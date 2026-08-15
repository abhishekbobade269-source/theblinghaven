import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_21():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 21 (AR VIRTUAL TRY-ON STUDIO) AUDIT')
    print('======================================================================')

    # 1. Test Public Overlays API
    with urllib.request.urlopen('http://localhost:4000/try-on/overlays') as resp:
        overlays = json.loads(resp.read().decode())['data']
        print(f'  [PASS] AR Overlay Asset Library: Ingested {len(overlays)} transparent jewelry models')
        for o in overlays:
            print(f'         - {o["title"]} ({o["category"]}) -> Anchor: {o["anchorType"]}, Price: CAD ${o["basePriceCad"]}')

    # 2. Test Share Virtual Look Consultation with Advisor
    consult_payload = json.dumps({
        'clientName': 'Duchess Genevieve of York',
        'clientEmail': 'g.york@luxury-patrons.ca',
        'clientPhone': '+1 416 922 8800',
        'productSku': 'TBH-RING-001',
        'productTitle': 'The Sovereign 2.5ct Cushion Solitaire Ring',
        'category': 'RING',
        'scaleApplied': 1.10,
        'rotationApplied': 12.0,
        'skinToneSelected': 'WARM_OLIVE',
        'preferredSalon': 'Toronto Yorkville Haute Salon',
        'notes': 'Requested hand fitting review before acquiring for anniversary celebration.'
    }).encode('utf-8')
    req_consult = urllib.request.Request(
        'http://localhost:4000/try-on/share-consultation',
        data=consult_payload,
        headers={'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req_consult) as resp:
        consult_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Look Consultation Dispatched: ID #{consult_res["id"]}')
        print(f'         - Client: {consult_res["clientName"]} ({consult_res["clientEmail"]})')
        print(f'         - Creation: {consult_res["productTitle"]} (Scale: {consult_res["scaleApplied"]}x, Angle: {consult_res["rotationApplied"]}°)')
        print(f'         - Salon Desk: {consult_res["preferredSalon"]}')

    # 3. Test Admin Review & Status Update
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    req_list = urllib.request.Request(
        'http://localhost:4000/admin/try-on/consultations',
        headers={'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_list) as resp:
        all_consults = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Admin Consultation Ledger: {len(all_consults)} active look consultations found')

    # Update status to APPOINTMENT_SCHEDULED
    status_payload = json.dumps({'status': 'APPOINTMENT_SCHEDULED'}).encode('utf-8')
    req_status = urllib.request.Request(
        f'http://localhost:4000/admin/try-on/consultations/{consult_res["id"]}/status',
        data=status_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='PUT'
    )
    with urllib.request.urlopen(req_status) as resp:
        updated_status = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Consultation Status Updated: {updated_status["status"]} for {updated_status["clientName"]}')

    # 4. Verify Routes
    for url in ['http://localhost:3001/try-on', 'http://localhost:3000/try-on']:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 21 (AR VIRTUAL TRY-ON STUDIO) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_21()
