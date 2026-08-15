import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def test_storefront():
    print('======================================================================')
    print('THE BLING HAVEN - FLAGSHIP CONSUMER STOREFRONT & FULL PLATFORM AUDIT')
    print('======================================================================')

    # 1. Test Next.js Storefront Server Pages on http://localhost:3000
    pages = ['/', '/catalog', '/bespoke', '/concierge', '/checkout', '/track', '/about']
    for p in pages:
        req = urllib.request.Request(f'http://localhost:3000{p}')
        with urllib.request.urlopen(req) as resp:
            status = resp.getcode()
            print(f'  [PASS] Storefront Route: http://localhost:3000{p} (HTTP {status})')

    # 2. Test Catalog & Homepage APIs
    with urllib.request.urlopen('http://localhost:4000/catalog/products?limit=5') as resp:
        products = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Catalog Product Feed: Loaded {len(products)} luxury pieces')
        sample_prod = products[0]
        print(f'         Sample: {sample_prod["title"]} (${sample_prod["basePriceUsd"]} USD) | Slug: {sample_prod["slug"]}')

    with urllib.request.urlopen(f'http://localhost:4000/catalog/products/{sample_prod["slug"]}') as resp:
        prod_detail = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Product Detail API: Loaded {prod_detail["title"]} with specs: {prod_detail["specs"]["metalType"]} / {prod_detail["specs"]["hallmarkCertificate"]}')

    # 3. Test Bespoke 3D Atelier Submission from Storefront
    bespoke_payload = json.dumps({
        'clientName': 'Lady Eleanor Vance',
        'clientEmail': 'e.vance@mayfair-holdings.co.uk',
        'clientPhone': '+44 20 7946 0199',
        'clientCountry': 'United Kingdom',
        'category': 'Ring',
        'metalPreference': 'Platinum Pt950',
        'gemstonePreference': 'D-Flawless Type IIa Diamond',
        'estimatedCaratWeight': 4.5,
        'diamondShape': 'Emerald Cut',
        'ringOrWristSize': 'US 6.5',
        'engravingText': 'Eleanor & Henry • 2026',
        'budgetRangeUsd': '$50,000 - $100,000 USD',
        'designBrief': 'Vintage Art Deco platinum halo with tapered baguette shoulders and hidden diamond collar.'
    }).encode('utf-8')
    req_bespoke = urllib.request.Request('http://localhost:4000/bespoke/submit', data=bespoke_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_bespoke) as resp:
        bespoke_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Bespoke 3D Atelier Submission: Generated Commission #{bespoke_res["referenceNumber"]}')

    # 4. Test Private Concierge Salon Reservation
    concierge_payload = json.dumps({
        'fullName': 'Sheikh Mansoor Al-Nahyan',
        'email': 'mansoor@alnahyan-office.ae',
        'phone': '+971 50 111 2233',
        'country': 'United Arab Emirates',
        'type': 'PRIVATE_SALON_APPOINTMENT',
        'subject': 'Private Champagne Viewing for Royal Bridal Parure',
        'message': 'Requesting private salon suite for family bridal parure selection.',
        'preferredSalonLocation': 'Dubai Flagship Salon (DIFC)',
        'preferredAppointmentDate': '2026-09-01T16:00:00.000Z'
    }).encode('utf-8')
    req_concierge = urllib.request.Request('http://localhost:4000/concierge/inquire', data=concierge_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_concierge) as resp:
        concierge_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Concierge Desk Booking: Reserved for {concierge_res["fullName"]} at {concierge_res["preferredSalonLocation"]}')

    # 5. Test VIP Coupon Code Validation
    coupon_payload = json.dumps({
        'code': 'ROYAL2026',
        'cartSubtotalUsd': 32000,
        'vipTier': 'ROYAL_CONCIERGE'
    }).encode('utf-8')
    req_coupon = urllib.request.Request('http://localhost:4000/promotions/validate', data=coupon_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_coupon) as resp:
        coupon_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] VIP Coupon Engine: Code {coupon_res["code"]} -> Discount: -${coupon_res["discountAmountUsd"]} USD ({coupon_res["discountMessage"]})')

    # 6. Test Cross-Border Tax Calculator (UK 20% VAT)
    tax_payload = json.dumps({
        'countryCode': 'GB',
        'subtotalUsd': 30400,
        'currencyCode': 'GBP'
    }).encode('utf-8')
    req_tax = urllib.request.Request('http://localhost:4000/taxes/calculate', data=tax_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_tax) as resp:
        tax_res = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Cross-Border Tax Engine: {tax_res["countryName"]} ({tax_res["taxName"]} {tax_res["taxRatePercent"]}%)')
        print(f'         Tax: ${tax_res["taxAmountUsd"]} USD | Final: {tax_res["formattedTotalLocal"]} ({tax_res["currencyCode"]})')

    # 7. Test Customer Order Placement & Tracking Lookup
    order_payload = json.dumps({
        'customerName': 'Lady Eleanor Vance',
        'customerEmail': 'e.vance@mayfair-holdings.co.uk',
        'customerPhone': '+44 20 7946 0199',
        'customerVipTier': 'ROYAL_CONCIERGE',
        'currencyCode': 'GBP',
        'subtotalUsd': 30400,
        'totalAmountUsd': 36480,
        'totalAmountLocal': 29395,
        'shippingCarrier': 'FERRARI_GROUP_SECURE',
        'shippingAddress': {
            'fullName': 'Lady Eleanor Vance',
            'street': '22 Berkeley Square, Mayfair',
            'city': 'London',
            'country': 'United Kingdom',
            'postalCode': 'W1J 6EH'
        },
        'items': [{
            'productId': sample_prod['id'],
            'sku': sample_prod['sku'],
            'title': sample_prod['title'],
            'primaryImageUrl': sample_prod['primaryImageUrl'],
            'quantity': 1,
            'unitPriceUsd': 32000,
            'totalPriceUsd': 32000,
            'selectedRingSize': 'US 6.5',
            'customEngraving': 'Eleanor & Henry • 2026',
            'hallmarkCertificate': 'BIS 916 & GIA Triple Ex'
        }]
    }).encode('utf-8')
    req_order = urllib.request.Request('http://localhost:4000/orders/checkout', data=order_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_order) as resp:
        placed_order = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Live Order Placement: Generated Order #{placed_order["orderNumber"]} via {placed_order["shippingCarrier"]}')

    # Verify Order Tracking Lookup
    with urllib.request.urlopen(f'http://localhost:4000/orders/track/{placed_order["orderNumber"]}') as resp:
        tracked = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Order Tracking Verification: Order #{tracked["orderNumber"]} verified with {len(tracked["timeline"])} timeline milestone(s)')

    print('\n======================================================================')
    print('ALL STOREFRONT & PLATFORM TEST SUITES PASSED WITH 100% SUCCESS!')
    print('======================================================================')

if __name__ == '__main__':
    test_storefront()
