from pathlib import Path
import json, subprocess, sys
r = Path(__file__).resolve().parents[1]
s = json.loads((r / 'spec.json').read_text(encoding='utf-8'))
css = (r / 'scene.css').read_text(encoding='utf-8')
p = (r / 'prototype.css').read_text(encoding='utf-8')
subprocess.run([sys.executable, str(r / 'build_spec.py'), '--check'], check=True)
assert 'height:var(--panel-height)' in css
label = s['label']
assert 'top:' + label['top'] + ';font-size:' + label['font'] + ';line-height:' + str(label['lineHeight']) in css
for asset in [s['row']['normal'], s['row']['selection']]:
    assert asset in (r / 'scene.js').read_text(encoding='utf-8') and asset in (r / 'prototype.js').read_text(encoding='utf-8')
assert s['frame']['asset'] in css and s['emblem']['asset'] in (r / 'scene.html').read_text(encoding='utf-8')
assert 'line-height:' + str(s['header']['titleLineHeight']) in css
assert '.scene[data-option-count="4"]{' not in css, 'Count tokens must only exist in generated tokens.css'
assert 'left:23%' in p and 'width:17.2%' in css
print('PASS: current documents, tokens and critical code contract')

assert 'var(--safe-panel-padding)' in (r/'safe-panel.css').read_text(encoding='utf-8')
assert 'minmax(0,1fr) auto' in (r/'safe-panel.css').read_text(encoding='utf-8')
assert s['safePanel']['baseOwner'].startswith('right tooltip left76% top64% width23% height24%')
for name in ['scene.html','overview.html']:
    html=(r/name).read_text(encoding='utf-8')
    assert 'safe-panel-body' in html and 'safe-panel-status' in html and 'safe-panel.js' in html

assert s['row']['renderViewport']==[10,151,1935,619]
assert s['tokens']['--scene-title-tracking']=='.3845em'
assert 'letter-spacing:var(--scene-title-tracking)' in css
