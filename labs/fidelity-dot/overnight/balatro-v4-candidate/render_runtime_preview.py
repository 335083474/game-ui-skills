"""Offline component render of shared scene.js commands, NOT a browser screenshot.
Run node export-scenes.cjs first. Browser Canvas and Pillow may differ in rounded edges.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import json,sys
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'fonts/canonical'))
from canonical_font import render_mask
for screen in ['shop','collection']:
 scene=json.loads((R/'output'/f'{screen}-commands.json').read_text(encoding='utf-8'))
 im=Image.new('RGBA',(1024,576));draw=ImageDraw.Draw(im)
 def rect(x,y,w,h,r,color):draw.rounded_rectangle((x,y,x+w-1,y+h-1),radius=r,fill=color)
 for c in scene['commands']:
  if c['type']=='panel':
   x,y,w,h,r=c['x'],c['y'],c['w'],c['h'],c['radius'];rect(x+2,y+4,w,h,r,'#101b1d');rect(x,y,w,h,r,c['border'] or c['fill'])
   if c['border']:rect(x+3,y+3,w-6,h-6,max(2,r-3),c['fill'])
  elif c['type']=='image':im.alpha_composite(Image.open(R/c['src']).convert('RGBA').resize((c['w'],c['h']),Image.Resampling.NEAREST),(c['x'],c['y']))
  elif c['type']=='text':
   mask=render_mask(c['text'],c['size'])
   for color,off in [('#142023',2),(c['color'],0)]:
    layer=Image.new('RGBA',mask.size,color);layer.putalpha(mask);im.alpha_composite(layer,(c['x']+off,c['y']+off))
  elif c['type']=='outline':draw.rectangle((c['x'],c['y'],c['x']+c['w'],c['y']+c['h']),outline=c['color'],width=c['width'])
 im.save(R/'output'/f'{screen}-runtime-offline.png');im.resize((2048,1152),Image.Resampling.NEAREST).save(R/'output'/f'{screen}-runtime-offline-2x.png')
print('Rendered shared commands offline; not browser evidence.')
