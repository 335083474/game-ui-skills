"""Separate newly generated card components. Never reads the original game screenshot."""
from pathlib import Path
from PIL import Image,ImageDraw
import json
R=Path(__file__).resolve().parent
boxes={'joker_orange':[49,65,326,454],'joker_red':[390,64,675,454],'joker_purple':[746,65,1024,454],'joker_teal':[49,526,325,923],'wheel_fortune':[399,519,671,924],'joker_green':[746,526,1024,923],'joker_ballot':[50,978,337,1410],'buffoon_pack':[401,973,674,1420],'arcana_pack':[738,973,1024,1420]}
sheet=Image.open(R/'sources/generated-card-sheet.png').convert('RGBA')
for n,box in boxes.items():sheet.crop(box).save(R/('components/'+n+'.png'))
(R/'sources/card-regions.json').write_text(json.dumps({'source':'generated-card-sheet.png','regions':boxes,'policy':'Tight rectangular separation of independently generated components; no screenshot crops, no noise deletion or restoration; nearest rescaling in renderer'},indent=2)+'\n',encoding='utf-8')
# B03 independently authored ticket geometry, with caption added by canonical atlas in render.py.
import sys
sys.path.insert(0,str(R/'sources/decor'))
from draw_decor import render_voucher
render_voucher().save(R/'components/voucher.png')
print('Separated nine unchanged generated components; authored v2 ticket voucher')
