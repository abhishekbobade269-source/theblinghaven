'use client';

import React, { useState } from 'react';
import { apiRequest } from '@/lib/api';
import {
  Crown,
  Sparkles,
  MapPin,
  Calendar,
  PhoneCall,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Gem,
  ArrowRight,
} from 'lucide-react';

const SALON_LOCATIONS = [
  {
    id: 'Toronto Yorkville Flagship Salon',
    city: 'Toronto, Ontario, Canada',
    address: '100 Bloor Street West, Yorkville, Toronto ON M5S 1M4',
    phone: '+1 416 922 8800',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Vancouver Pacific Rim Salon',
    city: 'Vancouver, British Columbia, Canada',
    address: '1038 Canada Place, Vancouver BC V6C 0B9',
    phone: '+1 604 695 5300',
    image: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'London Mayfair Salon',
    city: 'London, United Kingdom',
    address: '14 Old Bond Street, Mayfair, London W1S 4PP',
    phone: '+44 20 7946 0912',
    image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Dubai Flagship Salon (DIFC)',
    city: 'Dubai, United Arab Emirates',
    address: 'Gate Precinct 4, DIFC, Dubai UAE',
    phone: '+971 4 362 7000',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'Virtual Private Video Suite',
    city: 'Global Video Consultation',
    address: 'Live HD video jewellery consultation and sizing',
    phone: '+1 416 922 8800',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ConciergePage() {
  const [selectedSalon, setSelectedSalon] = useState('Toronto Yorkville Flagship Salon');
  const [inquiryType, setInquiryType] = useState('PRIVATE_SALON_APPOINTMENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Canada');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/concierge/inquire', {
        method: 'POST',
        data: {
          fullName,
          email,
          phone: phone || undefined,
          country,
          type: inquiryType,
          subject: `Showroom Booking: ${inquiryType.replace(/_/g, ' ')} (${selectedSalon})`,
          message: message || 'Showroom appointment request.',
          preferredSalonLocation: selectedSalon,
          preferredAppointmentDate: appointmentDate ? new Date(appointmentDate).toISOString() : undefined,
        },
      });
      setIsSubmitted(true);
    } catch (e: any) {
      alert(typeof e === 'string' ? e : e?.message || 'Failed to submit appointment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-mono font-bold text-gold-700 dark:text-gold-400">
          <Crown className="h-3.5 w-3.5" />
          <span>Showroom & Private Consultation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100">
          Book Showroom Appointment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Reserve a private viewing suite for bridal fittings, solitaire rings, or custom jewellery design.
        </p>
      </div>

      {/* Salon Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SALON_LOCATIONS.map((salon) => (
          <div
            key={salon.id}
            onClick={() => setSelectedSalon(salon.id)}
            className={`cursor-pointer overflow-hidden rounded-3xl border transition-all duration-300 ${
              selectedSalon === salon.id
                ? 'border-gold-500 ring-2 ring-gold-500/50 bg-gold-500/10 dark:bg-gold-500/10 shadow-xl'
                : 'border-slate-200 dark:border-gold-500/20 bg-white dark:bg-[#0E0E14] hover:border-gold-500/50 shadow-md'
            }`}
          >
            <div className="h-44 w-full overflow-hidden">
              <img src={salon.image} alt={salon.city} className="h-full w-full object-cover" />
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-slate-900 dark:text-slate-100">{salon.city}</h3>
                {selectedSalon === salon.id && (
                  <CheckCircle2 className="h-4 w-4 text-gold-600 dark:text-gold-400" />
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{salon.address}</p>
              <p className="text-[11px] font-mono text-gold-700 dark:text-gold-400 font-bold">{salon.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Card */}
      {isSubmitted ? (
        <div className="rounded-3xl border border-gold-500/40 bg-white dark:bg-[#0E0E14] p-12 text-center space-y-4 shadow-2xl animate-in zoom-in-95 max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
            Appointment Requested
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Thank you. Our jewellery director at <strong className="text-gold-700 dark:text-gold-400">{selectedSalon}</strong> will contact you to confirm your private suite appointment.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="rounded-2xl bg-gold-500 px-6 py-2.5 text-xs font-mono font-bold text-obsidian-950 uppercase tracking-wider"
          >
            Book Another Time
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-[#0E0E14] p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="border-b border-slate-100 dark:border-white/10 pb-4">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
              Schedule Your Visit
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selected Location: <span className="text-gold-700 dark:text-gold-400 font-bold font-mono">{selectedSalon}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Service Required
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                >
                  <option value="PRIVATE_SALON_APPOINTMENT">Bridal Jewellery & Sizing Viewing</option>
                  <option value="GEMSTONE_SOURCING_INQUIRY">Solitaire Diamond & Gemstone Selection</option>
                  <option value="APPRAISAL_CERTIFICATION_REQUEST">Jewellery Valuation & Hallmark Certification</option>
                  <option value="GENERAL_CONCIERGE">General Jewellery Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Preferred Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Your Full Name *
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
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Email Address *
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

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Mobile / WhatsApp Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                  Country of Residence
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Canada / India"
                  className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1 uppercase text-[10px] font-mono">
                Specific Jewellery Requirements & Notes
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention specific ring sizes, bridal set preferences, or custom requirements..."
                className="w-full rounded-2xl border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-obsidian-950 p-3 text-slate-900 dark:text-slate-100 focus:border-gold-500 focus:outline-none font-sans"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-gold-500 hover:bg-gold-400 px-10 py-4 text-xs font-bold uppercase tracking-wider text-obsidian-950 shadow-xl transition font-mono flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Confirm Appointment Request'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
