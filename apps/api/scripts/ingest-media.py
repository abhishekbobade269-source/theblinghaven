import os
import shutil
import sqlite3
import struct
import uuid
from datetime import datetime

DB_PATH = 'apps/api/prisma/dev.db'
SRC_DIR = 'WebsiteImages'
API_UPLOADS = 'apps/api/uploads'
ADMIN_UPLOADS = 'apps/admin/public/uploads'

os.makedirs(API_UPLOADS, exist_ok=True)
os.makedirs(ADMIN_UPLOADS, exist_ok=True)

def get_image_info(path):
    size = os.path.getsize(path)
    w, h = 1000, 1000
    mime = 'image/jpeg'
    try:
        with open(path, 'rb') as f:
            data = f.read(100)
            if data.startswith(b'\x89PNG\r\n\x1a\n'):
                w, h = struct.unpack('>LL', data[16:24])
                mime = 'image/png'
            elif data.startswith(b'\xff\xd8'):
                mime = 'image/jpeg'
                # Simple dimension approximation or 1200x1200
                w, h = 1200, 1200
    except Exception:
        pass
    return mime, size, w, h

def sanitize_filename(name):
    clean = "".join(c for c in name if c.isalnum() or c in ('-', '_', '.')).lower()
    return clean

def map_category(folder_name):
    f = folder_name.lower()
    if 'bangle' in f:
        return 'BANGLES'
    elif 'bridal' in f:
        return 'BRIDAL'
    elif 'earring' in f:
        return 'EARRINGS'
    elif 'ring' in f:
        return 'RINGS'
    elif 'handmade' in f:
        return 'HANDMADE'
    elif 'set' in f:
        return 'SETS'
    elif 'logo' in f or 'banner' in f:
        return 'BANNERS'
    return 'GENERAL'

def ingest():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Ingest Media Assets
    print('=============================================')
    print('INGESTING JEWELRY PHOTOGRAPHY ASSETS...')
    print('=============================================')
    
    total_ingested = 0
    for root, dirs, files in os.walk(SRC_DIR):
        folder_name = os.path.basename(root)
        cat = map_category(folder_name)
        
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext not in ('.jpg', '.jpeg', '.png', '.webp'):
                continue
            
            src_path = os.path.join(root, file)
            mime, size, w, h = get_image_info(src_path)
            
            asset_id = str(uuid.uuid4())
            sanitized = sanitize_filename(file)
            unique_name = f"{cat.lower()}_{asset_id[:8]}_{sanitized}"
            
            dst_api = os.path.join(API_UPLOADS, unique_name)
            dst_admin = os.path.join(ADMIN_UPLOADS, unique_name)
            
            shutil.copy2(src_path, dst_api)
            shutil.copy2(src_path, dst_admin)
            
            url = f"/uploads/{unique_name}"
            tags = [cat.lower(), 'jewelry', 'luxury', 'hallmarked', 'gold', 'diamonds']
            tags_json = str(tags).replace("'", '"')
            alt_text = f"The Bling Haven {cat.capitalize()} Fine Jewelry Collection"
            
            now_iso = datetime.utcnow().isoformat() + 'Z'
            
            cursor.execute('''
                INSERT OR REPLACE INTO media_assets 
                (id, filename, originalName, url, mimeType, sizeBytes, width, height, category, altText, tags, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (asset_id, unique_name, file, url, mime, size, w, h, cat, alt_text, tags_json, now_iso, now_iso))
            
            total_ingested += 1

    print(f'Successfully ingested and indexed {total_ingested} high-resolution jewelry photos!')
    
    # 2. Seed Initial Luxury CMS Pages
    print('\n=============================================')
    print('SEEDING LUXURY CMS STORYTELLING PAGES...')
    print('=============================================')
    
    pages = [
        (
            str(uuid.uuid4()),
            'about',
            'Our Heritage & The Maison Story',
            'Artisanal excellence, ethical sourcing, and timeless beauty since 2018.',
            '''# The Maison of The Bling Haven

Founded on the principle that fine jewelry should be an intimate expression of timeless elegance, **The Bling Haven** brings together centuries of artisanal goldsmithing with contemporary international luxury.

## Ethical Sourcing & Hallmarked Purity
Every diamond in our collection is strictly conflict-free, adhering to the Kimberly Process Certification Scheme. Our 18K and 22K gold creations carry certified BIS Hallmarking, guaranteeing pure precious metal integrity.

## Master Artisans & Hand-Finishing
From the initial hand-drawn gouache rendering to the micro-pave setting of brilliant-cut gemstones, each piece spends over 45 hours in our master atelier before receiving its velvet vault seal.
''',
            'Our Story & Artisanal Heritage | The Bling Haven',
            'Discover the craftsmanship, ethical precious metal sourcing, and timeless heritage behind The Bling Haven luxury jewelry collection.',
            'PUBLISHED',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ),
        (
            str(uuid.uuid4()),
            'craftsmanship',
            'The Art of Haute Horlogerie & Jewelry',
            'Precision stone setting, hand-cast gold alloys, and microscope calibration.',
            '''# Precision Master Craftsmanship

At The Bling Haven, perfection is measured in fractions of a millimeter.

### 1. Certified 18K & 22K Solid Gold
We exclusively formulate custom gold alloys that resist tarnishing while delivering the warm, luminous champagne hue characteristic of our signature creations.

### 2. Flawless Gemstone Calibration
Every natural diamond, Colombian emerald, and Burmese ruby is hand-selected for color consistency (D-F color grade) and clarity (VVS+).

### 3. Invisible Prong & Pave Setting
Our master jewelers utilize high-magnification stereomicroscopes to hand-set every micro-gemstone, creating seamless fields of fire and brilliance.
''',
            'Haute Jewelry Craftsmanship & Hallmarking | The Bling Haven',
            'Explore our master gemstone settings, solid gold alloys, and artisan calibration techniques.',
            'PUBLISHED',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ),
        (
            str(uuid.uuid4()),
            'policies',
            'White-Glove Shipping & Lifetime Guarantee',
            'Complimentary armored express transit, 30-day returns, and lifetime authenticity.',
            '''# Delivery, Returns & Lifetime Guarantee

### Fully Insured Express Transit
All international and domestic orders are dispatched via armored courier with tamper-evident vault sealing, discreet packaging, and mandatory adult signature verification upon arrival.

### 30-Day Complimentary Returns
We offer 30 days of hassle-free returns on all non-customized pieces in their original unworn condition with certification tags intact.

### Lifetime Authenticity & Annual Cleaning
Every creation is backed by our permanent certificate of authenticity and includes complimentary annual ultrasonic cleaning and prong re-tightening at any of our partner ateliers.
''',
            'Insured Shipping, Returns & Guarantee | The Bling Haven',
            'Learn about our armored transit delivery, 30-day returns, and lifetime authenticity warranty.',
            'PUBLISHED',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ),
        (
            str(uuid.uuid4()),
            'faq',
            'Frequently Asked Client Inquiries',
            'Answers to sizing, custom commissions, international duties, and jewelry care.',
            '''# Client Inquiries & Concierge FAQ

### How do I accurately measure my ring size?
We offer a printable international ring sizing chart and can dispatch a complimentary physical ring sizer to your doorstep prior to placing your order.

### Are international customs duties and taxes included?
Yes. All prices displayed on our global storefront include pre-calculated customs duties, local VAT, and import clearances (DDP - Delivered Duty Paid).

### Can I commission a bespoke bridal piece?
Our VIP Concierge team collaborates with clients worldwide to create one-of-a-kind engagement rings and heritage bridal sets. Contact concierge@theblinghaven.shop to schedule an atelier consultation.
''',
            'Client Care & Frequently Asked Questions | The Bling Haven',
            'Find answers regarding international shipping, custom bridal designs, and ring sizing assistance.',
            'PUBLISHED',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        )
    ]
    
    for p in pages:
        cursor.execute('''
            INSERT OR REPLACE INTO cms_pages 
            (id, slug, title, subtitle, content, seoTitle, seoDescription, status, publishedAt, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', p)
    
    print('Seeded 4 luxury storytelling pages: /about, /craftsmanship, /policies, /faq')
    
    # 3. Seed Homepage Hero Banners
    print('\n=============================================')
    print('SEEDING HOMEPAGE HERO CAROUSEL BANNERS...')
    print('=============================================')
    
    banners = [
        (
            str(uuid.uuid4()),
            'The Royal Heritage Bridal Collection',
            'Handcrafted polki chokers, certified solitaire rings, and 22K gold heirlooms.',
            'NEW AUTUMN 2026',
            'Explore Collection',
            '/catalog',
            '/images/banner.jpg',
            None,
            1,
            1,
            'LEFT',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ),
        (
            str(uuid.uuid4()),
            'Artisan Hand-Carved Silver & Precious Gems',
            'Ethereal pendants and intricate earrings crafted with celestial precision.',
            'LIMITED EDITION',
            'Discover Artisan Silver',
            '/catalog',
            '/images/banner.jpg',
            None,
            2,
            1,
            'CENTER',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        ),
        (
            str(uuid.uuid4()),
            'Custom Bridal Atelier & Bespoke Rings',
            'Collaborate directly with our master goldsmiths for your once-in-a-lifetime jewel.',
            'VIP CONCIERGE',
            'Book Consultation',
            '/cms/about',
            '/images/banner.jpg',
            None,
            3,
            1,
            'RIGHT',
            datetime.utcnow().isoformat() + 'Z',
            datetime.utcnow().isoformat() + 'Z'
        )
    ]
    
    for b in banners:
        cursor.execute('''
            INSERT OR REPLACE INTO hero_banners
            (id, title, subtitle, badgeText, ctaText, ctaLink, imageUrl, mobileImageUrl, displayOrder, isActive, alignment, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', b)
        
    print('Seeded 3 homepage hero banners!')
    
    conn.commit()
    conn.close()
    print('\nIngestion and seeding completed successfully!')

if __name__ == '__main__':
    ingest()
