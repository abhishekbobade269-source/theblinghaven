import sqlite3
import json
import uuid
from datetime import datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_orders_and_customers():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print('===========================================================')
    print('SEEDING VIP HIGH-JEWELRY CUSTOMERS & ORDERS')
    print('===========================================================')

    now_iso = datetime.utcnow().isoformat() + 'Z'

    # 1. Customers
    customers = [
        {
            'id': 'cust-noor-alsabah',
            'firstName': 'Her Highness Princess Noor',
            'lastName': 'Al-Sabah',
            'email': 'noor.alsabah@royalcourt.ae',
            'phone': '+971 50 882 9104',
            'country': 'United Arab Emirates',
            'city': 'Dubai (Emirates Hills)',
            'vipTier': 'ROYAL_CONCIERGE',
            'totalSpendUsd': 145000.0,
            'totalOrdersCount': 4,
            'preferences': {
                'preferredRingSize': 'US 6.5',
                'preferredBangleSize': 'Size 2.6',
                'preferredMetal': '22K Heritage Gold & Platinum',
                'favoriteGemstones': ['Natural Basra Pearls', 'Syndicate Polki', 'Colombian Emeralds'],
                'anniversaryDate': '1998-11-24',
                'birthDate': '1975-06-12',
                'giftPreferences': 'High-jewelry bespoke private viewings only. Packaged in Italian velvet presentation trunks.'
            },
            'conciergeNotes': 'Private Collector. Requests white-glove armored delivery via Ferrari Group directly to Emirates Hills residence.',
            'assignedAdvisor': 'Lady Genevieve Laurent (Private Client Director)'
        },
        {
            'id': 'cust-evelyn-rothschild',
            'firstName': 'Lady Evelyn',
            'lastName': 'Rothschild-Vane',
            'email': 'evelyn.rothschild@kensington-ateliers.co.uk',
            'phone': '+44 7700 900821',
            'country': 'United Kingdom',
            'city': 'London (Mayfair)',
            'vipTier': 'GOLD_PATRON',
            'totalSpendUsd': 68500.0,
            'totalOrdersCount': 3,
            'preferences': {
                'preferredRingSize': 'US 5.5',
                'preferredBangleSize': 'Size 2.4',
                'preferredMetal': '18K White Gold & Pt950',
                'favoriteGemstones': ['D-Flawless Solitaires', 'Kashmir Sapphires'],
                'anniversaryDate': '2004-09-18',
                'birthDate': '1982-03-29',
            },
            'conciergeNotes': 'Prefers GIA certified D-Color solitaires with ideal cut symmetry.',
            'assignedAdvisor': 'Marcus Sterling (Senior Gemologist)'
        },
        {
            'id': 'cust-aarav-singhania',
            'firstName': 'Aarav',
            'lastName': 'Singhania',
            'email': 'aarav.singhania@heritageholdings.in',
            'phone': '+91 98200 11942',
            'country': 'India',
            'city': 'Mumbai (Malabar Hill)',
            'vipTier': 'ROYAL_CONCIERGE',
            'totalSpendUsd': 92000.0,
            'totalOrdersCount': 2,
            'preferences': {
                'preferredRingSize': 'US 7.0',
                'preferredBangleSize': 'Size 2.8',
                'preferredMetal': '22K Solid Gold (916)',
                'favoriteGemstones': ['Uncut Polki', 'Basra Pearls', 'Pigeon Blood Rubies'],
                'anniversaryDate': '2010-12-08',
            },
            'conciergeNotes': 'Acquired the Maharani Royal Heritage Bridal Choker Set for daughter wedding.',
            'assignedAdvisor': 'Lady Genevieve Laurent (Private Client Director)'
        },
        {
            'id': 'cust-charlotte-vance',
            'firstName': 'Dr. Charlotte',
            'lastName': 'Vance',
            'email': 'charlotte.vance@manhattanmed.org',
            'phone': '+1 212 555 0198',
            'country': 'United States',
            'city': 'New York (Upper East Side)',
            'vipTier': 'SILVER',
            'totalSpendUsd': 23400.0,
            'totalOrdersCount': 2,
            'preferences': {
                'preferredRingSize': 'US 6.0',
                'preferredMetal': '18K Yellow Gold',
                'favoriteGemstones': ['Colombian Emeralds', 'Baguette Diamonds'],
            },
            'conciergeNotes': 'Loves Art-Deco cocktail rings and evening drop earrings.',
            'assignedAdvisor': 'Elena Rostova (VIP Concierge)'
        },
    ]

    for c in customers:
        cursor.execute('''
            INSERT OR REPLACE INTO customers (
                id, firstName, lastName, email, phone, country, city,
                vipTier, totalSpendUsd, totalOrdersCount, preferences,
                conciergeNotes, assignedAdvisor, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            c['id'], c['firstName'], c['lastName'], c['email'], c['phone'], c['country'], c['city'],
            c['vipTier'], c['totalSpendUsd'], c['totalOrdersCount'], json.dumps(c['preferences']),
            c['conciergeNotes'], c['assignedAdvisor'], now_iso, now_iso
        ))

    print(f'Seeded {len(customers)} VIP high-jewelry private clients!')

    # Fetch products for order lines
    cursor.execute('SELECT id, sku, title, basePriceUsd, primaryImageUrl, specs FROM products')
    prod_rows = cursor.fetchall()
    prod_map = {row[1]: row for row in prod_rows}

    # 2. Rich Multi-Currency Orders across different stages
    orders = [
        {
            'id': str(uuid.uuid4()),
            'orderNumber': 'TBH-2026-8801',
            'customerId': 'cust-noor-alsabah',
            'customerName': 'Her Highness Princess Noor Al-Sabah',
            'customerEmail': 'noor.alsabah@royalcourt.ae',
            'customerPhone': '+971 50 882 9104',
            'customerVipTier': 'ROYAL_CONCIERGE',
            'status': 'SECURE_DISPATCH_ARMORED',
            'paymentStatus': 'PAID',
            'paymentMethod': 'PRIVATE_BANK_WIRE_TRANSFER',
            'currencyCode': 'AED',
            'currencySymbol': 'AED',
            'totalAmountUsd': 32000.0,
            'totalAmountLocal': 119872.0,
            'subtotalUsd': 32000.0,
            'taxAmountUsd': 0.0,
            'shippingAmountUsd': 0.0,
            'shippingAddress': {
                'fullName': 'Her Highness Princess Noor Al-Sabah',
                'street': 'Villa 14, Royal Palm Avenue, Sector E',
                'city': 'Emirates Hills, Dubai',
                'country': 'United Arab Emirates',
                'postalCode': '00000',
                'phone': '+971 50 882 9104'
            },
            'shippingCarrier': 'FERRARI_GROUP_SECURE',
            'trackingNumber': 'FG-DXB-992014-VAULT',
            'insuredValueUsd': 35000.0,
            'customerNotes': 'Deliver strictly between 10am - 1pm to private security detail.',
            'conciergeNotes': 'Armored convoy dispatched with dual armed couriers and tamper-evident titanium lock seals.',
            'items': ['TBH-BDL-001'],
            'timeline': [
                ('PENDING_VERIFICATION', 'Order received and private bank wire transfer initiated.', 'System'),
                ('CONFIRMED', 'Wire transfer of AED 119,872 received and verified by Treasury.', 'admin@theblinghaven.shop'),
                ('VAULT_ALLOCATION', 'Allocated from Vault B - Royal Heritage Safe 04.', 'Elena Rostova'),
                ('QUALITY_INSPECTION_PASSED', 'BIS 916 seal and IGI certificate verified by Master Gemologist.', 'Marcus Sterling'),
                ('SECURE_DISPATCH_ARMORED', 'Handed over to Ferrari Group Secure Logistics under tracking FG-DXB-992014-VAULT.', 'Lady Genevieve')
            ]
        },
        {
            'id': str(uuid.uuid4()),
            'orderNumber': 'TBH-2026-8802',
            'customerId': 'cust-evelyn-rothschild',
            'customerName': 'Lady Evelyn Rothschild-Vane',
            'customerEmail': 'evelyn.rothschild@kensington-ateliers.co.uk',
            'customerPhone': '+44 7700 900821',
            'customerVipTier': 'GOLD_PATRON',
            'status': 'CUSTOM_SIZING_IN_PROGRESS',
            'paymentStatus': 'PAID',
            'paymentMethod': 'VAULT_BLACK_CENTURION_CARD',
            'currencyCode': 'GBP',
            'currencySymbol': '£',
            'totalAmountUsd': 18500.0,
            'totalAmountLocal': 14907.0,
            'subtotalUsd': 18500.0,
            'taxAmountUsd': 0.0,
            'shippingAmountUsd': 0.0,
            'shippingAddress': {
                'fullName': 'Lady Evelyn Rothschild-Vane',
                'street': '42 Grosvenor Square, Mayfair',
                'city': 'London',
                'country': 'United Kingdom',
                'postalCode': 'W1K 2HP',
                'phone': '+44 7700 900821'
            },
            'shippingCarrier': 'BRINKS_GLOBAL',
            'trackingNumber': 'BG-LON-883109',
            'insuredValueUsd': 20000.0,
            'customerNotes': 'Complimentary resizing to US 5.5 requested.',
            'conciergeNotes': 'Ring currently at Master Goldsmith bench for micro-pave custom resizing to US 5.5.',
            'items': ['TBH-RNG-001'],
            'timeline': [
                ('CONFIRMED', 'Centurion card payment of £14,907 authorized.', 'System'),
                ('VAULT_ALLOCATION', 'Transferred from Vault A - High Security Solitaires.', 'Elena Rostova'),
                ('CUSTOM_SIZING_IN_PROGRESS', 'Undergoing micro-pave adjustments to US 5.5 at London Atelier bench.', 'Marcus Sterling')
            ]
        },
        {
            'id': str(uuid.uuid4()),
            'orderNumber': 'TBH-2026-8803',
            'customerId': 'cust-charlotte-vance',
            'customerName': 'Dr. Charlotte Vance',
            'customerEmail': 'charlotte.vance@manhattanmed.org',
            'customerPhone': '+1 212 555 0198',
            'customerVipTier': 'SILVER',
            'status': 'DELIVERED_SIGNATURE_REQUIRED',
            'paymentStatus': 'PAID',
            'paymentMethod': 'APPLE_PAY_VAULT',
            'currencyCode': 'USD',
            'currencySymbol': '$',
            'totalAmountUsd': 14200.0,
            'totalAmountLocal': 14200.0,
            'subtotalUsd': 14200.0,
            'taxAmountUsd': 0.0,
            'shippingAmountUsd': 0.0,
            'shippingAddress': {
                'fullName': 'Dr. Charlotte Vance',
                'street': '740 Park Avenue, Apt 11B',
                'city': 'New York, NY',
                'country': 'United States',
                'postalCode': '10021',
                'phone': '+1 212 555 0198'
            },
            'shippingCarrier': 'DHL_EXPRESS_INSURED',
            'trackingNumber': 'DHL-NYC-771920',
            'insuredValueUsd': 15000.0,
            'deliverySignatureName': 'Charlotte Vance (Recipient Verified)',
            'customerNotes': 'Requires direct signature upon delivery.',
            'conciergeNotes': 'Delivered and verified. Client delighted with emerald saturation.',
            'items': ['TBH-RNG-002'],
            'timeline': [
                ('CONFIRMED', 'Apple Pay authorization completed.', 'System'),
                ('VAULT_ALLOCATION', 'Secured from Vault A.', 'Elena Rostova'),
                ('QUALITY_INSPECTION_PASSED', 'SSEF Swiss report verified.', 'Marcus Sterling'),
                ('SECURE_DISPATCH_ARMORED', 'Dispatched via DHL Express Insured Signature.', 'Marcus Sterling'),
                ('DELIVERED_SIGNATURE_REQUIRED', 'Signed and received by Dr. Charlotte Vance.', 'DHL Courier')
            ]
        }
    ]

    for ord in orders:
        cursor.execute('''
            INSERT OR REPLACE INTO orders (
                id, orderNumber, customerId, customerName, customerEmail, customerPhone,
                customerVipTier, status, paymentStatus, paymentMethod, currencyCode, currencySymbol,
                totalAmountUsd, totalAmountLocal, subtotalUsd, taxAmountUsd, shippingAmountUsd,
                shippingAddress, shippingCarrier, trackingNumber, insuredValueUsd,
                deliverySignatureName, customerNotes, conciergeNotes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            ord['id'], ord['orderNumber'], ord['customerId'], ord['customerName'], ord['customerEmail'], ord['customerPhone'],
            ord['customerVipTier'], ord['status'], ord['paymentStatus'], ord['paymentMethod'], ord['currencyCode'], ord['currencySymbol'],
            ord['totalAmountUsd'], ord['totalAmountLocal'], ord['subtotalUsd'], ord['taxAmountUsd'], ord['shippingAmountUsd'],
            json.dumps(ord['shippingAddress']), ord.get('shippingCarrier'), ord.get('trackingNumber'), ord.get('insuredValueUsd'),
            ord.get('deliverySignatureName'), ord.get('customerNotes'), ord.get('conciergeNotes'), now_iso, now_iso
        ))

        # Order Items
        for sku in ord['items']:
            prod = prod_map.get(sku)
            if prod:
                p_id, p_sku, p_title, p_price, p_img, p_specs = prod
                specs_dict = json.loads(p_specs)
                item_id = str(uuid.uuid4())
                cursor.execute('''
                    INSERT OR REPLACE INTO order_items (
                        id, orderId, productId, sku, title, primaryImageUrl, quantity,
                        unitPriceUsd, totalPriceUsd, selectedRingSize, selectedBangleSize,
                        hallmarkCertificate
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    item_id, ord['id'], p_id, p_sku, p_title, p_img, 1,
                    p_price, p_price, specs_dict.get('ringSize'), specs_dict.get('bangleSize'),
                    specs_dict.get('hallmarkCertificate')
                ))

        # Order Timeline
        for status, notes, actor in ord['timeline']:
            tl_id = str(uuid.uuid4())
            cursor.execute('''
                INSERT OR REPLACE INTO order_timeline (id, orderId, status, notes, actorEmail, createdAt)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (tl_id, ord['id'], status, notes, actor, now_iso))

    print(f'Seeded {len(orders)} high-value orders across multiple fulfillment stages!')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_orders_and_customers()
