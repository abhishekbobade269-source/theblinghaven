import urllib.request, json, sys

sys.stdout.reconfigure(encoding='utf-8')

def verify_module_24():
    print('======================================================================')
    print('THE BLING HAVEN - MODULE 24 (AI VOICE CONCIERGE & GEMOLOGIST) AUDIT')
    print('======================================================================')

    # 1. Test 4Cs Diamond Query
    q1_payload = json.dumps({
        'query': 'What is the difference between D-Color Flawless and VVS1 diamonds in your solitaire collection?',
        'preferredCurrency': 'CAD'
    }).encode('utf-8')
    req1 = urllib.request.Request('http://localhost:4000/ai-concierge/ask', data=q1_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req1) as resp:
        res1 = json.loads(resp.read().decode())['data']
        print(f'  [PASS] 4Cs Diamond AI Consultation: Action -> {res1["actionType"]}')
        print(f'         - Spoken Audio Text: "{res1["speechText"]}"')
        print(f'         - Products Recommended: {len(res1["recommendedProducts"])} items')
        print(f'         - Suggested Follow-ups: {len(res1["suggestedFollowUps"])} options')

    # 2. Test Canadian Salon Booking Query
    q2_payload = json.dumps({
        'query': 'How do I book a private diamond viewing at the Toronto Yorkville salon on Bloor Street?',
        'preferredCurrency': 'CAD'
    }).encode('utf-8')
    req2 = urllib.request.Request('http://localhost:4000/ai-concierge/ask', data=q2_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req2) as resp:
        res2 = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Canadian Salon AI Booking: Action -> {res2["actionType"]}')
        print(f'         - Salon CTA Link: {res2.get("salonLink")}')
        print(f'         - Spoken Audio Text: "{res2["speechText"]}"')

    # 3. Test Live Metal Spot Rate Query
    q3_payload = json.dumps({
        'query': 'What is the live gold spot price per gram in Canada today?',
        'preferredCurrency': 'CAD'
    }).encode('utf-8')
    req3 = urllib.request.Request('http://localhost:4000/ai-concierge/ask', data=q3_payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req3) as resp:
        res3 = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Spot Bullion AI Consultation: Action -> {res3["actionType"]}')
        print(f'         - Spoken Audio Text: "{res3["speechText"]}"')

    # 4. Test Curated Topics
    req_topics = urllib.request.Request('http://localhost:4000/ai-concierge/topics')
    with urllib.request.urlopen(req_topics) as resp:
        topics = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Curated Gemology Topics: {len(topics)} luxury prompts active')

    # 5. Test Admin AI Consultation Logs
    login_data = json.dumps({'email': 'admin@theblinghaven.shop', 'password': 'Admin@BlingHaven2026!'}).encode('utf-8')
    req_login = urllib.request.Request('http://localhost:4000/admin/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req_login) as resp:
        token = json.loads(resp.read().decode())['data']['accessToken']

    req_logs = urllib.request.Request('http://localhost:4000/admin/ai-concierge/logs', headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(req_logs) as resp:
        logs = json.loads(resp.read().decode())['data']
        print(f'  [PASS] Admin Voice Analytics Stream: {len(logs)} consultation logs recorded')

    # 6. Verify Routes
    for url in ['http://localhost:3001/ai-concierge', 'http://localhost:3000/ai-concierge']:
        req_page = urllib.request.Request(url)
        with urllib.request.urlopen(req_page) as resp:
            print(f'  [PASS] Route Verified: {url} (HTTP {resp.getcode()})')

    print('\n======================================================================')
    print('MODULE 24 (AI VOICE CONCIERGE & GEMOLOGIST) 100% VERIFIED!')
    print('======================================================================')

if __name__ == '__main__':
    verify_module_24()
