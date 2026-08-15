'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import {
  AiConciergeResponseDto,
  ProductDto,
} from '@theblinghaven/shared';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  Bot,
  User,
  Crown,
  Building,
  ArrowRight,
  RefreshCw,
  Gem,
  CheckCircle2,
  Camera,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'AURA' | 'PATRON';
  text: string;
  recommendedProducts?: ProductDto[];
  suggestedFollowUps?: string[];
  salonLink?: string;
  tryOnSku?: string;
  timestamp: string;
}

export default function AiVoiceConciergePage() {
  const { currentCurrency, formatPrice } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [curatedTopics, setCuratedTopics] = useState<any[]>([]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Welcome Message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'AURA',
        text: 'Welcome to The Bling Haven. I am Aura, your Private AI Senior Gemologist and Diamond Director. You may speak with me using your microphone or type your inquiry below. How may I assist your high-jewelry curation today?',
        suggestedFollowUps: [
          '💎 What is the difference between D-Color Flawless and VVS1?',
          '👑 Recommend a Royal Bridal Choker set in 22K gold',
          '🍁 Book private diamond viewing at Toronto Yorkville salon',
          '📊 What is the live gold spot price per gram in Canada today?',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    // Fetch Topics
    apiRequest<any>('/ai-concierge/topics').then((res) => {
      const list = Array.isArray(res) ? res : res?.data || [];
      setCuratedTopics(list);
    }).catch(console.error);

    // Setup Web Speech Recognition if available in browser
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Audio Synthesis
  const speakText = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    // Pick luxury British or English voice if available
    const voices = window.speechSynthesis.getVoices();
    const luxuryVoice = voices.find((v) => v.name.includes('Google UK English Female') || v.name.includes('Victoria') || v.name.includes('Karen') || v.lang === 'en-GB');
    if (luxuryVoice) utterance.voice = luxuryVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your question.');
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

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const patronMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'PATRON',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, patronMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await apiRequest<AiConciergeResponseDto>('/ai-concierge/ask', {
        method: 'POST',
        data: {
          query: textToSend,
          preferredCurrency: currentCurrency,
        },
      });

      const data = (res as any)?.data || res;

      const auraMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'AURA',
        text: data.answerText,
        recommendedProducts: data.recommendedProducts,
        suggestedFollowUps: data.suggestedFollowUps,
        salonLink: data.salonLink,
        tryOnSku: data.tryOnSku,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, auraMsg]);

      // Speak response if voice enabled
      if (data.speechText) {
        speakText(data.speechText);
      }
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'AURA',
          text: 'Pardon me, our gemological knowledge network encountered a brief delay. Please feel free to ask again or consult our Private Concierge.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-obsidian-950 text-slate-800 dark:text-slate-200 transition-colors">
      {/* Hero Header */}
      <div className="border-b border-ivory-200 dark:border-obsidian-800 bg-white/70 dark:bg-obsidian-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 flex items-center justify-center shadow-lg shadow-gold-500/20 text-obsidian-950">
                <Bot className="h-6 w-6" />
              </div>
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-gold-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
                  Aura • AI Voice Gemologist
                </h1>
                <span className="rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  Voice Speech Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Conversational 4Cs Diamond Curation, Spot Metal Insights & Canadian Salon Booking
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (isVoiceEnabled) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
                setIsVoiceEnabled(!isVoiceEnabled);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                isVoiceEnabled
                  ? 'bg-gold-500/15 border-gold-500/30 text-gold-600 dark:text-gold-400'
                  : 'bg-slate-100 dark:bg-obsidian-800 border-slate-300 dark:border-obsidian-700 text-slate-400'
              }`}
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{isVoiceEnabled ? 'Voice Output ON' : 'Muted'}</span>
            </button>

            <Link
              href="/try-on"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-ivory-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-900 hover:text-gold-500 transition"
            >
              <Camera className="h-4 w-4 text-gold-500" />
              <span>AR Try-On Studio</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-40">
        {/* Curated Prompts Carousel */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Suggested High-Jewelry Topics:
          </span>
          <div className="flex flex-wrap gap-2">
            {curatedTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSendMessage(topic.query)}
                className="rounded-xl border border-ivory-300 dark:border-obsidian-750 bg-white dark:bg-obsidian-900 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:border-gold-500 hover:text-gold-500 transition shadow-sm"
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Message Thread */}
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'PATRON' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'PATRON'
                    ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-obsidian-950'
                    : 'bg-gradient-to-tr from-gold-600 to-amber-300 text-obsidian-950 shadow-md'
                }`}
              >
                {msg.sender === 'PATRON' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-3xl p-5 text-xs sm:text-sm space-y-3 leading-relaxed shadow-sm ${
                  msg.sender === 'PATRON'
                    ? 'bg-gold-500 text-obsidian-950 font-medium'
                    : 'bg-white dark:bg-obsidian-900 border border-ivory-300 dark:border-obsidian-750 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Recommended Product Cards */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="pt-3 border-t border-ivory-200 dark:border-obsidian-800 space-y-3">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-gold-600 dark:text-gold-400 block">
                      Recommended Haute Joaillerie Creation:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-2xl border border-ivory-300 dark:border-obsidian-800 bg-ivory-50 dark:bg-obsidian-850 p-3 space-y-2 flex flex-col justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.primaryImageUrl}
                              alt={p.title}
                              className="w-14 h-14 rounded-xl object-cover border border-gold-500/20"
                            />
                            <div className="overflow-hidden">
                              <h4 className="font-serif font-bold text-xs truncate text-slate-900 dark:text-slate-100">
                                {p.title}
                              </h4>
                              <span className="font-serif text-xs font-bold text-gold-600 dark:text-gold-400 block">
                                {formatPrice(p.basePriceUsd)}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {p.sku}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-1">
                            <Link
                              href={`/products/${p.slug}`}
                              className="flex-1 text-center rounded-xl bg-gold-500 hover:bg-gold-400 text-obsidian-950 py-1.5 text-[11px] font-bold transition"
                            >
                              View Details
                            </Link>
                            <Link
                              href={`/try-on?sku=${p.sku}`}
                              className="flex-1 text-center rounded-xl border border-gold-500/40 text-gold-600 dark:text-gold-400 hover:bg-gold-500/10 py-1.5 text-[11px] font-bold transition flex items-center justify-center space-x-1"
                            >
                              <Camera className="h-3 w-3" />
                              <span>Try in AR</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Salon Link CTA */}
                {msg.salonLink && (
                  <div className="pt-2">
                    <Link
                      href={msg.salonLink}
                      className="inline-flex items-center space-x-2 rounded-xl bg-gold-500 text-obsidian-950 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition"
                    >
                      <Building className="h-4 w-4" />
                      <span>Book Salon Viewing in Toronto or Vancouver</span>
                    </Link>
                  </div>
                )}

                {/* Suggested Follow Up Questions */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-3 border-t border-ivory-200 dark:border-obsidian-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block">Suggested Inquiries:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="rounded-lg bg-ivory-100 dark:bg-obsidian-800 hover:bg-gold-500/20 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-300 transition text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-right text-[9px] font-mono text-slate-400 pt-1">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs font-mono">
              <Bot className="h-4 w-4 text-gold-500 animate-spin" />
              <span>Aura is consulting gemological dossiers...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Bottom Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-obsidian-900/85 backdrop-blur-lg border-t border-ivory-300 dark:border-obsidian-800 p-4">
        <div className="max-w-3xl mx-auto flex items-center space-x-3">
          <button
            onClick={toggleListening}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md flex-shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-gold-500 hover:bg-gold-400 text-obsidian-950'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak with Aura'}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex-1 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : 'Ask Aura about 4Cs diamonds, spot gold, or bridal sets...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-2xl border border-ivory-300 dark:border-obsidian-700 bg-white dark:bg-obsidian-950 px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-obsidian-950 flex items-center justify-center hover:bg-gold-500 hover:text-obsidian-950 transition flex-shrink-0 disabled:opacity-40"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
