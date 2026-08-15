import sqlite3, uuid, datetime

DB_PATH = 'apps/api/prisma/dev.db'

def seed_vaults_ecosystem():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    now_dt = datetime.datetime.now(datetime.timezone.utc)
    now_iso = now_dt.strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'
    est_arrival_iso = (now_dt + datetime.timedelta(hours=14)).strftime('%Y-%m-%dT%H:%M:%S.%f') + 'Z'

    vaults = [
        {
            'name': 'Toronto Yorkville Central Reserve Vault',
            'code': 'TORONTO_YORKVILLE',
            'city': 'Toronto',
            'country': 'Canada',
            'currencyCode': 'CAD',
            'totalAssetValueCad': 24500000.0,
            'goldBullionKg': 320.0,
            'looseDiamondCarats': 2450.0,
            'securityLevel': 'TIER_5_MILITARY_GRADE',
            'isMasterVault': True,
            'address': '100 Bloor Street West, Safe Room 4, Toronto, ON M5S 1M4, Canada',
        },
        {
            'name': 'Vancouver Pacific Rim Safe Deposit Vault',
            'code': 'VANCOUVER_PACIFIC',
            'city': 'Vancouver',
            'country': 'Canada',
            'currencyCode': 'CAD',
            'totalAssetValueCad': 14200000.0,
            'goldBullionKg': 180.0,
            'looseDiamondCarats': 1200.0,
            'securityLevel': 'TIER_5_MILITARY_GRADE',
            'isMasterVault': False,
            'address': '1038 Canada Place, Waterfront Suite 9, Vancouver, BC V6C 0B9, Canada',
        },
        {
            'name': 'London Mayfair Bond Street Treasury Vault',
            'code': 'LONDON_MAYFAIR',
            'city': 'London',
            'country': 'United Kingdom',
            'currencyCode': 'GBP',
            'totalAssetValueCad': 31800000.0,
            'goldBullionKg': 410.0,
            'looseDiamondCarats': 3100.0,
            'securityLevel': 'TIER_5_MILITARY_GRADE',
            'isMasterVault': False,
            'address': '14 Old Bond Street, Sub-Level B2, Mayfair, London W1S 4PP, United Kingdom',
        },
        {
            'name': 'Dubai DIFC Gate Bullion Reserve Vault',
            'code': 'DUBAI_DIFC',
            'city': 'Dubai',
            'country': 'United Arab Emirates',
            'currencyCode': 'AED',
            'totalAssetValueCad': 28900000.0,
            'goldBullionKg': 390.0,
            'looseDiamondCarats': 1900.0,
            'securityLevel': 'TIER_5_MILITARY_GRADE',
            'isMasterVault': False,
            'address': 'Gate Precinct 4, DIFC Gold Depository, Dubai, United Arab Emirates',
        },
        {
            'name': 'Zurich FreePort High-Security Vault',
            'code': 'ZURICH_FREEPORT',
            'city': 'Zurich',
            'country': 'Switzerland',
            'currencyCode': 'CHF',
            'totalAssetValueCad': 42500000.0,
            'goldBullionKg': 650.0,
            'looseDiamondCarats': 4200.0,
            'securityLevel': 'TIER_5_MILITARY_GRADE',
            'isMasterVault': False,
            'address': 'Zurich FreePort Embraport, Sector 7, 8424 Embrach, Zurich, Switzerland',
        },
    ]

    vault_id_map = {}

    for v in vaults:
        cursor.execute("SELECT id FROM luxury_vaults WHERE code = ?", (v['code'],))
        row = cursor.fetchone()
        if not row:
            uid = str(uuid.uuid4())
            cursor.execute("""
                INSERT INTO luxury_vaults (
                    id, name, code, city, country, currencyCode,
                    totalAssetValueCad, goldBullionKg, looseDiamondCarats,
                    securityLevel, isMasterVault, address, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                uid, v['name'], v['code'], v['city'], v['country'], v['currencyCode'],
                v['totalAssetValueCad'], v['goldBullionKg'], v['looseDiamondCarats'],
                v['securityLevel'], 1 if v['isMasterVault'] else 0, v['address'],
                now_iso, now_iso
            ))
            vault_id_map[v['code']] = uid
            print(f"  [VAULT] Seeded {v['name']} ({v['city']}, {v['country']})")
        else:
            vault_id_map[v['code']] = row[0]

    # Seed Sample Armored Transfers
    cursor.execute("SELECT id FROM armored_transfers WHERE manifestNumber = 'TBH-ARM-2026-8801'")
    if not cursor.fetchone() and 'TORONTO_YORKVILLE' in vault_id_map and 'LONDON_MAYFAIR' in vault_id_map:
        tid1 = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO armored_transfers (
                id, manifestNumber, originVaultId, destinationVaultId,
                carrierName, courierBadgeId, insuredValueCad, insurancePolicyNumber,
                transferStatus, itemsCount, itemsSummary, currentWaypoint,
                dispatchedAt, estimatedArrivalAt, notes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tid1, 'TBH-ARM-2026-8801', vault_id_map['TORONTO_YORKVILLE'], vault_id_map['LONDON_MAYFAIR'],
            'BRINKS_GLOBAL_SERVICES', 'BRINKS-CAN-98210', 2500000.0,
            'LLOYDS-LONDON-VAL-882901', 'ARMORED_TRANSIT', 6,
            '4x 1kg LBMA 999.9 Gold Bullion Bars + 2x 5ct D-Flawless Cushion Diamonds',
            'Transatlantic Armored Cargo Flight (Toronto Pearson YYZ -> London Heathrow LHR)',
            now_iso, est_arrival_iso,
            'Secured under Lloyd’s of London $5,000,000 policy with dual-custody seal verification.',
            now_iso, now_iso
        ))
        print("  [ARMORED TRANSFER] Seeded Armored Manifest TBH-ARM-2026-8801 (Toronto -> London).")

    cursor.execute("SELECT id FROM armored_transfers WHERE manifestNumber = 'TBH-ARM-2026-8802'")
    if not cursor.fetchone() and 'ZURICH_FREEPORT' in vault_id_map and 'TORONTO_YORKVILLE' in vault_id_map:
        tid2 = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO armored_transfers (
                id, manifestNumber, originVaultId, destinationVaultId,
                carrierName, courierBadgeId, insuredValueCad, insurancePolicyNumber,
                transferStatus, itemsCount, itemsSummary, currentWaypoint,
                dispatchedAt, estimatedArrivalAt, notes, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tid2, 'TBH-ARM-2026-8802', vault_id_map['ZURICH_FREEPORT'], vault_id_map['TORONTO_YORKVILLE'],
            'MALCA_AMIT_SECURITY', 'MALCA-SWISS-77412', 3800000.0,
            'LLOYDS-LONDON-VAL-882902', 'CUSTOMS_PORT_INSPECTION', 3,
            '3x Untreated Kashmir Sapphire Parures + 12ct Golconda Diamond Tiara',
            'Canada Border Services Agency (CBSA) Armored Vault Clearance, Toronto Pearson',
            now_iso, est_arrival_iso,
            'Private high-jewelry rebalancing for Toronto Yorkville VIP salon viewings.',
            now_iso, now_iso
        ))
        print("  [ARMORED TRANSFER] Seeded Armored Manifest TBH-ARM-2026-8802 (Zurich -> Toronto).")

    conn.commit()
    conn.close()
    print("Multi-Vault Network and Armored Transfers seeded successfully.")

if __name__ == '__main__':
    seed_vaults_ecosystem()
