"""Pixel evidence, not browser acceptance. Requires Pillow; inputs unchanged PNGs."""
from pathlib import Path
import sys,json,hashlib
from PIL import Image
root=Path(__file__).resolve().parents[1]
paths=[Path(x) for x in sys.argv[1:]] or [root/'components/neutral-row-v27.png',root/'components/selection-overlay-v27.png']
results=[]
for path in paths:
    im=Image.open(path);alpha=im.getchannel('A');w,h=im.size
    areas=[alpha.crop((0,0,w,151)),alpha.crop((0,619,w,h)),alpha.crop((0,151,10,619)),alpha.crop((1935,151,w,619))]
    excludedMax=max(part.getextrema()[1] for part in areas)
    assert excludedMax<=1,(path,excludedMax)
    bounds=alpha.point(lambda value:255 if value>1 else 0).getbbox()
    assert bounds[0]>=10 and bounds[1]>=151 and bounds[2]<=1935 and bounds[3]<=619
    results.append({'file':path.name,'canvas':[w,h],'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'excluded_alpha_max':excludedMax,'alpha_above1_bounds':bounds,'all_above1_retained':True})
print(json.dumps({'scope':'Exact source pixels outside CSS viewport; no browser render test','results':results},indent=2))
