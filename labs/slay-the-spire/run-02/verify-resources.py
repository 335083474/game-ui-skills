"""Offline resource and source-integrity checks; no browser automation."""
import hashlib
import json
import re
import struct
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent
source = Path('D:/SEA/game-ui-skills/skill-packages/slay-the-spire-ui/assets')
resources = []
for relative in ['index.html', 'style.css', 'assets/components/theme.css']:
    file = root / relative
    text = file.read_text(encoding='utf-8')
    urls = re.findall(r'(?:src|href)="([^"]+)"', text) if file.suffix == '.html' else re.findall(r'url\([\"\']?([^\"\')]+)', text)
    for url in urls:
        if url.startswith('#'):
            continue
        assert not re.match(r'^[a-z]+:', url, re.I), f'Non-local URL: {url}'
        target = (file.parent / url).resolve()
        assert target.is_relative_to(root), f'Outside output: {target}'
        assert target.is_file(), f'Missing resource: {target}'
        resources.append(str(target.relative_to(root)).replace('\\', '/'))

copied = ['items-atlas.png', 'components/theme.css', 'components/stone.svg', 'components/paper.svg']
copied.extend(str(item.relative_to(source)).replace('\\', '/') for item in (source / 'fonts').rglob('*') if item.is_file())
for relative in copied:
    expected = hashlib.sha256((source / relative).read_bytes()).hexdigest()
    actual = hashlib.sha256((root / 'assets' / relative).read_bytes()).hexdigest()
    assert actual == expected, f'Copied resource mismatch: {relative}'
atlas = (root / 'assets/items-atlas.png').read_bytes()
assert atlas[:8] == b'\x89PNG\r\n\x1a\n'
width, height, depth, color = struct.unpack('>IIBB', atlas[16:26])
assert (width, height, depth, color) == (1536, 1024, 8, 6)
syntax = subprocess.run(['node', '--check', str(root / 'app.js')], check=True, capture_output=True, text=True)
state = subprocess.run(['node', str(root / 'verify-state.cjs')], check=True, capture_output=True, text=True)
report = {
    'javascript_syntax': 'PASS',
    'state_checks': json.loads(state.stdout),
    'local_resource_references': {'result': 'PASS', 'references_checked': len(resources), 'unique_files': sorted(set(resources))},
    'copied_assets_sha256': {'result': 'PASS', 'files_checked': len(copied)},
    'font_licenses': ['assets/fonts/alegreya-sc/OFL.txt', 'assets/fonts/crimson-text/OFL.txt'],
    'atlas': {'result': 'PASS', 'width': width, 'height': height, 'color': 'RGBA', 'bit_depth': depth},
    'browser_qa': 'NOT EXECUTED by this agent; parent owns browser QA',
    'screen_types': ['branching NPC dialogue', 'settings'],
}
(root / 'verification-results.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report, indent=2))
