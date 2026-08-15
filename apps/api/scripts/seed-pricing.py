import sqlite3
import uuid
from datetime import datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_pricing():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print('===========================================================')
    print('SEEDING 8 INTERNATIONAL CURRENCY RATES & RISK BUFFERS')
    print('===========================================================')

    now_iso = datetime.utcnow().isoformat() + 'Z'

    rates = [
        ('USD', 'US Dollar', '$', 1.0, 0.0, 'ROUND_WHOLE_LUXURY', 1),
        ('EUR', 'Euro', '€', 0.92, 2.0, 'ROUND_WHOLE_LUXURY', 1),
        ('GBP', 'British Pound', '£', 0.79, 2.0, 'ROUND_WHOLE_LUXURY', 1),
        ('AED', 'UAE Dirham', 'AED', 3.6725, 1.5, 'ROUND_WHOLE_LUXURY', 1),
        ('INR', 'Indian Rupee', '₹', 83.50, 2.5, 'ROUND_WHOLE_LUXURY', 1),
        ('CAD', 'Canadian Dollar', 'CA$', 1.36, 2.5, 'ROUND_WHOLE_LUXURY', 1),
        ('AUD', 'Australian Dollar', 'AU$', 1.52, 2.5, 'ROUND_WHOLE_LUXURY', 1),
        ('SGD', 'Singapore Dollar', 'SG$', 1.35, 2.0, 'ROUND_WHOLE_LUXURY', 1),
    ]

    for code, name, sym, rate, buffer_pct, rounding, active in rates:
        rate_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT OR REPLACE INTO currency_rates (id, currencyCode, currencyName, symbol, rateToUsd, fxBufferPercent, roundingRule, isActive, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (rate_id, code, name, sym, rate, buffer_pct, rounding, active, now_iso, now_iso))

    print(f'Seeded {len(rates)} international currency exchange rates with FX buffers!')

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed_pricing()
