import sqlite3, uuid, datetime, hashlib, json

DB_PATH = 'apps/api/prisma/dev.db'

def calculate_sha256(data: dict) -> str:
    serialized = json.dumps(data, sort_keys=True)
    return '0x' + hashlib.sha256(serialized.encode('utf-8')).hexdigest()

def seed_certificates():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    # Fetch products
    cursor.execute("SELECT id, sku, title, specs FROM products LIMIT 5")
    products = cursor.fetchall()

    certs = [
        {
            'certNum': 'TBH-CERT-2026-9001',
            'productIdx': 0,
            'lab': 'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA',
            'reportNum': 'GIA-6482910382',
            'carat': 2.50,
            'color': 'D (Colorless)',
            'clarity': 'FL (Flawless)',
            'cut': 'Triple Excellent',
            'polish': 'EXCELLENT',
            'symmetry': 'EXCELLENT',
            'fluorescence': 'NONE',
            'metalType': '18K White Gold & Platinum',
            'metalPurity': 'AU 750 / PT 950',
            'grossGrams': 8.45,
            'netGrams': 7.95,
            'huid': 'BIS-916-HUID-884210',
            'owner': 'Lady Eleanor Vance',
            'notes': 'Commissioned with Mayfair Atelier laser inscription: "Eleanor & Henry • 2026"',
        },
        {
            'certNum': 'TBH-CERT-2026-9002',
            'productIdx': 1,
            'lab': 'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA',
            'reportNum': 'GIA-2219847291',
            'carat': 14.80,
            'color': 'D-E (Colorless)',
            'clarity': 'VVS1 (Very Very Slightly Included)',
            'cut': 'Ideal Hearts & Arrows',
            'polish': 'EXCELLENT',
            'symmetry': 'EXCELLENT',
            'fluorescence': 'NONE',
            'metalType': '22K Royal Heritage Yellow Gold',
            'metalPurity': 'AU 916 (BIS 916)',
            'grossGrams': 48.20,
            'netGrams': 45.24,
            'huid': 'BIS-916-HUID-991204',
            'owner': 'Her Highness Princess Noor Al-Sabah',
            'notes': 'Imperial Royal Heritage Bridal Parure with certified Zambian emerald accents.',
        },
        {
            'certNum': 'TBH-CERT-2026-9003',
            'productIdx': 2,
            'lab': 'IGI_INTERNATIONAL_GEMOLOGICAL_INSTITUTE',
            'reportNum': 'IGI-5829104829',
            'carat': 4.20,
            'color': 'E (Colorless)',
            'clarity': 'IF (Internally Flawless)',
            'cut': 'Triple Excellent',
            'polish': 'EXCELLENT',
            'symmetry': 'EXCELLENT',
            'fluorescence': 'NONE',
            'metalType': '18K Rose Gold',
            'metalPurity': 'AU 750',
            'grossGrams': 12.60,
            'netGrams': 11.76,
            'huid': 'BIS-916-HUID-774812',
            'owner': 'The Bling Haven Vault Reserve',
            'notes': 'Vault Reserve Celestial Solitaire creation with micro-pave diamond halo.',
        },
        {
            'certNum': 'TBH-CERT-2026-9004',
            'productIdx': 3,
            'lab': 'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA',
            'reportNum': 'GIA-5928103948',
            'carat': 3.15,
            'color': 'D (Colorless)',
            'clarity': 'VVS2',
            'cut': 'Triple Excellent Cushion Brilliant',
            'polish': 'EXCELLENT',
            'symmetry': 'EXCELLENT',
            'fluorescence': 'FAINT',
            'metalType': 'Platinum Pt950',
            'metalPurity': 'PT 950',
            'grossGrams': 9.80,
            'netGrams': 9.17,
            'huid': 'BIS-916-HUID-663910',
            'owner': 'The Bling Haven Canadian Vault (Toronto)',
            'notes': 'Inspected and certified in Toronto Yorkville Gemological Suite.',
        },
    ]

    for item in certs:
        p = products[item['productIdx']] if item['productIdx'] < len(products) else products[0]
        prod_id, prod_sku, prod_title, _ = p

        payload_to_hash = {
            'certificateNumber': item['certNum'],
            'sku': prod_sku,
            'reportNumber': item['reportNum'],
            'carat': item['carat'],
            'color': item['color'],
            'clarity': item['clarity'],
            'metal': item['metalPurity'],
            'huid': item['huid']
        }
        crypto_hash = calculate_sha256(payload_to_hash)
        qr_url = f"http://localhost:3000/verify/{item['certNum']}"

        transfer_history = [
            {
                'timestamp': now,
                'fromOwner': 'Maison Goldsmith Atelier',
                'toOwner': item['owner'],
                'transferReason': 'Official Provenance Minting & Certified Acquisition',
                'actorEmail': 'gemologist@theblinghaven.shop',
                'transactionHash': crypto_hash[:18] + '...'
            }
        ]

        cursor.execute("SELECT id FROM certificates_of_authenticity WHERE certificateNumber = ?", (item['certNum'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO certificates_of_authenticity (
                    id, certificateNumber, productId, sku, productTitle,
                    gemstoneReportNumber, gemstoneLaboratory, caratWeight,
                    colorGrade, clarityGrade, cutGrade, polishGrade,
                    symmetryGrade, fluorescence, metalType, metalPurity,
                    grossWeightGrams, netGoldWeightGrams, bisHallmarkStamp,
                    cryptographicHash, qrVerificationUrl, ownerName,
                    transferHistory, isRevoked, notes, issuedAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                uid, item['certNum'], prod_id, prod_sku, prod_title,
                item['reportNum'], item['lab'], item['carat'],
                item['color'], item['clarity'], item['cut'], item['polish'],
                item['symmetry'], item['fluorescence'], item['metalType'], item['metalPurity'],
                item['grossGrams'], item['netGrams'], item['huid'],
                crypto_hash, qr_url, item['owner'],
                json.dumps(transfer_history), 0, item['notes'], now, now
            ))
            print(f"  [MINTED] Certificate #{item['certNum']} for {prod_title} -> SHA-256 {crypto_hash[:16]}...")
        else:
            cursor.execute("""
                UPDATE certificates_of_authenticity SET
                    cryptographicHash = ?,
                    qrVerificationUrl = ?,
                    ownerName = ?,
                    updatedAt = ?
                WHERE certificateNumber = ?
            """, (crypto_hash, qr_url, item['owner'], now, item['certNum']))
            print(f"  [UPDATED] Refreshed Certificate #{item['certNum']}")

    conn.commit()
    conn.close()
    print("Gemological certificates seeded successfully.")

if __name__ == '__main__':
    seed_certificates()
