import sqlite3
import json
import datetime
import uuid
import hashlib

def clean_and_brand_the_bling_haven_canada():
    print("======================================================================")
    print("THE BLING HAVEN - SEEDING 25+ PRODUCTS ACROSS SEPARATED CATEGORIES")
    print("======================================================================")

    conn = sqlite3.connect('apps/api/prisma/dev.db')
    cursor = conn.cursor()

    now_iso = datetime.datetime.utcnow().isoformat() + 'Z'
    now_dt = datetime.datetime.utcnow()

    # 1. Clear all dynamic transactional tables
    tables_to_clear = [
        'order_timeline',
        'order_items',
        'orders',
        'support_tickets',
        'ticket_responses',
        'concierge_inquiries',
        'bespoke_requests',
        'certificates_of_authenticity',
        'vip_members',
        'secret_vault_drops',
        'vip_chat_messages',
        'armored_transfers',
        'luxury_vaults',
        'ai_consultation_logs',
        'fiscal_close_records',
        'products',
        'categories',
        'collections',
        'customers',
    ]

    for table in tables_to_clear:
        try:
            cursor.execute(f"DELETE FROM {table}")
            print(f"  [CLEANSED] Cleared table '{table}'")
        except sqlite3.OperationalError:
            pass

    # 2. Seed Clean 5 Main Categories
    cat_rings_id = str(uuid.uuid4())
    cat_bridal_id = str(uuid.uuid4())
    cat_earrings_id = str(uuid.uuid4())
    cat_bangles_id = str(uuid.uuid4())
    cat_silver_id = str(uuid.uuid4())

    categories = [
        (cat_rings_id, 'AAA+ CZ Solitaires & Fashion Rings', 'rings', 'Anti-tarnish 18K rhodium and gold plated AAA+ Hearts & Arrows solitaire cubic zirconia rings.', now_iso, now_iso),
        (cat_bridal_id, 'Royal Heritage Kundan & Polki Bridal Sets', 'bridal-sets', 'Handcrafted Jadau choker necklaces, cultured faux Basra pearls, and hydro gemstone bridal parures.', now_iso, now_iso),
        (cat_earrings_id, 'Austrian Crystal & Hydro Gem Earrings', 'earrings', 'Dazzling chandelier drops, hydro velvet sapphire accents, and lightweight hypoallergenic studs.', now_iso, now_iso),
        (cat_bangles_id, '22K Micro Gold Plated Bangles & Kadas', 'bangles', 'Anti-tarnish brass openable kadas with 22K antique matte gold finish and hidden safety locks.', now_iso, now_iso),
        (cat_silver_id, 'Artisan 925 Silver Plated Demi-Fine', 'artisan-silver', 'Hand-filigree 925 sterling silver plated cuffs and everyday luxury heirlooms.', now_iso, now_iso),
    ]

    cursor.executemany("""
        INSERT INTO categories (id, name, slug, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?)
    """, categories)
    print("  [SEEDED] 5 The Bling Haven Dedicated Categories")

    # 3. Seed 25+ Strictly Separated Products
    products = [
        # --- RINGS CATEGORY (Strictly rings_... images) ---
        (
            str(uuid.uuid4()), 'TBH-RNG-001', 'The Bling Haven Canada • The Sovereign 5ct Cushion Solitaire CZ Ring',
            'the-sovereign-5ct-cushion-solitaire-cz-ring',
            'AAA+ Hearts & Arrows Cushion Cubic Zirconia in 18K Rhodium Plated Brass',
            'Our flagship luxury faux solitaire ring featuring a 5.0ct equivalent AAA+ Hearts & Arrows cushion cubic zirconia with anti-tarnish waterproof finish and comfort-fit band.',
            65.0, 89.0, 22.0, cat_rings_id, None,
            json.dumps({'stone': '5.0ct Equiv AAA+ CZ', 'cut': 'Hearts & Arrows Cushion', 'plating': '18K White Gold Rhodium', 'baseMetal': 'Jewelers Brass', 'hypoallergenic': '100% Lead & Nickel Free'}),
            '/uploads/rings_03526cf9_1s6a0179.jpg',
            json.dumps(['/uploads/rings_128d41a2_1s6a0191.jpg', '/uploads/rings_5802bb4c_1s6a0180.jpg']),
            25, 5, 'ACTIVE', 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-RNG-002', 'The Bling Haven Canada • Royal Oval Emerald Halo Statement Ring',
            'royal-oval-emerald-halo-statement-ring',
            'Hydro Columbian Emerald with Micro-Pavé CZ Halo in 18K Yellow Gold Dip',
            'A striking royal green hydro emerald center stone surrounded by a brilliant halo of micro-pavé Austrian cubic zirconia.',
            55.0, 75.0, 18.0, cat_rings_id, None,
            json.dumps({'stone': '3.5ct Hydro Emerald', 'cut': 'Oval Brilliant', 'plating': '18K Yellow Gold', 'hypoallergenic': 'Yes'}),
            '/uploads/rings_617def17_1s6a0188.jpg',
            json.dumps(['/uploads/rings_7bc20a8e_1s6a0194.jpg', '/uploads/rings_7d08d71b_1s6a0173.jpg']),
            20, 5, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-RNG-003', 'The Bling Haven Canada • Princess Cut Eternity Band in Platinum Finish',
            'princess-cut-eternity-band-platinum-finish',
            'Channel-Set AAA+ CZ Eternity Ring with Mirror Polish',
            'Sleek and dazzling full eternity band channel-set with princess-cut cubic zirconia, engineered for stackable everyday wear.',
            45.0, 60.0, 15.0, cat_rings_id, None,
            json.dumps({'stone': 'AAA+ Princess CZ', 'setting': 'Channel Setting', 'plating': '18K Rhodium', 'waterproof': 'Yes'}),
            '/uploads/rings_8df42b75_1s6a0186.jpg',
            json.dumps(['/uploads/rings_96b9e991_1s6a0172.jpg', '/uploads/rings_a2850d19_1s6a0181.jpg']),
            35, 5, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-RNG-004', 'The Bling Haven Canada • Radiant Royal Sapphire Cocktail Ring',
            'radiant-royal-sapphire-cocktail-ring',
            'Hydro Royal Velvet Sapphire with Baguette Shoulder Accents',
            'Deep midnight blue hydro sapphire cocktail ring flanked by dual tapered baguette-cut simulated diamonds.',
            59.0, 79.0, 19.0, cat_rings_id, None,
            json.dumps({'stone': '4.0ct Hydro Sapphire', 'cut': 'Radiant Cut', 'plating': '18K White Gold Rhodium', 'hypoallergenic': 'Yes'}),
            '/uploads/rings_c3d920e9_1s6a0183.jpg',
            json.dumps(['/uploads/rings_d266cb59_1s6a0184.jpg', '/uploads/rings_d4a3dff9_1s6a0175.jpg']),
            18, 4, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-RNG-005', 'The Bling Haven Canada • Empress Pear-Cut Teardrop Halo Ring',
            'empress-pear-cut-teardrop-halo-ring',
            'D-Color Simulated Diamond Pear Solitaire with Split Pavé Shank',
            'Graceful pear-shaped simulated diamond solitaire mounted on an elegant split pavé band with anti-tarnish protective coating.',
            62.0, 85.0, 20.0, cat_rings_id, None,
            json.dumps({'stone': '3.8ct Pear CZ', 'plating': '18K Gold Plated', 'hypoallergenic': 'Yes'}),
            '/uploads/rings_e916e5c2_1s6a0249.jpg',
            json.dumps(['/uploads/rings_f456856a_1s6a0178.jpg', '/uploads/rings_03526cf9_1s6a0179.jpg']),
            22, 5, 'ACTIVE', 0, 1, now_iso, now_iso
        ),

        # --- BRIDAL SETS CATEGORY (Strictly sets_... and bridal_... images) ---
        (
            str(uuid.uuid4()), 'TBH-BRD-001', 'The Bling Haven Canada • Maharani Royal Heritage Kundan & Polki Bridal Set',
            'maharani-royal-heritage-kundan-polki-bridal-set',
            'Handcrafted Meenakari Jadau Choker Set with Hydro Emeralds & Faux Basra Pearls',
            'Centuries-old royal goldsmithing look in 22K micro gold plating, adorned with hand-cut Polki Kundan stones, natural hydro emerald drops, and matching chandelier earrings + maang tikka.',
            185.0, 240.0, 65.0, cat_bridal_id, None,
            json.dumps({'plating': '22K Micro Gold Plating', 'stones': 'Hand-cut Polki Kundan & Hydro Emeralds', 'pearls': 'Cultured Faux Basra Pearls', 'craft': 'Traditional Meenakari Backing'}),
            '/uploads/sets_00c2f42a_1s6a9390.jpg',
            json.dumps(['/uploads/bridal_230e1477_1s6a0023.jpg', '/uploads/sets_06e3eeb0_1s6a9372.jpg']),
            15, 3, 'ACTIVE', 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BRD-002', 'The Bling Haven Canada • Noor Jahan Grand Royal Choker Set',
            'noor-jahan-grand-royal-choker-set',
            'Multi-Tiered Polki Kundan Choker with Hydro Ruby Drops',
            'Exquisite 3-tier bridal collar crafted in 22K antique matte gold with ruby-toned hydro teardrops and adjustable dori necklace tie.',
            195.0, 260.0, 70.0, cat_bridal_id, None,
            json.dumps({'plating': '22K Antique Gold', 'stones': 'Polki Kundan & Hydro Rubies', 'includes': 'Choker, Earrings, Maang Tikka'}),
            '/uploads/sets_07526616_1s6a9431.jpg',
            json.dumps(['/uploads/sets_15e7dde3_1s6a9426.jpg', '/uploads/sets_1845d57e_1s6a9415.jpg']),
            12, 3, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BRD-003', 'The Bling Haven Canada • Rajkumari Pastel Mint & Kundan Bridal Parure',
            'rajkumari-pastel-mint-kundan-bridal-parure',
            'Pastel Mint Enamel Meenakari Choker with Faux Seed Pearls',
            'Modern pastel bridal parure blending soft mint Meenakari work with hand-faceted Kundan glass stones and clusters of faux seed pearls.',
            165.0, 220.0, 58.0, cat_bridal_id, None,
            json.dumps({'plating': '22K Gold Plated', 'enamel': 'Pastel Mint Hand-Meenakari', 'pearls': 'Faux Seed Pearls'}),
            '/uploads/sets_197c0d56_1s6a0362.jpg',
            json.dumps(['/uploads/sets_1be8452b_1s6a9409.jpg', '/uploads/sets_1f6079e6_1s6a9396.jpg']),
            18, 4, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BRD-004', 'The Bling Haven Canada • Padmavati Antique Temple Motif Bridal Set',
            'padmavati-antique-temple-motif-bridal-set',
            'Goddess Laxmi Temple Carvings in 22K Matte Gold Finish with Kempu Stones',
            'South Indian inspired bridal necklace parure featuring intricate temple carvings, kempu red stones, and golden jhumki bells.',
            175.0, 230.0, 60.0, cat_bridal_id, None,
            json.dumps({'motif': 'Temple Laxmi Carving', 'plating': '22K Matte Antique Gold', 'stones': 'Kempu Rubies & Emeralds'}),
            '/uploads/sets_2685c103_1s6a8706.jpg',
            json.dumps(['/uploads/sets_2c42da6a_1s6a9300.jpg', '/uploads/sets_30016d85_1s6a9388.jpg']),
            14, 3, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BRD-005', 'The Bling Haven Canada • Mumtaz Pearl Cascade Layered Haram Set',
            'mumtaz-pearl-cascade-layered-haram-set',
            '5-Strand Faux Basra Pearl Long Rani Haar with Kundan Pendant',
            'Majestic 5-row pearl layered bridal necklace featuring a grand hand-carved floral Kundan medallion center.',
            145.0, 195.0, 50.0, cat_bridal_id, None,
            json.dumps({'style': 'Long Rani Haar', 'pearls': '5-Row Faux Basra Pearls', 'pendant': 'Kundan Floral Medallion'}),
            '/uploads/sets_32dc8ef6_1s6a0413.jpg',
            json.dumps(['/uploads/sets_343781d0_1s6a0406.jpg', '/uploads/sets_37b6f3d7_1s6a8668.jpg']),
            20, 5, 'ACTIVE', 0, 1, now_iso, now_iso
        ),

        # --- EARRINGS CATEGORY (Strictly earrings_... images) ---
        (
            str(uuid.uuid4()), 'TBH-EAR-001', 'The Bling Haven Canada • Empress Velvet Blue Sapphire Crystal Chandelier Drops',
            'empress-velvet-blue-sapphire-crystal-chandelier-drops',
            'Austrian Crystals & Hydro Kashmir Sapphire Chandeliers in 18K Gold Finish',
            'Dazzling high-fashion statement chandelier earrings studded with multi-faceted Austrian crystals and royal blue hydro sapphires in lightweight hypoallergenic setting.',
            48.0, 65.0, 16.0, cat_earrings_id, None,
            json.dumps({'stones': 'Austrian Crystals & Hydro Blue Sapphires', 'plating': '18K Yellow Gold Dip', 'weight': 'Lightweight Comfort Fit (18g)', 'hypoallergenic': '100% Skin Safe'}),
            '/uploads/earrings_01462b03_1s6a0431.jpg',
            json.dumps(['/uploads/earrings_03584f30_1s6a0357.jpg', '/uploads/earrings_0cc71c0c_1s6a0429.jpg']),
            30, 5, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-EAR-002', 'The Bling Haven Canada • Chandbali Royal Pearl Kundan Drop Earrings',
            'chandbali-royal-pearl-kundan-drop-earrings',
            'Crescent Moon Chandbali Design with Faux Pearl Fringes',
            'Classic Mughal-inspired crescent moon earrings embellished with hand-cut Kundan stones and dangling mini pearl beads.',
            42.0, 58.0, 14.0, cat_earrings_id, None,
            json.dumps({'design': 'Mughal Chandbali', 'plating': '22K Micro Gold Plating', 'pearls': 'Seed Pearl Drops'}),
            '/uploads/earrings_0cf4038b_1s6a0451.jpg',
            json.dumps(['/uploads/earrings_133b4e08_1s6a8717.jpg', '/uploads/earrings_24d947a6_1s6a0458.jpg']),
            35, 6, 'ACTIVE', 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-EAR-003', 'The Bling Haven Canada • Jhumka Royal Dome Filigree Bell Earrings',
            'jhumka-royal-dome-filigree-bell-earrings',
            'Traditional Hand-Engraved Dome Jhumkis with Bell Hangings',
            'Authentic handcrafted royal dome jhumkas featuring delicate floral filigree and soothing rhythmic bell tassels.',
            38.0, 52.0, 12.0, cat_earrings_id, None,
            json.dumps({'style': 'Traditional Dome Jhumka', 'closure': 'Push-back with Comfort Stopper', 'hypoallergenic': 'Yes'}),
            '/uploads/earrings_32220e68_1s6a8686.jpg',
            json.dumps(['/uploads/earrings_326f0cdf_1s6a0414.jpg', '/uploads/earrings_372b3173_1s6a8678.jpg']),
            40, 8, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-EAR-004', 'The Bling Haven Canada • Emerald Cut CZ Waterfall Drop Earrings',
            'emerald-cut-cz-waterfall-drop-earrings',
            'Multi-Tiered Brilliant CZ Drops in 18K White Gold Finish',
            'Cascading waterfall statement drops with sparkling geometric emerald-cut and round Austrian cubic zirconia stones.',
            52.0, 72.0, 17.0, cat_earrings_id, None,
            json.dumps({'stones': 'AAA+ Geometric CZ', 'plating': '18K White Gold Rhodium', 'length': '6.5cm'}),
            '/uploads/earrings_3841ede3_1s6a0423.jpg',
            json.dumps(['/uploads/earrings_41fbdbff_1s6a0417.jpg', '/uploads/earrings_4c55c662_1s6a0453.jpg']),
            25, 5, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-EAR-005', 'The Bling Haven Canada • Solitaire Stud Duo with Micro-Pavé Halo',
            'solitaire-stud-duo-with-micro-pave-halo',
            'Everyday 2.0ct Equiv CZ Halo Studs in 18K Gold Finish',
            'Refined luxury everyday studs with brilliant round simulated diamond centers surrounded by a delicate micro-pavé halo.',
            32.0, 45.0, 10.0, cat_earrings_id, None,
            json.dumps({'style': 'Halo Solitaire Studs', 'plating': '18K Yellow Gold / White Gold', 'waterproof': 'Yes'}),
            '/uploads/earrings_59510d5c_1s6a8728.jpg',
            json.dumps(['/uploads/earrings_5b41f4de_1s6a0415.jpg', '/uploads/earrings_5b5fc368_1s6a0436.jpg']),
            50, 10, 'ACTIVE', 0, 1, now_iso, now_iso
        ),

        # --- BANGLES & KADAS CATEGORY (Strictly bangles_... images) ---
        (
            str(uuid.uuid4()), 'TBH-BAN-001', 'The Bling Haven Canada • Imperial 22K Antique Gold Hand-Engraved Openable Kada',
            'imperial-22k-antique-gold-hand-engraved-openable-kada',
            'Anti-Tarnish Matte Gold Finish with Elephant Motif & Hidden Safety Clasp',
            'Heavyweight openable luxury kada crafted in premium brass with long-lasting 22K antique matte gold micro-plating, elephant crest engravings, and secure side lock.',
            59.0, 79.0, 20.0, cat_bangles_id, None,
            json.dumps({'plating': '22K Antique Matte Gold', 'metal': 'High-Density Jewelers Brass', 'closure': 'Hidden Side Clasp', 'waterproof': 'Yes Anti-Tarnish'}),
            '/uploads/bangles_0deb44c0_1s6a9953.jpg',
            json.dumps(['/uploads/bangles_1ac04918_1s6a9952.jpg', '/uploads/bangles_271ffaca_1s6a9933.jpg']),
            40, 8, 'ACTIVE', 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BAN-002', 'The Bling Haven Canada • Royal Polki Kundan Openable Bangle Pair',
            'royal-polki-kundan-openable-bangle-pair',
            'Set of 2 Kundan Inset Bangles with Screw Closure',
            'Pair of handcrafted openable bangles adorned with sparkling glass Polki Kundan stones set in rich 22K micro gold plating.',
            72.0, 95.0, 24.0, cat_bangles_id, None,
            json.dumps({'quantity': 'Pair (2 Pieces)', 'plating': '22K Micro Gold', 'closure': 'Side Screw Lock'}),
            '/uploads/bangles_34e971bc_1s6a9958.jpg',
            json.dumps(['/uploads/bangles_4230caef_1s6a9999.jpg', '/uploads/bangles_5ba1f9e9_1s6a9961.jpg']),
            28, 5, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BAN-003', 'The Bling Haven Canada • Eternity Tennis CZ Bangle Bracelet',
            'eternity-tennis-cz-bangle-bracelet',
            'AAA+ Round Brilliant Cut CZ in 18K White Gold Rhodium Finish',
            'Sleek modern luxury tennis bracelet featuring a continuous line of prong-set simulated diamonds with double safety latch.',
            49.0, 68.0, 16.0, cat_bangles_id, None,
            json.dumps({'stone': 'AAA+ Brilliant CZ', 'plating': '18K White Gold Rhodium', 'closure': 'Double Safety Clasp'}),
            '/uploads/bangles_780948c6_1s6a9954.jpg',
            json.dumps(['/uploads/bangles_a1d6aec3_1s6a9963.jpg', '/uploads/bangles_a71ba12b_1s6a9955.jpg']),
            35, 6, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BAN-004', 'The Bling Haven Canada • Meenakari Peacock Filigree Kada',
            'meenakari-peacock-filigree-kada',
            'Hand-Painted Royal Blue & Green Meenakari Cuff Bangle',
            'Vibrant artisan kada showcasing dual peacock motifs hand-enameled in regal blue and emerald green with pearl accents.',
            65.0, 88.0, 22.0, cat_bangles_id, None,
            json.dumps({'motif': 'Dual Peacock Meenakari', 'plating': '22K Gold Finish', 'size': 'Adjustable Open Spring'}),
            '/uploads/bangles_b53553d4_1s6a9949.jpg',
            json.dumps(['/uploads/bangles_bc58c1e1_1s6a9965.jpg', '/uploads/bangles_d94d97ab_1s6a9950.jpg']),
            22, 4, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-BAN-005', 'The Bling Haven Canada • Royal Polki Kada with Ruby Stone Accents',
            'royal-polki-kada-with-ruby-stone-accents',
            'Antique Gold Plated Floral Kada with Hydro Ruby Highlights',
            'Graceful floral-patterned openable bracelet highlighted by glowing hydro ruby cabochons and sparkling Kundan stones.',
            68.0, 92.0, 23.0, cat_bangles_id, None,
            json.dumps({'stones': 'Hydro Rubies & Kundan', 'plating': '22K Antique Gold', 'closure': 'Pin Screw Lock'}),
            '/uploads/bangles_d9cffa51_1s6a9948.jpg',
            json.dumps(['/uploads/bangles_def785bf_1s6a9939.jpg', '/uploads/bangles_e7bea9e3_1s6a9957.jpg']),
            25, 5, 'ACTIVE', 0, 1, now_iso, now_iso
        ),

        # --- ARTISAN SILVER CATEGORY (Strictly handmade_... images) ---
        (
            str(uuid.uuid4()), 'TBH-SLV-001', 'The Bling Haven Canada • Artisan 925 Silver Plated Filigree Heritage Master Cuff',
            'artisan-925-silver-plated-filigree-heritage-master-cuff',
            'Handcrafted Wire Filigree Statement Cuff with Anti-Oxidation Coating',
            'Intricate handcrafted filigree cuff bracelet finished with high-mirror 925 sterling silver plating and anti-tarnish protective sealant.',
            39.0, 55.0, 12.0, cat_silver_id, None,
            json.dumps({'finish': '925 Sterling Silver Micro-Plate', 'sealant': 'E-Coat Anti-Tarnish', 'size': 'Adjustable Open Cuff', 'hypoallergenic': 'Yes'}),
            '/uploads/handmade_2ffa5211_1s6a0379.jpg',
            json.dumps(['/uploads/handmade_341ea2ba_1s6a0383.jpg', '/uploads/handmade_394ebd8b_1s6a0389.jpg']),
            50, 10, 'ACTIVE', 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-SLV-002', 'The Bling Haven Canada • Tribal Silver Carved Flower Filigree Bangle',
            'tribal-silver-carved-flower-filigree-bangle',
            'Oxidized 925 Silver Look Openable Kada with Floral Relief',
            'Bohemian royal oxidized silver-look kada featuring deeply carved floral patterns and antique patina finish.',
            35.0, 48.0, 11.0, cat_silver_id, None,
            json.dumps({'finish': 'Antique Oxidized 925 Silver Look', 'metal': 'Solid Alloy', 'weight': '32g'}),
            '/uploads/handmade_427e00b2_1s6a0375.jpg',
            json.dumps(['/uploads/handmade_50b6267d_1s6a0384.jpg', '/uploads/handmade_60e88ecc_1s6a0390.jpg']),
            45, 8, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-SLV-003', 'The Bling Haven Canada • Geometric Silver Mesh Artisan Choker',
            'geometric-silver-mesh-artisan-choker',
            'Handmade Woven Silver Wire Collar with Adjustable Hook',
            'Modern sculptural jewelry piece hand-woven with fine silver-plated metallic wires into a flexible, lightweight collar.',
            49.0, 69.0, 15.0, cat_silver_id, None,
            json.dumps({'style': 'Hand-Woven Mesh Collar', 'finish': 'Bright 925 Silver Plate', 'hypoallergenic': 'Yes'}),
            '/uploads/handmade_6aa29361_1s6a0403.jpg',
            json.dumps(['/uploads/handmade_6b356de8_1s6a0395.jpg', '/uploads/handmade_8aafcd39_1s6a0402.jpg']),
            30, 6, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-SLV-004', 'The Bling Haven Canada • Handcrafted Silver Filigree Jhumka Drops',
            'handcrafted-silver-filigree-jhumka-drops',
            'Intricate Wire Filigree Chandelier Drops in Antique Silver',
            'Generational silversmithing wire-work shaped into delicate teardrop chandeliers with antique black oxidation highlights.',
            36.0, 50.0, 11.0, cat_silver_id, None,
            json.dumps({'style': 'Wire Filigree Drops', 'finish': 'Antique Silver Patina', 'hypoallergenic': 'Yes'}),
            '/uploads/handmade_8b581e15_1s6a0391.jpg',
            json.dumps(['/uploads/handmade_9bac078b_1s6a0394.jpg', '/uploads/handmade_aaaddc34_1s6a0393.jpg']),
            40, 8, 'ACTIVE', 1, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'TBH-SLV-005', 'The Bling Haven Canada • Royal Elephant Motif Silver Statement Ring',
            'royal-elephant-motif-silver-statement-ring',
            'Adjustable Hand-Carved Artisan Ring in Solid 925 Silver Finish',
            'Bold statement ring engraved with royal elephant crests and framed with micro filigree beadwork.',
            28.0, 39.0, 8.0, cat_silver_id, None,
            json.dumps({'motif': 'Royal Elephant', 'size': 'Adjustable Band', 'finish': '925 Silver Plated'}),
            '/uploads/handmade_ba977ccb_1s6a0400.jpg',
            json.dumps(['/uploads/handmade_c8c9b822_1s6a0401.jpg', '/uploads/handmade_ca9847db_1s6a0381.jpg']),
            55, 10, 'ACTIVE', 0, 1, now_iso, now_iso
        ),
    ]

    cursor.executemany("""
        INSERT INTO products (
            id, sku, title, slug, subtitle, description,
            basePriceUsd, comparePriceUsd, costPriceUsd, categoryId, collectionId,
            specs, primaryImageUrl, galleryImages, stockQuantity, lowStockThreshold,
            status, isFeatured, isBestseller, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, products)
    print(f"  [SEEDED] {len(products)} Strictly Separated Fashion Jewelry Masterpiece Products")

    # 4. Seed Customer & Order
    cust_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO customers (
            id, firstName, lastName, email, phone,
            country, city, vipTier, totalSpendUsd, totalOrdersCount,
            preferences, conciergeNotes, assignedAdvisor, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cust_id, 'Elena', 'Vanderbilt', 'elena.v@theblinghaven.shop',
        '+1 (416) 555-0199', 'Canada', 'Toronto', 'ROYAL_CONCIERGE',
        185.0, 1,
        json.dumps({'preferredCategory': 'Bridal Kundan', 'preferredCurrency': 'CAD'}),
        'Valued patron looking for handcrafted bridal kundan jewelry in Toronto.',
        'Lord Alistair Sterling (Client Advisor, Toronto)',
        now_iso, now_iso
    ))

    order_id = str(uuid.uuid4())
    shipping_addr_json = json.dumps({
        'fullName': 'Elena Vanderbilt',
        'addressLine1': '100 Bloor Street West, Suite 4',
        'city': 'Toronto',
        'stateOrProvince': 'Ontario',
        'postalCode': 'M5S 1M4',
        'country': 'Canada',
        'phone': '+1 (416) 555-0199'
    })

    cursor.execute("""
        INSERT INTO orders (
            id, orderNumber, customerId, customerName, customerEmail, customerPhone,
            customerVipTier, status, paymentStatus, paymentMethod, currencyCode, currencySymbol,
            totalAmountUsd, totalAmountLocal, subtotalUsd, taxAmountUsd, shippingAmountUsd,
            shippingAddress, shippingCarrier, trackingNumber, insuredValueUsd,
            deliverySignatureName, customerNotes, conciergeNotes, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id, 'TBH-ORD-CAN-1001', cust_id, 'Elena Vanderbilt', 'elena.v@theblinghaven.shop', '+1 (416) 555-0199',
        'ROYAL_CONCIERGE', 'DELIVERED', 'PAID', 'STRIPE_CREDIT_CARD', 'CAD', 'C$',
        185.0, 249.0, 185.0, 24.05, 0.0,
        shipping_addr_json, 'CANADA_POST_EXPRESS', 'TBH-CA-99201', 249.0,
        'Elena Vanderbilt', 'Toronto Yorkville express delivery with signature confirmation.',
        'Client confirmed receipt and loved the 22K micro-gold finish.',
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO order_items (
            id, orderId, productId, sku, title, primaryImageUrl,
            quantity, unitPriceUsd, totalPriceUsd, selectedRingSize,
            selectedBangleSize, customEngraving, hallmarkCertificate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), order_id, products[5][0], 'TBH-BRD-001',
        'The Bling Haven Canada • Maharani Royal Heritage Kundan & Polki Bridal Set',
        '/uploads/sets_00c2f42a_1s6a9390.jpg', 1, 185.0, 185.0,
        None, None, 'THE BLING HAVEN 2026', 'TBH-QC-2026-CAN'
    ))
    print("  [SEEDED] 1 The Bling Haven Canada Order & Customer Record")

    # 5. Seed Concierge & Bespoke Records
    cursor.execute("""
        INSERT INTO concierge_inquiries (
            id, fullName, email, phone, country, vipTier,
            type, status, subject, message, preferredSalonLocation,
            preferredAppointmentDate, assignedAdvisor, internalNotes, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'Elena Vanderbilt', 'elena.v@theblinghaven.shop', '+1 (416) 555-0199',
        'Canada', 'ROYAL_CONCIERGE', 'SALON_APPOINTMENT', 'CONFIRMED',
        'Bridal Kundan Set Consultation & Saree Matching',
        'Looking for bridal kundan parure color customization with hydro emeralds.',
        'Toronto Yorkville Haute Salon (100 Bloor St W)',
        now_iso, 'Lord Alistair Sterling (Client Advisor, Toronto)',
        'Private styling session confirmed at 100 Bloor St W.',
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO bespoke_requests (
            id, referenceNumber, clientName, clientEmail, clientPhone,
            clientCountry, vipTier, category, metalPreference, gemstonePreference,
            estimatedCaratWeight, diamondShape, ringOrWristSize, engravingText,
            budgetRangeUsd, inspirationPhotoUrl, designBrief, status,
            assignedGoldsmith, quotedAmountUsd, cadRenderUrl, estimatedCompletionWeeks,
            atelierNotes, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'TBH-CAD-CAN-001', 'Elena Vanderbilt', 'elena.v@theblinghaven.shop', '+1 (416) 555-0199',
        'Canada', 'ROYAL_CONCIERGE', 'Necklace', '22K Micro Gold Plating', 'Hydro Zambian Emeralds & Kundan',
        0.0, 'Traditional Meenakari', 'Standard Adjustable', 'THE BLING HAVEN 2026',
        '$200 - $500', '/uploads/sets_00c2f42a_1s6a9390.jpg',
        'Custom hydro emerald choker adjustment with matching earrings.',
        'CAD_APPROVED', 'Master Artisan Pierre (Toronto Atelier)',
        249.0, '/3d/sovereign-ring.glb', 2,
        'Customized bridal kundan set ready for artisan finishing.',
        now_iso, now_iso
    ))

    # 6. Seed Quality Certificate (Certificate of Authenticity & Anti-Tarnish Warranty)
    cert_hash = hashlib.sha256(b"TBH-QC-CAN-8801-MAHARANI-KUNDAN").hexdigest()
    cursor.execute("""
        INSERT INTO certificates_of_authenticity (
            id, certificateNumber, productId, orderId, sku, productTitle,
            gemstoneReportNumber, gemstoneLaboratory, caratWeight, colorGrade,
            clarityGrade, cutGrade, polishGrade, symmetryGrade, fluorescence,
            metalType, metalPurity, grossWeightGrams, netGoldWeightGrams,
            bisHallmarkStamp, cryptographicHash, qrVerificationUrl, ownerName,
            transferHistory, isRevoked, notes, issuedAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'TBH-QC-CAN-8801', products[5][0], order_id, 'TBH-BRD-001',
        'The Bling Haven Canada • Maharani Royal Heritage Kundan & Polki Bridal Set',
        'TBH-QC-2026-991', 'TBH_QUALITY_ASSURANCE', 0.0, 'AAA+ Hydro Emerald', 'VVS Synthetic Polki', 'Hand-Facet Jadau',
        'EXCELLENT', 'EXCELLENT', 'NONE', '22K Micro Gold Plate', 'Brass Base', 145.0, 0.0,
        'TBH-22K-PLATED', cert_hash, 'http://localhost:3000/verify/TBH-QC-CAN-8801',
        'Elena Vanderbilt', '[]', 0,
        'Maison Authenticity Certificate with Lifetime Anti-Tarnish Polish Guarantee.',
        now_iso, now_iso
    ))

    # 6b. Seed AR Try-On Overlays (Strictly using each category's distinct image)
    cursor.execute("DELETE FROM try_on_overlays")
    overlays = [
        (str(uuid.uuid4()), products[0][0], 'TBH-RNG-001', 'The Bling Haven Canada • The Sovereign 5ct Cushion Solitaire CZ Ring', 'RING', '/uploads/rings_03526cf9_1s6a0179.jpg', 1.0, 0.0, 'HAND_RING_FINGER', 1, 89.0, now_iso, now_iso),
        (str(uuid.uuid4()), products[5][0], 'TBH-BRD-001', 'The Bling Haven Canada • Maharani Royal Heritage Kundan & Polki Bridal Set', 'NECKLACE', '/uploads/sets_00c2f42a_1s6a9390.jpg', 1.2, 0.0, 'NECK_COLLAR', 1, 249.0, now_iso, now_iso),
        (str(uuid.uuid4()), products[10][0], 'TBH-EAR-001', 'The Bling Haven Canada • Empress Velvet Blue Sapphire Crystal Chandelier Drops', 'EARRINGS', '/uploads/earrings_01462b03_1s6a0431.jpg', 0.9, 0.0, 'EAR_LOBE', 1, 65.0, now_iso, now_iso),
        (str(uuid.uuid4()), products[15][0], 'TBH-BAN-001', 'The Bling Haven Canada • Imperial 22K Antique Gold Hand-Engraved Openable Kada', 'BANGLE', '/uploads/bangles_0deb44c0_1s6a9953.jpg', 1.1, 0.0, 'WRIST', 1, 79.0, now_iso, now_iso),
    ]
    cursor.executemany("""
        INSERT INTO try_on_overlays (
            id, productId, sku, title, category, overlayImageUrl,
            defaultScale, defaultRotation, anchorType, sparkleRefractionEnabled,
            basePriceCad, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, overlays)

    # 7. Seed VIP Lounge & Secret Drops
    vip_mem_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO vip_members (
            id, name, email, phone, tier, invitationKey,
            assignedAdvisor, preferredSalon, totalSpendCad, isActive, joinedAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        vip_mem_id, 'Elena Vanderbilt (Toronto)', 'elena.v@theblinghaven.shop', '+1 (416) 555-0199',
        'BLACK_TIER_INNER_CIRCLE', 'BLING-VIP-TORONTO-2026',
        'Lord Alistair Sterling (Client Advisor, Toronto)', 'Toronto Yorkville Salon (100 Bloor St W)',
        1250.0, 1, now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO secret_vault_drops (
            id, sku, title, tagline, description, gemstoneDetails, metalDetails, priceCad,
            vaultLocation, allocationStatus, accessTierRequired, dropEndTimestamp,
            primaryImageUrl, galleryImages, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'TBH-VAULT-CAN-001',
        'The Bling Haven Canada • The Nizam Royal Heritage Kundan & Hydro Emerald Choker Set',
        '1-OF-1 HANDCRAFTED BRIDAL LIMITED EDITION',
        'Exclusive limited-run bridal creation featuring handcrafted Meenakari work, hydro emerald drops, and AAA+ Polki Kundan.',
        'AAA+ Polki Kundan Stones with Hydro Colombian Emeralds & Synthetic Basra Pearls',
        '22K Micro Gold Plating with Anti-Tarnish E-Coat Protection',
        380.0, 'Toronto Yorkville Boutique (100 Bloor St W)', 'AVAILABLE',
        'BLACK_TIER_INNER_CIRCLE', now_iso, '/uploads/sets_00c2f42a_1s6a9390.jpg',
        json.dumps(['/uploads/bridal_230e1477_1s6a0023.jpg', '/uploads/sets_06e3eeb0_1s6a9372.jpg']),
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO vip_chat_messages (
            id, clientEmail, clientName, senderRole, senderName,
            message, salonLocation, isRead, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'elena.v@theblinghaven.shop', 'Elena Vanderbilt (Toronto)',
        'ADVISOR', 'Lord Alistair Sterling (Client Advisor)',
        'Welcome to The Bling Haven Canada VIP Lounge. Your private viewing suite at 100 Bloor St W, Toronto is prepared for your next acquisition.',
        'Toronto Yorkville Haute Salon (100 Bloor St W)', 1, now_iso
    ))

    # 8. Seed International Vaults (Retained for future provisions)
    v_toronto_id = str(uuid.uuid4())
    v_vancouver_id = str(uuid.uuid4())
    v_london_id = str(uuid.uuid4())
    v_dubai_id = str(uuid.uuid4())
    v_zurich_id = str(uuid.uuid4())

    vaults = [
        (v_toronto_id, 'Toronto Central Hub (100 Bloor St W)', 'VAULT-CAN-01', 'Toronto', 'Canada', 'CAD', 1250000.0, 50.0, 800.0, 'MAXIMUM_MILITARY_GRADE', 1, '100 Bloor St W, Toronto, ON M5S 1M4, Canada', now_iso, now_iso),
        (v_vancouver_id, 'Vancouver Pacific Hub (Burrard St)', 'VAULT-CAN-02', 'Vancouver', 'Canada', 'CAD', 850000.0, 30.0, 500.0, 'TIER_4_HIGH_SECURITY', 0, 'Pacific Centre, 701 W Georgia St, Vancouver, BC, Canada', now_iso, now_iso),
        (v_london_id, 'London Mayfair Hub (Bond St)', 'VAULT-UK-01', 'London', 'United Kingdom', 'GBP', 1400000.0, 60.0, 900.0, 'TIER_4_HIGH_SECURITY', 0, '14 New Bond St, Mayfair, London W1S 3PF, UK', now_iso, now_iso),
        (v_dubai_id, 'Dubai DIFC Hub', 'VAULT-UAE-01', 'Dubai', 'United Arab Emirates', 'AED', 2100000.0, 90.0, 1200.0, 'MAXIMUM_MILITARY_GRADE', 0, 'Gate Precinct 4, DIFC, Dubai, UAE', now_iso, now_iso),
        (v_zurich_id, 'Zurich Bahnhofstrasse Hub', 'VAULT-CH-01', 'Zurich', 'Switzerland', 'CHF', 1800000.0, 70.0, 1000.0, 'MAXIMUM_MILITARY_GRADE', 0, 'Bahnhofstrasse 45, 8001 Zurich, Switzerland', now_iso, now_iso),
    ]

    cursor.executemany("""
        INSERT INTO luxury_vaults (
            id, name, code, city, country, currencyCode,
            totalAssetValueCad, goldBullionKg, looseDiamondCarats, securityLevel,
            isMasterVault, address, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, vaults)

    # Armored transfer (Preserved as future provision)
    cursor.execute("""
        INSERT INTO armored_transfers (
            id, manifestNumber, originVaultId, destinationVaultId, carrierName,
            courierBadgeId, insuredValueCad, insurancePolicyNumber, transferStatus,
            itemsCount, itemsSummary, currentWaypoint, dispatchedAt, estimatedArrivalAt,
            completedAt, notes, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), 'TRF-CAN-2026-001', v_toronto_id, v_vancouver_id,
        'BRINKS_GLOBAL_SERVICES', 'BRINKS-CAN-4421', 450000.0, 'LLOYDS-CAN-991024',
        'ARRIVED_SECURE', 15, 'Premium 22K Gold Plated Bridal Parures & Solitaire Rings',
        'Vancouver Pacific Vault Depository', now_iso, now_iso, now_iso,
        'Transferred stock from Toronto Yorkville to Vancouver flagship boutique.',
        now_iso, now_iso
    ))

    # 9. Seed Support Ticket
    tkt_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO support_tickets (
            id, ticketNumber, customerName, customerEmail, customerPhone,
            category, priority, status, subject, description,
            relatedOrderNumber, relatedProductSku, assignedAgent, staffNotes,
            createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        tkt_id, 'TBH-TKT-CAN-1001', 'Elena Vanderbilt', 'elena.v@theblinghaven.shop', '+1 (416) 555-0199',
        'SALON_APPOINTMENT', 'VIP', 'RESOLVED',
        'Private Salon Viewing for Bridal Kundan Choker',
        'Requesting private champagne viewing suite at 100 Bloor St W for bridal styling session.',
        'TBH-ORD-CAN-1001', 'TBH-BRD-001', 'Lord Alistair Sterling',
        'Patron accommodated in Suite 4.',
        now_iso, now_iso
    ))

    cursor.execute("""
        INSERT INTO ticket_responses (
            id, ticketId, senderRole, senderName, message, isInternalNote, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), tkt_id, 'SUPPORT_AGENT', 'Lord Alistair Sterling',
        'Dear Patron, your private viewing suite at 100 Bloor Street West, Toronto is confirmed with master styling advisor.',
        0, now_iso
    ))

    # 9b. Seed AI Consultation Log
    cursor.execute("""
        INSERT INTO ai_consultation_logs (
            id, clientQuery, aiResponse, topicCategory, actionTriggered,
            recommendedSku, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()),
        'Tell me about the anti-tarnish 18K gold finish and CZ solitaire quality.',
        'The Sovereign Solitaire features AAA+ Hearts & Arrows CZ stones set in anti-tarnish 18K rhodium-plated brass for waterproof everyday brilliance. I have arranged for Lord Alistair Sterling to prepare a private salon viewing in Toronto.',
        'MATERIALS_CARE', 'SALON_BOOKING', 'TBH-RNG-001', now_iso
    ))

    # 10. Seed Fiscal Close
    fiscal_date = now_dt.strftime('%Y-%m-%d')
    fiscal_hash = hashlib.sha256(f"THE-BLING-HAVEN-CANADA-EOD-{fiscal_date}".encode()).hexdigest()
    cursor.execute("""
        INSERT INTO fiscal_close_records (
            id, fiscalDate, status, grossSalesCad, netRevenueCad,
            ordersCount, taxesCollectedCad, ontarioHstCad, internationalTaxCad,
            vaultInventoryValuationCad, goldBullionKgStock, diamondCaratsStock,
            armoredTransitValueCad, discrepancyAmountCad, certifiedByAuditor,
            certifiedAt, auditNotes, cryptoLedgerHash, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        str(uuid.uuid4()), fiscal_date, 'EXECUTIVE_CERTIFIED',
        249.00, 220.35, 1, 28.65, 28.65, 0.00,
        7400000.0, 300.0, 4200.0, 450000.0, 0.0,
        'compliance-cfo@theblinghaven.shop', now_iso,
        'The Bling Haven Canada Daily EOD close certified with 100% inventory parity.',
        fiscal_hash, now_iso, now_iso
    ))

    # 11. Seed Hero Banners & Collections
    cursor.execute("DELETE FROM hero_banners")
    banners = [
        (
            str(uuid.uuid4()), 'The Bling Haven Canada • Handcrafted Royal Kundan & Polki Bridal Parures',
            'Luxury 22K micro gold plated Meenakari bridal chokers, hydro emeralds, and faux Basra pearls.',
            'Maison de Haute Fashion Jewelry • Toronto Flagship',
            'Explore Bridal Collection', '/bridal-sets',
            '/uploads/sets_00c2f42a_1s6a9390.jpg', '/uploads/sets_00c2f42a_1s6a9390.jpg',
            1, 1, 'LEFT', now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'AAA+ Hearts & Arrows Solitaire CZ Rings',
            'Flawless diamond-look solitaires in 18K white gold rhodium and anti-tarnish gold plating.',
            'Everyday Demi-Fine & Engagement Luxury',
            'Discover Solitaire Rings', '/rings',
            '/uploads/rings_03526cf9_1s6a0179.jpg', '/uploads/rings_03526cf9_1s6a0179.jpg',
            2, 1, 'LEFT', now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'Bespoke Bridal Styling & 3D Customizer',
            'Customize colors, stones, and necklace lengths for your wedding outfits with live 3D preview.',
            'Custom Fashion Atelier Studio',
            'Launch 3D Customizer', '/bespoke',
            '/uploads/handmade_2ffa5211_1s6a0379.jpg', '/uploads/handmade_2ffa5211_1s6a0379.jpg',
            3, 1, 'LEFT', now_iso, now_iso
        ),
    ]
    cursor.executemany("""
        INSERT INTO hero_banners (
            id, title, subtitle, badgeText, ctaText, ctaLink,
            imageUrl, mobileImageUrl, displayOrder, isActive, alignment,
            createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, banners)

    cursor.execute("DELETE FROM collections")
    collections = [
        (
            str(uuid.uuid4()), 'The Imperial Bridal Kundan Sets', 'imperial-bridal-kundan-sets',
            'Heritage Meenakari & Hydro Emeralds',
            'Handcrafted 22K micro gold plated Polki Kundan bridal choker necklaces with matching earrings.',
            '/uploads/sets_00c2f42a_1s6a9390.jpg', 1, 1, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'AAA+ Solitaire CZ Rings', 'aaa-solitaire-cz-rings',
            'Diamond-Look Solitaires',
            'Hearts & Arrows cushion and emerald cut cubic zirconia rings in 18K rhodium plating.',
            '/uploads/rings_03526cf9_1s6a0179.jpg', 1, 2, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), 'Austrian Crystal & Hydro Gem Earrings', 'austrian-crystal-hydro-gem-earrings',
            'Statement Chandelier Drops',
            'Dazzling chandelier earrings with royal velvet blue hydro sapphires and Austrian crystals.',
            '/uploads/earrings_01462b03_1s6a0431.jpg', 1, 3, 1, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), '22K Matte Gold Heritage Bangles', '22k-matte-gold-heritage-bangles',
            'Anti-Tarnish Openable Kadas',
            'Antique 22K matte gold plated elephant-engraved openable kadas with secure side clasp.',
            '/uploads/bangles_0deb44c0_1s6a9953.jpg', 1, 4, 1, now_iso, now_iso
        ),
    ]
    cursor.executemany("""
        INSERT INTO collections (
            id, name, slug, tagline, description, heroBannerUrl,
            isFeatured, displayOrder, isActive, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, collections)
    # 12. Seed Universal Page Controls (Core Pages & Sample Custom Pages)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS page_controls (
            id TEXT PRIMARY KEY,
            pageRoute TEXT UNIQUE,
            pageTitle TEXT,
            pageType TEXT DEFAULT 'CORE_SYSTEM',
            status TEXT DEFAULT 'ACTIVE',
            customHeadline TEXT,
            customSubtext TEXT,
            heroBannerUrl TEXT,
            badgeText TEXT,
            productIds TEXT DEFAULT '[]',
            estimatedReturnAt TEXT,
            hideFromNavigation INTEGER DEFAULT 0,
            createdAt TEXT,
            updatedAt TEXT
        )
    """)
    cursor.execute("DELETE FROM page_controls")

    # Sample curated product IDs for bestsellers and discounted items
    bestseller_ids = [products[0][0], products[5][0], products[15][0], products[10][0], products[20][0]]
    discounted_ids = [products[1][0], products[6][0], products[11][0], products[16][0]]

    pages_to_seed = [
        # Core Pages
        (str(uuid.uuid4()), '/', 'Flagship Storefront Home', 'CORE_SYSTEM', 'ACTIVE', 'Under Maintenance', 'Our flagship salon is undergoing planned digital upgrades. We will return shortly.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Flagship Toronto Salon', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/catalog', 'Complete Haute Catalog', 'CORE_SYSTEM', 'ACTIVE', 'Catalog Under Curation', 'Our master curators are cataloging new arrivals.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Haute Joaillerie', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/rings', 'AAA+ CZ Solitaires & Fashion Rings', 'CORE_SYSTEM', 'ACTIVE', 'Solitaire Vault Closed', 'Private solitaire showcase undergoing seasonal replenishment.', '/uploads/rings_03526cf9_1s6a0179.jpg', 'The Solitaire Salon', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/bridal-sets', 'Royal Heritage Kundan & Polki Bridal Sets', 'CORE_SYSTEM', 'ACTIVE', 'Bridal Salon Upgrades', 'Our bridal salon is preparing new limited edition Jadau sets.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Imperial Bridal Atelier', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/earrings', 'Austrian Crystal & Hydro Gem Earrings', 'CORE_SYSTEM', 'ACTIVE', 'Earrings Line Upgrades', 'New chandelier and Chandbali drops arriving soon.', '/uploads/earrings_01462b03_1s6a0431.jpg', 'Haute Earring Salon', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/bangles', '22K Micro Gold Plated Bangles & Kadas', 'CORE_SYSTEM', 'ACTIVE', 'Kada Vault In Maintenance', 'Openable kada inventory being replenished.', '/uploads/bangles_0deb44c0_1s6a9953.jpg', 'Royal Kada Vault', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/artisan-silver', 'Artisan 925 Silver Plated Demi-Fine', 'CORE_SYSTEM', 'ACTIVE', 'Silversmithing Atelier Update', 'Generational filigree collection under master finishing.', '/uploads/handmade_2ffa5211_1s6a0379.jpg', 'Artisan Atelier', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/try-on', 'AR Virtual Try-On Studio', 'CORE_SYSTEM', 'ACTIVE', 'AR Studio Recalibrating', 'Interactive augmented reality fitting room is undergoing sensor calibration.', '/uploads/rings_03526cf9_1s6a0179.jpg', 'Live AR Studio', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/bespoke', 'Bespoke 3D Customizer Studio', 'CORE_SYSTEM', 'ACTIVE', '3D Atelier Booked', 'Custom bridal 3D atelier is temporarily closed for private bridal commissions.', '/uploads/handmade_2ffa5211_1s6a0379.jpg', '3D Customizer', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/vip-lounge', 'VIP Member Lounge & Secret Drops', 'CORE_SYSTEM', 'ACTIVE', 'Private Salon Exclusive', 'VIP member portal accessible strictly by invitation key.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'VIP Inner Circle', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/concierge', 'Private Salon Concierge', 'CORE_SYSTEM', 'ACTIVE', 'Concierge Busy', 'Salon viewing suite fully booked for today.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Private Salon Viewing', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/ai-concierge', 'AI Voice Gemologist ("Aura")', 'CORE_SYSTEM', 'ACTIVE', 'AI Voice Updating', 'Conversational gemologist undergoing knowledge base training.', '/uploads/rings_03526cf9_1s6a0179.jpg', 'AI Voice Advisor', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/support', 'Client Support & Ticket Desk', 'CORE_SYSTEM', 'ACTIVE', 'Support Desk Maintenance', 'Ticket portal undergoing scheduled maintenance.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Client Care', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/track', 'Armored & Express Order Tracking', 'CORE_SYSTEM', 'ACTIVE', 'Carrier Radar Offline', 'Order tracking waypoint telemetry undergoing maintenance.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Live Tracking', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/verify', 'Quality Authenticity Ledger', 'CORE_SYSTEM', 'ACTIVE', 'Ledger Syncing', 'Cryptographic verification ledger syncing with central depository.', '/uploads/rings_03526cf9_1s6a0179.jpg', 'Authenticity Ledger', '[]', None, 0, now_iso, now_iso),
        (str(uuid.uuid4()), '/about', 'Maison Heritage Story', 'CORE_SYSTEM', 'ACTIVE', 'Heritage Archives Closed', 'Maison history archives undergoing curation.', '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Maison Story', '[]', None, 0, now_iso, now_iso),

        # Custom Showcase Pages
        (
            str(uuid.uuid4()), '/pages/bestsellers', 'Maison Bestsellers & Top Trending', 'CUSTOM_PAGE', 'ACTIVE',
            'Bestsellers Collection', 'Our most coveted handcrafted bridal parures, solitaire rings, and antique kadas.',
            '/uploads/sets_00c2f42a_1s6a9390.jpg', 'Trending Now • Limited Stock',
            json.dumps(bestseller_ids), None, 0, now_iso, now_iso
        ),
        (
            str(uuid.uuid4()), '/pages/discounted-items', 'Exclusive Vault Deals & Clearance', 'CUSTOM_PAGE', 'ACTIVE',
            'Vault Clearance & Special Offers', 'Enjoy up to 30% savings on selected handcrafted fashion & bridal heirlooms.',
            '/uploads/rings_03526cf9_1s6a0179.jpg', 'Limited Time Promotion',
            json.dumps(discounted_ids), None, 0, now_iso, now_iso
        ),
    ]

    cursor.executemany("""
        INSERT INTO page_controls (
            id, pageRoute, pageTitle, pageType, status,
            customHeadline, customSubtext, heroBannerUrl, badgeText,
            productIds, estimatedReturnAt, hideFromNavigation, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, pages_to_seed)
    print(f"  [SEEDED] {len(pages_to_seed)} Universal Page Controls (16 Core + 2 Custom Pages)")

    conn.commit()
    conn.close()
    print("======================================================================")
    print(f"DATABASE RESEEDED: 25 PRODUCTS & {len(pages_to_seed)} PAGE CONTROLS COMPLETE")
    print("======================================================================")

if __name__ == '__main__':
    clean_and_brand_the_bling_haven_canada()
