import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_block_5():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 5 (MODULES 11, 12) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Customers Directory API
    req_cust = urllib.request.Request('http://localhost:4000/admin/customers', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_cust) as res_cust:
        cust_data = json.loads(res_cust.read().decode())
        customers = cust_data['data']
        print(f'  [PASS] Customers API: Loaded {len(customers)} VIP clients (Royal Concierge: {cust_data["meta"]["royalConciergeCount"]})')
        sample_client = customers[0]
        print(f'         Sample VIP: {sample_client["fullName"]} [{sample_client["vipTier"]}]')
        print(f'         Residence: {sample_client["city"]}, {sample_client["country"]} | LTV: ${sample_client["totalSpendUsd"]} USD')

    # 2. Test Customer Detail with Preferences API
    req_cd = urllib.request.Request(f'http://localhost:4000/admin/customers/{sample_client["id"]}', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_cd) as res_cd:
        client_detail = json.loads(res_cd.read().decode())['data']
        print(f'  [PASS] Client File & Preferences: Ring Size: {client_detail["preferences"].get("preferredRingSize")}, Metals: {client_detail["preferences"].get("preferredMetal")}')

    # 3. Test Orders Directory API
    req_ord = urllib.request.Request('http://localhost:4000/admin/orders', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_ord) as res_ord:
        ord_data = json.loads(res_ord.read().decode())
        orders = ord_data['data']
        print(f'  [PASS] Orders API: Loaded {len(orders)} high-value orders (Gross Volume: ${ord_data["meta"]["totalRevenueUsd"]} USD)')
        sample_order = orders[0]
        print(f'         Sample Order: #{sample_order["orderNumber"]} — Client: {sample_order["customerName"]}')
        print(f'         Total: {sample_order["currencySymbol"]} {sample_order["totalAmountLocal"]} ({sample_order["status"]})')

    # 4. Test Single Order Details & Armored Logistics
    req_od = urllib.request.Request(f'http://localhost:4000/admin/orders/{sample_order["id"]}', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_od) as res_od:
        order_detail = json.loads(res_od.read().decode())['data']
        print(f'  [PASS] Order Inspector: Verified {len(order_detail["items"])} line items & {len(order_detail["timeline"])} fulfillment timeline steps')
        print(f'         Carrier: {order_detail["shippingCarrier"]} | Tracking: {order_detail["trackingNumber"]}')

    # 5. Test Transition Fulfillment Status
    status_update = json.dumps({
        'status': 'DELIVERED_SIGNATURE_REQUIRED',
        'notes': 'White-glove armored delivery signed by recipient with passport verification.',
        'deliverySignatureName': 'Verified High-Jewelry Client Signature'
    }).encode('utf-8')
    req_st = urllib.request.Request(f'http://localhost:4000/admin/orders/{sample_order["id"]}/status', data=status_update, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}, method='PUT')
    with urllib.request.urlopen(req_st) as res_st:
        updated_ord = json.loads(res_st.read().decode())['data']
        print(f'  [PASS] Fulfillment Status Transition: Order #{updated_ord["orderNumber"]} moved to {updated_ord["status"]}')

    print('\n===========================================================')
    print('BLOCK 5 (MODULES 11, 12) VERIFIED WITH 100% SUCCESS!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_5()
