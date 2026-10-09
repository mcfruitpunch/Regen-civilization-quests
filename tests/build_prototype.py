"""Build a standalone HTML demo with data embedded; works without network/local server."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PACK = json.loads((ROOT/'data/quests.json').read_text(encoding='utf-8'))
template = (ROOT/'web/template.html').read_text(encoding='utf-8')
# '<' escaped so JSON cannot terminate the enclosing HTML script element.
embedded = json.dumps(PACK,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
assert template.count('__QUEST_DATA__') == 1
html = template.replace('__QUEST_DATA__',embedded)
(ROOT/'web/index.html').write_text(html,encoding='utf-8')
print('Generated offline prototype:',len(html),'bytes')
