'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/ui/FadeUp';
import { useCurrency } from '@/context/CurrencyContext';
import { useCart } from '@/context/CartContext';
import { apiRequest } from '@/lib/api';
import {
  Sparkles,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  User,
  ArrowDown,
  ShoppingBag,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Ruler,
  Crown,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260514_135830_bb6491d1-9b66-4aec-9722-13b4dfe3fb46.mp4';

const HEADLINE_TEXT = 'YOUR PERSONAL AI JEWELRY STYLIST & GEMOLOGY CONCIERGE.';
const HEADLINE_WORDS = HEADLINE_TEXT.split(' ');

interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  href: string;
}

interface Message {
  id: string;
  sender: 'AURA' | 'PATRON';
  text: string;
  recommendations?: RecommendedProduct[];
  suggestions?: string[];
  timestamp: string;
}

// Built-in intelligent AI jewelry engine responses for instantaneous latency
const LOCAL_KNOWLEDGE: {
  keywords: string[];
  reply: string;
  speech: string;
  recommendations?: RecommendedProduct[];
  suggestions?: string[];
}[] = [
  {
    keywords: ['ring', 'size', 'diameter', 'measure'],
    reply:
      'For our rings, sizing follows standard North American and Indian measurements. If your inner finger diameter is **17.3 mm**, your ideal size is **US 7 (Indian 14)** with a 54.4 mm circumference.\n\nOur solitaires feature comfort-fit contoured bands and many are gently adjustable. Would you like to view our standard ring size chart or explore our top-rated crystal solitaires?',
    speech:
      'For a seventeen point three millimeter diameter, your size is US 7. Our comfort fit bands ensure effortless wear.',
    recommendations: [
      {
        id: 'rng-solitaire',
        title: 'Crystal Solitaire Ring',
        price: 85,
        image: '/uploads/rings_0345f0a9_1s6a0180.jpg',
        category: 'Rings',
        href: '/rings',
      },
    ],
    suggestions: [
      'Open Full Ring Size Guide',
      'Show me adjustable rings',
      'Are the crystals AAA+ quality?',
    ],
  },
  {
    keywords: ['bridal', 'choker', 'wedding', 'necklace', 'lehenga', 'maroon', 'red', 'pastel'],
    reply:
      'For bridal celebrations, we recommend our **Royal Kundan Choker Parure** in 22K micro gold plating. The multi-strand pearl drops and hand-cut Polki foils harmoniously complement deep crimson, velvet maroon, and royal emerald lehengas.\n\nEvery bridal suite includes matching chandelier earrings and an adjustable dori (gold cord) for a tailored neckline fit.',
    speech:
      'Our Royal Kundan Choker Parure in twenty-two karat gold plating is our most cherished bridal suite. It includes matching chandelier earrings and an adjustable gold cord.',
    recommendations: [
      {
        id: 'brd-choker',
        title: 'Royal Bridal Choker Set',
        price: 249,
        image: '/uploads/sets_00c2f42a_1s6a9390.jpg',
        category: 'Bridal Sets',
        href: '/bridal-sets',
      },
      {
        id: 'ear-jhumka',
        title: 'Kundan Pearl Earrings',
        price: 65,
        image: '/uploads/earrings_01462b03_1s6a0431.jpg',
        category: 'Earrings',
        href: '/earrings',
      },
    ],
    suggestions: [
      'What comes included in the bridal set?',
      'Can I customize the bead colors?',
      'Is delivery insured to Canada?',
    ],
  },
  {
    keywords: ['tarnish', 'care', 'plating', 'shower', 'clean', 'gold', 'last'],
    reply:
      'The Bling Haven jewellery features **multi-micron 22K gold electro-plating** sealed with a nano-ceramic protective shield. It is **100% anti-tarnish** under proper care.\n\n**Golden Rules of Care:**\n1. *Last On, First Off*: Apply perfumes and lotions before wearing.\n2. *Keep Dry*: Remove before showering, swimming, or vigorous workouts.\n3. *Storage*: Store in the airtight velvet pouch provided with each order.',
    speech:
      'Our jewelry features multi-micron twenty-two karat gold plating with a protective nano-ceramic shield. Simply apply perfumes before wearing and store in your velvet pouch.',
    suggestions: [
      'Read the complete Care & Anti-Tarnish Manual',
      'Is the jewellery safe for sensitive skin?',
      'Does it come with a warranty?',
    ],
  },
  {
    keywords: ['bangle', 'kada', 'wrist', 'cuff', '2.4', '2.6', '2.8'],
    reply:
      'Our **Antique Gold Bangles & Kadas** are cast in solid brass with 22K antique gold polish and ruby-colored cabochons. Most styles feature a discreet hinge and magnetic safety lock, allowing a seamless fit for wrist sizes **2.4 through 2.8**.\n\nThey arrive as a pair of two matching kadas.',
    speech:
      'Our Antique Gold Kadas feature convenient openable hinge clasps, fitting sizes two point four through two point eight comfortably.',
    recommendations: [
      {
        id: 'bgl-antique',
        title: 'Antique Gold Bangles (Pair of 2)',
        price: 110,
        image: '/uploads/bangles_271ffaca_1s6a9933.jpg',
        category: 'Bangles',
        href: '/bangles',
      },
    ],
    suggestions: [
      'How do I measure my wrist for bangles?',
      'Can I buy a single kada?',
      'Show me silver bangles',
    ],
  },
  {
    keywords: ['gift', 'present', 'anniversary', 'birthday', 'under 100', 'budget'],
    reply:
      'For an unforgettable gift under $100, we recommend our **Crystal Solitaire Ring** or **Austrian Crystal Partywear Earrings**. Every order arrives packaged in our signature velvet gift box with a complimentary gold-foil care card and ribbon.',
    speech:
      'Our crystal solitaire rings and partywear earrings are our most popular gifts under one hundred dollars, arriving in signature velvet presentation boxes.',
    recommendations: [
      {
        id: 'rng-solitaire',
        title: 'Crystal Solitaire Ring',
        price: 85,
        image: '/uploads/rings_0345f0a9_1s6a0180.jpg',
        category: 'Rings',
        href: '/rings',
      },
    ],
    suggestions: [
      'Can I add a handwritten gift note?',
      'What is the return & exchange policy?',
    ],
  },
];

export default function AiAssistantPage() {
  const { currentCurrency, formatPrice } = useCurrency();
  const { addItem } = useCart();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      sender: 'AURA',
      text: 'Hello, I am Aura — your Private AI Jewelry Stylist & Gemology Concierge at The Bling Haven. How may I assist you today? You can ask me about bridal jewelry matching, ring sizing, anti-tarnish plating, or gift ideas.',
      suggestions: [
        '👑 Recommend a bridal choker for my wedding',
        '💍 What is my ring size if my finger is 17.3 mm?',
        '✨ How do I keep my jewelry from tarnishing?',
        '🎁 Suggest an anniversary gift under $100',
      ],
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRec =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setInputQuery(transcript);
          handleSend(transcript);
        };
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Voice synthesis
  const speakText = (text: string) => {
    if (!isVoiceActive || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.98;
    utt.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const luxVoice = voices.find(
      (v) =>
        v.name.includes('Google UK English Female') ||
        v.name.includes('Victoria') ||
        v.name.includes('Karen') ||
        v.lang === 'en-GB'
    );
    if (luxVoice) utt.voice = luxVoice;

    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    utt.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    const patronMsg: Message = {
      id: Date.now().toString(),
      sender: 'PATRON',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, patronMsg]);
    setInputQuery('');
    setIsLoading(true);

    // 1. Try Backend API First
    try {
      const res = await apiRequest<any>('/ai-concierge/ask', {
        method: 'POST',
        data: { query: q, preferredCurrency: currentCurrency },
      });
      const data = res?.data || res;
      if (data && data.answerText) {
        const recs: RecommendedProduct[] = (data.recommendedProducts || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.basePriceUsd,
          image: p.primaryImageUrl || '/uploads/sets_00c2f42a_1s6a9390.jpg',
          category: p.categoryName || 'Jewelry',
          href: `/products/${p.slug}`,
        }));

        const auraMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'AURA',
          text: data.answerText,
          recommendations: recs.length > 0 ? recs : undefined,
          suggestions: data.suggestedFollowUps,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, auraMsg]);
        if (data.speechText) speakText(data.speechText);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      // Backend not running or timeout; seamlessly use intelligent local gemology engine!
    }

    // 2. Local Intelligent Fallback
    setTimeout(() => {
      const lower = q.toLowerCase();
      const matched = LOCAL_KNOWLEDGE.find((item) =>
        item.keywords.some((kw) => lower.includes(kw))
      );

      let reply =
        "At The Bling Haven, every creation is handcrafted with 22K micro gold plating, Austrian stones, and anti-tarnish seals. Whether you are seeking a wedding choker, daily solitaire, or Kada bangles, I am here to help. What specific jewelry style or occasion are you shopping for?";
      let speech =
        "At The Bling Haven, we handcraft twenty-two karat gold plated jewelry with Austrian stones. What specific style or celebration can I assist you with today?";
      let recs: RecommendedProduct[] | undefined = undefined;
      let suggestions: string[] | undefined = [
        '👑 Recommend a bridal choker set',
        '💍 Help me find my ring size',
        '✨ How to clean Kundan jewelry',
      ];

      if (matched) {
        reply = matched.reply;
        speech = matched.speech;
        recs = matched.recommendations;
        suggestions = matched.suggestions;
      }

      const auraMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'AURA',
        text: reply,
        recommendations: recs,
        suggestions: suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, auraMsg]);
      speakText(speech);
      setIsLoading(false);
    }, 450);
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        fontFamily: "'Helvetica Now Var', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
      className="relative min-h-screen text-white select-none"
    >
      {/* ---------------- 1. FIXED BACKGROUND VIDEO (BEHIND EVERYTHING) ---------------- */}
      <video
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      {/* Subtle Ambient Vignette Overlay (Lightened for Transparency & Video Glow) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background:
            'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.65) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* ---------------- 2. FULL-VIEWPORT HERO SECTION (100VH) ---------------- */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100vh',
        }}
        className="px-8 sm:px-12 lg:px-16 pt-[70px] pb-8 max-[900px]:pt-[90px] max-[900px]:px-[18px] max-[900px]:pb-8"
      >
        {/* Content Block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '740px',
          }}
        >
          {/* Subtle Luxury Aura Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-black/40 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-400" />
            <span>Aura AI • Intelligent Jewelry Stylist</span>
          </motion.div>

          {/* Heading with Individual Word Staggered Fade-Up */}
          <h2
            className="ai-assistant-headline"
            style={{
              fontSize: 'clamp(26px, 3vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#fff',
              margin: 0,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
              {HEADLINE_WORDS.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.15 + index * 0.08,
                    ease: EASE,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h2>

          {/* Subtext with FadeUp (delay: 0.9, y: 24) */}
          <FadeUp
            as="p"
            delay={0.9}
            y={24}
            style={{
              marginTop: '24px',
              fontSize: '14px',
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.85)',
              maxWidth: '520px',
            }}
          >
            Meet Aura, your 24/7 personal jewelry gemologist. Get instant bridal lehenga matching,
            accurate ring and bangle sizing calculations, 22K plating care advice, and curated
            recommendations in seconds.
          </FadeUp>

          {/* Interactive CTA Buttons with FadeUp (delay: 1.1) */}
          <FadeUp
            as="div"
            delay={1.1}
            y={24}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={scrollToChat}
              className="btn-primary px-7 py-3 bg-white text-black font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-2xl flex items-center gap-2 hover:bg-gold-50 transition-all"
            >
              <Bot className="w-4 h-4 text-gold-700" />
              <span>Consult with Aura</span>
            </button>

            <button
              onClick={toggleMic}
              className={`px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border transition-all ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse'
                  : 'bg-black/40 border-white/30 text-white hover:bg-white/20'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-gold-400" />}
              <span>{isListening ? 'Listening...' : 'Voice Search'}</span>
            </button>

            <Link
              href="/size-guide"
              className="px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 bg-black/40 border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              <Ruler className="w-3.5 h-3.5 text-gold-400" />
              <span>Size Guide</span>
            </Link>
          </FadeUp>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition cursor-pointer" onClick={scrollToChat}>
          <span className="text-[10px] font-mono uppercase tracking-widest">Chat with AI</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* ---------------- 3. INTERACTIVE AI CHAT & CONSULTATION ENGINE ---------------- */}
      <section
        ref={chatSectionRef}
        style={{ position: 'relative', zIndex: 1 }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="rounded-3xl border border-white/20 bg-black/15 backdrop-blur-md shadow-[0_16px_50px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Console Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 flex items-center justify-center text-black shadow-lg shadow-gold-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white tracking-wide">Aura AI Concierge</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">Online 24/7</span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Senior Gemologist & Haute Bridal Stylist
                </p>
              </div>
            </div>

            {/* Voice Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                  isVoiceActive
                    ? 'border-gold-400/50 text-gold-300 bg-gold-500/20'
                    : 'border-white/15 text-stone-300 hover:text-white bg-black/20'
                }`}
                title="Toggle Voice Output"
              >
                {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="text-[10px] uppercase font-mono">{isVoiceActive ? 'Audio ON' : 'Audio OFF'}</span>
              </button>
            </div>
          </div>

          {/* Conversation Stream */}
          <div className="p-4 sm:p-6 min-h-[420px] max-h-[620px] overflow-y-auto space-y-6">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col ${m.sender === 'PATRON' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
                    {m.sender === 'AURA' && (
                      <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-300 flex items-center justify-center shrink-0 mt-1 border border-gold-400/20">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div
                        className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          m.sender === 'PATRON'
                            ? 'bg-gold-500/90 text-obsidian-950 font-medium rounded-tr-none shadow-md backdrop-blur-sm'
                            : 'bg-white/[0.08] border border-white/20 text-stone-100 rounded-tl-none backdrop-blur-md shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-line">{m.text}</p>
                      </div>

                      <span className="text-[10px] text-stone-400 mt-1 block px-1">
                        {m.timestamp}
                      </span>
                    </div>

                    {m.sender === 'PATRON' && (
                      <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-1 border border-white/15">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Recommended Products Card Stream */}
                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="mt-4 pl-10 w-full">
                      <span className="text-xs uppercase font-mono tracking-wider text-gold-400 font-bold mb-2 block drop-shadow-sm">
                        ✦ Recommended Pieces for You:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                        {m.recommendations.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-3 rounded-2xl bg-black/30 border border-white/15 backdrop-blur-md flex items-center gap-3 hover:border-gold-500/50 transition group"
                          >
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-stone-400 uppercase font-mono">
                                {prod.category}
                              </span>
                              <h4 className="text-xs font-semibold text-white truncate group-hover:text-gold-300">
                                {prod.title}
                              </h4>
                              <p className="text-xs font-bold text-gold-400 mt-0.5">
                                {formatPrice(prod.price)}
                              </p>
                              <div className="mt-2 flex gap-2">
                                <Link
                                  href={prod.href}
                                  className="text-[10px] font-semibold text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 transition"
                                >
                                  View Piece <ChevronRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Chips */}
                  {m.suggestions && m.suggestions.length > 0 && (
                    <div className="mt-3 pl-10 flex flex-wrap gap-2">
                      {m.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-3 py-1.5 rounded-full bg-black/30 hover:bg-white/15 border border-white/15 text-stone-200 text-xs backdrop-blur-sm transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 pl-10 text-stone-300 text-xs">
                  <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Aura is curating gemological recommendations...</span>
                </div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3 rounded-2xl border transition ${
                  isListening
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-black/30 border-white/20 text-gold-400 hover:bg-white/20'
                }`}
                title="Speak to Aura"
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Aura about bridal sets, ring sizing, or jewelry care..."
                className="flex-1 bg-black/30 border border-white/20 rounded-2xl px-5 py-3 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-gold-400 transition backdrop-blur-sm"
              />

              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="btn-primary px-5 py-3 bg-gold-500 text-obsidian-950 font-bold text-xs uppercase tracking-wider rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
