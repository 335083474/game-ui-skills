"""Actual cloud tests; does not claim native Windows or full cross-platform equality."""
from pathlib import Path
from PIL import ImageFont,Image
import runpy,json,hashlib
R=Path(__file__).resolve().parent
def forbidden(*a,**k):raise AssertionError('Unexpected FreeType rasterization')
ImageFont.truetype=forbidden
ns=runpy.run_path(str(R/'render.py'))
controls=json.loads((R/'fonts/canonical/v2_count_controls.json').read_text(encoding='utf-8'))
for c in controls:
 mask=ns['render_mask'](c['text'],c['size']);assert list(mask.size)==c['shape'] and hashlib.sha256(mask.tobytes()).hexdigest()==c['rawSHA256']
slots=ns['L']['score_slots'];assert slots['red'][0]-(slots['blue'][0]+slots['blue'][2])==28
cases=[('0','0'),('9','99'),('999','123'),('1234','9999'),('999999','99999999'),('9999999999','1000000000')]
gallery=Image.new('RGBA',(460,216),'#18262a');reports=[]
for index,(chips,mult) in enumerate(cases):
 canvas=Image.new('RGBA',(1024,576),'#18262a');ns['panel'](canvas,tuple(slots['blue']),'blue');ns['panel'](canvas,tuple(slots['red']),'red');start=len(ns['FIT_REPORT'])
 for value,cx,width,color,alignment in [(chips,slots['chipCenterX'],78,'white','right'),(mult,slots['multCenterX'],78,'white','left'),('×',slots['seamCenterX'],24,'red','center')]:ns['fit_text'](canvas,value,cx,335,width,35,color,align=alignment)
 for r in ns['FIT_REPORT'][start:]:
  x,y,right,bottom=r['bounds'];left,top,fr,fb=r['fitBox'];assert left<=x<=right<=fr and top<=y<=bottom<=fb,r;assert r['size']in[16,18,20,24,26,32,40,48]
 reports.append(ns['FIT_REPORT'][start:]);gallery.alpha_composite(canvas.crop((18,300,248,372)),((index%2)*230,(index//2)*72))
try:ns['fit_text'](Image.new('RGBA',(1024,576)),'999999999999',72,335,78,35)
except ValueError:oversize_rejected=True
else:raise AssertionError('Oversize numeric string silently accepted')
gallery.save(R/'output/score-fit-cases.png')
# Frozen atlas helper expected hashes and explicit non-grid rejection.
runpy.run_path(str(R/'fonts/canonical/test_font.py'))
report={'runtimeFreeTypeCallsBlocked':True,'scoreCases':reports,'oversizeExplicitError':oversize_rejected,'slotGapPixels':28,'actualWindowsRun':False,'fullCrossPlatformPNGIdentity':'v2 recipient Windows24PNG pixel match confirmed; v3 still awaits recipient verification','scope':'local Linux/Pillow canonical-mask and geometry checks'}
(R/'output/v3-test-results.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print('PASS v3: canonical atlas/no FreeType, six multi-digit cases,28px slot gap, oversize explicit error. No Windows identity claim.')
