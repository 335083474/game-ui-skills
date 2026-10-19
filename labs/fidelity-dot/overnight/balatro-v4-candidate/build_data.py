"""Rebuild browser data bindings and alpha atlases from editable JSON/canonical masks."""
from pathlib import Path
import json
from PIL import Image
R=Path(__file__).resolve().parent
for source,target,name in [('example-data.json','example-data.js','DEFAULT_DATA'),('fonts/canonical/canonical_metrics.json','font-data.js','FONT_METRICS')]:
 data=json.loads((R/source).read_text(encoding='utf-8'));(R/target).write_text('window.'+name+'='+json.dumps(data,separators=(',',':'))+';\n',encoding='utf-8')
(R/'fonts/browser').mkdir(exist_ok=True)
for p in (R/'fonts/canonical').glob('canonical_atlas_*.png'):
 mask=Image.open(p).convert('L');im=Image.new('RGBA',mask.size,'white');im.putalpha(mask);im.save(R/'fonts/browser'/p.name)
print('Built local JS data bindings and exact-mask alpha atlases.')
