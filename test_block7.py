import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_block_7():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 7 (MODULES 15, 16) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Public Concierge Salon Inquiry Submission
    inquiry_data = json.dumps({
        'fullName': 'Baroness Sophie de Rothschild',
        'email': 'sophie.rothschild@geneva-trust.ch',
        'phone': '+41 22 819 9000',
        'country': 'Switzerland',
        'type': 'PRIVATE_SALON_APPOINTMENT',
        'subject': 'Private Viewing of D-Flawless Celestial High Solitaires in London Mayfair Salon',
        'message': 'Requesting private salon suite for bridal high jewelry selection.',
        'preferredSalonLocation': 'London Mayfair Atelier',
        'preferredAppointmentDate': '2026-04-10T14:00:00Z'
    }).encode('utf-8')
    req_pub_inq = urllib.request.Request('http://localhost:4000/concierge/inquire', data=inquiry_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_pub_inq) as res_pub:
        pub_inq = json.loads(res_pub.read().decode())['data']
        print(f'  [PASS] Public Concierge Submission: Created inquiry for {pub_inq["fullName"]} ({pub_inq["preferredSalonLocation"]})')

    # 2. Test Admin Concierge List & Manage
    req_admin_inq = urllib.request.Request('http://localhost:4000/admin/concierge', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_admin_inq) as res_ai:
        all_inq = json.loads(res_ai.read().decode())['data']
        print(f'  [PASS] Admin Concierge Listing: Retrieved {len(all_inq)} concierge inquiries & VIP appointments')

    # 3. Test Concierge Status Update
    update_inq_data = json.dumps({
        'status': 'APPOINTMENT_SCHEDULED',
        'assignedAdvisor': 'Madame Celine Laurent (Director)',
        'internalNotes': 'Confirmed VIP champagne suite in London salon.'
    }).encode('utf-8')
    req_up_inq = urllib.request.Request(f'http://localhost:4000/admin/concierge/{pub_inq["id"]}', data=update_inq_data, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}, method='PUT')
    with urllib.request.urlopen(req_up_inq) as res_up:
        updated_inq = json.loads(res_up.read().decode())['data']
        print(f'  [PASS] Concierge Appointment Scheduled: Status -> {updated_inq["status"]} (Advisor: {updated_inq["assignedAdvisor"]})')

    # 4. Test Public Bespoke Customizer Submission
    bespoke_data = json.dumps({
        'clientName': 'Prince Tariq Al-Mansoor',
        'clientEmail': 'tariq.mansoor@royal-palace.ae',
        'clientPhone': '+971 55 123 9999',
        'clientCountry': 'United Arab Emirates',
        'category': 'Ring',
        'metalPreference': 'Platinum Pt950 & 18K Yellow Gold',
        'gemstonePreference': '10.5ct Royal Blue Burmese Sapphire & Flawless Trapeze Diamonds',
        'estimatedCaratWeight': 10.5,
        'diamondShape': 'Cushion Cut',
        'ringOrWristSize': 'US 7.0',
        'engravingText': 'Tariq & Shaikha • 2026',
        'budgetRangeUsd': '$150,000 - $250,000 USD',
        'designBrief': 'High-jewelry bespoke ring with untreated vivid royal blue sapphire mounted in handmade platinum gallery.'
    }).encode('utf-8')
    req_pub_bes = urllib.request.Request('http://localhost:4000/bespoke/submit', data=bespoke_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_pub_bes) as res_bes:
        pub_bes = json.loads(res_bes.read().decode())['data']
        print(f'  [PASS] Public Bespoke Submission: Generated Commission #{pub_bes["referenceNumber"]} for {pub_bes["clientName"]}')

    # 5. Test Admin Bespoke Atelier Pipeline
    req_admin_bes = urllib.request.Request('http://localhost:4000/admin/bespoke', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_admin_bes) as res_ab:
        all_bes = json.loads(res_ab.read().decode())['data']
        print(f'  [PASS] Admin Bespoke Pipeline: Loaded {len(all_bes)} luxury commissions in atelier pipeline')

    # 6. Test Bespoke Project Quote & Goldsmith Bench Assignment
    update_bes_data = json.dumps({
        'status': 'CAD_DESIGN_IN_PROGRESS',
        'assignedGoldsmith': 'Master Artisan Pierre Dubois (Geneva)',
        'quotedAmountUsd': 185000.0,
        'estimatedCompletionWeeks': 8,
        'cadRenderUrl': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
        'atelierNotes': 'Burmese sapphire certified by SSEF/Gübelin. 3D CAD modeling commenced in Geneva atelier.'
    }).encode('utf-8')
    req_up_bes = urllib.request.Request(f'http://localhost:4000/admin/bespoke/{pub_bes["id"]}', data=update_bes_data, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}, method='PUT')
    with urllib.request.urlopen(req_up_bes) as res_ub:
        updated_bes = json.loads(res_ub.read().decode())['data']
        print(f'  [PASS] Bespoke Atelier Quote & Goldsmith Assigned:')
        print(f'         Quote: ${updated_bes["quotedAmountUsd"]} USD | Goldsmith: {updated_bes["assignedGoldsmith"]} | Stage: {updated_bes["status"]}')

    print('\n===========================================================')
    print('BLOCK 7 (MODULES 15, 16) VERIFIED WITH 100% SUCCESS!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_7()
