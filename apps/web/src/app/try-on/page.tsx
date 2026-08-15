'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import {
  TryOnOverlayDto,
  JewelryTryOnCategory,
} from '@theblinghaven/shared';
import {
  Camera,
  Sparkles,
  Upload,
  RotateCw,
  Maximize2,
  Minimize2,
  Layers,
  Send,
  ShoppingBag,
  CheckCircle2,
  Eye,
  Sliders,
  Sun,
  ShieldCheck,
  Building,
  Crown,
  Share2,
  RefreshCcw,
} from 'lucide-react';

const SKIN_TONE_MODELS = [
  {
    id: 'WARM_OLIVE',
    label: 'Warm Olive (Model A)',
    handImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'FAIR_PORCELAIN',
    label: 'Fair Porcelain (Model B)',
    handImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'GOLDEN_TAN',
    label: 'Golden Radiance (Model C)',
    handImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'DEEP_EBONY',
    label: 'Deep Velvet (Model D)',
    handImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function TryOnPage() {
  const { currentCurrency, formatPrice } = useCurrency();
  const { addItem, setIsCartOpen } = useCart();

  const [overlays, setOverlays] = useState<TryOnOverlayDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<JewelryTryOnCategory | 'ALL'>('ALL');
  const [selectedOverlay, setSelectedOverlay] = useState<TryOnOverlayDto | null>(null);

  // Fitting Canvas State
  const [viewMode, setViewMode] = useState<'MODEL' | 'WEBCAM' | 'UPLOAD'>('MODEL');
  const [selectedSkinTone, setSelectedSkinTone] = useState(SKIN_TONE_MODELS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Jewelry Placement & Shimmer Controls
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [sparkleActive, setSparkleActive] = useState(true);
  const [brightness, setBrightness] = useState<number>(100);

  // Dragging logic
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Share Look Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredSalon, setPreferredSalon] = useState('Toronto Yorkville Haute Salon');
  const [notes, setNotes] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    const fetchOverlays = async () => {
      try {
        const res = await apiRequest<any>('/try-on/overlays');
        const list = Array.isArray(res) ? res : res?.data || [];
        setOverlays(list);
        if (list.length > 0) {
          setSelectedOverlay(list[0]);
          setScale(list[0].defaultScale || 1.0);
          setRotation(list[0].defaultRotation || 0);
        }
      } catch (e) {
        console.error('Failed to load try-on overlays:', e);
      }
    };
    fetchOverlays();
  }, []);

  const filteredOverlays = overlays.filter((o) => {
    if (selectedCategory === 'ALL') return true;
    return o.category === selectedCategory;
  });

  const handleSelectOverlay = (overlay: TryOnOverlayDto) => {
    setSelectedOverlay(overlay);
    setScale(overlay.defaultScale || 1.0);
    setRotation(overlay.defaultRotation || 0);
    setPosition({ x: 50, y: 50 });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePositionFromEvent(e);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updatePositionFromEvent(e);
  };

  const updatePositionFromEvent = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    setPosition({ x, y });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setViewMode('UPLOAD');
    }
  };

  const handleShareConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOverlay) return;

    setIsSharing(true);
    try {
      await apiRequest<any>('/try-on/share-consultation', {
        method: 'POST',
        data: {
          clientName,
          clientEmail,
          clientPhone: clientPhone || undefined,
          productSku: selectedOverlay.sku,
          productTitle: selectedOverlay.title,
          category: selectedOverlay.category,
          scaleApplied: scale,
          rotationApplied: rotation,
          skinToneSelected: selectedSkinTone.id,
          preferredSalon,
          notes: notes || undefined,
        },
      });
      setShareSuccess(true);
      setTimeout(() => {
        setIsShareModalOpen(false);
        setShareSuccess(false);
      }, 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to submit consultation.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleAcquire = () => {
    if (!selectedOverlay) return;
    addItem({
      productId: selectedOverlay.id,
      sku: selectedOverlay.sku,
      title: selectedOverlay.title,
      slug: selectedOverlay.sku.toLowerCase(),
      unitPriceUsd: Math.round(selectedOverlay.basePriceCad / 1.3872),
      quantity: 1,
      primaryImageUrl: selectedOverlay.overlayImageUrl,
      selectedRingSize: selectedOverlay.category === 'RING' ? 'US 6.5' : undefined,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1 text-xs font-mono tracking-widest text-gold-700 dark:text-gold-400 uppercase font-bold">
          <Camera className="h-3.5 w-3.5" />
          <span>Augmented Reality Haute Joaillerie Visualizer</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Virtual Try-On & Hand Fitting Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Fit solitaires, bridal chokers, and chandelier earrings on your hand or portrait with real-time diamond sparkle refraction and precision sizing.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left 8 Columns: Interactive Fitting Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Canvas Mode Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0E0E14] border border-slate-200 dark:border-gold-500/20 text-xs shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] font-mono">Fitting Canvas:</span>
              <button
                onClick={() => setViewMode('MODEL')}
                className={`px-3 py-1 rounded-xl font-bold transition font-mono ${
                  viewMode === 'MODEL' ? 'bg-gold-500 text-obsidian-950 shadow-md' : 'text-slate-700 dark:text-slate-300 hover:text-gold-600'
                }`}
              >
                Skin-Tone Models
              </button>
              <label className={`px-3 py-1 rounded-xl font-bold transition cursor-pointer font-mono ${
                viewMode === 'UPLOAD' ? 'bg-gold-500 text-obsidian-950 shadow-md' : 'text-slate-700 dark:text-slate-300 hover:text-gold-600'
              }`}>
                Upload Photo
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {viewMode === 'MODEL' && (
              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {SKIN_TONE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedSkinTone(m)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono transition shrink-0 ${
                      selectedSkinTone.id === m.id
                        ? 'bg-gold-500/20 border border-gold-500 text-gold-800 dark:text-gold-300 font-bold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {m.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Interactive AR Fitting Canvas */}
          <div
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="relative h-[440px] sm:h-[540px] w-full rounded-3xl overflow-hidden border-2 border-slate-200 dark:border-gold-500/30 bg-slate-100 dark:bg-black shadow-2xl select-none cursor-move"
          >
            <img
              src={viewMode === 'UPLOAD' && uploadedImage ? uploadedImage : selectedSkinTone.handImage}
              alt="Fitting Canvas"
              className="absolute inset-0 h-full w-full object-cover filter transition-all duration-300"
              style={{ filter: `brightness(${brightness}%)` }}
            />

            <div className="absolute inset-0 border border-gold-500/15 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] font-mono text-gold-700 dark:text-gold-400/60 uppercase tracking-widest bg-white/70 dark:bg-black/60 px-3 py-1 rounded-full">
                [ Drag Creation to Position on Hand / Wrist / Collar ]
              </span>
            </div>

            {selectedOverlay && (
              <div
                className="absolute transition-transform duration-75 pointer-events-none"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                }}
              >
                <div className="relative">
                  <img
                    src={selectedOverlay.overlayImageUrl}
                    alt={selectedOverlay.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-44 max-w-44 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.75)]"
                  />
                  {sparkleActive && (
                    <>
                      <span className="absolute top-2 left-4 h-3 w-3 bg-white rounded-full animate-ping opacity-75" />
                      <span className="absolute bottom-4 right-6 h-2 w-2 bg-gold-300 rounded-full animate-pulse opacity-90" />
                      <Sparkles className="absolute top-1 right-2 h-5 w-5 text-gold-300 animate-spin text-opacity-80" />
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="absolute bottom-4 left-4 rounded-2xl bg-black/75 backdrop-blur-md border border-gold-500/30 px-3 py-1.5 text-[11px] font-mono text-gold-400 space-y-0.5 pointer-events-none">
              <p className="font-bold text-white">{selectedOverlay?.title}</p>
              <p className="text-[10px] text-slate-300">Scale: {scale.toFixed(2)}x • Rotation: {rotation}°</p>
            </div>
          </div>

          {/* Interactive Precision Control Dials */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E0E14] border border-slate-200 dark:border-gold-500/20 text-xs font-mono shadow-md">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1 font-bold">
                  <Maximize2 className="h-3.5 w-3.5 text-gold-600" />
                  <span>Size & Carat Scale:</span>
                </span>
                <strong className="text-gold-700 dark:text-gold-400">{scale.toFixed(2)}x</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1 font-bold">
                  <RotateCw className="h-3.5 w-3.5 text-gold-600" />
                  <span>Fitting Angle:</span>
                </span>
                <strong className="text-gold-700 dark:text-gold-400">{rotation}°</strong>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-gold-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-center sm:space-x-3 pt-2">
              <button
                onClick={() => setSparkleActive(!sparkleActive)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border transition font-bold ${
                  sparkleActive
                    ? 'border-gold-500 bg-gold-500/20 text-gold-800 dark:text-gold-300'
                    : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Diamond Fire</span>
              </button>

              <button
                onClick={() => {
                  setScale(selectedOverlay?.defaultScale || 1.0);
                  setRotation(selectedOverlay?.defaultRotation || 0);
                  setPosition({ x: 50, y: 50 });
                }}
                className="p-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                title="Reset Position"
              >
                <RefreshCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Masterpiece Wardrobe */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'RING', 'NECKLACE', 'EARRINGS', 'BANGLE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-obsidian-950 shadow-md'
                    : 'border border-slate-200 dark:border-gold-500/20 bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 hover:text-gold-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredOverlays.map((o) => (
              <div
                key={o.id}
                onClick={() => handleSelectOverlay(o)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center space-x-3 shadow-sm ${
                  selectedOverlay?.id === o.id
                    ? 'border-gold-500 bg-gold-500/15 shadow-md'
                    : 'border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14] hover:border-gold-500/50'
                }`}
              >
                <div className="h-16 w-16 rounded-xl bg-slate-50 dark:bg-obsidian-950 p-2 flex items-center justify-center border border-slate-200 dark:border-white/5 shrink-0">
                  <img
                    src={o.overlayImageUrl}
                    alt={o.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-gold-700 dark:text-gold-400 uppercase font-bold">{o.category}</span>
                  <h4 className="font-serif text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{o.title}</h4>
                  <p className="font-mono text-xs text-gold-700 dark:text-gold-400 font-bold">
                    {formatPrice(Math.round(o.basePriceCad / 1.3872))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleAcquire}
              className="w-full rounded-2xl bg-gold-500 hover:bg-gold-400 py-3 text-xs font-bold uppercase tracking-wider text-obsidian-950 transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Acquire This Creation</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-full rounded-2xl border border-slate-300 dark:border-gold-500/40 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 py-3 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gold-400 transition flex items-center justify-center space-x-2 shadow-sm"
            >
              <Send className="h-4 w-4" />
              <span>Send Look to Private Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Look with Concierge Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border-2 border-gold-500/40 bg-white dark:bg-[#0E0E14] p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 text-xs font-mono">
            <div className="text-center space-y-1 border-b border-slate-200 dark:border-gold-500/30 pb-4">
              <div className="flex items-center justify-center space-x-2 text-gold-700 dark:text-gold-400 text-[11px] uppercase font-bold">
                <Crown className="h-4 w-4" />
                <span>Private High-Jewelry Consultation</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-gold-300">
                Share Virtual Fitting with Advisor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Your virtual hand fitting parameters for <strong className="text-slate-900 dark:text-slate-200">{selectedOverlay?.title}</strong> will be forwarded to your dedicated director.
              </p>
            </div>

            {shareSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <h4 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                  Look Consultation Dispatched
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your advisor at {preferredSalon} has received your look dossier and will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleShareConsultation} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Eleanor Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="client@luxury.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Phone</label>
                    <input
                      type="tel"
                      placeholder="+1 (416) 922-8800"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Preferred Salon Suite</label>
                  <select
                    value={preferredSalon}
                    onChange={(e) => setPreferredSalon(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-obsidian-900 p-2.5 text-slate-900 dark:text-gold-400 font-bold focus:outline-none"
                  >
                    <option value="Toronto Yorkville Haute Salon">🍁 Toronto Yorkville Salon (100 Bloor St W)</option>
                    <option value="Vancouver Pacific Rim Salon">🍁 Vancouver Pacific Rim Salon (Canada Place)</option>
                    <option value="London Mayfair Atelier">🇬🇧 London Mayfair Salon (14 Old Bond St)</option>
                    <option value="Dubai Flagship Salon (DIFC)">🇦🇪 Dubai DIFC Flagship Salon</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase text-[10px]">Personal Notes / Sizing Inquiries</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Inquiring about matching bridal earrings or diamond clarity upgrade..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-white/5 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-gold-500/20">
                  <button
                    type="button"
                    onClick={() => setIsShareModalOpen(false)}
                    className="rounded-xl border border-slate-300 dark:border-white/10 px-4 py-2 text-slate-600 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSharing}
                    className="rounded-xl bg-gold-500 px-6 py-2 font-bold uppercase tracking-wider text-obsidian-950 hover:bg-gold-400 transition"
                  >
                    {isSharing ? 'Dispatching...' : 'Submit Look to Director'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
