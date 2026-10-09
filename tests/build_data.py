"""Manage REGEN's illustrative quest seed data.

The committed JSON file is the source of truth. This utility verifies the
basic record relationships, and optionally normalizes its formatting.
Use tests/test_project.py for complete JSON Schema validation.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / 'data' / 'quests.json'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--write', action='store_true', help='Normalize the JSON file in place')
    args = parser.parse_args()
    pack = json.loads(PATH.read_text(encoding='utf-8'))
    quests = pack.get('quests', [])
    ids = [q['id'] for q in quests]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate quest IDs')
    for q in quests:
        if q.get('next_quest_id') not in (None, *ids):
            raise ValueError(f"Unknown next quest for {q['id']}")
        if q.get('publication_status') != 'illustrative_only':
            raise ValueError(f"Seed quest must remain illustrative_only: {q['id']}")
    normalized = json.dumps(pack, indent=2, ensure_ascii=False) + '\n'
    if args.write:
        PATH.write_text(normalized, encoding='utf-8')
        print(f'Normalized {len(quests)} illustrative quests.')
    else:
        print(f'Validated {len(quests)} illustrative quests. Use --write to normalize.')

if __name__ == '__main__':
    main()
