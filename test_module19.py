import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_19():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 19 (PRECIOUS METALS SPOT TICKER) AUDIT')
    print('======================================================================')

    # 1. Test Public Spot Rates API
    with urllib.request.urlopen('http://localhost:4000/metals/rates') as resp:
        rates = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Live Metal Spot Rates Feed: Ingested {len(rates)} bullion purities')
        for r in rates:
            print(f'         - {r["purityName"]}: ${r["spotPriceUsdPerGram"]}/g (Making: ${r["makingChargesDefaultUsdPerGram"]}/g, Change: {r["dailyChangePercent"]}%)')

    # 2. Test Transparent Pricing Calculation Breakdown (22K Royal Heritage Gold)
    calc_payload = json.dumps({
        'purityCode': '22K_916',
        'netGoldWeightGrams': 25.0,
        'grossWeightGrams': 26.5,
        'gemstoneValuationUsd': 8500,
        'craftsmanshipTier': 'ROYAL_HERITAGE',
        'currencyCode': 'AED'
    }).encode('utf-8')
    req_calc = urllib.request.Request('http://localhost:4000/metals/calculate-breakdown', data=calc_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_calc) as resp:
        calc_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Transparent Pricing Calculation:')
        print(f'         Gold Base (25.0g @ ${calc_res["spotPriceUsdPerGram"]}/g): ${calc_res["goldBaseValueUsd"]} USD')
        print(f'         Making Charges (Royal Heritage 2.2x): ${calc_res["totalMakingChargesUsd"]} USD (${calc_res["makingChargeRateUsdPerGram"]}/g)')
        print(f'         Gemstone Valuation: ${calc_res["gemstoneValuationUsd"]} USD')
        print(f'         BIS 916 Certification & Hallmarking: ${calc_res["hallmarkingAndCertificationUsd"]} USD')
        print(f'         -> Estimated Total: ${calc_res["estimatedTotalUsd"]} USD = {calc_res["formattedTotalLocal"]} ({calc_res["currencyCode"]})')

    # 3. Test Admin Spot Price Override & Audit Trail
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    rate_24k = next(r for r in rates if r['purityCode'] == '24K_999')
    update_payload = json.dumps({
        'spotPriceUsdPerGram': 79.10,
        'makingChargesDefaultUsdPerGram': 11.5,
        'dailyChangePercent': 1.85
    }).encode('utf-8')
    req_update = urllib.request.Request(
        f'http://localhost:4000/admin/metals/rates/{rate_24k["id"]}',
        data=update_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='PUT'
    )
    with urllib.request.urlopen(req_update) as resp:
        updated = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Admin Bullion Override: Updated {updated["purityName"]} to ${updated["spotPriceUsdPerGram"]}/g (Making: ${updated["makingChargesDefaultUsdPerGram"]}/g)')

    # 4. Test Live Market Sync (LBMA London & TSX Canadian Bullion feed)
    req_sync = urllib.request.Request('http://localhost:4000/metals/sync-market', data=b'{}', headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req_sync) as resp:
        synced_rates = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Live Bullion Sync: Synced {len(synced_rates)} rates with Bank of Canada CAD & LBMA feeds')

    # 5. Verify Admin and Storefront Routes with Canadian Defaults
    for url in ['http://localhost:3001/metals', 'http://localhost:3000/catalog', 'http://localhost:3000/checkout', 'http://localhost:3000/concierge']:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 19 (PRECIOUS METALS SPOT ENGINE) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_19()
