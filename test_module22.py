import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_22():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 22 (VIP MEMBER LOUNGE & SECRET DROPS) AUDIT')
    print('======================================================================')

    # 1. Test VIP Passcode Gate Authentication
    auth_payload = json.dumps({'invitationKey': 'BLING-VIP-TORONTO-2026'}).encode('utf-8')
    req_auth = urllib.request.Request('http://localhost:4000/vip/authenticate', data=auth_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_auth) as resp:
        member = json.loads(resp.read().decode())['data']
        print(f'  [PASS] VIP Security Gate: Authenticated {member["name"]}')
        print(f'         - Patron Tier: {member["tier"]}')
        print(f'         - Assigned Director: {member["assignedAdvisor"]}')
        print(f'         - Salon Suite: {member["preferredSalon"]}')
        print(f'         - Lifetime Spend: CAD ${member["totalSpendCad"]:,}')

    # 2. Test Secret Vault Drops Showcase
    with urllib.request.urlopen('http://localhost:4000/vip/secret-drops') as resp:
        drops = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Secret Vault Drops: {len(drops)} 1-of-1 creations active in reserve')
        for d in drops:
            print(f'         - {d["title"]} ({d["tagline"]}) -> CAD ${d["priceCad"]:,} [{d["allocationStatus"]}]')

    # 3. Test Place Acquisition Hold on Secret Drop
    target_drop = drops[0]
    reserve_payload = json.dumps({
        'clientEmail': member['email'],
        'clientName': member['name'],
        'dropId': target_drop['id'],
        'preferredSalon': member['preferredSalon'],
    }).encode('utf-8')
    req_reserve = urllib.request.Request('http://localhost:4000/vip/reserve-drop', data=reserve_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_reserve) as resp:
        reserved_drop = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Private Acquisition Hold Placed: {reserved_drop["title"]} -> Status: {reserved_drop["allocationStatus"]}')

    # 4. Test 1-on-1 Client Chat Message
    chat_payload = json.dumps({
        'clientEmail': member['email'],
        'clientName': member['name'],
        'message': 'Good afternoon Alistair. I have placed an acquisition hold on the Golconda 12.8ct parure. Looking forward to our Thursday private viewing.',
        'salonLocation': member['preferredSalon']
    }).encode('utf-8')
    req_chat = urllib.request.Request('http://localhost:4000/vip/chat/send', data=chat_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_chat) as resp:
        sent_msg = json.loads(resp.read().decode())['data']
        print(f'  [PASS] VIP Client Message Dispatched: "{sent_msg["message"][:45]}..."')

    # 5. Test Admin Advisor Reply
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    reply_payload = json.dumps({
        'clientEmail': member['email'],
        'advisorName': 'Lord Alistair Sterling (Senior Director)',
        'message': 'Dear Baroness, the vault vault suite at 100 Bloor St W is reserved exclusively for you. The parure and champagne are prepared.'
    }).encode('utf-8')
    req_reply = urllib.request.Request(
        'http://localhost:4000/admin/vip/chat/reply',
        data=reply_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_reply) as resp:
        reply_msg = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Advisor Director Reply Dispatched: "{reply_msg["message"][:45]}..."')

    # 6. Verify Routes
    for url in ['http://localhost:3001/vip', 'http://localhost:3000/vip-lounge']:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 22 (VIP MEMBER LOUNGE & SECRET DROPS) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_22()
