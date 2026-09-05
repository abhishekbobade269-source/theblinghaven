'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Truck,
  Gem,
  HelpCircle,
  PhoneCall,
  ChevronDown,
  Minimize2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  links?: { label: string; href: string }[];
}

const QUICK_PROMPTS = [
  { label: '📦 Track My Order', text: 'How can I track my order delivery?' },
  { label: '✨ Custom Jewellery', text: 'I want to make a custom artificial jewellery design.' },
  { label: '📏 Size & Styling Help', text: 'How do I choose the right ring or bangle size?' },
  { label: '💬 Support & Returns', text: 'What is your shipping and return policy?' },
];

export function CustomerChatWidget() {
  const pathname = usePathname();
  if (pathname === '/future-fashion' || pathname === '/gallery') return null;

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to The Bling Haven. How can we assist you today with our handcrafted artificial, Kundan, and CZ jewellery?',
      time: 'Just now',
      links: [
        { label: 'View Gallery', href: '/gallery' },
        { label: 'Custom Jewellery', href: '/bespoke' },
        { label: 'Track Order', href: '/track' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Simulated Smart Support Bot Response
    setTimeout(() => {
      let replyText =
        'Thank you for reaching out! Our customer care team is available to help with orders, sizing, and styling.';
      let links: { label: string; href: string }[] | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('track') || lower.includes('order') || lower.includes('shipping') || lower.includes('delivery')) {
        replyText =
          'You can track your order in real time using your Order Number or tracking ID. Orders within Canada typically arrive in 2-4 business days via courier.';
        links = [{ label: 'Track Order Now', href: '/track' }];
      } else if (lower.includes('custom') || lower.includes('make') || lower.includes('bangle') || lower.includes('necklace') || lower.includes('bespoke')) {
        replyText =
          'We craft custom artificial & bridal jewellery! You can choose your item (ring, bangle, choker, earrings), describe the design, and our team will get back to you with sketches and pricing.';
        links = [{ label: 'Custom Jewellery Studio', href: '/bespoke' }];
      } else if (lower.includes('size') || lower.includes('ring size') || lower.includes('sizing')) {
        replyText =
          'Our rings follow standard North American & Indian ring sizes (Sizes 5 to 10), and bangles come in 2.4, 2.6, and 2.8 diameters. If you need custom sizing guidance, our bespoke concierge is delighted to assist!';
        links = [{ label: 'Custom Sizing Inquiries', href: '/bespoke' }];
      } else if (lower.includes('return') || lower.includes('policy') || lower.includes('damage') || lower.includes('help')) {
        replyText =
          'We offer a 100% Anti-Tarnish Guarantee and safe doorstep courier delivery. If you need any assistance with an existing order, please submit a ticket at our Help Desk.';
        links = [{ label: 'Help & Support Desk', href: '/support' }];
      }

      const botReply: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        links,
      };

      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Expanded Chat Window */}
      {isOpen ? (
        <div className="w-[360px] sm:w-[390px] h-[540px] max-h-[85vh] rounded-3xl border-2 border-slate-200 dark:border-gold-500/40 bg-white dark:bg-[#0E0E14] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-[#161622] to-slate-900 text-white p-4 flex items-center justify-between border-b border-gold-500/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-obsidian-950 font-bold shadow-md">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide text-white">
                  The Bling Haven Support
                </h3>
                <p className="text-[10px] font-mono text-gold-400">● Online | Instant Assistant</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition"
                aria-label="Close Chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50 dark:bg-[#0A0A0E]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gold-500 text-obsidian-950 font-medium rounded-tr-sm'
                      : 'bg-white dark:bg-[#161620] border border-slate-200 dark:border-gold-500/25 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <p>{msg.text}</p>

                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-gold-500/20 flex flex-wrap gap-1.5">
                      {msg.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center space-x-1 rounded-lg bg-gold-500/15 hover:bg-gold-500 hover:text-obsidian-950 px-2 py-1 text-[10px] font-mono font-bold text-gold-700 dark:text-gold-400 transition"
                        >
                          <span>{link.label}</span>
                          <span>→</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14] flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.label}
                onClick={() => handleSend(prompt.text)}
                className="shrink-0 rounded-full border border-slate-200 dark:border-gold-500/30 bg-slate-100 dark:bg-[#161620] hover:border-gold-500 px-3 py-1 text-[10px] font-mono text-slate-700 dark:text-slate-300 hover:text-gold-600 dark:hover:text-gold-400 transition"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-2xl border border-slate-300 dark:border-gold-500/30 bg-slate-50 dark:bg-[#161620] px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-gold-500 focus:outline-none transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="h-9 w-9 rounded-2xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-obsidian-950 flex items-center justify-center transition shadow-md shrink-0"
                aria-label="Send Message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Floating Chat Trigger Button */
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-gold-600 via-gold-500 to-amber-400 text-obsidian-950 shadow-2xl hover:scale-110 transition-all duration-300 ring-4 ring-gold-500/20"
          aria-label="Open Chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />

          {/* Unread Ping Badge */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-[9px] font-mono font-bold items-center justify-center">
                1
              </span>
            </span>
          )}

          {/* Tooltip on hover */}
          <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden sm:group-hover:flex items-center space-x-1 rounded-xl bg-slate-900 text-gold-400 px-3 py-1.5 text-xs font-mono font-bold whitespace-nowrap shadow-xl border border-gold-500/30 pointer-events-none">
            <Sparkles className="h-3 w-3" />
            <span>Chat with us</span>
          </div>
        </button>
      )}
    </div>
  );
}
