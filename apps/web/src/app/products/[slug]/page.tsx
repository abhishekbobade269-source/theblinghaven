'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { ProductDto } from '@theblinghaven/shared';
import {
  ShieldCheck,
  Truck,
  Gem,
  Crown,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Lock,
  ChevronRight,
  HelpCircle,
  X,
  Camera,
} from 'lucide-react';

const RING_SIZES = ['US 5.0', 'US 5.5', 'US 6.0', 'US 6.5', 'US 7.0', 'US 7.5', 'US 8.0', 'US 8.5'];
const BANGLE_SIZES = ['2.4 (57mm)', '2.6 (60mm)', '2.8 (63mm)', '2.10 (67mm)'];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('US 6.5');
  const [engravingText, setEngravingText] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSalonModalOpen, setIsSalonModalOpen] = useState(false);
  const [salonLocation, setSalonLocation] = useState('London Mayfair Atelier');
  const [salonDate, setSalonDate] = useState('');
  const [salonClientName, setSalonClientName] = useState('');
  const [salonClientEmail, setSalonClientEmail] = useState('');
  const [isSalonBooking, setIsSalonBooking] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await apiRequest<any>(`/catalog/products/${slug}`);
        const p: ProductDto = res.data || res;
        setProduct(p);
        setSelectedImage(p.primaryImageUrl);
      } catch (e: any) {
        alert(e.message || 'Failed to load jewelry creation.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToBag = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      sku: product.sku,
      title: product.title,
      slug: product.slug,
      unitPriceUsd: product.basePriceUsd,
      quantity: 1,
      primaryImageUrl: product.primaryImageUrl,
      selectedRingSize: isRing ? selectedSize : undefined,
      selectedBangleSize: isBangle ? selectedSize : undefined,
      customEngraving: engravingText || undefined,
      hallmarkCertificate: product.specs?.hallmarkCertificate,
    });
  };

  const handleSalonBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSalonBooking(true);
    try {
      await apiRequest('/concierge/inquire', {
        method: 'POST',
        data: {
          fullName: salonClientName,
          email: salonClientEmail,
          country: 'International Private Client',
          type: 'PRIVATE_SALON_APPOINTMENT',
          subject: `Private Salon Viewing for ${product.title} (${product.sku})`,
          message: `Client requested private viewing of ${product.title}. Preferred date: ${salonDate}.`,
          preferredSalonLocation: salonLocation,
          preferredAppointmentDate: salonDate ? new Date(salonDate).toISOString() : undefined,
        },
      });
      alert('Your private salon viewing request has been received. Our High-Jewelry Director will contact you confidentially.');
      setIsSalonModalOpen(false);
    } catch (e: any) {
      alert(e.message || 'Booking request failed.');
    } finally {
      setIsSalonBooking(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center space-x-2 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="text-xs font-mono mt-3">Loading Haute Creation Details...</p>
        </div>
      </div>
    );
  }

  const galleryList = [product.primaryImageUrl, ...(product.galleryImages || [])];
  const isRing = ((product as any).category?.name || product.categoryName || '').toLowerCase().includes('ring');
  const isBangle = ((product as any).category?.name || product.categoryName || '').toLowerCase().includes('bangle');

  const diamondWeight = product.specs?.diamondWeightCarats || (product.specs as any)?.gemstoneCarat;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-gold-400">
          Maison
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/catalog" className="hover:text-gold-400">
          Haute Creations
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gold-400 font-bold truncate">{product.title}</span>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 7 Columns: Visual Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Visual Frame */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-gold-500/30 bg-obsidian-950 shadow-2xl">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-cover object-center transition-all duration-500"
            />
            {diamondWeight && (
              <div className="absolute top-4 left-4 rounded-full bg-obsidian-950/80 backdrop-blur-md border border-gold-500/40 px-3 py-1 font-mono text-xs font-bold text-gold-300">
                💎 {diamondWeight} Carat Certified
              </div>
            )}
          </div>

          {/* Interactive Thumbnails Row */}
          {galleryList.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {galleryList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition ${
                    selectedImage === img
                      ? 'border-gold-500 shadow-md ring-2 ring-gold-500/50'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right 5 Columns: Jewelry Specs & Acquisition Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Price Strip */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-400 block">
              {(product as any).category?.name || product.categoryName || 'High Jewelry'} • SKU: {product.sku}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 leading-tight">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="text-xs text-slate-400 font-light">{product.subtitle}</p>
            )}

            <div className="pt-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">
                Acquisition Price
              </span>
              <p className="font-serif text-3xl font-bold text-gold-400">
                {formatPrice(product.basePriceUsd)}
              </p>
              <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                ✓ Insured Armored Global Freight & Taxes Calculated at Checkout
              </p>
            </div>
          </div>

          {/* Size Selector (If Ring or Bangle) */}
          {(isRing || isBangle) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select {isRing ? 'Ring Size (US)' : 'Bangle Size'}
                </label>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center space-x-1 text-[11px] text-gold-400 hover:underline font-mono"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(isRing ? RING_SIZES : BANGLE_SIZES).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`rounded-xl py-2 text-xs font-mono font-bold transition border ${
                      selectedSize === sz
                        ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-md'
                        : 'bg-obsidian-900 text-slate-300 border-white/10 hover:border-gold-500/40'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Laser Engraving */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Complimentary Laser Engraving (Optional)
            </label>
            <input
              type="text"
              maxLength={30}
              value={engravingText}
              onChange={(e) => setEngravingText(e.target.value)}
              placeholder="e.g. Forever & Always • 2026"
              className="w-full rounded-2xl border border-gold-500/30 bg-obsidian-900 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:border-gold-400 focus:outline-none font-mono"
            />
            <p className="text-[10px] text-slate-500">
              Master micro-laser engraving placed discreetly inside the precious metal band.
            </p>
          </div>

          {/* Acquisition Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToBag}
              className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 py-4 text-xs font-bold uppercase tracking-widest text-obsidian-950 shadow-xl shadow-gold-500/20 hover:from-gold-500 hover:to-gold-400 transition"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add to Shopping Bag</span>
            </button>

            <Link
              href="/try-on"
              className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-gold-500/40 bg-gold-500/10 py-3.5 text-xs font-bold uppercase tracking-widest text-gold-400 hover:bg-gold-500 hover:text-obsidian-950 transition shadow-md"
            >
              <Camera className="h-4 w-4" />
              <span>✨ Virtual AR Try-On / Hand Fit</span>
            </Link>

            <button
              onClick={() => setIsSalonModalOpen(true)}
              className="flex w-full items-center justify-center space-x-2 rounded-2xl border border-gold-500/40 bg-obsidian-900 py-3.5 text-xs font-bold uppercase tracking-widest text-gold-400 hover:bg-gold-500/10 transition"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Book Private Salon Viewing</span>
            </button>
          </div>

          {/* Gemological Specs & 4Cs Box */}
          <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900 p-5 space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-slate-100 flex items-center space-x-2 border-b border-white/10 pb-2">
              <Gem className="h-4 w-4 text-gold-400" />
              <span>Haute Joaillerie Certified Specifications</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Precious Metal:
                </span>
                <p className="font-bold text-slate-200 mt-0.5">
                  {product.specs?.metalType || '18K Solid Gold / Pt950'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Metal Purity / Karat:
                </span>
                <p className="font-bold text-slate-200 mt-0.5">
                  {product.specs?.metalPurity || '750 Gold / Pt950'}
                </p>
              </div>

              {diamondWeight && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Diamond 4Cs (Weight):
                  </span>
                  <p className="font-bold text-gold-400 mt-0.5">
                    {diamondWeight} ct {product.specs?.diamondClarity || 'D-Flawless'}
                  </p>
                </div>
              )}

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Government Hallmark:
                </span>
                <p className="font-mono text-emerald-400 font-bold mt-0.5">
                  {product.specs?.hallmarkCertificate || 'BIS 916 & GIA Triple Ex'}
                </p>
              </div>
            </div>

            {/* Transparent Valuation Breakdown Tag */}
            <div className="pt-3 border-t border-white/10 space-y-1.5 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Gold Alloy Net Weight:</span>
                <span className="text-slate-200 font-bold">{product.specs?.netWeightGrams || 8.5}g</span>
              </div>
              <div className="flex justify-between">
                <span>BIS Laser Hallmark:</span>
                <span className="text-emerald-400 font-bold">Government Certified</span>
              </div>
              <div className="flex justify-between">
                <span>Master Bench Making:</span>
                <span className="text-gold-400 font-bold">Hand-Sculpted Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Heritage Section */}
      <div className="rounded-3xl border border-gold-500/20 bg-obsidian-900 p-8 space-y-4">
        <h3 className="font-serif text-xl font-bold text-slate-100">
          Atelier Craftsmanship Dossier
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {product.description}
        </p>
      </div>

      {/* Book Private Salon Viewing Modal */}
      {isSalonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gold-500/40 bg-obsidian-950 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-100">
                  Book Confidential Salon Viewing
                </h3>
                <p className="text-xs text-gold-400 mt-0.5 font-mono">{product.title}</p>
              </div>
              <button
                onClick={() => setIsSalonModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSalonBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase text-[10px]">
                  Private Client Name
                </label>
                <input
                  type="text"
                  required
                  value={salonClientName}
                  onChange={(e) => setSalonClientName(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/30 bg-obsidian-900 p-2.5 text-slate-100 focus:border-gold-400 focus:outline-none"
                  placeholder="e.g. Lady Evelyn Rothschild"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase text-[10px]">
                  Confidential Email
                </label>
                <input
                  type="email"
                  required
                  value={salonClientEmail}
                  onChange={(e) => setSalonClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/30 bg-obsidian-900 p-2.5 text-slate-100 focus:border-gold-400 focus:outline-none"
                  placeholder="e.g. client@private-office.co.uk"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase text-[10px]">
                  Salon Location
                </label>
                <select
                  value={salonLocation}
                  onChange={(e) => setSalonLocation(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/30 bg-obsidian-900 p-2.5 text-slate-100 focus:border-gold-400 focus:outline-none"
                >
                  <option value="London Mayfair Atelier">London Mayfair (14 Old Bond St)</option>
                  <option value="Dubai Flagship Salon (DIFC)">Dubai DIFC Flagship Salon</option>
                  <option value="Virtual Private Video Suite">Virtual Private Video Viewing</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1 uppercase text-[10px]">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={salonDate}
                  onChange={(e) => setSalonDate(e.target.value)}
                  className="w-full rounded-xl border border-gold-500/30 bg-obsidian-900 p-2.5 text-slate-100 focus:border-gold-400 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSalonModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSalonBooking}
                  className="rounded-xl border border-gold-500/60 bg-gradient-to-r from-gold-600 to-gold-500 px-6 py-2 font-bold uppercase tracking-widest text-obsidian-950 hover:from-gold-500 hover:to-gold-400 transition disabled:opacity-50"
                >
                  {isSalonBooking ? 'Requesting...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-500/40 bg-obsidian-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                International Ring Size Matrix
              </h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-gold-400">
                  <th className="pb-2">US / Canada</th>
                  <th className="pb-2">UK / Australia</th>
                  <th className="pb-2">EU (Circumference)</th>
                  <th className="pb-2">India Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr><td className="py-1.5">US 5.0</td><td>J 1/2</td><td>49 mm</td><td>9</td></tr>
                <tr><td className="py-1.5">US 6.0</td><td>L 1/2</td><td>52 mm</td><td>12</td></tr>
                <tr><td className="py-1.5">US 6.5</td><td>M 1/2</td><td>53 mm</td><td>13</td></tr>
                <tr><td className="py-1.5">US 7.0</td><td>N 1/2</td><td>54 mm</td><td>14</td></tr>
                <tr><td className="py-1.5">US 8.0</td><td>P 1/2</td><td>57 mm</td><td>17</td></tr>
              </tbody>
            </table>

            <p className="text-[10px] text-slate-400 italic">
              *All The Bling Haven acquisitions include complimentary lifetime resizing by our master atelier bench.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
