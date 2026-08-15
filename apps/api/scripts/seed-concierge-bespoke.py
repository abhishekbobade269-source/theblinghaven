import sqlite3
import uuid
from datetime import datetime, timezone

DB_PATH = 'apps/api/prisma/dev.db'

def seed_concierge_and_bespoke():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print('===========================================================')
    print('SEEDING CONCIERGE INQUIRIES & BESPOKE ATELIER REQUESTS')
    print('===========================================================')

    now_iso = datetime.now(timezone.utc).isoformat()

    # 1. Seed Concierge Inquiries
    inquiries = [
        (
            'Her Highness Princess Noor Al-Sabah',
            'princess.noor@alsabah-holding.kw',
            '+971 50 998 1234',
            'United Arab Emirates',
            'ROYAL_CONCIERGE',
            'PRIVATE_SALON_APPOINTMENT',
            'APPOINTMENT_SCHEDULED',
            'Private Viewing of Celestial High Solitaires in Dubai Salon',
            'Requesting a confidential private salon viewing for the upcoming royal gala season. Interested in inspecting 5ct+ certified solitaires.',
            'Dubai Flagship Salon (DIFC)',
            '2026-03-15T15:00:00Z',
            'Madame Celine Laurent (Senior High-Jewelry Director)',
            'Private champagne suite and armed security escort reserved.'
        ),
        (
            'Lady Evelyn Rothschild',
            'evelyn@rothschild-heritage.co.uk',
            '+44 20 7946 0912',
            'United Kingdom',
            'GOLD_PATRON',
            'GEMSTONE_SOURCING_INQUIRY',
            'IN_REVIEW_BY_GEMOLOGIST',
            'Rare Muzo Colombian Emerald (4.5ct+) Sourcing Request',
            'Seeking a natural untreated Colombian emerald with vivid green saturation and GIA/SSEF provenance for custom heirloom pendant.',
            'London Mayfair Atelier',
            None,
            'Dr. Alistair Vance (Chief Gemologist)',
            'Sourcing rough stones from private Geneva gem vault.'
        ),
        (
            'Aarav Singhania',
            'aarav.singhania@singhania-group.in',
            '+91 98200 12345',
            'India',
            'ROYAL_CONCIERGE',
            'BESPOKE_CUSTOM_CREATION',
            'QUOTATION_DISPATCHED',
            'Imperial Heritage Jadau & Diamond Bridal Parure',
            'Require custom-crafted 22K polki bridal choker set with natural Basra pearls for destination wedding in Lake Como.',
            'Virtual Private Video Consultation',
            '2026-02-28T11:00:00Z',
            'Master Goldsmith Rajeshwar Verma',
            'CAD 3D renders generated and sent via private encrypted dossier.'
        )
    ]

    for fn, em, ph, ctry, vip, itype, st, subj, msg, salon, app_dt, adv, notes in inquiries:
        inq_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO concierge_inquiries (
                id, fullName, email, phone, country, vipTier, type, status,
                subject, message, preferredSalonLocation, preferredAppointmentDate,
                assignedAdvisor, internalNotes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (inq_id, fn, em, ph, ctry, vip, itype, st, subj, msg, salon, app_dt, adv, notes, now_iso, now_iso))

    print(f'Seeded {len(inquiries)} VIP concierge inquiries and salon appointments!')

    # 2. Seed Bespoke Requests
    bespokes = [
        (
            'BESPOKE-2026-001',
            'Her Highness Princess Noor Al-Sabah',
            'princess.noor@alsabah-holding.kw',
            '+971 50 998 1234',
            'United Arab Emirates',
            'ROYAL_CONCIERGE',
            'Ring',
            'Platinum Pt950 & 18K Yellow Gold Accents',
            'D-Flawless Type IIa Diamond',
            6.2,
            'Emerald Cut',
            'US 6.5',
            'N & K • Eternally 2026',
            '$75,000 - $100,000 USD',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
            'A magnificent 6.20ct Emerald-Cut D-Flawless solitaire flanked by custom-cut tapered baguette diamonds in micro-prong platinum setting.',
            'CAD_DESIGN_IN_PROGRESS',
            'Master Artisan Pierre Dubois (Geneva)',
            78500.0,
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85',
            5,
            '3D wax printing model prepared for private salon fitting in Dubai.'
        ),
        (
            'BESPOKE-2026-002',
            'Aarav Singhania',
            'aarav.singhania@singhania-group.in',
            '+91 98200 12345',
            'India',
            'ROYAL_CONCIERGE',
            'Choker',
            '22K Solid Heritage Yellow Gold',
            'Uncut Syndicate Polki Diamonds & Certified Basra Pearls',
            24.5,
            'Syndicate Polki Slice',
            'Adjustable Royal Dori (38cm)',
            'Singhania Royal Lineage',
            '$100,000 - $150,000 USD',
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
            'Grand royal choker featuring antique open-setting polki diamonds suspended with 7 strands of graduated Basra seed pearls and hand-enameled meenakari foliage.',
            'CASTING_AND_SETTING',
            'Syndicate Jadau Atelier Jaipur',
            128000.0,
            'https://images.unsplash.com/photo-1611591475161-050478b871ee?auto=format&fit=crop&w=1200&q=85',
            8,
            'Meenakari reverse enamel completed. Setting 48 Syndicate polki stones in 24K kundan foil.'
        ),
        (
            'BESPOKE-2026-003',
            'Dr. Charlotte Vance',
            'charlotte.vance@vance-neurology.org',
            '+1 212 555 0192',
            'United States',
            'SILVER',
            'Ring',
            'Platinum Pt950',
            'VVS1 Oval Cut Diamonds',
            4.0,
            'Oval Brilliant',
            'US 5.75',
            'Forever Always',
            '$25,000 - $40,000 USD',
            'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
            'Full eternity band composed of 14 matching 0.30ct oval brilliant diamonds in shared-prong platinum montage.',
            'SUBMITTED',
            'Atelier Concierge Desk',
            32000.0,
            None,
            4,
            'Awaiting client confirmation of exact diamond color grading (D/E).'
        )
    ]

    for ref, cn, em, ph, ctry, vip, cat, metal, gem, ct, shp, sz, eng, bud, photo, brief, st, gold, quote, cad, wks, notes in bespokes:
        b_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO bespoke_requests (
                id, referenceNumber, clientName, clientEmail, clientPhone, clientCountry,
                vipTier, category, metalPreference, gemstonePreference, estimatedCaratWeight,
                diamondShape, ringOrWristSize, engravingText, budgetRangeUsd, inspirationPhotoUrl,
                designBrief, status, assignedGoldsmith, quotedAmountUsd, cadRenderUrl,
                estimatedCompletionWeeks, atelierNotes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (b_id, ref, cn, em, ph, ctry, vip, cat, metal, gem, ct, shp, sz, eng, bud, photo, brief, st, gold, quote, cad, wks, notes, now_iso, now_iso))

    print(f'Seeded {len(bespokes)} luxury bespoke jewelry atelier projects!')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_concierge_and_bespoke()
