import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_23():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 23 (MULTI-VAULT ARMORED FREIGHT NETWORK) AUDIT')
    print('======================================================================')

    # 1. Login as Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    # 2. Test Vaults Directory
    req_vaults = urllib.request.Request('http://localhost:4000/admin/vaults', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_vaults) as resp:
        vaults = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Multi-Vault Network: Loaded {len(vaults)} international high-security depositories')
        for v in vaults:
            print(f'         - {v["name"]} ({v["city"]}, {v["country"]}) -> CAD ${v["totalAssetValueCad"]:,} | Gold: {v["goldBullionKg"]}kg | Diamonds: {v["looseDiamondCarats"]}ct')

    toronto_vault = next(v for v in vaults if v['code'] == 'TORONTO_YORKVILLE')
    zurich_vault = next(v for v in vaults if v['code'] == 'ZURICH_FREEPORT')

    # 3. Test Dispatch New Armored Transfer
    dispatch_payload = json.dumps({
        'originVaultId': toronto_vault['id'],
        'destinationVaultId': zurich_vault['id'],
        'carrierName': 'FERRARI_GROUP_ARMORED',
        'courierBadgeId': 'FERRARI-SEC-CAN-8802',
        'insuredValueCad': 4200000.0,
        'itemsCount': 8,
        'itemsSummary': '5x 1kg LBMA Gold Bars + 3x 10ct D-Flawless Cushion Diamond Solitaires',
        'notes': 'High-security diplomatic freight transfer for Swiss Zurich FreePort reserve rebalance.'
    }).encode('utf-8')
    req_dispatch = urllib.request.Request(
        'http://localhost:4000/admin/vaults/transfers',
        data=dispatch_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_dispatch) as resp:
        transfer = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Armored Manifest Dispatched: #{transfer["manifestNumber"]}')
        print(f'         - Route: {transfer["originVaultName"].split()[0]} -> {transfer["destinationVaultName"].split()[0]}')
        print(f'         - Carrier: {transfer["carrierName"]} (Courier: {transfer["courierBadgeId"]})')
        print(f'         - Insured Value: CAD ${transfer["insuredValueCad"]:,} ({transfer["insurancePolicyNumber"]})')
        print(f'         - Waypoint: {transfer["currentWaypoint"]}')

    # 4. Test Update Waypoint & Status
    status_payload = json.dumps({
        'transferStatus': 'CUSTOMS_PORT_INSPECTION',
        'currentWaypoint': 'Swiss Federal Customs Armored Depository, Zurich Airport ZRH'
    }).encode('utf-8')
    req_status = urllib.request.Request(
        f'http://localhost:4000/admin/vaults/transfers/{transfer["id"]}/status',
        data=status_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='PUT'
    )
    with urllib.request.urlopen(req_status) as resp:
        updated = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Armored Transit Waypoint Updated: {updated["transferStatus"]} -> {updated["currentWaypoint"]}')

    # 5. Verify Route
    url = 'http://localhost:3001/vaults'
    req_page = urllib.request.Request(url)
    with urllib.request.urlopen(req_page) as resp:
        print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 23 (MULTI-VAULT ARMORED FREIGHT NETWORK) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_23()
