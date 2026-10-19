#!/usr/bin/env python3
"""Offline Pillow component render; not a browser screenshot or runtime test."""
from pathlib import Path
from PIL import Image, ImageDraw
import json
R=Path(__file__).resolve().parent
load=lambda p:json.loads((R/p).read_text(encoding='utf-8'))
data=load('example-data.json'); fonts=load('sources/glyphs/glyph_arrays.json')['fonts'];layout=load('sources/layout.json')
def render(screen):
 im=Image.open(R/'components/background_native.png').convert('RGBA');d=ImageDraw.Draw(im)
 def icon(path,x,y):im.alpha_composite(Image.open(R/path).convert('RGBA'),(x,y))
 def sprite(n,x,y):icon('components/sprite_'+n+'_native.png',x,y)
 def text(s,x,y,font='display6',color=(248,248,240,255)):
  f=fonts[font]
  for c in s.upper():
   if c==' ':x+=f['metrics'][' ']['advance'];continue
   if c not in f['glyphs']:c='?'
   rows=f['glyphs'][c];m=dict(f.get('metrics',{}).get(c,{}))
   if s=='LIFT.3' and c=='.':m.update(advance=0,bearing_x=-1)
   for yy,row in enumerate(rows):
    for xx,v in enumerate(row):
     if v=='1':d.point((x+m.get('bearing_x',0)+xx,y+yy),fill=color)
   x+=m.get('advance',len(rows[0])+f['tracking'])
 def width(s,font='display6'):
  f=fonts[font];return sum(f['metrics'].get(c.upper(),f['metrics']['?'])['advance'] for c in s)
 def lines(s,w,font='display6'):
  out=[]
  for para in s.split('\n'):
   line=''
   for c in para:
    if line and width(line+c,font)>w:
     space=line.rfind(' ')
     if space>0:out.append(line[:space]);line=line[space+1:]
     else:out.append(line);line=''
     if c==' ' and not line:continue
    line+=c
   out.append(line)
  return out
 for p in load('sources/panels.json')['panels']:icon('components/panel_'+p['id']+'_native.png',*p['origin'])
 d.rectangle((23,15,23+min(130,width(data['title'],'compact5')+3)-1,20),fill=(0,0,0,255));d.rectangle((25,143,39,148),fill=(0,0,0,255))
 for r in layout['text']:
  if r['text'] not in ['FLUTE','×4','ITEM']:text(r['text'],*r['xy'],r['font'],tuple(r.get('color',(248,248,240,255))))
 text(lines(data['title'],128,'compact5')[0],24,15,'compact5')
 for xy in layout['crystal_origins']:sprite('crystal_faceted',*xy)
 for n,xy in zip(['boots_gold','glove_gold','flippers_blue','pearl_red'],layout['action_equipment_origins']):sprite(n,*xy)
 for v,xy in zip(data['equipment'],layout['equipment_origins']):icon(v['icon'],*xy)
 sprite('heart_red',*layout['heart_origin'])
 for x in range(177,241,8):d.line((x,179,x+3,179),fill=(248,248,240,255))
 v=data['items'][data['selectedIndex']] if screen=='inventory' else data['equipment'][0]
 icon(v['icon'],200,23);text(lines(v['name'],64)[0],177,48);text('×'+str(v['count']),177,40,'compact5');text('×'+str(data['equipment'][0]['count']),177,172,'compact5')
 if screen=='inventory':
  for i,v in enumerate(data['items']):
   x=layout['inventory_origin'][0]+i%5*layout['inventory_spacing'][0];y=layout['inventory_origin'][1]+i//5*layout['inventory_spacing'][1];icon(v['icon'],x,y)
   if i==data['selectedIndex']:d.rectangle((x-2,y-2,x+18,y+18),outline=(248,248,240,255))
 else:
  d.line((175,177,191,177),fill=(248,248,240,255))
  for i,line in enumerate(lines(v['name']+'\nCOUNT '+str(v['count'])+'\n'+v['description'],120)[:9]):text(line,29,30+i*10)
 v=data['items'][data['selectedIndex']] if screen=='inventory' else data['equipment'][0]
 name_pages=len(lines(v['name'],64))
 pages=max(1,name_pages) if screen=='inventory' else max(name_pages,(len(lines(v['name']+'\nCOUNT '+str(v['count'])+'\n'+v['description'],120))+8)//9)
 text('PAGE 1/'+str(pages),30,125,'compact5')
 if name_pages>1:text('+',237,40,'compact5')
 out=R/'output';out.mkdir(exist_ok=True)
 im.save(out/(screen+'_offline_native.png'));im.resize((1024,896),Image.Resampling.NEAREST).save(out/(screen+'_offline_4x.png'))
 return im
if __name__=='__main__':
 for s in ['inventory','equipment']:render(s)
 print('Rendered two offline Python component previews, NOT browser screenshots')
