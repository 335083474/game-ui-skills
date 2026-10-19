"""Explicit authoring only. Runtime renders frozen glyph pixels/advances without FreeType."""
from pathlib import Path
import json,hashlib,platform
from PIL import Image,ImageDraw,ImageFont,features
import PIL,fontTools
from fontTools.ttLib import TTFont
R=Path(__file__).resolve().parent;source=R.parent/'m6x11.ttf'
sha=hashlib.sha256(source.read_bytes()).hexdigest();assert sha=='64697c6fefd4a084dbe28f3df3e658b1f72bd148f81c4ec10fd1f8f944f18a20'
chars=[chr(cp) for cp in sorted(TTFont(source).getBestCmap())];masters={}
for size in [16,18,19,20,22,24,26,32,40,48,96]:
 font=ImageFont.truetype(str(source),size);cell=size+4;columns=16;atlas=Image.new('L',(columns*cell,8*cell));glyphs={}
 for index,char in enumerate(chars):
  b=font.getbbox(char);raw=Image.new('1',(max(1,b[2]-b[0]),max(1,b[3]-b[1])));ImageDraw.Draw(raw).text((-b[0],-b[1]),char,font=font,fill=1);bb=raw.getbbox();x=index%columns*cell;y=index//columns*cell
  if bb:
   ink=raw.crop(bb).convert('L');w,h=ink.size;atlas.paste(ink,(x,y));bx,by=b[0]+bb[0],b[1]+bb[1]
  else:w=h=bx=by=0
  glyphs[char]={'rect':[x,y,w,h],'width':w,'height':h,'bearingX':bx,'bearingY':by,'advance64':round(font.getlength(char)*64),'sourceBBox':list(b)}
 name=f'canonical_atlas_{size}.png';atlas.save(R/name);masters[str(size)]={'size':size,'lineHeight':size,'atlas':name,'atlasSHA256':hashlib.sha256((R/name).read_bytes()).hexdigest(),'glyphs':glyphs}
data={'schemaVersion':3,'creator':'Daniel Linssen','font':'m6x11','creatorURL':'https://managore.itch.io/m6x11','sourceSHA256':sha,'fallback':'?','advanceRule':'Accumulate integer advance64; pixel origin=floor((advance64+32)/64). No runtime floating-point or FreeType layout.','masters':masters,'generation':{'python':platform.python_version(),'platform':platform.platform(),'pillow':PIL.__version__,'freetype':features.version('freetype2'),'fonttools':fontTools.__version__,'mode':'Independent frozen 1-bit glyph masks per master; no rescaling between masters'}}
(R/'canonical_metrics.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
