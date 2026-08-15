import sqlite3
import json
import uuid
from datetime import datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print('===========================================================')
    print('SEEDING LUXURY JEWELRY CATEGORIES, COLLECTIONS & PRODUCTS')
    print('===========================================================')

    now_iso = datetime.utcnow().isoformat() + 'Z'

    # 1. Categories
    categories = [
        ('cat-rings', 'Rings & Solitaires', 'rings', 'Diamond solitaires, micro-pave eternity bands, and cocktail rings.', '/uploads/rings_sample.jpg', 1, now_iso, now_iso),
        ('cat-bridal', 'Bridal & Royal Sets', 'bridal-sets', 'Heritage polki chokers, uncut diamond necklace sets, and kundan masterpieces.', '/uploads/bridal_sample.jpg', 2, now_iso, now_iso),
        ('cat-earrings', 'Earrings & Drops', 'earrings', 'Diamond studs, chandelier drops, and handcrafted heritage jhumkas.', '/uploads/earrings_sample.jpg', 3, now_iso, now_iso),
        ('cat-bangles', 'Bangles & Kadas', 'bangles', '22K solid gold kadas, open cuff bangles, and diamond tennis bracelets.', '/uploads/bangles_sample.jpg', 4, now_iso, now_iso),
        ('cat-silver', 'Artisan Silver', 'artisan-silver', 'Hand-carved sterling silver creations, filigree pendants, and celestial jewels.', '/uploads/silver_sample.jpg', 5, now_iso, now_iso),
    ]

    for cat in categories:
        cursor.execute('''
            INSERT OR REPLACE INTO categories (id, name, slug, description, imageUrl, displayOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', cat)

    print(f'Seeded {len(categories)} luxury categories!')

    # 2. Collections
    collections = [
        ('col-royal-bridal', 'The Royal Heritage Bridal 2026', 'royal-heritage-bridal', 'AUTUMN COUTURE', 'Handcrafted royal polki chokers and 22K gold heirlooms.', '/images/banner.jpg', 1, 1, now_iso, now_iso),
        ('col-celestial', 'Celestial Solitaires', 'celestial-solitaires', 'TIMELESS BRILLIANCE', 'Certified D-Flawless diamonds set in platinum and 18K white gold.', '/images/banner.jpg', 1, 2, now_iso, now_iso),
        ('col-imperial-polki', 'Imperial Polki & Kundan', 'imperial-polki', 'MASTER ATELIER', 'Centuries-old jadau goldsmithing with natural unheated gemstones.', '/images/banner.jpg', 1, 3, now_iso, now_iso),
        ('col-artisan-silver', 'Artisan Silver Radiance', 'artisan-silver-radiance', 'LIMITED EDITION', 'Contemporary ethereal filigree and hand-forged 925 silver.', '/images/banner.jpg', 0, 4, now_iso, now_iso),
    ]

    for col in collections:
        cursor.execute('''
            INSERT OR REPLACE INTO collections (id, name, slug, tagline, description, heroBannerUrl, isFeatured, displayOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', col)

    print(f'Seeded {len(collections)} premier collections!')

    # Fetch available media assets by category for realistic mapping
    cursor.execute('SELECT category, url FROM media_assets')
    media_rows = cursor.fetchall()
    
    media_by_cat = {}
    for c, u in media_rows:
        media_by_cat.setdefault(c, []).append(u)

    def get_images(cat_key, fallback_img='/images/banner.jpg'):
        urls = media_by_cat.get(cat_key, [])
        if not urls:
            return fallback_img, [fallback_img]
        return urls[0], urls[:4]

    # 3. Rich Jewelry Products
    products = [
        # --- RINGS ---
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-RNG-001',
            'title': 'The Sovereign 2.5ct Cushion Diamond Solitaire Ring',
            'slug': 'sovereign-cushion-diamond-solitaire-ring',
            'subtitle': 'D Color, VVS1 Clarity, 18K White Gold Micro-Pave Band',
            'description': 'An extraordinary 2.50-carat cushion brilliant diamond crowned in a hand-sculpted four-prong platinum basket over an 18K white gold eternity band set with 48 micro-pave diamonds.',
            'basePriceUsd': 18500.0,
            'comparePriceUsd': 21000.0,
            'costPriceUsd': 12000.0,
            'categoryId': 'cat-rings',
            'collectionId': 'col-celestial',
            'specs': {
                'metalType': '18K White Gold & Platinum',
                'metalPurity': '18K (750) / Pt950',
                'metalColor': 'White Gold',
                'grossWeightGrams': 5.8,
                'netWeightGrams': 5.2,
                'diamondWeightCarats': 2.98,
                'diamondColor': 'D (Colorless)',
                'diamondClarity': 'VVS1',
                'diamondCut': 'Ideal',
                'hallmarkCertificate': 'GIA Certified #64829103 & BIS Hallmarked',
                'ringSize': 'US 6.5 (Complimentary Resizing)'
            },
            'cat_img': 'RINGS',
            'stock': 3,
            'featured': 1,
            'bestseller': 1
        },
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-RNG-002',
            'title': 'Imperial Emerald & Radiant Diamond Cocktail Ring',
            'slug': 'imperial-emerald-radiant-diamond-cocktail-ring',
            'subtitle': '3.20ct Minor-Oil Colombian Emerald in 18K Yellow Gold',
            'description': 'Showcasing a mesmerizing natural Colombian emerald exhibiting vivid green saturation, framed by a celestial halo of baguette and brilliant-cut diamonds in 18K yellow gold.',
            'basePriceUsd': 14200.0,
            'comparePriceUsd': 16500.0,
            'costPriceUsd': 9000.0,
            'categoryId': 'cat-rings',
            'collectionId': 'col-celestial',
            'specs': {
                'metalType': '18K Yellow Gold',
                'metalPurity': '18K (750)',
                'metalColor': 'Yellow Gold',
                'grossWeightGrams': 7.4,
                'netWeightGrams': 6.6,
                'diamondWeightCarats': 1.45,
                'diamondColor': 'E',
                'diamondClarity': 'VVS2',
                'gemstoneDetails': '3.20ct Natural Colombian Emerald (Minor Oil)',
                'hallmarkCertificate': 'SSEF Swiss Gemstone Report & BIS Hallmarked',
                'ringSize': 'US 7.0'
            },
            'cat_img': 'RINGS',
            'stock': 2,
            'featured': 1,
            'bestseller': 0
        },
        # --- BRIDAL SETS ---
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-BDL-001',
            'title': 'Maharani Royal Heritage Polki & Emerald Bridal Choker Set',
            'slug': 'maharani-royal-heritage-polki-emerald-bridal-choker-set',
            'subtitle': '22K Solid Gold, Natural Uncut Polki Diamonds & Zambian Emeralds',
            'description': 'A museum-grade bridal choker accompanied by matching chandelier earrings and maang tikka. Handcrafted across 140 atelier hours featuring syndicate uncut polki diamonds and hand-strung emerald beads.',
            'basePriceUsd': 32000.0,
            'comparePriceUsd': 36500.0,
            'costPriceUsd': 22000.0,
            'categoryId': 'cat-bridal',
            'collectionId': 'col-royal-bridal',
            'specs': {
                'metalType': '22K Heritage Solid Gold',
                'metalPurity': '22K (916)',
                'metalColor': 'Heritage Champagne Gold',
                'grossWeightGrams': 168.5,
                'netWeightGrams': 132.0,
                'diamondWeightCarats': 28.5,
                'gemstoneDetails': 'Natural Uncut Polki Diamonds & 45ct Zambian Emerald Beads',
                'hallmarkCertificate': 'BIS 916 Hallmarked & IGI Diamond Authenticity',
            },
            'cat_img': 'SETS',
            'stock': 1,
            'featured': 1,
            'bestseller': 1
        },
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-BDL-002',
            'title': 'Noor-E-Jahan Hand-Strung Basra Pearl & Polki Necklace',
            'slug': 'noor-e-jahan-basra-pearl-polki-necklace',
            'subtitle': 'Seven-Strand Natural Basra Pearls with 22K Jadau Polki Pendant',
            'description': 'Exquisite seven-strand certified natural Basra pearls meeting at an intricately enamelled meenakari centerpiece set with uncut diamonds and pigeon-blood Burmese rubies.',
            'basePriceUsd': 24500.0,
            'comparePriceUsd': 28000.0,
            'costPriceUsd': 16000.0,
            'categoryId': 'cat-bridal',
            'collectionId': 'col-imperial-polki',
            'specs': {
                'metalType': '22K Solid Gold',
                'metalPurity': '22K (916)',
                'metalColor': 'Yellow Gold',
                'grossWeightGrams': 112.0,
                'netWeightGrams': 78.4,
                'diamondWeightCarats': 16.2,
                'gemstoneDetails': 'Natural Basra Pearls & 8.5ct Burmese Rubies',
                'hallmarkCertificate': 'BIS 916 Hallmarked & Pearl Origin Certification',
            },
            'cat_img': 'SETS',
            'stock': 2,
            'featured': 0,
            'bestseller': 1
        },
        # --- EARRINGS ---
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-ERG-001',
            'title': 'Celestial Cascade Diamond Chandelier Earrings',
            'slug': 'celestial-cascade-diamond-chandelier-earrings',
            'subtitle': '6.40ct Total Diamond Weight, 18K White Gold Art-Deco Drops',
            'description': 'Art-Deco inspired articulating drops crafted with pear-shaped, marquise, and brilliant-cut diamonds, capturing luminous fire with every movement.',
            'basePriceUsd': 8900.0,
            'comparePriceUsd': 10500.0,
            'costPriceUsd': 5800.0,
            'categoryId': 'cat-earrings',
            'collectionId': 'col-celestial',
            'specs': {
                'metalType': '18K White Gold',
                'metalPurity': '18K (750)',
                'metalColor': 'White Gold',
                'grossWeightGrams': 18.2,
                'netWeightGrams': 16.9,
                'diamondWeightCarats': 6.40,
                'diamondColor': 'E-F',
                'diamondClarity': 'VVS',
                'diamondCut': 'Excellent',
                'hallmarkCertificate': 'IGI Certified & BIS Hallmarked',
            },
            'cat_img': 'EARRINGS',
            'stock': 4,
            'featured': 1,
            'bestseller': 1
        },
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-ERG-002',
            'title': 'Heritage Gulab Jhumkas with Seed Pearl Tassels',
            'slug': 'heritage-gulab-jhumkas-seed-pearl-tassels',
            'subtitle': '22K Gold Handcrafted Filigree with Natural Ruby Studs',
            'description': 'Traditional royal jhumkas featuring delicate floral filigree, cabochon rubies, and tiered seed pearl tassels with secure screw-back clasps.',
            'basePriceUsd': 4600.0,
            'comparePriceUsd': 5200.0,
            'costPriceUsd': 3100.0,
            'categoryId': 'cat-earrings',
            'collectionId': 'col-imperial-polki',
            'specs': {
                'metalType': '22K Yellow Gold',
                'metalPurity': '22K (916)',
                'metalColor': 'Yellow Gold',
                'grossWeightGrams': 26.4,
                'netWeightGrams': 23.8,
                'gemstoneDetails': 'Natural Seed Pearls & 1.8ct Cabochon Rubies',
                'hallmarkCertificate': 'BIS 916 Hallmarked',
            },
            'cat_img': 'EARRINGS',
            'stock': 5,
            'featured': 0,
            'bestseller': 0
        },
        # --- BANGLES & BRACELETS ---
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-BNG-001',
            'title': 'The Royal Peacock 22K Gold Hand-Carved Kada Pair',
            'slug': 'royal-peacock-22k-gold-hand-carved-kada-pair',
            'subtitle': 'Solid 22K Gold Pair with Concealed Screw Clasps & Meenakari',
            'description': 'A pair of heavy hand-engraved 22K gold kadas sculpted with majestic peacock motifs, crowned with red enamel meenakari and bezel-set cabochon rubies.',
            'basePriceUsd': 11800.0,
            'comparePriceUsd': 13200.0,
            'costPriceUsd': 8200.0,
            'categoryId': 'cat-bangles',
            'collectionId': 'col-royal-bridal',
            'specs': {
                'metalType': '22K Solid Gold',
                'metalPurity': '22K (916)',
                'metalColor': 'Champagne Gold',
                'grossWeightGrams': 84.0,
                'netWeightGrams': 81.5,
                'bangleSize': 'Size 2.6 (60mm Inner Diameter)',
                'hallmarkCertificate': 'BIS 916 Government Hallmarked',
            },
            'cat_img': 'BANGLES',
            'stock': 2,
            'featured': 1,
            'bestseller': 1
        },
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-BNG-002',
            'title': 'Infinity Diamond Tennis Bracelet in 18K White Gold',
            'slug': 'infinity-diamond-tennis-bracelet-18k-white-gold',
            'subtitle': '8.50ct F/VVS Round Brilliant Diamonds with Double-Lock Clasp',
            'description': 'A continuous stream of 52 meticulously matched round brilliant-cut diamonds held in four-prong 18K white gold mountings with safety figure-eight clasps.',
            'basePriceUsd': 9400.0,
            'comparePriceUsd': 11000.0,
            'costPriceUsd': 6400.0,
            'categoryId': 'cat-bangles',
            'collectionId': 'col-celestial',
            'specs': {
                'metalType': '18K White Gold',
                'metalPurity': '18K (750)',
                'metalColor': 'White Gold',
                'grossWeightGrams': 15.6,
                'netWeightGrams': 13.9,
                'diamondWeightCarats': 8.50,
                'diamondColor': 'F',
                'diamondClarity': 'VVS2',
                'diamondCut': 'Ideal',
                'hallmarkCertificate': 'IGI Certified & BIS Hallmarked',
            },
            'cat_img': 'BANGLES',
            'stock': 3,
            'featured': 0,
            'bestseller': 1
        },
        # --- ARTISAN SILVER ---
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-SLV-001',
            'title': 'Ethereal Lotus Handcrafted 925 Sterling Silver Pendant',
            'slug': 'ethereal-lotus-handcrafted-sterling-silver-pendant',
            'subtitle': 'Oxidised 925 Sterling Silver with Natural Moonstone Cabochon',
            'description': 'Mastercrafted using antique silver filigree techniques, framing an iridescent rainbow moonstone cabochon on a 20-inch solid silver rope chain.',
            'basePriceUsd': 480.0,
            'comparePriceUsd': 580.0,
            'costPriceUsd': 220.0,
            'categoryId': 'cat-silver',
            'collectionId': 'col-artisan-silver',
            'specs': {
                'metalType': '925 Sterling Silver',
                'metalPurity': '925 Silver',
                'metalColor': 'Oxidised Antique Silver',
                'grossWeightGrams': 22.4,
                'netWeightGrams': 19.8,
                'gemstoneDetails': '4.5ct Natural Rainbow Moonstone',
                'hallmarkCertificate': '925 Silver Hallmarked',
            },
            'cat_img': 'HANDMADE',
            'stock': 12,
            'featured': 1,
            'bestseller': 1
        },
        {
            'id': str(uuid.uuid4()),
            'sku': 'TBH-SLV-002',
            'title': 'Celestial Crescent 925 Silver Artisan Choker',
            'slug': 'celestial-crescent-silver-artisan-choker',
            'subtitle': 'Hammered Silver with Hand-Set Raw Herkimer Diamonds',
            'description': 'Bold yet refined, this hand-forged sterling silver open collar choker features crescent finials set with sparkling raw Herkimer quartz crystals.',
            'basePriceUsd': 620.0,
            'comparePriceUsd': 750.0,
            'costPriceUsd': 290.0,
            'categoryId': 'cat-silver',
            'collectionId': 'col-artisan-silver',
            'specs': {
                'metalType': '925 Sterling Silver',
                'metalPurity': '925 Silver',
                'metalColor': 'Polished Bright Silver',
                'grossWeightGrams': 34.0,
                'netWeightGrams': 31.2,
                'gemstoneDetails': 'Raw Natural Herkimer Quartz Crystals',
                'hallmarkCertificate': '925 Silver Hallmarked',
            },
            'cat_img': 'HANDMADE',
            'stock': 8,
            'featured': 0,
            'bestseller': 0
        },
    ]

    for p in products:
        primary_img, gallery_imgs = get_images(p['cat_img'])
        specs_json = json.dumps(p['specs'])
        gallery_json = json.dumps(gallery_imgs)

        cursor.execute('''
            INSERT OR REPLACE INTO products (
                id, sku, title, slug, subtitle, description,
                basePriceUsd, comparePriceUsd, costPriceUsd,
                categoryId, collectionId, specs, primaryImageUrl, galleryImages,
                stockQuantity, lowStockThreshold, status, isFeatured, isBestseller,
                createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            p['id'], p['sku'], p['title'], p['slug'], p['subtitle'], p['description'],
            p['basePriceUsd'], p['comparePriceUsd'], p['costPriceUsd'],
            p['categoryId'], p['collectionId'], specs_json, primary_img, gallery_json,
            p['stock'], 1, 'ACTIVE', p['featured'], p['bestseller'],
            now_iso, now_iso
        ))

    print(f'Seeded {len(products)} luxury jewelry products with high-res photography and specs!')

    conn.commit()
    conn.close()
    print('\nCatalog seed completed successfully!')

if __name__ == '__main__':
    seed()
