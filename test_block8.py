import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_block_8():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 8 (MODULES 17, 18) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Financial Analytics API
    req_analytics = urllib.request.Request('http://localhost:4000/admin/reports/analytics?period=ALL', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_analytics) as res_a:
        analytics = json.loads(res_a.read().decode())['data']
        print(f'  [PASS] Financial Forensics: Gross Sales: ${analytics["grossRevenueUsd"]} USD | Net Realized: ${analytics["netRevenueUsd"]} USD')
        print(f'         AOV: ${analytics["averageOrderValueUsd"]} USD | Total Orders: {analytics["totalOrdersCount"]}')
        print(f'         Currency Distribution: {len(analytics["currencyBreakdown"])} currencies')
        for c in analytics['currencyBreakdown']:
            print(f'         - {c["currencyCode"]}: {c["currencySymbol"]} {c["totalRevenueLocal"]} (${c["totalRevenueUsd"]} USD, {c["sharePercent"]}%)')

    # 2. Test BIS Hallmarking Audit Export (JSON)
    req_hallmark = urllib.request.Request('http://localhost:4000/admin/reports/export/hallmark-audit?format=json', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_hallmark) as res_h:
        hallmark_data = json.loads(res_h.read().decode())
        print(f'  [PASS] BIS Hallmarking Audit Ledger: {hallmark_data["recordCount"]} certified records generated')
        sample = hallmark_data['data'][0]
        print(f'         Sample: #{sample["orderNumber"]} | SKU: {sample["sku"]} | Purity: {sample["metalPurity"]} | Cert: {sample["hallmarkCertificate"]}')

    # 3. Test VAT & GST Tax Filing Export (JSON)
    req_tax = urllib.request.Request('http://localhost:4000/admin/reports/export/tax-filing?format=json', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_tax) as res_t:
        tax_data = json.loads(res_t.read().decode())
        print(f'  [PASS] Cross-Border VAT/GST Filing Ledger: {tax_data["recordCount"]} tax records generated')
        sample_t = tax_data['data'][0]
        print(f'         Sample: #{sample_t["orderNumber"]} | {sample_t["countryName"]} ({sample_t["taxSchemeName"]}) -> Tax: ${sample_t["taxCollectedUsd"]} USD')

    # 4. Test Vault Inventory Insurance Valuation Export (JSON)
    req_inv = urllib.request.Request('http://localhost:4000/admin/reports/export/inventory-valuation?format=json', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_inv) as res_i:
        inv_data = json.loads(res_i.read().decode())
        print(f'  [PASS] Vault Inventory Insurance Valuation: {inv_data["recordCount"]} vaulted jewelry pieces audited')
        total_vault_val = sum(item['totalReplacementValueUsd'] for item in inv_data['data'])
        print(f'         Total Vault Replacement Valuation: ${total_vault_val:,.2f} USD across global physical safes')

    # 5. Test CSV Stream Download
    req_csv = urllib.request.Request('http://localhost:4000/admin/reports/export/hallmark-audit?format=csv', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_csv) as res_csv:
        csv_content = res_csv.read().decode('utf-8')
        lines = csv_content.strip().split('\n')
        print(f'  [PASS] Streamed CSV Generation: Downloaded {len(lines)} CSV rows (Header: {lines[0][:60]}...)')

    print('\n===========================================================')
    print('BLOCK 8 (MODULES 17, 18) VERIFIED WITH 100% SUCCESS!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_8()
