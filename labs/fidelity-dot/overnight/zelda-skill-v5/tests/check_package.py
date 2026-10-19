"""Static checks only, no browser execution."""
from pathlib import Path
import json,re,hashlib,ast
from PIL import Image
R=Path(__file__).resolve().parents[1]
for page in ['inventory.html','equipment.html']:
 for file in re.findall(r'(?:src|href)="([^"#]+)"',(R/page).read_text(encoding='utf-8')):
  assert (R/file).exists(),file
fonts=json.loads((R/'sources/glyphs/font_arrays.json').read_text(encoding='utf-8'))['fonts']
for font in ['compact5','display6']:
 for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?':assert c in fonts[font]['glyphs'],(font,c)
for p in R.rglob('*.py'):
 for n in ast.walk(ast.parse(p.read_text(encoding='utf-8'))):
  if isinstance(n,ast.Call) and isinstance(n.func,ast.Attribute) and n.func.attr in ['read_text','write_text']:assert any(k.arg=='encoding' for k in n.keywords),(p,n.lineno)
for name in ['inventory','equipment']:
 a=Image.open(R/f'output/{name}_offline_native.png');b=Image.open(R/f'output/{name}_offline_4x.png');assert a.size==(256,224);assert b.tobytes()==a.resize((1024,896),Image.Resampling.NEAREST).tobytes()
print('Static local links, complete A-Z/0-9 fallback, explicit UTF-8, exact nearest previews: PASS. Browser not tested.')
