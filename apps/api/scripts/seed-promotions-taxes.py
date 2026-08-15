import sqlite3
import uuid
from datetime import datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_promotions_and_taxes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print('===========================================================')
    print('SEEDING VIP PROMOTIONS & GLOBAL TAX/CUSTOMS RULES')
    print('===========================================================')

    now_iso = datetime.utcnow().isoformat() + 'Z'

    # 1. Promotions
    promotions = [
        ('ROYAL2026', 'Royal Concierge Private Atelier Privilege', 'Private 15% VIP discount for High Net Worth patrons.', 'PERCENTAGE_OFF', 15.0, 10000.0, 10000.0, 'ROYAL_CONCIERGE', None, None, 50, 2, 1),
        ('SOLITAIRE500', 'Celestial Solitaires Acquisition Credit', '$500 USD credit towards D-Flawless certified solitaires.', 'FIXED_AMOUNT_OFF', 500.0, 5000.0, 500.0, None, None, None, 100, 5, 1),
        ('ATELIER10', 'Maison Welcome Invitation', '10% private welcome discount on first high-jewelry order.', 'PERCENTAGE_OFF', 10.0, 2000.0, 2500.0, None, None, None, 500, 18, 1),
        ('ARMORED_VIP', 'Complimentary White-Glove Armored Shipping', 'Free insured armored delivery via Ferrari Group.', 'FREE_ARMORED_SHIPPING', 100.0, 5000.0, 500.0, 'GOLD_PATRON', None, None, 200, 12, 1),
    ]

    for code, name, desc, p_type, val, min_p, max_d, vip, cat_id, col_id, u_limit, u_count, act in promotions:
        p_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT OR REPLACE INTO promotions (
                id, code, name, description, type, value, minPurchaseAmountUsd,
                maxDiscountAmountUsd, vipTierRequired, categoryId, collectionId,
                usageLimit, usageCount, isActive, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (p_id, code, name, desc, p_type, val, min_p, max_d, vip, cat_id, col_id, u_limit, u_count, act, now_iso, now_iso))

    print(f'Seeded {len(promotions)} VIP promotions and atelier private offers!')

    # 2. Tax & Customs Rules
    tax_rules = [
        ('US', 'United States', 'NY', 'New York Sales Tax', 8.875, 0.0, 0, 1, 'Standard New York State & City sales tax.'),
        ('US', 'United States', 'CA', 'California Sales Tax', 7.25, 0.0, 0, 1, 'California base district sales tax.'),
        ('US', 'United States', None, 'US General Sales Tax', 6.0, 0.0, 0, 1, 'Default US interstate sales tax average.'),
        ('GB', 'United Kingdom', None, 'UK Luxury VAT', 20.0, 0.0, 1, 1, '20% standard VAT included in UK luxury pricing.'),
        ('AE', 'United Arab Emirates', None, 'UAE Standard VAT', 5.0, 0.0, 1, 1, '5% Federal Tax Authority standard VAT.'),
        ('IN', 'India', None, 'Precious Jewelry GST', 3.0, 5.0, 1, 1, '3% Gold & Diamond GST + 5% Customs on unmounted gems.'),
        ('FR', 'France', None, 'French Luxury VAT', 20.0, 0.0, 1, 1, '20% TVA applied to luxury goods.'),
        ('DE', 'Germany', None, 'German MwSt', 19.0, 0.0, 1, 1, '19% Mehrwertsteuer luxury VAT.'),
        ('CA', 'Canada', 'ON', 'Ontario HST', 13.0, 0.0, 0, 1, '13% Harmonized Sales Tax.'),
        ('AU', 'Australia', None, 'Australian GST', 10.0, 0.0, 1, 1, '10% Goods and Services Tax.'),
    ]

    for cc, cn, reg, t_name, t_rate, c_duty, inc, act, notes in tax_rules:
        t_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT OR REPLACE INTO tax_rules (
                id, countryCode, countryName, regionCode, taxName, taxRatePercent,
                customsDutyPercent, isTaxIncludedInPrice, isActive, notes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (t_id, cc, cn, reg, t_name, t_rate, c_duty, inc, act, notes, now_iso, now_iso))

    print(f'Seeded {len(tax_rules)} global tax, VAT, GST, and customs rules!')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_promotions_and_taxes()
