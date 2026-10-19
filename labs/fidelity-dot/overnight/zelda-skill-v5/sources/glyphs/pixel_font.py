"""UTF-8 pixel-font layout, wrapping and pagination without silent input loss."""
from pathlib import Path
import json
from PIL import Image
ROOT=Path(__file__).resolve().parent

def load_fonts(path=None):
 return json.loads(Path(path or ROOT/'font_arrays.json').read_text(encoding='utf-8'))

def layout_text(text, font_name='display6', max_width=None, page_height=None, fonts=None, lift_separator=False):
 data=fonts or load_fonts();font=data['fonts'][font_name]
 if max_width is not None and max_width<1:raise ValueError('max_width must be positive')
 if page_height is not None and page_height<1:raise ValueError('page_height must be positive')
 max_lines=max(1,page_height//font['lineHeight']) if page_height else None
 records=[];diagnostics=[];x=0;line=0;page=0
 def next_line():
  nonlocal x,line,page
  x=0;line+=1
  if max_lines and line>=max_lines:page+=1;line=0
 for index,char in enumerate(text):
  if char in '\r\n':
   records.append({'kind':'control','index':index,'source':char,'page':page,'line':line})
   if char=='\n' or index+1==len(text) or text[index+1]!='\n':next_line()
   continue
  rendered=char if char in font['glyphs'] else font['fallback']
  if rendered!=char:diagnostics.append({'code':'UNSUPPORTED_GLYPH','index':index,'source':char,'codepoint':f'U+{ord(char):04X}','fallback':rendered,'message':f'Unsupported U+{ord(char):04X}; visible fallback used'})
  glyph=dict(font['glyphs'][rendered])
  if lift_separator and font_name=='display6' and char=='.':glyph.update(advance=0,bearingX=-1)
  if max_width and x and x+glyph['advance']>max_width:next_line()
  if max_width and glyph['advance']>max_width:diagnostics.append({'code':'GLYPH_EXCEEDS_LINE_WIDTH','index':index,'source':char,'message':'Glyph preserved; render canvas expands to avoid clipping'})
  records.append({'kind':'glyph','index':index,'source':char,'rendered':rendered,'page':page,'line':line,'x':x,'y':line*font['lineHeight'],'width':glyph['width'],'advance':glyph['advance'],'bearingX':glyph['bearingX'],'bearingY':glyph['bearingY']})
  x+=glyph['advance']
 return {'text':text,'font':font_name,'maxWidth':max_width,'pageHeight':page_height,'lineHeight':font['lineHeight'],'pageCount':page+1,'records':records,'diagnostics':diagnostics,'inputPreserved':''.join(r['source'] for r in records)==text}

def render_pages(layout, fonts=None, foreground=(248,248,240,255), background=(0,0,0,255)):
 data=fonts or load_fonts();font=data['fonts'][layout['font']];pages=[]
 for page in range(layout['pageCount']):
  records=[r for r in layout['records'] if r['page']==page and r['kind']=='glyph']
  min_x=min([0]+[r['x']+r['bearingX'] for r in records]);offset=-min_x
  width=max([1,layout['maxWidth'] or 1]+[r['x']+r['bearingX']+r['width'] for r in records])+offset
  height=max([font['height'],layout['pageHeight'] or font['height']]+[r['y']+r['bearingY']+font['height'] for r in records])
  im=Image.new('RGBA',(width,height),background)
  for r in records:
   for yy,row in enumerate(font['glyphs'][r['rendered']]['rows']):
    for xx,value in enumerate(row):
     if value=='1':im.putpixel((r['x']+r['bearingX']+xx+offset,r['y']+r['bearingY']+yy),foreground)
  pages.append(im)
 return pages
