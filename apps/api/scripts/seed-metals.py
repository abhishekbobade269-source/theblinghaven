import sqlite3, uuid, datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_metal_prices():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    metals = [
        {
            'metalType': 'GOLD',
            'purityCode': '24K_999',
            'purityName': '24K Solid Gold (99.9% Purity)',
            'spotPriceUsdPerGram': 78.45,
            'marketSource': 'LBMA_LONDON',
            'dailyChangePercent': 1.42,
            'isMarketOpen': 1,
            'makingChargesDefaultUsdPerGram': 10.0,
        },
        {
            'metalType': 'GOLD',
            'purityCode': '22K_916',
            'purityName': '22K Royal Heritage Gold (91.6% BIS 916)',
            'spotPriceUsdPerGram': 71.86,
            'marketSource': 'LBMA_LONDON',
            'dailyChangePercent': 1.38,
            'isMarketOpen': 1,
            'makingChargesDefaultUsdPerGram': 14.5,
        },
        {
            'metalType': 'GOLD',
            'purityCode': '18K_750',
            'purityName': '18K Fine Jewelry Gold (75.0% AU 750)',
            'spotPriceUsdPerGram': 58.84,
            'marketSource': 'LBMA_LONDON',
            'dailyChangePercent': 1.25,
            'isMarketOpen': 1,
            'makingChargesDefaultUsdPerGram': 18.0,
        },
        {
            'metalType': 'PLATINUM',
            'purityCode': 'PT_950',
            'purityName': 'Platinum Pt950 (95.0% Pure Platinum)',
            'spotPriceUsdPerGram': 32.65,
            'marketSource': 'LBMA_LONDON',
            'dailyChangePercent': -0.45,
            'isMarketOpen': 1,
            'makingChargesDefaultUsdPerGram': 22.0,
        },
        {
            'metalType': 'SILVER',
            'purityCode': 'AG_925',
            'purityName': 'Artisan Sterling Silver (92.5% AG 925)',
            'spotPriceUsdPerGram': 0.96,
            'marketSource': 'LBMA_LONDON',
            'dailyChangePercent': 0.82,
            'isMarketOpen': 1,
            'makingChargesDefaultUsdPerGram': 4.5,
        },
    ]

    for m in metals:
        cursor.execute("SELECT id FROM metal_price_rates WHERE purityCode = ?", (m['purityCode'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO metal_price_rates (
                    id, metalType, purityCode, purityName, spotPriceUsdPerGram,
                    marketSource, dailyChangePercent, isMarketOpen,
                    makingChargesDefaultUsdPerGram, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                uid, m['metalType'], m['purityCode'], m['purityName'], m['spotPriceUsdPerGram'],
                m['marketSource'], m['dailyChangePercent'], m['isMarketOpen'],
                m['makingChargesDefaultUsdPerGram'], now, now
            ))
            print(f"  [INSERT] Seeded metal spot rate: {m['purityName']} -> ${m['spotPriceUsdPerGram']}/g")
        else:
            cursor.execute("""
                UPDATE metal_price_rates SET
                    spotPriceUsdPerGram = ?,
                    dailyChangePercent = ?,
                    isMarketOpen = ?,
                    makingChargesDefaultUsdPerGram = ?,
                    updatedAt = ?
                WHERE purityCode = ?
            """, (
                m['spotPriceUsdPerGram'], m['dailyChangePercent'], m['isMarketOpen'],
                m['makingChargesDefaultUsdPerGram'], now, m['purityCode']
            ))
            print(f"  [UPDATE] Refreshed metal spot rate: {m['purityName']} -> ${m['spotPriceUsdPerGram']}/g")

    conn.commit()
    conn.close()
    print("Precious metal spot rates seeded successfully.")

if __name__ == '__main__':
    seed_metal_prices()
