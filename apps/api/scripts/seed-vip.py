import sqlite3, uuid, datetime, json

DB_PATH = 'apps/api/prisma/dev.db'

def seed_vip_ecosystem():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    now_iso = now_dt.strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'
    future_iso = (now_dt + datetime.timedelta(days=7)).strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    # 1. VIP Members with Invitation Keys
    members = [
        {
            'name': 'Baroness Charlotte De Rothschild',
            'email': 'c.rothschild@toronto-estates.ca',
            'phone': '+1 (416) 922-8800',
            'invitationKey': 'BLING-VIP-TORONTO-2026',
            'tier': 'BLACK_TIER_INNER_CIRCLE',
            'assignedAdvisor': 'Lord Alistair Sterling (Senior Director, Toronto)',
            'preferredSalon': 'Toronto Yorkville Haute Salon (100 Bloor St W)',
            'totalSpendCad': 420000.0,
        },
        {
            'name': 'Lord Henry Cavendish',
            'email': 'h.cavendish@mayfair-holdings.co.uk',
            'phone': '+44 20 7946 0912',
            'invitationKey': 'BLING-VIP-LONDON-2026',
            'tier': 'ROYAL_TIER',
            'assignedAdvisor': 'Lady Genevieve Beaufort (Director, London Mayfair)',
            'preferredSalon': 'London Mayfair Salon (14 Old Bond Street)',
            'totalSpendCad': 280000.0,
        },
        {
            'name': 'Princess Noor Al-Sabah',
            'email': 'noor.alsabah@difc-patrons.ae',
            'phone': '+971 4 362 7000',
            'invitationKey': 'BLING-VIP-DUBAI-2026',
            'tier': 'MAISON_PATRON',
            'assignedAdvisor': 'Tariq Al-Mansoor (Senior Gemologist, Dubai)',
            'preferredSalon': 'Dubai Flagship Salon (Gate Precinct 4, DIFC)',
            'totalSpendCad': 195000.0,
        },
        {
            'name': 'Evelyn Tremblay-Chau',
            'email': 'evelyn.chau@vancouver-pacific.ca',
            'phone': '+1 (604) 688-3400',
            'invitationKey': 'BLING-VIP-VANCOUVER-2026',
            'tier': 'BLACK_TIER_INNER_CIRCLE',
            'assignedAdvisor': 'Marc-André Laurent (Director, Vancouver)',
            'preferredSalon': 'Vancouver Pacific Rim Salon (1038 Canada Place)',
            'totalSpendCad': 510000.0,
        },
    ]

    for m in members:
        cursor.execute("SELECT id FROM vip_members WHERE email = ?", (m['email'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO vip_members (
                    id, name, email, phone, invitationKey, tier,
                    assignedAdvisor, preferredSalon, totalSpendCad, isActive,
                    joinedAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            """, (
                uid, m['name'], m['email'], m['phone'], m['invitationKey'],
                m['tier'], m['assignedAdvisor'], m['preferredSalon'],
                m['totalSpendCad'], now_iso, now_iso
            ))
            print(f"  [VIP MEMBER] Registered {m['name']} (Key: {m['invitationKey']})")

    # 2. Secret Vault Drops (1-of-1 Ultra Rare Creations)
    drops = [
        {
            'sku': 'TBH-VAULT-001',
            'title': 'The Sovereign 12.8ct Golconda Cushion Diamond & Platinum Master Parure',
            'tagline': '1-OF-1 MAISON RESERVE VAULT PIECE',
            'description': 'Discovered in the ancient diamond gravels of Golconda, this type IIa nitrogen-free cushion solitaire exhibits purest water clarity with matching chandelier shoulder drops set in hand-drawn 950 platinum.',
            'gemstoneDetails': '12.80 Carats • D (Colorless) • Flawless (FL) • Type IIa Golconda • GIA Report #6482910001',
            'metalDetails': '950 Platinum (PT 950) & 18K White Gold • Net Gold Weight: 28.5g • BIS-916-HUID-990182',
            'priceCad': 285000.0,
            'vaultLocation': 'Toronto Reserve Vault (Safe Room 4)',
            'allocationStatus': 'AVAILABLE',
            'accessTierRequired': 'BLACK_TIER_INNER_CIRCLE',
            'primaryImageUrl': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
            'galleryImages': json.dumps([
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
            ]),
        },
        {
            'sku': 'TBH-VAULT-002',
            'title': 'The Empress Kashmir Royal Velvet Cornflower Blue Sapphire Suite',
            'tagline': '1-OF-1 UNHEATED KASHMIR HEIRLOOM',
            'description': 'A fabled 8.40ct unheated Kashmir blue sapphire exhibiting the rare velvety silk glow, surrounded by 4.20 carats of marquise and pear-cut collection-grade diamonds.',
            'gemstoneDetails': '8.40ct Unheated Royal Blue Sapphire (Kashmir Origin) + 4.20ct D-VVS Diamonds • SSEF & GIA Dossier',
            'metalDetails': '18K White Gold (AU 750) • Net Gold Weight: 22.4g • BIS-916-HUID-882904',
            'priceCad': 340000.0,
            'vaultLocation': 'London Mayfair Vault (Bond Street)',
            'allocationStatus': 'AVAILABLE',
            'accessTierRequired': 'ROYAL_TIER',
            'primaryImageUrl': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
            'galleryImages': json.dumps([
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
            ]),
        },
        {
            'sku': 'TBH-VAULT-003',
            'title': 'The Nizam 100-Year Basra Natural Pearl & Uncut Polki Imperial Bridal Choker',
            'tagline': 'HISTORIC ROYAL ATELIER COMMISSION',
            'description': 'Composed of 144 matched Basra saltwater pearls from vintage royal treasury reserves, woven with 24K pure gold jadau setting and Colombian untreated emerald briolettes.',
            'gemstoneDetails': '144 Certified Basra Saltwater Pearls • 35ct Uncut Polki Diamonds • 48ct Colombian Emerald Drops',
            'metalDetails': '22K Solid Gold with Pure 24K Foil Jadau • Net Gold: 88.0g • Government BIS Hallmark HUID-774910',
            'priceCad': 450000.0,
            'vaultLocation': 'Toronto Reserve Vault (Private Salon)',
            'allocationStatus': 'AVAILABLE',
            'accessTierRequired': 'BLACK_TIER_INNER_CIRCLE',
            'primaryImageUrl': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
            'galleryImages': json.dumps([
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
            ]),
        },
    ]

    for d in drops:
        cursor.execute("SELECT id FROM secret_vault_drops WHERE sku = ?", (d['sku'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO secret_vault_drops (
                    id, sku, title, tagline, description, gemstoneDetails,
                    metalDetails, priceCad, vaultLocation, allocationStatus,
                    accessTierRequired, dropEndTimestamp, primaryImageUrl,
                    galleryImages, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                uid, d['sku'], d['title'], d['tagline'], d['description'],
                d['gemstoneDetails'], d['metalDetails'], d['priceCad'],
                d['vaultLocation'], d['allocationStatus'], d['accessTierRequired'],
                future_iso, d['primaryImageUrl'], d['galleryImages'],
                now_iso, now_iso
            ))
            print(f"  [SECRET VAULT] Seeded 1-of-1 Drop: {d['title']}")

    # 3. Seed Sample VIP Advisor Chat Messages
    cursor.execute("SELECT id FROM vip_chat_messages WHERE clientEmail = 'c.rothschild@toronto-estates.ca'")
    if not cursor.fetchone():
        msg_id1 = str(uuid.uuid4())
        msg_id2 = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO vip_chat_messages (
                id, clientEmail, clientName, senderRole, senderName,
                message, salonLocation, isRead, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (
            msg_id1, 'c.rothschild@toronto-estates.ca', 'Baroness Charlotte De Rothschild',
            'CLIENT', 'Baroness Charlotte De Rothschild',
            'Good afternoon Alistair. I saw the Golconda 12.8ct drop in the Secret Vault. Is it available for private inspection at the Yorkville salon this Thursday at 3 PM?',
            'Toronto Yorkville Haute Salon (100 Bloor St W)', now_iso
        ))

        cursor.execute("""
            INSERT INTO vip_chat_messages (
                id, clientEmail, clientName, senderRole, senderName,
                message, salonLocation, isRead, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        """, (
            msg_id2, 'c.rothschild@toronto-estates.ca', 'Baroness Charlotte De Rothschild',
            'ADVISOR', 'Lord Alistair Sterling (Senior Director)',
            'Good afternoon Baroness. Yes, I have placed a temporary acquisition hold on the Golconda 12.8ct for you. Our private vault room in Yorkville is reserved for your viewing on Thursday at 3:00 PM with vintage Dom Pérignon prepared.',
            'Toronto Yorkville Haute Salon (100 Bloor St W)', now_iso
        ))
        print("  [VIP CHAT] Seeded 1-on-1 VIP Advisor Consultation Dialogue.")

    conn.commit()
    conn.close()
    print("VIP Member Lounge & Secret Vault Drops seeded successfully.")

if __name__ == '__main__':
    seed_vip_ecosystem()
