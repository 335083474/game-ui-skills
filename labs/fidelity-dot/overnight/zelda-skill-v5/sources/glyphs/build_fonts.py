"""Export compatibility maps and file:// browser bindings from editable canonical JSON."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parent
source=json.loads((ROOT/'font_arrays.json').read_text(encoding='utf-8'))
compat={**source,'fonts':{}}
for name,font in source['fonts'].items():
 compat['fonts'][name]={'height':font['height'],'lineHeight':font['lineHeight'],'line_height':font['lineHeight'],'fallback':font['fallback'],'tracking':1 if name in ['compact5','counter7'] else 2,'glyphs':{c:g['rows'] for c,g in font['glyphs'].items()},'metrics':{c:{'width':g['width'],'advance':g['advance'],'bearing_x':g['bearingX'],'bearing_y':g['bearingY']}for c,g in font['glyphs'].items()}}
(ROOT/'font_compat.json').write_text(json.dumps(compat,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(ROOT/'font_data.js').write_text('/* Authored bitmap font data; no network needed. */\nwindow.PIXEL_FONT_DATA='+json.dumps(source,ensure_ascii=False)+';\nwindow.FONT_DATA='+json.dumps(compat,ensure_ascii=False)+';\n',encoding='utf-8')
