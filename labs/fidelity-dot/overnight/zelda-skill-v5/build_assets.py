"""Render independent assets from local editable grids and palette. No source screenshot."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageColor
import json
R=Path(__file__).resolve().parent
load=lambda p:json.loads((R/p).read_text(encoding='utf-8'))
p=load('sources/background/palette.json');colors=[ImageColor.getrgb(p['colors'][k])+(255,)for k in p['index_order']];matrix=load('sources/background/map_indices.json')
im=Image.new('RGBA',(256,224));im.putdata([colors[i]for row in matrix for i in row]);im.save(R/'components/background_native.png')
palette=load('sources/sprites/palette.json')
for name,grid in load('sources/sprites/sprite_grids.json').items():
 im=Image.new('RGBA',(len(grid[0]),len(grid)));im.putdata([tuple(palette[c])for row in grid for c in row]);im.save(R/('components/sprite_'+name+'_native.png'))
for spec in load('sources/panels.json')['panels']:
 w,h=spec['size'];im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im)
 def ring(n,c):
  l=t=n;r=w-1-n;b=h-1-n
  return [(l+c,t),(r-c,t),(r,t+c),(r,b-c),(r-c,b),(l+c,b),(l,b-c),(l,t+c)]
 d.polygon(ring(0,4),fill=(0,0,0,255))
 for n,col in enumerate([(0,0,0,255),tuple(spec['color']),tuple(spec['color']),(248,248,240,255)]):
  pts=ring(n,4-n);d.line(pts+[pts[0]],fill=col,width=1)
 im.save(R/('components/panel_'+spec['id']+'_native.png'))
print('Rebuilt editable component PNGs; refresh browser to load changed files')
