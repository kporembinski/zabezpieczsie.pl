import json
import logging
import os
import re
import time

import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATTACKS_JSON_PATH = os.path.join(PROJECT_ROOT, 'web', 'src', 'data', 'attacks.json')

RANSOMWARE_LIVE_URL = 'https://api-pro.ransomware.live/victims/'
BEZPIECZNEDANE_URL = 'https://bezpiecznedane.gov.pl/historia-wyciekow'

ENTRY_PATTERN = re.compile(
    r'<span class="inline-flex items-center font-normal text-gray-cool-500">([^<]+)</span>'
    r'<span class="inline-flex items-center before:mx-6[^"]*">([^<]+)</span>'
)
NEXT_BUTTON_PATTERN = re.compile(r'aria-label="Przejdź do następnej strony"([^>]*)>')

MAX_PAGES = 100

ONION_URL_PATTERN = re.compile(r'\S*\.onion\S*', re.IGNORECASE)


def sanitize_description(text):
    if not text:
        return None
    text = ONION_URL_PATTERN.sub('[link ukryty]', text)
    text = ' '.join(text.split())
    if len(text) > 250:
        truncated = text[:250].rsplit(' ', 1)[0]
        text = f'{truncated}…'
    return text or None


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
        description = sanitize_description(item.get('description'))
        for key, value in (('sector', item.get('activity')), ('group', group_name), ('description', description)):
            if value:
                entry[key] = value
        attacks.append(entry)
    return attacks


def scrape_bezpiecznedane():
    attacks = []
    previous_entries = None
    page = 1
    while page <= MAX_PAGES:
        response = requests.get(BEZPIECZNEDANE_URL, params={'page': page}, timeout=30)
        response.raise_for_status()
        html = response.text
        entries = ENTRY_PATTERN.findall(html)
        if not entries or entries == previous_entries:
            break
        for date_raw, company in entries:
            attacks.append({
                'company': company.strip(),
                'date': date_raw.strip().replace('.', '-'),
                'type': 'wyciek_danych',
                'source': 'bezpiecznedane.gov.pl',
                'sourceUrl': BEZPIECZNEDANE_URL,
                'verified': True,
            })
        next_button = NEXT_BUTTON_PATTERN.search(html)
        if next_button and 'disabled' in next_button.group(1):
            break
        previous_entries = entries
        page += 1
        time.sleep(0.5)
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

    existing = load_existing()
    merged = merge_and_dedupe(existing, ransomware_attacks + leak_attacks)

    with open(ATTACKS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        f.write('\n')

    logger.info(f'Wrote {len(merged)} total entries to {ATTACKS_JSON_PATH}')


if __name__ == '__main__':
    main()
