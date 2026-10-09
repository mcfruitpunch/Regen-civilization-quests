"""Regenerate deterministic offline REGEN pre-community simulation page."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
quests=json.loads((ROOT/"data/quests.json").read_text(encoding="utf-8"))["quests"]
scenarios=json.loads((ROOT/"data/scenarios.json").read_text(encoding="utf-8"))["scenarios"]
template=(ROOT/"web/lab-template.html").read_text(encoding="utf-8")
assert template.count("__LAB_DATA__")==1
bundle={"quests":quests,"scenarios":scenarios}
embedded=json.dumps(bundle,ensure_ascii=False,separators=(",",":")).replace("<","\\u003c")
html=template.replace("__LAB_DATA__",embedded)
(ROOT/"web/lab.html").write_text(html,encoding="utf-8")
print(f"Generated lab: {len(quests)} illustrative quests; {len(scenarios)} simulated scenarios; {len(html)} characters.")
