"""Independent frozen-master bitmap text. No runtime FreeType/ImageFont."""
from pathlib import Path
import json,warnings
from PIL import Image
R=Path(__file__).resolve().parent
METRICS=json.loads((R/'canonical_metrics.json').read_text(encoding='utf-8'))
AVAILABLE_SIZES=tuple(int(v) for v in METRICS['masters'])
ATLASES={int(k):Image.open(R/v['atlas']).convert('L') for k,v in METRICS['masters'].items()}
def _layout(text,size=20):
 if size not in AVAILABLE_SIZES:raise ValueError(f'No frozen master at {size}; choose one of {AVAILABLE_SIZES}')
 master=METRICS['masters'][str(size)];x64=0;y=0;glyphs=[];diagnostics=[];advance64=0
 for index,char in enumerate(text):
  if char in '\r\n':
   if char=='\n' or index+1==len(text) or text[index+1]!='\n':advance64=max(advance64,x64);x64=0;y+=master['lineHeight']
   continue
  actual=char if char in master['glyphs'] else METRICS['fallback']
  if actual!=char:diagnostics.append({'index':index,'source':char,'codepoint':f'U+{ord(char):04X}','fallback':actual,'code':'UNSUPPORTED_GLYPH'})
  g=master['glyphs'][actual]
  if g['width'] and g['height']:glyphs.append((actual,(x64+32)//64+g['bearingX'],y+g['bearingY'],g))
  x64+=g['advance64']
 advance64=max(advance64,x64)
 bbox=[min(v[1] for v in glyphs),min(v[2] for v in glyphs),max(v[1]+v[3]['width'] for v in glyphs),max(v[2]+v[3]['height'] for v in glyphs)] if glyphs else [0,0,0,0]
 report={'text':text,'size':size,'width':bbox[2]-bbox[0],'height':bbox[3]-bbox[1],'inkBBox':bbox,'advance64':advance64,'advance':(advance64+32)//64,'lineHeight':master['lineHeight'],'diagnostics':diagnostics,'rasterSource':master['atlas'],'runtimeFreeType':False,'frozenIndependentMaster':True}
 return glyphs,bbox,report
def measure(text,size=20):return _layout(text,size)[2]
def render_mask(text,size=20):
 glyphs,bbox,report=_layout(text,size)
 for d in report['diagnostics']:warnings.warn(f"Unsupported {d['codepoint']} at index {d['index']}; rendered ?",RuntimeWarning,stacklevel=2)
 mask=Image.new('L',(max(1,bbox[2]-bbox[0]),max(1,bbox[3]-bbox[1])))
 for char,x,y,g in glyphs:
  ax,ay,w,h=g['rect'];ink=ATLASES[size].crop((ax,ay,ax+w,ay+h));mask.paste(ink,(x-bbox[0],y-bbox[1]))
 return mask
def center_x(center,text,size=20):return int(center)-measure(text,size)['width']//2
text_mask=render_mask
