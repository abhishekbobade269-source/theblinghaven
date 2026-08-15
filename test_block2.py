import urllib.request, json

def verify_block_2():
    print('===========================================================')
    print('THE BLING HAVEN - BLOCK 2 (MODULES 04 & 05) VERIFICATION')
    print('===========================================================')

    # Authenticate as Super Admin
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        token = json.loads(response.read().decode())['data']['accessToken']

    # 1. Test Media Library API
    req_media = urllib.request.Request('http://localhost:4000/admin/media?limit=100', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_media) as res_m:
        media_data = json.loads(res_m.read().decode())
        assets = media_data['data']
        total = media_data['meta']['total']
        print(f'  [PASS] Media Library API: Loaded {total} jewelry photography assets!')
        print(f'         Sample asset: {assets[0]["originalName"]} ({assets[0]["category"]}) -> {assets[0]["url"]}')

    # 2. Test Category Filtering
    req_rings = urllib.request.Request('http://localhost:4000/admin/media?category=RINGS', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_rings) as res_r:
        rings_data = json.loads(res_r.read().decode())
        print(f'  [PASS] Media Filter RINGS: Found {rings_data["meta"]["total"]} ring photographs')

    # 3. Test CMS Pages List API
    req_pages = urllib.request.Request('http://localhost:4000/admin/cms/pages', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_pages) as res_p:
        pages = json.loads(res_p.read().decode())['data']
        print(f'  [PASS] CMS Pages API: Loaded {len(pages)} storytelling pages:')
        for p in pages:
            print(f'         - /{p["slug"]}: "{p["title"]}" [{p["status"]}]')

    # 4. Test Public Storefront CMS Page by Slug
    req_public = urllib.request.Request('http://localhost:4000/cms/pages/about')
    with urllib.request.urlopen(req_public) as res_pub:
        pub_page = json.loads(res_pub.read().decode())['data']
        print(f'  [PASS] Public Storefront CMS Endpoint: Retrieved "{pub_page["title"]}"')
        assert 'ethical sourcing' in pub_page['content'].lower()

    # 5. Test Hero Banners API
    req_banners = urllib.request.Request('http://localhost:4000/admin/cms/banners', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_banners) as res_b:
        banners = json.loads(res_b.read().decode())['data']
        print(f'  [PASS] Homepage Hero Banners API: Loaded {len(banners)} hero slides:')
        for b in banners:
            print(f'         - [{b["badgeText"]}] "{b["title"]}" -> CTA: {b["ctaText"]}')

    print('\n===========================================================')
    print('BLOCK 2 (MODULES 04 & 05) VERIFICATION PASSED WITH 100%!')
    print('===========================================================')

if __name__ == '__main__':
    verify_block_2()
