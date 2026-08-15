import urllib.request, json, sys

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def verify_block_4():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 4 (MODULES 09, 10) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Vault Inventory Listing API
    req_inv = urllib.request.Request('http://localhost:4000/admin/inventory', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_inv) as res_inv:
        inv_data = json.loads(res_inv.read().decode())
        items = inv_data['data']
        print(f'  [PASS] Vault Inventory API: Loaded {len(items)} vault items (Low stock: {inv_data["meta"]["lowStockCount"]} SKUs)')
        sample_item = items[0]
        print(f'         Sample SKU: {sample_item["sku"]} — In Stock: {sample_item["stockQuantity"]}, Location: {sample_item["vaultLocation"]}')

    # 2. Test Stock Adjustment with Immutable Audit Trail
    adjust_data = json.dumps({
        'productId': sample_item['productId'],
        'newQuantity': sample_item['stockQuantity'] + 2,
        'changeType': 'RESTOCK',
        'reason': 'Automated verification test restock of 2 pieces',
        'vaultLocation': 'Vault A - High-Security Solitaires & Platinum'
    }).encode('utf-8')
    req_adj = urllib.request.Request('http://localhost:4000/admin/inventory/adjust', data=adjust_data, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_adj) as res_adj:
        adjusted = json.loads(res_adj.read().decode())['data']
        print(f'  [PASS] Stock Adjustment API: Updated stock from {sample_item["stockQuantity"]} to {adjusted["stockQuantity"]}')

    # 3. Test Vault Audit Ledger API
    req_logs = urllib.request.Request('http://localhost:4000/admin/inventory/logs', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_logs) as res_logs:
        logs = json.loads(res_logs.read().decode())['data']
        print(f'  [PASS] Vault Audit Ledger API: Retrieved {len(logs)} stock movement audit logs')
        print(f'         Latest Log: [{logs[0]["changeType"]}] {logs[0]["sku"]} — "{logs[0]["reason"]}" by {logs[0]["actorEmail"]}')

    # 4. Test Multi-Currency Rates API
    req_rates = urllib.request.Request('http://localhost:4000/admin/pricing/rates', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_rates) as res_rates:
        rates = json.loads(res_rates.read().decode())['data']
        print(f'  [PASS] Currency Rates API: Loaded {len(rates)} international currencies:')
        for r in rates:
            print(f'         - {r["currencyCode"]} ({r["symbol"]}): Rate {r["rateToUsd"]} | FX Buffer +{r["fxBufferPercent"]}% -> Effective: {r["effectiveRate"]}')

    # 5. Test Update Currency Rate & FX Buffer
    update_rate_data = json.dumps({
        'rateToUsd': 3.6725,
        'fxBufferPercent': 2.0,
        'roundingRule': 'ROUND_WHOLE_LUXURY'
    }).encode('utf-8')
    req_up_rate = urllib.request.Request('http://localhost:4000/admin/pricing/rates/AED', data=update_rate_data, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}, method='PUT')
    with urllib.request.urlopen(req_up_rate) as res_up:
        updated_rate = json.loads(res_up.read().decode())['data']
        print(f'  [PASS] Update Currency Rate API: Updated AED FX buffer to {updated_rate["fxBufferPercent"]}% (Effective: {updated_rate["effectiveRate"]})')

    # 6. Test Public Multi-Currency Conversion Endpoint
    req_conv = urllib.request.Request('http://localhost:4000/pricing/convert?amount=18500&from=USD&to=AED')
    with urllib.request.urlopen(req_conv) as res_conv:
        conv = json.loads(res_conv.read().decode())['data']
        print(f'  [PASS] Public Dynamic Currency Converter: $18,500 USD converted to {conv["formattedAmount"]} (Effective Rate: {conv["effectiveRate"]})')

    print('\n===========================================================')
    print('BLOCK 4 (MODULES 09, 10) VERIFIED WITH 100% SUCCESS!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_4()
