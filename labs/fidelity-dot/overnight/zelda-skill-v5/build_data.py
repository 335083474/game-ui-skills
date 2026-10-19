"""Update file:// bindings after editing JSON. UTF-8, script-relative, offline."""
from pathlib import Path
import json
R=Path(__file__).resolve().parent
for source,target,binding in [('example-data.json','example-data.js','DEFAULT_DATA'),('sources/layout.json','layout-data.js','LAYOUT')]:
 data=json.loads((R/source).read_text(encoding='utf-8'))
 (R/target).write_text('window.'+binding+'='+json.dumps(data,ensure_ascii=False)+';\n',encoding='utf-8')
print('Updated example and layout browser bindings; validator runs when loaded')
