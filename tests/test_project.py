"""Validation of seed quests and generated demo; no network access needed."""
import json
from pathlib import Path
import jsonschema

ROOT=Path(__file__).resolve().parents[1]
pack=json.loads((ROOT/'data/quests.json').read_text())
schema=json.loads((ROOT/'schema/quest.schema.json').read_text())
quests=pack['quests']
assert len(quests)==30, 'Expected 30 illustrative learning quests'
ids=[q['id'] for q in quests]
assert len(set(ids))==len(ids), 'Quest IDs must be unique'
allowed_skills={
'Ecological Restoration','Community Building','Building & Engineering','Civic Transformation',
'Creative Expression','Education & Research','Regenerative Enterprise','Systems Thinking'}
for q in quests:
    jsonschema.validate(q,schema)
    assert isinstance(q['prerequisite_ids'],list)
    assert len(set(q['prerequisite_ids'])) == len(q['prerequisite_ids'])
    assert all(pre in ids and pre != q['id'] for pre in q['prerequisite_ids'])
    assert set(q['skills']) <= allowed_skills, f"Unexpected skill in {q['id']}"
    assert q['next_quest_id'] is None or q['next_quest_id'] in ids
    assert q['publication_status']=='illustrative_only'
    assert q['evidence_level']=='self_report'

html=(ROOT/'web/index.html').read_text(encoding='utf-8')
assert '__QUEST_DATA__' not in html
assert 'const QUESTPACK = ' in html
assert html.count('<script>')==1
assert '<script src="quest-engine.js"></script>' in html
assert 'id="journey"' in html
assert 'id="pathRecommendations"' in html
assert 'renderJourney()' in html
assert 'No account' in html
assert 'covert infiltration' in html
assert 'Self-reported' in html
for qid in ids:
    assert qid in html
for path in list((ROOT/'docs').glob('*.md')):
    content=path.read_text()
    assert len(content)>700, path
assert (ROOT/'README.md').exists()
assert (ROOT/'index.html').exists() and 'web/index.html' in (ROOT/'index.html').read_text()
assert (ROOT/'.nojekyll').exists()
for required in ('LICENSE_DECISION.md','CODE_OF_CONDUCT_DRAFT.md','SECURITY.md','docs/08-repository-setup.md','docs/09-first-issues.md'):
    assert (ROOT/required).exists(), required
print(f'OK: {len(quests)} schema-valid illustrative quests, safe local demo, core documentation.')
