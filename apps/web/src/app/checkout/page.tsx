'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { apiRequest } from '@/lib/api';
import {
  ShippingCarrier,
  TaxCalculationResultDto,
  CouponValidationResultDto,
} from '@theblinghaven/shared';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Crown,
  Tag,
  DollarSign,
  Landmark,
  CreditCard,
  Building,
  Calendar,
  Clock,
  Check,
  AlertCircle,
  QrCode,
  Smartphone,
  Banknote,
  Percent,
} from 'lucide-react';

const DESTINATIONS: { code: string; name: string; region?: string }[] = [
  { code: 'IN', name: 'India (Pan-India Express Delivery)', region: undefined },
  { code: 'CA', name: 'Canada (Canadian Domestic Delivery)', region: 'ON' },
  { code: 'US', name: 'United States (US Express Delivery)', region: 'NY' },
  { code: 'GB', name: 'United Kingdom (UK Express Delivery)', region: undefined },
  { code: 'AE', name: 'United Arab Emirates (Dubai & UAE Delivery)', region: undefined },
  { code: 'AU', name: 'Australia (Express Air Courier)', region: undefined },
  { code: 'SG', name: 'Singapore (Express Air Delivery)', region: undefined },
];

const CARRIER_OPTIONS: {
  key: string;
  name: string;
  estDays: string;
  badge: string;
  desc: string;
}[] = [
  {
    key: 'DTDC_EXPRESS',
    name: 'DTDC Express Priority Delivery',
    estDays: '2 - 3 Business Days',
    badge: 'Fast & Recommended',
    desc: 'Priority air courier with live SMS & WhatsApp tracking updates.',
  },
  {
    key: 'BLUEDART_DHL_AIR',
    name: 'Blue Dart / DHL Express Air',
    estDays: '1 - 2 Business Days',
    badge: 'Super Express',
    desc: 'Fastest door-to-door air express delivery with doorstep signature.',
  },
  {
    key: 'DELHIVERY_STANDARD',
    name: 'Delhivery / Standard Insured Courier',
    estDays: '3 - 5 Business Days',
    badge: 'Standard Safe',
    desc: '100% insured delivery with tamper-proof packaging.',
  },
];

type PaymentMode = 'UPI' | 'CARD' | 'NET_BANKING' | 'COD' | 'EMI';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalUsd, clearCart } = useCart();
  const { currentCurrency, formatPrice } = useCurrency();

  // Shipping Form State
  const [countryCode, setCountryCode] = useState('IN');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('DTDC_EXPRESS');
  const [customerNotes, setCustomerNotes] = useState('');

  // Payment Gateway State
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'OTHER'>('GPAY');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState('3');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponValidation, setCouponValidation] = useState<CouponValidationResultDto | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Tax State
  const [taxCalc, setTaxCalc] = useState<TaxCalculationResultDto | null>(null);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);

  // Order Submission State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const discountAmountUsd = couponValidation?.isValid ? couponValidation.discountAmountUsd : 0;
  const taxableSubtotalUsd = Math.max(0, subtotalUsd - discountAmountUsd);

  // Recalculate taxes whenever country, subtotal or currency changes
  useEffect(() => {
    if (taxableSubtotalUsd <= 0) return;

    const calculateTaxes = async () => {
      setIsCalculatingTax(true);
      try {
        const dest = DESTINATIONS.find((d) => d.code === countryCode);
        const res = await apiRequest<any>('/taxes/calculate', {
          method: 'POST',
          data: {
            countryCode,
            regionCode: dest?.region,
            subtotalUsd: taxableSubtotalUsd,
            currencyCode: currentCurrency,
          },
        });
        setTaxCalc(res.data || res);
      } catch (e) {
        console.error('Tax calculation error:', e);
      } finally {
        setIsCalculatingTax(false);
      }
    };
    calculateTaxes();
  }, [countryCode, taxableSubtotalUsd, currentCurrency]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError(null);
    try {
      const res = await apiRequest<any>('/promotions/validate', {
        method: 'POST',
        data: {
          code: couponCode.trim(),
          cartSubtotalUsd: subtotalUsd,
          vipTier: 'GOLD_PATRON',
        },
      });
      const data: CouponValidationResultDto = res.data || res;
      setCouponValidation(data);
      if (!data.isValid) {
        setCouponError(data.discountMessage || 'Invalid coupon code.');
      }
    } catch (e: any) {
      setCouponError(typeof e === 'string' ? e : e?.message || 'Coupon validation failed.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    setCheckoutError(null);
    try {
      const dest = DESTINATIONS.find((d) => d.code === countryCode);
      const chosenCarrierObj = CARRIER_OPTIONS.find((c) => c.key === selectedCarrier);

      // Payment metadata
      const paymentRef = `TBH-TXN-${Date.now().toString().slice(-6)}`;
      const paymentLabel =
        paymentMode === 'UPI'
          ? `UPI (${selectedUpiApp})`
          : paymentMode === 'CARD'
          ? `Credit/Debit Card (Ending ${cardNumber.slice(-4) || '8801'})`
          : paymentMode === 'NET_BANKING'
          ? `Net Banking (${selectedBank})`
          : paymentMode === 'EMI'
          ? `No-Cost EMI (${selectedEmiTenure} Months)`
          : 'Cash on Delivery';

      const res = await apiRequest<any>('/orders/checkout', {
        method: 'POST',
        data: {
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone || undefined,
          customerVipTier: 'STANDARD',
          currencyCode: currentCurrency,
          subtotalUsd: taxableSubtotalUsd,
          totalAmountUsd: taxCalc ? taxCalc.finalTotalUsd : taxableSubtotalUsd,
          totalAmountLocal: taxCalc ? taxCalc.finalTotalLocal : taxableSubtotalUsd,
          shippingCarrier: chosenCarrierObj?.name || 'DTDC Express Priority',
          paymentMethod: paymentLabel,
          paymentTransactionId: paymentRef,
          shippingAddress: {
            fullName,
            street,
            city,
            state: stateName,
            country: dest?.name || countryCode,
            postalCode,
          },
          items: items.map((i) => ({
            productId: i.productId,
            sku: i.sku,
            title: i.title,
            primaryImageUrl: i.primaryImageUrl,
            quantity: i.quantity,
            unitPriceUsd: i.unitPriceUsd,
            totalPriceUsd: i.unitPriceUsd * i.quantity,
            selectedRingSize: i.selectedRingSize,
            selectedBangleSize: i.selectedBangleSize,
            customEngraving: i.customEngraving,
            hallmarkCertificate: i.hallmarkCertificate || 'BIS 916 & Quality Certified',
          })),
          customerNotes: customerNotes ? `${customerNotes} | Mode: ${paymentLabel}` : `Payment: ${paymentLabel}`,
        },
      });

      const orderData = res.data || res;
      setCompletedOrder({ ...orderData, paymentLabel, paymentRef });
      clearCart();
    } catch (e: any) {
      setCheckoutError(typeof e === 'string' ? e : e?.message || 'Order placement failed. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Helper to compute estimated delivery date
  const getDeliveryDateString = (carrierKey: string) => {
    const today = new Date();
    const daysToAdd = carrierKey === 'BLUEDART_DHL_AIR' ? 2 : carrierKey === 'DTDC_EXPRESS' ? 3 : 5;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + daysToAdd);
    return deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Order Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-8 font-mono">
        <div className="rounded-3xl border border-slate-200 dark:border-gold-500/50 bg-white dark:bg-[#0E0E14] p-8 sm:p-14 shadow-2xl space-y-6">
          <div className="rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-5 w-fit mx-auto">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Payment Confirmed & Order Placed
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Order #{completedOrder.orderNumber}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-sans">
              Thank you for choosing The Bling Haven! Your order is being packed in tamper-proof packaging. Dispatch will occur via{' '}
              <strong className="text-slate-900 dark:text-slate-100">{completedOrder.shippingCarrier || 'DTDC Express Priority'}</strong> with tracking updates sent to your email & WhatsApp.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 dark:bg-obsidian-950 p-6 border border-slate-200 dark:border-gold-500/20 text-xs max-w-md mx-auto text-left space-y-2.5 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Customer Name:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{completedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{completedOrder.paymentLabel || 'UPI Gateway'}</span>
            </div>
            <div className="flex justify-between">
              <span>Transaction Ref:</span>
              <span className="font-bold text-gold-700 dark:text-gold-400">{completedOrder.paymentRef || 'TBH-TXN-902144'}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Total:</span>
              <span className="font-bold text-gold-700 dark:text-gold-400 text-sm">
                {formatPrice(completedOrder.totalAmountUsd || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Courier Partner:</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{completedOrder.shippingCarrier || 'DTDC Express Priority'}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2">
              <span>Estimated Delivery:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Within 2–3 Business Days</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              href={`/track?order=${encodeURIComponent(completedOrder.orderNumber)}`}
              className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md transition"
            >
              Track DTDC Courier Delivery
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4 font-mono">
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-slate-500">
          Please add a jewellery creation to your cart before proceeding to checkout.
        </p>
        <Link
          href="/catalog"
          className="inline-block rounded-2xl bg-gold-500 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-md"
        >
          Browse Jewellery Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      {/* Checkout Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-[11px] font-mono tracking-wider uppercase text-gold-700 dark:text-gold-400 font-bold">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>256-Bit SSL Encrypted Secure Checkout</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Order Checkout & Payment
        </h1>
      </div>

      {checkoutError && (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
        {/* Left 7 Cols: Shipping Address, Courier Selection & Payment Gateway */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Shipping Destination & Address */}
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 border-b border-slate-100 dark:border-white/10 pb-3">
              <Truck className="h-5 w-5 text-gold-600 dark:text-gold-400" />
              <span>1. Shipping Address & Contact Details</span>
            </h2>

            <div className="space-y-4 font-mono">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                  Country of Delivery *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer font-sans"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                    Email Address (For Order Tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                  Flat / House No., Apartment, Building & Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Flat 402, Royal Palms Apartment, MG Road"
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                    PIN / Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400001"
                    className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px]">
                  Mobile Number (For Delivery SMS & Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>
            </div>
          </div>

          {/* 2. Select Courier Partner & Express Delivery Option */}
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 space-y-4 shadow-xl text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>2. Courier & Delivery Partner</span>
              </h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Free Insured Shipping
              </span>
            </div>

            <div className="space-y-3">
              {CARRIER_OPTIONS.map((c) => {
                const isSelected = selectedCarrier === c.key;
                const estDate = getDeliveryDateString(c.key);
                return (
                  <div
                    key={c.key}
                    onClick={() => setSelectedCarrier(c.key)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/10 shadow-md ring-1 ring-gold-500/50'
                        : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 hover:border-gold-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-gold-500 bg-gold-500' : 'border-slate-400'
                          }`}
                        >
                          {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-obsidian-950" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100">
                              {c.name}
                            </h4>
                            <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-[9px] font-bold text-gold-700 dark:text-gold-400 uppercase">
                              {c.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                            {c.desc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                          FREE
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          Est. {estDate}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Payment Gateway & Payment Method */}
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 space-y-5 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-gold-600 dark:text-gold-400" />
                <span>3. Payment Gateway & Method</span>
              </h2>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-gold-700 dark:text-gold-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>100% Safe & Secure</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono">
              <button
                type="button"
                onClick={() => setPaymentMode('UPI')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMode === 'UPI'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-800 dark:text-gold-400 font-bold ring-1 ring-gold-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-[11px]">UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('CARD')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMode === 'CARD'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-800 dark:text-gold-400 font-bold ring-1 ring-gold-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span className="text-[11px]">Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('NET_BANKING')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMode === 'NET_BANKING'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-800 dark:text-gold-400 font-bold ring-1 ring-gold-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Landmark className="h-4 w-4" />
                <span className="text-[11px]">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('EMI')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMode === 'EMI'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-800 dark:text-gold-400 font-bold ring-1 ring-gold-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Percent className="h-4 w-4" />
                <span className="text-[11px]">No-Cost EMI</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('COD')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  paymentMode === 'COD'
                    ? 'border-gold-500 bg-gold-500/15 text-gold-800 dark:text-gold-400 font-bold ring-1 ring-gold-500/40'
                    : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Banknote className="h-4 w-4" />
                <span className="text-[11px]">Cash on Delivery</span>
              </button>
            </div>

            {/* UPI Details Box */}
            {paymentMode === 'UPI' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Select UPI App:</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Instant 0% Convenience Fee</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['GPAY', 'PHONEPE', 'PAYTM', 'OTHER'] as const).map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedUpiApp(app)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        selectedUpiApp === app
                          ? 'border-gold-500 bg-gold-500 text-obsidian-950 shadow-sm'
                          : 'border-slate-300 dark:border-white/10 bg-white dark:bg-[#0E0E14] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {app === 'GPAY' ? 'Google Pay' : app === 'PHONEPE' ? 'PhonePe' : app === 'PAYTM' ? 'Paytm' : 'Any UPI ID'}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobileNumber@okhdfcbank or yourname@paytm"
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">A payment request will be sent to your UPI app upon placing order.</p>
                </div>
              </div>
            )}

            {/* Credit/Debit Card Box */}
            {paymentMode === 'CARD' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-3 font-mono">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                    Card Number (Visa / Mastercard / RuPay / Amex)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8801"
                    maxLength={19}
                    className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Priya Sharma"
                      className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Box */}
            {paymentMode === 'NET_BANKING' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-3 font-mono">
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                  Select Your Bank
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0E0E14] p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none cursor-pointer"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="OTHER">Other Indian Banks</option>
                </select>
              </div>
            )}

            {/* EMI Box */}
            {paymentMode === 'EMI' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Choose EMI Tenure:</span>
                  <span className="text-[10px] text-emerald-600 font-bold">No-Cost EMI Available</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { months: '3', label: '3 Months (No Cost)' },
                    { months: '6', label: '6 Months (No Cost)' },
                    { months: '12', label: '12 Months Low Cost' },
                  ].map((plan) => (
                    <button
                      key={plan.months}
                      type="button"
                      onClick={() => setSelectedEmiTenure(plan.months)}
                      className={`p-3 rounded-xl border text-center transition text-xs font-bold ${
                        selectedEmiTenure === plan.months
                          ? 'border-gold-500 bg-gold-500 text-obsidian-950 shadow-sm'
                          : 'border-slate-300 dark:border-white/10 bg-white dark:bg-[#0E0E14] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {plan.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash on Delivery Box */}
            {paymentMode === 'COD' && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/10 space-y-2 font-mono text-xs">
                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>Pay Cash / UPI upon Delivery</span>
                </p>
                <p className="text-[11px] text-slate-500 font-sans">
                  Our DTDC delivery executive will verify with an SMS OTP before handing over your jewellery parcel.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 5 Cols: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-xl text-xs">
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-white/10 pb-3">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>

            {/* Cart Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center space-x-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-950 border border-slate-200 dark:border-white/5">
                  <img
                    src={item.primaryImageUrl}
                    alt={item.title}
                    className="h-12 w-12 rounded-xl object-cover border border-gold-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.title}
                    </h5>
                    <span className="font-mono text-[10px] text-slate-500 block">
                      Qty: {item.quantity} {item.selectedRingSize ? `• Size ${item.selectedRingSize}` : ''}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0">
                    {formatPrice(item.unitPriceUsd * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Box */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10">
              <label className="block text-[10px] uppercase font-mono font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                Discount Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="e.g. ROYAL15, MAISON25"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="rounded-xl bg-gold-500 hover:bg-gold-400 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-obsidian-950 transition shadow-sm shrink-0"
                >
                  {isValidatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>

              {couponValidation?.isValid && (
                <p className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                  <Check className="h-3.5 w-3.5" />
                  <span>{couponValidation.discountMessage}</span>
                </p>
              )}

              {couponError && (
                <p className="mt-2 text-[10px] font-mono text-rose-600 dark:text-rose-400 font-bold">
                  {couponError}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 border-t border-slate-100 dark:border-white/10 pt-4 font-mono text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{formatPrice(subtotalUsd)}</span>
              </div>

              {discountAmountUsd > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Discount Applied:</span>
                  <span>- {formatPrice(discountAmountUsd)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Courier Delivery:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
              </div>

              {taxCalc && taxCalc.taxAmountUsd > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>{taxCalc.taxName} ({taxCalc.taxRatePercent}%):</span>
                  <span>+ {formatPrice(taxCalc.taxAmountUsd)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-white/10 pt-3">
                <span className="font-serif text-base">Total Payable:</span>
                <span className="font-mono text-lg text-gold-700 dark:text-gold-400">
                  {formatPrice(taxCalc ? taxCalc.finalTotalUsd : taxableSubtotalUsd)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacingOrder}
              className="w-full rounded-2xl bg-gold-500 hover:bg-gold-400 py-4 font-mono text-xs font-bold uppercase tracking-wider text-obsidian-950 transition shadow-xl flex items-center justify-center space-x-2"
            >
              <Lock className="h-4 w-4" />
              <span>{isPlacingOrder ? 'Processing Payment...' : `Pay ${formatPrice(taxCalc ? taxCalc.finalTotalUsd : taxableSubtotalUsd)} & Place Order`}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
