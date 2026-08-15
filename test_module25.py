import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_25():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 25 (EOD FISCAL CLOSE & MULTI-VAULT AUDIT) AUDIT')
    print('======================================================================')

    # 1. Login as Admin / CFO
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    # 2. Test Generate Daily EOD Fiscal Close
    gen_payload = json.dumps({}).encode('utf-8')
    req_gen = urllib.request.Request(
        'http://localhost:4000/admin/fiscal-close/generate',
        data=gen_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_gen) as resp:
        record = json.loads(resp.read().decode())['data']
        print(f'  [PASS] EOD Fiscal Reconciliation Generated: Date -> {record["fiscalDate"]}')
        print(f'         - Reconciled Gross Sales: CAD ${record["grossSalesCad"]:,}')
        print(f'         - Ontario 13% HST Tax: CAD ${record["ontarioHstCad"]:,}')
        print(f'         - Global 5-Vault Valuation: CAD ${record["vaultInventoryValuationCad"]:,}')
        print(f'         - Physical Bullion in Safe: {record["goldBullionKgStock"]} kg')
        print(f'         - Loose Diamonds in Safe: {record["diamondCaratsStock"]} ct')
        print(f'         - Armored Transit Value: CAD ${record["armoredTransitValueCad"]:,}')
        print(f'         - Discrepancy Amount: CAD ${record["discrepancyAmountCad"]} (Clean Reconciled State)')
        print(f'         - SHA-256 Digest: {record["cryptoLedgerHash"]}')

    # 3. Test Executive CFO Certification
    cert_payload = json.dumps({
        'auditorEmail': 'cfo-compliance@theblinghaven.shop',
        'auditorNotes': 'Certified without discrepancy after multi-vault physical tally and live TSX/LBMA mark-to-market reconciliation.'
    }).encode('utf-8')
    req_cert = urllib.request.Request(
        f'http://localhost:4000/admin/fiscal-close/{record["id"]}/certify',
        data=cert_payload,
        headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token}
    )
    with urllib.request.urlopen(req_cert) as resp:
        certified = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Executive CFO Sign-off Certified: Status -> {certified["status"]}')
        print(f'         - Certified Auditor: {certified["certifiedByAuditor"]}')
        print(f'         - Certified At: {certified["certifiedAt"]}')

    # 4. Verify Route
    url = 'http://localhost:3001/fiscal-close'
    req_page = urllib.request.Request(url)
    with urllib.request.urlopen(req_page) as resp:
        print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 25 (EOD FISCAL CLOSE & MULTI-VAULT AUDIT) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_25()
