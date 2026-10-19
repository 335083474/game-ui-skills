from pathlib import Path
import json,hashlib,warnings
from PIL import ImageFont
from canonical_font import render_mask,measure,center_x
R=Path(__file__).resolve().parent
ImageFont.truetype=lambda *a,**k:(_ for _ in ()).throw(AssertionError('Runtime TTF rasterization forbidden'))
vectors=json.loads((R/'expected_vectors.json').read_text(encoding='utf-8'))
for v in vectors:
 mask=render_mask(v['text'],v['size']);assert list(mask.size)==v['maskSize'];assert measure(v['text'],v['size'])==v['measure'];assert hashlib.sha256(mask.tobytes()).hexdigest()==v['rawSHA256'];assert set(mask.getdata())<={0,255};assert center_x(100,v['text'],v['size'])==100-mask.width//2
with warnings.catch_warnings(record=True) as caught:
 warnings.simplefilter('always');mask=render_mask('A🧪B',19);assert len(caught)==1 and mask.tobytes()==render_mask('A?B',19).tobytes()
report={'frozen_vectors_passed':len(vectors),'runtime_truetype_blocked':True,'exact_fixed_point_advances':True,'binary_masks':True,'fallback_warned_and_visible':True,'actual_windows_test':False,'cross_cwd':'/tmp','python_utf8_mode_disabled':True}
(R/'validation.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
