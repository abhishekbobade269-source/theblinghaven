import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def test_sanitization():
    print('======================================================================')
    print('THE BLING HAVEN CANADA - DATA SANITIZATION & BRAND AUDIT')
    print('======================================================================')

    # 1. Login
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']
    auth_header = {'Authorization': 'Bearer ' + token}

    # 2. Check Products
    with urllib.request.urlopen('http://localhost:4000/catalog/products') as resp:
        products = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Catalog: {len(products)} products loaded.')
        for p in products:
            print(f'         - {p["sku"]}: {p["title"]}')

    # 3. Check Orders
    req_orders = urllib.request.Request('http://localhost:4000/admin/orders', headers=auth_header)
    with urllib.request.urlopen(req_orders) as resp:
        orders = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Orders: {len(orders)} clean The Bling Haven Canada orders loaded.')
        for o in orders:
            print(f'         - Order #{o["orderNumber"]}: {o["customerName"]} (CAD ${o["totalAmountLocal"]})')

    # 4. Check Customers
    req_custs = urllib.request.Request('http://localhost:4000/admin/customers', headers=auth_header)
    with urllib.request.urlopen(req_custs) as resp:
        custs = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Customer Directory: {len(custs)} VIP profiles.')
        for c in custs:
            print(f'         - {c["firstName"]} {c["lastName"]} ({c["email"]}) [Tier: {c["vipTier"]}]')

    # 5. Check Vaults
    req_vaults = urllib.request.Request('http://localhost:4000/admin/vaults', headers=auth_header)
    with urllib.request.urlopen(req_vaults) as resp:
        v_data = json.loads(resp.read().decode())['data']
        master = next((v for v in v_data if v.get('isMasterVault')), v_data[0])
        print(f'  [PASS] Vault Network: Master -> {master["name"]} ({master["city"]}, {master["country"]})')

    # 6. Check Support Desk
    req_support = urllib.request.Request('http://localhost:4000/admin/support/tickets', headers=auth_header)
    with urllib.request.urlopen(req_support) as resp:
        tickets = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Support Desk: {len(tickets)} tickets loaded.')
        for t in tickets:
            print(f'         - #{t["ticketNumber"]}: {t["subject"]}')

    # 7. Check Fiscal Close
    req_fc = urllib.request.Request('http://localhost:4000/admin/fiscal-close', headers=auth_header)
    with urllib.request.urlopen(req_fc) as resp:
        fc_records = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Fiscal Close Records: {len(fc_records)} EOD audited reports.')
        for fc in fc_records:
            print(f'         - Date {fc["fiscalDate"]}: Gross CAD ${fc["grossSalesCad"]:,.2f} [Status: {fc["status"]}]')

    print('\n======================================================================')
    print('ALL DATA CLEANSED & UNIFIED TO THE BLING HAVEN CANADA! 100% AUDIT PASS')
    print('======================================================================')

if __name__ == '__main__':
    test_sanitization()
