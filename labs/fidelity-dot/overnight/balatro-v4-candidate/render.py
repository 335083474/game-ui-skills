"""Independent component rendering of a representative shop. No reference pixels read."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageColor,ImageFilter
import json,math,random,sys
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'fonts/canonical'))
from canonical_font import render_mask,measure
sys.path.insert(0,str(R/'sources/decor'))
from draw_decor import render_voucher,render_marquee
load=lambda n:json.loads((R/n).read_text(encoding='utf-8'))
P=load('sources/palette.json');L=load('sources/layout.json');S=L['reference_state'];W,H=L['size']
C=R/'components';O=R/'output';C.mkdir(exist_ok=True);O.mkdir(exist_ok=True)
TEXT_BOUNDS=[]
rgba=lambda c:ImageColor.getrgb(P.get(c,c))+(255,)
def paste_text(im,s,x,y,size=16,color='white',shadow=True,center=False,tracking=0,outline=False):
 mask=render_mask(s,size)

 w,h=mask.size
 if center:x-=w//2
 x=int(x);y=int(y)
 TEXT_BOUNDS.append({'text':s,'surface':list(im.size),'bounds':[x-(1 if outline else 0),y-(1 if outline else 0),x+w+(2 if shadow else 0),y+h+(2 if shadow else 0)],'fontSize':size,'frozenMasterSize':size,'runtimeFreeType':False,'nativeTracking':0})
 if outline:
  expanded=Image.new('L',(w+2,h+2));expanded.paste(mask,(1,1));expanded=expanded.filter(ImageFilter.MaxFilter(3));rim=Image.new('RGBA',expanded.size,rgba('ink'));rim.putalpha(expanded);im.alpha_composite(rim,(x-1,y-1))
 if shadow:
  layer=Image.new('RGBA',mask.size,rgba('#142023'));layer.putalpha(mask);im.alpha_composite(layer,(x+2,y+2))
 layer=Image.new('RGBA',mask.size,rgba(color));layer.putalpha(mask);im.alpha_composite(layer,(x,y))

def text(im,s,x,y,sx=2,sy=2,color='white',shadow=True,center=False):
 # Each role selects a separately frozen master. No scaling/rasterization at runtime.
 size=19
 if sx>=8:size=96
 elif sy>=4:size=48
 elif sx>=3:size=32
 elif color=='gold':size=24
 elif sy==1:size=16
 elif (s in ['Hands','Discards','Ante','Round'] and y>=380) or s in [S['jokerSlots'],S['consumableSlots'],S['deck'],'ANTE 1 VOUCHER']:size=18
 paste_text(im,s,x,y,size,color,shadow,center)

FIT_REPORT=[]
def fit_text(im,s,cx,cy,max_width,max_height,color='white',sizes=(48,40,32,26,24,20,18,16),align='center'):
 outline=False;extra=2
 for size in sizes:
  m=measure(s,size)
  if m['width']+extra<=max_width and m['height']+extra<=max_height:break
 else:raise ValueError('Text does not fit configured score box: '+s)
 left=cx-max_width//2;right=left+max_width
 if align=='left':x=int(left)
 elif align=='right':x=int(right-m['width']-extra)
 else:x=int(cx-(m['width']+extra)//2)
 y=int(cy-(m['height']+extra)//2)
 paste_text(im,s,x,y,size,color,outline=outline)
 FIT_REPORT.append({'text':s,'size':size,'alignment':align,'bounds':[x-(1 if outline else 0),y-(1 if outline else 0),x+m['width']+2,y+m['height']+2],'fitBox':[cx-max_width//2,cy-max_height//2,cx-max_width//2+max_width,cy-max_height//2+max_height]})

def rounded(d,box,col,r=8):
 x,y,w,h=box;d.rounded_rectangle((x,y,x+w-1,y+h-1),radius=r,fill=rgba(col))

def panel(im,box,fill='panel',border=None,shadow=4,r=8):
 d=ImageDraw.Draw(im);x,y,w,h=box
 if shadow:rounded(d,(x+2,y+shadow,w,h),'#101b1d',r)
 if border:rounded(d,box,border,r);rounded(d,(x+3,y+3,w-6,h-6),fill,max(2,r-3))
 else:rounded(d,box,fill,r)
# Editable procedural backdrop, low-resolution native color clusters with soft swirl structure.
bg=Image.new('RGBA',(W//2,H//2));pixels=[]
for y in range(H//2):
 for x in range(W//2):
  xx=x/512;yy=y/288
  u=xx+.13*math.sin(5.2*yy+2.7*xx)+.06*math.sin(11*yy-3*xx)
  v=yy+.15*math.sin(4.4*xx-3.1*yy)+.05*math.sin(8*xx+5*yy)
  broad=math.sin(7*u+5*v+1.4*math.sin(4*v-2*u))
  strand=math.sin(33*v-16*u+4.5*math.sin(5*u+3*v))
  value=max(0,min(1,.54+.14*broad+.22*math.tanh(1.2*strand)))
  pixels.append((int(22+32*value),int(55+75*value),int(48+53*value),255))
bg.putdata(pixels);bg=bg.resize((W,H),Image.Resampling.NEAREST);bg.save(C/'background.png')
base=Image.new('RGBA',(W,H));d=ImageDraw.Draw(base)
d.rectangle((13,0,252,H),fill=rgba('sidebar'));d.line((12,0,12,H),fill=rgba('red'),width=2);d.line((253,0,253,H),fill=rgba('red'),width=2)
panel(base,(18,38,230,154),'panel','red',4,11)
panel(base,(18,207,230,41),'panel',None,3,8);panel(base,(88,210,155,34),'sidebar',None,0,8)
panel(base,(18,254,230,116),'#172426',None,3,6)
panel(base,tuple(L['score_slots']['blue']),'blue',None,3,7);panel(base,tuple(L['score_slots']['red']),'red',None,3,7)
panel(base,(26,384,70,81),'red',None,4,8);panel(base,(26,475,70,80),'orange',None,4,8)
for box in [(107,380,68,53),(181,380,67,53),(107,444,141,53),(107,507,68,53),(181,507,67,53)]:panel(base,box,'panel',None,3,8)
for box in [(112,399,57,30),(186,399,57,30),(112,448,130,44),(112,528,57,29),(186,528,57,29)]:panel(base,box,'sidebar',None,0,6)
# Shop group outer heavy keyline, muted gray-blue interior wells.
panel(base,(282,188,552,388),'#19272b','red',5,10);panel(base,(288,194,540,377),'panel',None,0,8)
panel(base,(435,201,386,160),'rail',None,0,9)
panel(base,(299,205,131,69),'red',None,5,8);panel(base,(299,280,131,74),'green',None,5,8)
panel(base,(304,389,258,166),'rail',None,0,10);panel(base,(311,396,244,152),'panel',None,0,6)
panel(base,(570,389,244,166),'rail',None,0,10)
for box in [(555,188,50,30),(655,188,50,30),(422,381,50,30),(613,369,50,30),(720,369,50,30)]:panel(base,box,'sidebar','#111d20',4,9)
base.save(C/'panels.png')
labels=Image.new('RGBA',(W,H))
# Side state, all live source data, no text baked into cards or panels.
text(labels,'Round',32,213,1,2);text(labels,'score',32,229,1,2);text(labels,str(S['score']),172,215,3,3)
slots=L['score_slots'];fit_text(labels,str(S['chips']),slots['chipCenterX'],335,slots['textMaxWidth'],slots['textMaxHeight'],align=slots['chipAlign']);fit_text(labels,str(S['mult']),slots['multCenterX'],335,slots['textMaxWidth'],slots['textMaxHeight'],align=slots['multAlign']);fit_text(labels,'×',slots['seamCenterX'],335,slots['operatorMaxWidth'],35,'red')
for s,x,y in [('Run',61,407),('Info',61,427),('Options',61,510),('Hands',141,384),('Discards',214,384),('Ante',141,510),('Round',215,510)]:text(labels,s,x,y,1,2,center=True)
text(labels,str(S['hands']),141,404,3,3,'blue',center=True);text(labels,str(S['discards']),215,404,3,3,'red',center=True);text(labels,'$'+str(S['cash']),178,455,4,4,'gold',center=True)
text(labels,S['ante'].split('/')[0],131,530,3,3,'orange',center=True);text(labels,'/'+S['ante'].split('/')[1],151,537,1,2);text(labels,str(S['round']),215,530,3,3,'orange',center=True)
for s,x,y in [('Next',364,222),('Round',364,241),('Reroll',364,293)]:text(labels,s,x,y,2,2,center=True)
text(labels,'$'+str(S['reroll']),364,316,3,3,center=True)
for s,x,y in [('$'+str(L['prices'][k]),x,y) for k,x,y in [('joker_green',580,193),('joker_ballot',680,193),('voucher',447,386),('buffoon_pack',638,374),('arcana_pack',745,374)]]:text(labels,s,x,y,2,2,'gold',center=True)
text(labels,S['jokerSlots'],273,144,1,2);text(labels,S['consumableSlots'],937,144,1,2);text(labels,S['deck'],913,557,1,2,center=True)
# Rotated vertical caption remains an independently rendered glyph layer.
caption=Image.new('RGBA',(160,18));text(caption,'ANTE 1 VOUCHER',0,0,1,2,'rail',False);caption=caption.crop(caption.getbbox()).rotate(90,expand=True);labels.alpha_composite(caption,(321,408))
# Labels saved after tagline composition below.
# Independently sculpted marquee and ticket sources, not body-font substitutions.
marquee=render_marquee();marquee.save(C/'shop-marquee.png')
render_voucher().save(C/'voucher.png')
# Score chip authored vector/pixel component.
chip=Image.new('RGBA',(24,24));cd=ImageDraw.Draw(chip);cd.ellipse((2,2,22,22),fill=rgba('white'))
for a in range(0,360,45):
 x=12+9*math.cos(math.radians(a));y=12+9*math.sin(math.radians(a));cd.rectangle((round(x)-2,round(y)-2,round(x)+1,round(y)+1),fill=rgba('#91acb4'))
cd.ellipse((6,6,18,18),fill=rgba('#d5e8e8'));chip.save(C/'score-chip.png')
# Independent deck back; repeated suit-like marks are authored, no screenshot sampling.
deck=Image.new('RGBA',(98,137));dd=ImageDraw.Draw(deck)
for off in [10,7,4,0]:panel(deck,(off//2,off,88,124),'white','#647775',0,7)
panel(deck,(5,3,82,118),'#20617a','white',0,5)
cols=['gold','red','blue']
for yy in range(10,116,9):
 for xx in range(11,83,9):
  col=rgba(cols[((xx//9)+(yy//9))%3]);dd.rectangle((xx,yy,xx+2,yy+2),outline=col);dd.point((xx+1,yy-1),fill=col)
deck.save(C/'deck.png')
canvas=bg.copy();canvas.alpha_composite(base);canvas.alpha_composite(marquee,(33,50));paste_text(labels,'Improve your run!',133,162,26,'gold',center=True);labels.save(C/'labels.png');canvas.alpha_composite(labels);canvas.alpha_composite(chip,(143,215));canvas.alpha_composite(deck,(866,425))
missing=[]
for card in L['cards']:
 path=C/(card['id']+'.png')
 if not path.exists():missing.append(card['id']);continue
 im=Image.open(path).convert('RGBA').resize(tuple(card['size']),Image.Resampling.NEAREST)
 if card['id']=='voucher':paste_text(im,'VOUCHER',39,13,16,'#465971',False,True)
 if card['rotation']:im=im.rotate(card['rotation'],Image.Resampling.NEAREST,expand=True)
 x,y=card['xy'];shadow=Image.new('RGBA',im.size,'#112e24');shadow.putalpha(im.getchannel('A').point(lambda a:int(a*.6)));canvas.alpha_composite(shadow,(x+5,y+7));canvas.alpha_composite(im,(x,y))
canvas.save(O/'balatro-shop-1024x576.png');canvas.resize((2048,1152),Image.Resampling.NEAREST).save(O/'balatro-shop-2x.png')
(O/'render-report.json').write_text(json.dumps({'canvas':[W,H],'missingCardComponents':missing,'previewType':'Offline independent-component render, not browser screenshot','originalPixelsRead':False,'status':'incomplete' if missing else 'representative-candidate','fontSource':'fonts/canonical independently frozen per-size masters from creator-sourced m6x11; no runtime scaling/FreeType; exact game version unverified','textBounds':TEXT_BOUNDS,'scoreFit':FIT_REPORT},indent=2)+'\n',encoding='utf-8')
print('Rendered; missing card components:',missing)
