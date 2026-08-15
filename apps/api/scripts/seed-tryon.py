import sqlite3, uuid, datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_tryon_assets():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    overlays = [
        {
            'sku': 'TBH-RING-001',
            'title': 'The Sovereign 2.5ct Cushion Solitaire Ring',
            'category': 'RING',
            'overlayImageUrl': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
            'defaultScale': 1.0,
            'defaultRotation': 0.0,
            'anchorType': 'HAND_RING_FINGER',
            'basePriceCad': 25650.0,
        },
        {
            'sku': 'TBH-RING-002',
            'title': 'Imperial Emerald & Radiant Diamond Cocktail Ring',
            'category': 'RING',
            'overlayImageUrl': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
            'defaultScale': 1.15,
            'defaultRotation': 15.0,
            'anchorType': 'HAND_RING_FINGER',
            'basePriceCad': 44380.0,
        },
        {
            'sku': 'TBH-CHOKER-001',
            'title': 'Maharani Royal Heritage Polki & Emerald Bridal Choker Set',
            'category': 'NECKLACE',
            'overlayImageUrl': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
            'defaultScale': 1.3,
            'defaultRotation': 0.0,
            'anchorType': 'NECK_COLLAR',
            'basePriceCad': 94320.0,
        },
        {
            'sku': 'TBH-EARRING-001',
            'title': 'Celestial Cascade Pear-Cut Diamond Chandelier Drop Earrings',
            'category': 'EARRINGS',
            'overlayImageUrl': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
            'defaultScale': 0.85,
            'defaultRotation': 0.0,
            'anchorType': 'EAR_LOBE',
            'basePriceCad': 30510.0,
        },
        {
            'sku': 'TBH-KADA-001',
            'title': 'Imperial 22K Solid Gold Openable Royal Filigree Kada',
            'category': 'BANGLE',
            'overlayImageUrl': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
            'defaultScale': 1.2,
            'defaultRotation': -25.0,
            'anchorType': 'WRIST',
            'basePriceCad': 20800.0,
        },
    ]

    for o in overlays:
        cursor.execute("SELECT id FROM try_on_overlays WHERE sku = ?", (o['sku'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO try_on_overlays (
                    id, sku, title, category, overlayImageUrl, defaultScale,
                    defaultRotation, anchorType, sparkleRefractionEnabled,
                    basePriceCad, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)
            """, (
                uid, o['sku'], o['title'], o['category'], o['overlayImageUrl'],
                o['defaultScale'], o['defaultRotation'], o['anchorType'],
                o['basePriceCad'], now, now
            ))
            print(f"  [INSERT] Seeded Try-On Overlay: {o['title']} ({o['category']})")
        else:
            cursor.execute("""
                UPDATE try_on_overlays SET
                    title = ?,
                    category = ?,
                    overlayImageUrl = ?,
                    basePriceCad = ?,
                    updatedAt = ?
                WHERE sku = ?
            """, (o['title'], o['category'], o['overlayImageUrl'], o['basePriceCad'], now, o['sku']))
            print(f"  [UPDATE] Refreshed Try-On Overlay: {o['title']}")

    # Seed Sample Client Consultation Look
    cursor.execute("SELECT id FROM try_on_consultations WHERE clientEmail = 'c.rothschild@toronto-estates.ca'")
    if not cursor.fetchone():
        cid = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO try_on_consultations (
                id, clientName, clientEmail, clientPhone, productSku,
                productTitle, category, scaleApplied, rotationApplied,
                skinToneSelected, preferredSalon, notes, status,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cid, 'Baroness Charlotte De Rothschild', 'c.rothschild@toronto-estates.ca',
            '+1 416 922 8800', 'TBH-RING-001',
            'The Sovereign 2.5ct Cushion Solitaire Ring', 'RING', 1.05, 5.0,
            'WARM_OLIVE', 'Toronto Yorkville Haute Salon',
            'Client requested virtual hand fitting before private viewing at Yorkville suite on Thursday.',
            'PENDING_ADVISOR_REVIEW', now, now
        ))
        print("  [CONSULTATION] Seeded VIP Client Virtual Try-On Look Consultation.")

    conn.commit()
    conn.close()
    print("AR Try-On studio assets seeded successfully.")

if __name__ == '__main__':
    seed_tryon_assets()
