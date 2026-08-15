import urllib.request, json

def verify_block_3():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 3 (MODULES 06, 07, 08) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Categories API
    req_cats = urllib.request.Request('http://localhost:4000/admin/catalog/categories', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_cats) as res_c:
        cats = json.loads(res_c.read().decode())['data']
        print(f'  [PASS] Categories API: Loaded {len(cats)} luxury categories:')
        for c in cats:
            print(f'         - {c["name"]} ({c["slug"]}): {c["productCount"]} SKUs')

    # 2. Test Collections API
    req_cols = urllib.request.Request('http://localhost:4000/admin/catalog/collections', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_cols) as res_col:
        cols = json.loads(res_col.read().decode())['data']
        print(f'  [PASS] Collections API: Loaded {len(cols)} premier collections:')
        for col in cols:
            print(f'         - {col["name"]} [{col["tagline"]}]: {col["productCount"]} SKUs')

    # 3. Test Products Directory API
    req_prods = urllib.request.Request('http://localhost:4000/admin/catalog/products', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_prods) as res_p:
        prods_data = json.loads(res_p.read().decode())
        prods = prods_data['data']
        total = prods_data['meta']['total']
        print(f'  [PASS] Products Catalog API: Loaded {total} master jewelry SKUs!')
        sample = prods[0]
        print(f'         Sample SKU: {sample["sku"]} — "{sample["title"]}"')
        print(f'         Price: ${sample["basePriceUsd"]} USD | Metal: {sample["specs"]["metalType"]} ({sample["specs"]["grossWeightGrams"]}g)')
        print(f'         Primary Image: {sample["primaryImageUrl"]}')

    # 4. Test Public Storefront Product Detail by Slug
    req_pub = urllib.request.Request('http://localhost:4000/catalog/products/' + sample['slug'])
    with urllib.request.urlopen(req_pub) as res_pub:
        pub_prod = json.loads(res_pub.read().decode())['data']
        print(f'  [PASS] Public Storefront Product Endpoint: Retrieved "{pub_prod["title"]}"')
        assert pub_prod['sku'] == sample['sku']

    # 5. Test Product Creation API
    new_sku_data = json.dumps({
        'sku': 'TBH-TST-999',
        'title': 'The Grand Imperial Diamond Tiara',
        'description': 'Handcrafted with 14.5 carats of VVS diamonds and 18K solid white gold.',
        'basePriceUsd': 45000.0,
        'categoryId': cats[0]['id'],
        'specs': {
            'metalType': '18K White Gold',
            'metalPurity': '18K (750)',
            'grossWeightGrams': 95.0,
            'netWeightGrams': 82.0,
            'diamondWeightCarats': 14.5,
            'hallmarkCertificate': 'GIA Certified & BIS Hallmarked'
        },
        'primaryImageUrl': sample['primaryImageUrl'],
        'stockQuantity': 1,
        'status': 'ACTIVE'
    }).encode('utf-8')
    req_create = urllib.request.Request('http://localhost:4000/admin/catalog/products', data=new_sku_data, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_create) as res_cr:
        created = json.loads(res_cr.read().decode())['data']
        print(f'  [PASS] Successfully created new jewelry SKU: {created["sku"]} (ID: {created["id"]})')

    print('\n===========================================================')
    print('BLOCK 3 (MODULES 06, 07, 08) VERIFIED WITH 100% SUCCESS!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_3()
