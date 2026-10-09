"""Rebuild offline synthetic-only REGEN evidence explorer."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ledger=json.loads((ROOT/"data/evidence-ledger.json").read_text(encoding="utf-8"))
assert ledger["visibility"]=="synthetic_only_no_real_world_claims"
template=(ROOT/"web/evidence-template.html").read_text(encoding="utf-8")
assert template.count("__EVIDENCE_DATA__")==1
embedded=json.dumps(ledger,ensure_ascii=False,separators=(",",":")).replace("<","\\u003c")
out=template.replace("__EVIDENCE_DATA__",embedded)
(ROOT/"web/evidence.html").write_text(out,encoding="utf-8")
print(f"Generated fictional evidence explorer: {len(ledger['claims'])} claims, {len(ledger['sources'])} invented sources, {len(ledger['events'])} correction events.")
