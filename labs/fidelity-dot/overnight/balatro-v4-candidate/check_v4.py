from pathlib import Path
from PIL import Image
import json,re,hashlib
R=Path(__file__).resolve().parent
metrics=json.loads((R/'fonts/canonical/canonical_metrics.json').read_text(encoding='utf-8'))
for m in metrics['masters'].values():
 original=Image.open(R/'fonts/canonical'/m['atlas']).convert('L');alpha=Image.open(R/'fonts/browser'/m['atlas']).getchannel('A');assert original.size==alpha.size and original.tobytes()==alpha.tobytes(),m['atlas']
for name in ['shop.html','collection.html','index.html','browser-harness.html']:
 for p in re.findall(r'(?:src|href)="([^"#]+)"',(R/name).read_text(encoding='utf-8')):
  if not p.startswith(('http','data:')):assert (R/p).is_file(),(name,p)
for screen in ['shop','collection']:
 scene=json.loads((R/'output'/f'{screen}-commands.json').read_text(encoding='utf-8'))
 for c in scene['commands']:
  if c['type']=='text':assert 0<=c['x'] and 0<=c['y'] and c['x']+c['width']+2<=1024 and c['y']+c['height']+2<=576,c
  if c['type']=='image':assert (R/c['src']).is_file(),c
 im=Image.open(R/'output'/f'{screen}-runtime-offline.png');assert im.size==(1024,576)
 im2=Image.open(R/'output'/f'{screen}-runtime-offline-2x.png');assert im.resize((2048,1152),Image.Resampling.NEAREST).tobytes()==im2.tobytes()
report={'version':4,'browserExecuted':False,'actualWindowsExecuted':False,'fontAlphaDerivativesExact':True,'relativeDependenciesPresent':True,'defaultTextBoundsIncludingShadow':True,'sameSceneCommandBuilderOfflinePreviews':True,'offlinePreviewsAreBrowserScreenshots':False,'note':'Native browser raster edges and interaction require recipient testing; prior v3 recipient evidence does not prove v4.'}
(R/'output/v4-static-validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print('PASS v4 alpha masks, relative paths, text/shadow bounds, native/offline nearest2x. No browser or Windows execution claimed.')
