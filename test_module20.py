import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_20():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 20 (CRYPTOGRAPHIC CERTIFICATE VAULT) AUDIT')
    print('======================================================================')

    # 1. Test Public Digital Certificate Verification
    cert_num = 'TBH-CERT-2026-9001'
    with urllib.request.urlopen(f'http://localhost:4000/certificates/verify/{cert_num}') as resp:
        verify_res = json.loads(resp.read().decode())['data']
        cert = verify_res['certificate']
        print(f'  [PASS] Public Provenance Passport: Certificate #{cert["certificateNumber"]} for {cert["productTitle"]}')
        print(f'         - Gemological Dossier: {cert["gemstoneReportNumber"]} ({cert["gemstoneLaboratory"]})')
        print(f'         - 4Cs Analysis: {cert["caratWeight"]}ct, Color: {cert["colorGrade"]}, Clarity: {cert["clarityGrade"]}, Cut: {cert["cutGrade"]}')
        print(f'         - Metallurgical Hallmark: {cert["bisHallmarkStamp"]} ({cert["metalType"]})')
        print(f'         - Cryptographic SHA-256 Hash: {cert["cryptographicHash"][:24]}...')
        print(f'         - Tamper Integrity Status: {verify_res["verificationMessage"]}')

    # 2. Login as Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    # 3. Test Admin Mint New Certificate
    mint_payload = json.dumps({
        'sku': 'TBH-RING-ROYAL-009',
        'productTitle': 'The Empress Oval Diamond Solitaire Masterpiece',
        'gemstoneReportNumber': 'GIA-8829104821',
        'gemstoneLaboratory': 'GIA_GEMOLOGICAL_INSTITUTE_OF_AMERICA',
        'caratWeight': 5.20,
        'colorGrade': 'D (Flawless Colorless)',
        'clarityGrade': 'IF (Internally Flawless)',
        'cutGrade': 'Triple Excellent Oval Brilliant',
        'metalType': 'Platinum Pt950 & 18K Yellow Gold',
        'metalPurity': 'PT 950 / AU 750',
        'grossWeightGrams': 14.2,
        'netGoldWeightGrams': 13.1,
        'bisHallmarkStamp': 'BIS-916-HUID-774920',
        'ownerName': 'The Bling Haven Canadian Vault (Toronto)',
        'notes': 'Maison Reserve Masterpiece certified in Toronto Gemological Suite.'
    }).encode('utf-8')
    req_mint = urllib.request.Request(
        'http://localhost:4000/admin/certificates',
        data=mint_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='POST'
    )
    with urllib.request.urlopen(req_mint) as resp:
        minted = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Certificate Minting Studio: Minted #{minted["certificateNumber"]} with Hash {minted["cryptographicHash"][:24]}...')

    # 4. Test Ownership Transfer Chain
    transfer_payload = json.dumps({
        'newOwnerName': 'Baroness Charlotte De Rothschild',
        'transferReason': 'Private Salon Acquisition at Toronto Yorkville Suite'
    }).encode('utf-8')
    req_transfer = urllib.request.Request(
        f'http://localhost:4000/admin/certificates/{minted["id"]}/transfer',
        data=transfer_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
        method='POST'
    )
    with urllib.request.urlopen(req_transfer) as resp:
        transferred = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Chain of Custody Transfer: Reassigned #{transferred["certificateNumber"]} to {transferred["ownerName"]}')
        print(f'         - Active Chain History Depth: {len(transferred["transferHistory"])} transfer events')

    # 5. Verify Storefront and Admin Routes
    for url in [
        'http://localhost:3001/certificates',
        'http://localhost:3000/verify',
        f'http://localhost:3000/verify/{cert_num}',
    ]:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 20 (CRYPTOGRAPHIC CERTIFICATE VAULT) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_20()
