import html
import json
import logging
import os
import re

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATTACKS_JSON_PATH = os.path.join(PROJECT_ROOT, 'web', 'src', 'data', 'attacks.json')

RANSOMWARE_LIVE_URL = 'https://api-pro.ransomware.live/victims/'
BEZPIECZNEDANE_URL = 'https://bezpiecznedane.gov.pl/historia-wyciekow'
BEZPIECZNEDANE_API_URL = 'https://bezpiecznedane.gov.pl/api/proxy/raytha/contentitems/last_leaks'
HIBP_BREACHES_URL = 'https://haveibeenpwned.com/api/v3/breaches'
HIBP_USER_AGENT = 'ZabezpieczSie.pl-CyberatakiScraper (https://www.zabezpieczsie.pl)'

# HIBP has no country field. Breaches whose Domain doesn't end in .pl but are
# still known Polish companies/incidents (confirmed manually against HIBP's
# own breach descriptions, which explicitly say "Polish" for each of these).
POLISH_BREACH_NAMES = {
    'CDProjektRed',
    'MoreleNet',
    'Paidwork',
    'CERTPolandPhish',
    'PolishCredentials',
}

ONION_URL_PATTERN = re.compile(r'\S*\.onion\S*', re.IGNORECASE)
HTML_TAG_PATTERN = re.compile(r'<[^>]+>')


def strip_html(text):
    if not text:
        return None
    text = HTML_TAG_PATTERN.sub('', text)
    text = html.unescape(text)
    return ' '.join(text.split()) or None


def sanitize_description(text):
    if not text:
        return None
    text = ONION_URL_PATTERN.sub('[link ukryty]', text)
    text = ' '.join(text.split())
    return text or None


def truncate(text, limit=250):
    if not text or len(text) <= limit:
        return text
    truncated = text[:limit].rsplit(' ', 1)[0]
    return f'{truncated}…'


def fetch_ransomware_live(api_key):
    headers = {'X-Api-Key': api_key}
    response = requests.get(RANSOMWARE_LIVE_URL, headers=headers, params={'country': 'PL'}, timeout=30)
    response.raise_for_status()
    attacks = []
    for item in response.json()['victims']:
        date_raw = item.get('attackdate') or item.get('discovered') or ''
        group_name = item.get('group')
        entry = {
            'company': item['victim'],
            'date': date_raw[:10],
            'type': 'ransomware',
            'source': 'ransomware.live',
            'sourceUrl': item.get('permalink') or 'https://www.ransomware.live/',
            'verified': False,
        }
        description = truncate(sanitize_description(item.get('description')))
        for key, value in (('sector', item.get('activity')), ('group', group_name), ('description', description)):
            if value:
                entry[key] = value
        discovered = item.get('discovered')
        if discovered:
            entry['discovered'] = discovered
        attacks.append(entry)
    return attacks


def scrape_bezpiecznedane():
    response = requests.get(BEZPIECZNEDANE_API_URL, timeout=30)
    response.raise_for_status()
    items = response.json()['result']['items']
    attacks = []
    for item in items:
        if not item.get('isPublished'):
            continue
        content = item.get('publishedContent', {})
        company = content.get('title', {}).get('text', '').strip()
        date_raw = content.get('leak_date', {}).get('text', '').strip()
        if not company or not date_raw:
            continue
        entry = {
            'company': company,
            'date': date_raw.replace('.', '-'),
            'type': 'wyciek_danych',
            'source': 'bezpiecznedane.gov.pl',
            'sourceUrl': BEZPIECZNEDANE_URL,
            'verified': True,
        }
        description = sanitize_description(content.get('leak_description', {}).get('text'))
        if description:
            entry['description'] = description
        attacks.append(entry)
    return attacks


def fetch_hibp():
    headers = {'User-Agent': HIBP_USER_AGENT}
    response = requests.get(HIBP_BREACHES_URL, headers=headers, timeout=30)
    response.raise_for_status()
    attacks = []
    for breach in response.json():
        is_polish = breach['Domain'].endswith('.pl') or breach['Name'] in POLISH_BREACH_NAMES
        if not is_polish:
            continue
        entry = {
            'company': breach['Title'],
            'date': breach['BreachDate'],
            'type': 'wyciek_danych',
            'source': 'haveibeenpwned.com',
            'sourceUrl': f"https://haveibeenpwned.com/PwnedWebsites#{breach['Name']}",
            'verified': bool(breach['IsVerified']),
        }
        description = sanitize_description(strip_html(breach.get('Description')))
        if description:
            entry['description'] = description
        attacks.append(entry)
    return attacks


def load_existing():
    if not os.path.exists(ATTACKS_JSON_PATH):
        return []
    with open(ATTACKS_JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def merge_and_dedupe(existing, new_entries):
    by_key = {}
    for entry in existing + new_entries:
        key = (entry['company'], entry['date'], entry['source'])
        by_key[key] = entry
    merged = list(by_key.values())
    merged.sort(key=lambda entry: entry['date'], reverse=True)
    return merged


def main():
    api_key = os.environ.get('RANSOMWARE_LIVE_API_KEY')
    if not api_key:
        raise SystemExit('Set the RANSOMWARE_LIVE_API_KEY environment variable before running.')

    logger.info('Fetching ransomware.live...')
    ransomware_attacks = fetch_ransomware_live(api_key)
    logger.info(f'Found {len(ransomware_attacks)} ransomware.live entries.')

    logger.info('Scraping bezpiecznedane.gov.pl...')
    leak_attacks = scrape_bezpiecznedane()
    logger.info(f'Found {len(leak_attacks)} bezpiecznedane.gov.pl entries.')

    logger.info('Fetching haveibeenpwned.com...')
    hibp_attacks = fetch_hibp()
    logger.info(f'Found {len(hibp_attacks)} haveibeenpwned.com entries.')

    existing = load_existing()
    merged = merge_and_dedupe(existing, ransomware_attacks + leak_attacks + hibp_attacks)

    with open(ATTACKS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        f.write('\n')

    logger.info(f'Wrote {len(merged)} total entries to {ATTACKS_JSON_PATH}')


if __name__ == '__main__':
    main()
