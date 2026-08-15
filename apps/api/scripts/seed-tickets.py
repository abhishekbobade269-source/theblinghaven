import sqlite3, uuid, datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_support_tickets():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    now_iso = now_dt.strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    tickets = [
        {
            'ticketNumber': 'TBH-TKT-2026-1042',
            'customerName': 'Lady Victoria Montagu',
            'customerEmail': 'v.montagu@mayfair-estates.co.uk',
            'customerPhone': '+44 20 7946 0912',
            'category': 'PRODUCT_INQUIRY',
            'priority': 'URGENT_VIP',
            'status': 'IN_REVIEW',
            'subject': 'Inquiry regarding 18K White Gold custom setting on Sovereign Solitaire',
            'description': 'Good morning. I would like to confirm whether The Sovereign Solitaire can be customized with a platinum gallery and pavé band for an upcoming anniversary.',
            'relatedProductSku': 'TBH-RNG-001',
            'assignedAgent': 'Alistair Sterling (Senior Director)',
            'staffNotes': 'VIP Black Tier client. Sourcing platinum pavé CAD rendering from Atelier.',
            'responses': [
                {
                    'senderRole': 'SUPPORT_AGENT',
                    'senderName': 'Alistair Sterling',
                    'message': 'Dear Lady Victoria, our master jeweler has reviewed your request. We can craft the platinum pavé gallery within 7 business days with complimentary hand delivery to Mayfair.',
                    'isInternalNote': 0
                }
            ]
        },
        {
            'ticketNumber': 'TBH-TKT-2026-1043',
            'customerName': 'Jean-Luc Tremblay',
            'customerEmail': 'jl.tremblay@montreal-capital.ca',
            'customerPhone': '+1 514 555 0188',
            'category': 'ORDER_SHIPMENT',
            'priority': 'PRIORITY',
            'status': 'WAITING_CLIENT',
            'subject': 'Armored Ferrari delivery window for Montreal Penthouse private drop',
            'description': 'Hello team. I placed order #TBH-ORD-1002 yesterday. Please confirm if the armored courier can arrive between 2:00 PM and 4:00 PM Thursday.',
            'relatedOrderNumber': 'TBH-ORD-1002',
            'assignedAgent': 'Genevieve Beaufort (Concierge Lead)',
            'staffNotes': 'Security clearance verified with CBSA & Ferrari Group Canada.',
            'responses': [
                {
                    'senderRole': 'SUPPORT_AGENT',
                    'senderName': 'Genevieve Beaufort',
                    'message': 'Bonjour Monsieur Tremblay. Ferrari Group Armored Canada has confirmed your 2:00 PM - 4:00 PM Thursday delivery window. The courier will present badge #FERRARI-CAN-8802.',
                    'isInternalNote': 0
                }
            ]
        },
        {
            'ticketNumber': 'TBH-TKT-2026-1044',
            'customerName': 'Dr. Rajesh Patel',
            'customerEmail': 'r.patel@vancouver-health.ca',
            'customerPhone': '+1 604 555 0142',
            'category': 'GEMOLOGY_CERTIFICATE',
            'priority': 'STANDARD',
            'status': 'OPEN',
            'subject': 'Digital GIA Provenance Passport QR verification question',
            'description': 'I have received my Royal Kada. How do I transfer the cryptographic SHA-256 digital certificate to my daughter’s digital safe?',
            'relatedProductSku': 'TBH-BAN-001',
            'assignedAgent': 'Marcus Vance (Senior Gemologist)',
            'staffNotes': 'Advised client on public /verify desk ownership transfer procedure.',
            'responses': []
        }
    ]

    for t in tickets:
        cursor.execute("SELECT id FROM support_tickets WHERE ticketNumber = ?", (t['ticketNumber'],))
        row = cursor.fetchone()
        if not row:
            tid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO support_tickets (
                    id, ticketNumber, customerName, customerEmail, customerPhone,
                    category, priority, status, subject, description,
                    relatedOrderNumber, relatedProductSku, assignedAgent, staffNotes,
                    createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                tid, t['ticketNumber'], t['customerName'], t['customerEmail'], t.get('customerPhone'),
                t['category'], t['priority'], t['status'], t['subject'], t['description'],
                t.get('relatedOrderNumber'), t.get('relatedProductSku'), t.get('assignedAgent'), t.get('staffNotes'),
                now_iso, now_iso
            ))

            for r in t['responses']:
                rid = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO ticket_responses (
                        id, ticketId, senderRole, senderName, message, isInternalNote, timestamp
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    rid, tid, r['senderRole'], r['senderName'], r['message'], r['isInternalNote'], now_iso
                ))
            print(f"  [SUPPORT] Seeded Ticket {t['ticketNumber']} for {t['customerName']}")

    conn.commit()
    conn.close()
    print("Support tickets and responses seeded successfully.")

if __name__ == '__main__':
    seed_support_tickets()
