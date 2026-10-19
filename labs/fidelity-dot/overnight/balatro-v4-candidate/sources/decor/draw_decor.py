"""New authored native raster decor, never reads the reference image.
No TTF is used. SHOP has independent sculpted masks; VOUCHER is added by caller's canonical atlas.
"""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFilter
ROOT=Path(__file__).resolve().parent

def rgba(c):
 return tuple(bytes.fromhex(c.lstrip('#')))+(255,)

def ticket_shape(width=78,height=122):
 # Both notches touch the outside edge; no floating circular punch-hole.
 return [(3,0),(30,0),(31,4),(34,7),(38,9),(41,9),(45,7),(47,3),(47,0),(74,0),(77,3),(77,24),(75,27),(76,29),(76,119),(73,121),(47,121),(46,117),(43,114),(40,112),(37,112),(34,114),(31,117),(30,121),(4,121),(1,118),(1,29),(3,26),(0,23),(0,3)]

def render_voucher():
 w,h=78,122;mask=Image.new('L',(w,h));d=ImageDraw.Draw(mask);d.polygon(ticket_shape(),fill=255)
 im=Image.new('RGBA',(w,h));p=im.load()
 # Magenta-to-plum body shading remains hard edged, with a cool specular edge.
 bands=['783252','96385f','b94379','d771a2','ebb0ce','d47ca7','c4588f','a84273','813454','6b2d4b']
 for y in range(h):
  for x in range(w):
   if mask.getpixel((x,y)):
    idx=min(len(bands)-1,(x*len(bands))//w)
    # Separate the lower bevel without flattening the primary side-lighting.
    color=rgba(bands[idx]);p[x,y]=color
 # Hard-pixel contour and inset bevels derived from the new authored silhouette.
 padded=Image.new('L',(w+8,h+8));padded.paste(mask,(4,4))
 inner1=padded.filter(ImageFilter.MinFilter(3)).crop((4,4,w+4,h+4));inner2=padded.filter(ImageFilter.MinFilter(5)).crop((4,4,w+4,h+4));inner3=padded.filter(ImageFilter.MinFilter(7)).crop((4,4,w+4,h+4))
 for y in range(h):
  for x in range(w):
   if mask.getpixel((x,y)) and not inner1.getpixel((x,y)):p[x,y]=rgba('ece5f7')
   elif inner1.getpixel((x,y)) and not inner2.getpixel((x,y)):p[x,y]=rgba('657188')
   elif inner2.getpixel((x,y)) and not inner3.getpixel((x,y)):p[x,y]=rgba('f8d7ee')
 d=ImageDraw.Draw(im)
 # Raised pale header, isolated from its darker body and with the same open top notch.
 header=Image.new('RGBA',(w,h));hd=ImageDraw.Draw(header)
 hd.rectangle((3,3,74,24),fill=rgba('e8eaf4'));hd.line((4,24,73,24),fill=rgba('b6c1d5'),width=1)
 hd.line((5,25,72,25),fill=rgba('504968'),width=1)
 hm=Image.new('L',(w,h));hmd=ImageDraw.Draw(hm);hmd.rectangle((3,3,74,24),fill=255)
 for y in range(h):
  for x in range(w):
   if hm.getpixel((x,y)) and inner3.getpixel((x,y)):p[x,y]=header.getpixel((x,y))
 # Inner frame and cool plaque, with step-corner geometry.
 plaque=[(17,38),(60,38),(63,41),(63,99),(60,102),(17,102),(14,99),(14,41)]
 d.polygon(plaque,fill=rgba('4c4e70'));d.line(plaque+[plaque[0]],fill=rgba('f4d7ee'),width=1)
 d.polygon([(18,40),(59,40),(61,42),(61,98),(59,100),(18,100),(16,98),(16,42)],fill=rgba('8a94c3'))
 d.line((18,41,59,41),fill=rgba('e7eafa'));d.line((17,43,17,97),fill=rgba('d1d9f2'))
 d.rectangle((19,43,58,97),fill=rgba('a8b5e1'))
 d.rectangle((53,43,58,97),fill=rgba('9aa6d3'))
 # Four-lobed / ghost-like white motif: blue upper rim, plum lower rim, pale center.
 emblem=Image.new('L',(w,h));ed=ImageDraw.Draw(emblem)
 ed.ellipse((31,56,46,72),fill=255);ed.polygon([(34,67),(43,67),(44,72),(49,76),(48,81),(43,82),(40,79),(37,83),(33,81),(29,82),(27,78),(30,73)],fill=255)
 outer=emblem.filter(ImageFilter.MaxFilter(5));mid=emblem.filter(ImageFilter.MaxFilter(3))
 for y in range(52,87):
  for x in range(23,53):
   if outer.getpixel((x,y)):p[x,y]=rgba('e8eafa')
   if mid.getpixel((x,y)):p[x,y]=rgba('3986ce' if y<70 else 'b83f80')
   if emblem.getpixel((x,y)):p[x,y]=rgba('f4fcf9' if x<41 else 'd9eef0')
 # A short cool highlight on the crown and one dark inset to separate lobes.
 d.line((35,57,41,57),fill=rgba('ffffff'));d.point((32,76),fill=rgba('477c93'));d.point((44,76),fill=rgba('477c93'))
 # Reapply shape alpha to ensure nothing escapes the ticket silhouette.
 im.putalpha(mask)
 return im

# Logo letter geometry is independent from the body UI alphabet.
def shop_masks():
 source=ROOT/'shop_letter_masks.json'
 if source.exists():
  grids=json.loads(source.read_text(encoding='utf-8'));result={}
  for ch in 'SHOP':
   rows=grids[ch];assert len(rows)==60 and all(len(row)==35 for row in rows)
   m=Image.new('L',(35,60));m.putdata([255 if value else 0 for row in rows for value in row]);result[ch]=m
  return result
 masks={}
 for ch in 'SHOP':
  m=Image.new('L',(35,60));d=ImageDraw.Draw(m)
  if ch=='S':
   pts=[(28,6),(12,6),(6,12),(6,21),(13,28),(22,28),(28,35),(28,47),(22,53),(5,53)]
   d.line(pts,fill=255,width=12,joint='curve')
   for x,y in pts:d.ellipse((x-5,y-5,x+5,y+5),fill=255)
  elif ch=='H':
   d.rounded_rectangle((0,0,11,59),radius=4,fill=255);d.rounded_rectangle((23,0,34,59),radius=4,fill=255);d.rectangle((7,24,27,35),fill=255)
  elif ch=='O':
   d.rounded_rectangle((0,0,34,59),radius=10,fill=255);d.rounded_rectangle((12,12,22,47),radius=4,fill=0)
  else:
   d.rounded_rectangle((0,0,11,59),radius=4,fill=255);d.rounded_rectangle((0,0,34,36),radius=9,fill=255);d.rounded_rectangle((12,12,22,24),radius=3,fill=0)
  masks[ch]=m
 return masks

def render_marquee():
 im=Image.new('RGBA',(200,100));d=ImageDraw.Draw(im)
 d.rounded_rectangle((5,7,199,99),radius=17,fill=rgba('101719'))
 d.rounded_rectangle((1,1,195,94),radius=16,fill=rgba('6c3529'))
 d.rounded_rectangle((2,2,194,92),radius=15,fill=rgba('f05a40'))
 d.rounded_rectangle((5,5,191,89),radius=13,fill=rgba('ffad55'))
 d.rounded_rectangle((7,7,189,87),radius=12,fill=rgba('b94332'))
 d.rounded_rectangle((12,13,184,82),radius=9,fill=rgba('162225'))
 d.rounded_rectangle((15,15,181,80),radius=7,fill=rgba('101a1d'))
 masks=shop_masks();whole=Image.new('L',im.size)
 for i,ch in enumerate('SHOP'):whole.paste(masks[ch],(20+i*39,18))
 # Dark extruded shadow and a thin outer contour.
 grow=whole.filter(ImageFilter.MaxFilter(3));pixels=im.load()
 for offx,offy,col in [(5,6,'0a1113'),(3,4,'4e3520'),(1,2,'916025')]:
  for y in range(100-offy):
   for x in range(200-offx):
    if grow.getpixel((x,y)):pixels[x+offx,y+offy]=rgba(col)
 for y in range(100):
  for x in range(200):
   if whole.getpixel((x,y)):
    def inside(dx,dy):return 0<=x+dx<200 and 0<=y+dy<100 and whole.getpixel((x+dx,y+dy))
    if not inside(-1,-1):col='fff0c4'
    elif not inside(-3,-3):col='ffdd8b'
    elif not inside(2,3):col='bb812b'
    elif not inside(1,1):col='946223'
    else:col='efbd55'
    # Small isolated face glints, not a striped fill replacing the gold face.
    if col=='efbd55' and (x+y)%31==0 and (x//9+y//11)%3==0:col='f8d782'
    pixels[x,y]=rgba(col)
 # Warm bulbs include bright and dim lamps with distinct outer/inner/core colors.
 bulbs=[]
 for x in range(18,185,13):bulbs.extend([(x,8),(x,88)])
 for y in [20,34,48,62,75]:bulbs.extend([(8,y),(190,y)])
 for i,(x,y) in enumerate(bulbs):
  bright=i%4!=2
  d.ellipse((x-5,y-5,x+5,y+5),fill=rgba('b75338' if bright else '8f3b2b'))
  d.ellipse((x-4,y-4,x+4,y+4),fill=rgba('ff9b69' if bright else 'd98c43'))
  d.ellipse((x-3,y-3,x+3,y+3),fill=rgba('ffe9b6' if bright else 'e7b75a'))
  if bright:d.ellipse((x-2,y-2,x+2,y+2),fill=rgba('fffef2'))
  else:d.rectangle((x-1,y-2,x+1,y),fill=rgba('f5cd73'))
 return im

def export():
 for name,im in [('voucher_art',render_voucher()),('shop_marquee',render_marquee())]:
  im.save(ROOT/(name+'.png'));im.resize((im.width*4,im.height*4),Image.Resampling.NEAREST).save(ROOT/(name+'@4x.png'))
  assert set(im.getchannel('A').getdata())<={0,255}
 masks={ch:[[int(v) for v in [m.getpixel((x,y))>0 for x in range(m.width)]] for y in range(m.height)]for ch,m in shop_masks().items()}
 (ROOT/'shop_letter_masks.json').write_text(json.dumps(masks)+'\n',encoding='utf-8')
 spec={'voucher':{'size':[78,122],'file':'voucher_art.png','caption':'VOUCHER','caption_bounds':[9,13,69,24],'caption_color':'#465971','caption_note':'No baked caption: render with canonical atlas, centered within bounds, glyph-aware fit; do not use TTF.'},'marquee':{'size':[200,100],'file':'shop_marquee.png','letters':'SHOP','letter_source':'independent 35x60 sculpted masks','ui_font_dependency':False},'provenance':'new authored procedural native raster; no source pixels read; rights not cleared'}
 (ROOT/'component_specs.json').write_text(json.dumps(spec,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(spec))
if __name__=='__main__':export()
