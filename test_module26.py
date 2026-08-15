import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_26():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 26 (CUSTOMER SUPPORT & TICKET DESK) AUDIT')
    print('======================================================================')

    # 1. Test Public Ticket Creation
    ticket_payload = json.dumps({
        'customerName': 'Countess Genevieve De Bourbon',
        'customerEmail': 'g.bourbon@geneva-private.ch',
        'customerPhone': '+41 22 710 4499',
        'category': 'PRODUCT_INQUIRY',
        'priority': 'URGENT_VIP',
        'subject': 'Inquiry regarding 1-of-1 Kashmir Sapphire Suite vault inspection in Zurich',
        'description': 'Bonjour. I would like to schedule a private vault viewing at the Zurich FreePort for the Kashmir Cornflower Sapphire parure before armored dispatch to Toronto.',
        'relatedProductSku': 'TBH-RNG-001'
    }).encode('utf-8')
    req_create = urllib.request.Request('http://localhost:4000/support/tickets', data=ticket_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_create) as resp:
        tkt = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Support Ticket Submitted: #{tkt["ticketNumber"]}')
        print(f'         - Customer: {tkt["customerName"]} ({tkt["customerEmail"]})')
        print(f'         - Category: {tkt["category"]} [Priority: {tkt["priority"]}]')
        print(f'         - Status: {tkt["status"]}')

    # 2. Test Public Ticket Tracking by Ticket Number
    req_track = urllib.request.Request(f'http://localhost:4000/support/tickets/track/{tkt["ticketNumber"]}')
    with urllib.request.urlopen(req_track) as resp:
        tracked = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Public Ticket Tracking: #{tracked["ticketNumber"]} successfully retrieved')
        print(f'         - Subject: "{tracked["subject"]}"')

    # 3. Test Admin Support Desk
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    req_admin_list = urllib.request.Request('http://localhost:4000/admin/support/tickets', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_admin_list) as resp:
        all_tickets = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Admin Ticket Inbox: {len(all_tickets)} active customer tickets loaded')

    # 4. Test Admin Reply & Internal Note
    reply_payload = json.dumps({
        'senderName': 'Lord Alistair Sterling (Senior Director)',
        'senderRole': 'SUPPORT_AGENT',
        'message': 'Dear Countess Genevieve, our Zurich FreePort curator has reserved private viewing salon suite 7 for you this Wednesday at 11:00 AM CET.',
        'isInternalNote': False
    }).encode('utf-8')
    req_reply = urllib.request.Request(
        f'http://localhost:4000/admin/support/tickets/{tkt["id"]}/reply',
        data=reply_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_reply) as resp:
        replied = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Advisor Reply Dispatched: Thread count -> {len(replied["responses"])} responses')

    # 5. Test Update Status to RESOLVED
    status_payload = json.dumps({
        'status': 'RESOLVED',
        'staffNotes': 'Viewing scheduled and security escort verified with Zurich Embraport.'
    }).encode('utf-8')
    req_status = urllib.request.Request(
        f'http://localhost:4000/admin/support/tickets/{tkt["id"]}/status',
        data=status_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='PUT'
    )
    with urllib.request.urlopen(req_status) as resp:
        resolved = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Ticket Status Updated: #{resolved["ticketNumber"]} -> {resolved["status"]}')

    # 6. Verify Routes
    for url in ['http://localhost:3001/support', 'http://localhost:3000/support']:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 26 (CUSTOMER SUPPORT & TICKET DESK) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_26()
