from pathlib import Path
from PIL import Image
import json,re,ast
R=Path(__file__).resolve().parent
report=json.loads((R/'output/render-report.json').read_text(encoding='utf-8'))
assert not report['missingCardComponents']
for r in report['textBounds']:
 x,y,right,bottom=r['bounds'];w,h=r['surface'];assert x>=0 and y>=0 and right<=w and bottom<=h,r
im=Image.open(R/'output/balatro-shop-1024x576.png');up=Image.open(R/'output/balatro-shop-2x.png');assert im.size==(1024,576);assert up.tobytes()==im.resize((2048,1152),Image.Resampling.NEAREST).tobytes();assert im.getchannel('A').getextrema()==(255,255)
for link in re.findall(r'(?:src|href)="([^"]+)"',(R/'index.html').read_text(encoding='utf-8')):assert (R/link).exists(),link
for p in R.glob('*.py'):
 for n in ast.walk(ast.parse(p.read_text(encoding='utf-8'))):
  if isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute) and n.func.attr in ['read_text','write_text']:assert any(k.arg=='encoding' for k in n.keywords),(p,n.lineno)
print('PASS: all independent components present; every authored text bounding box within its surface; exact16:9; opaque composite; nearest2x; local links; explicit UTF-8. These are offline checks, not browser or original-fidelity acceptance.')
