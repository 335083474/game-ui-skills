"""Read-only verification of every required asset in asset-manifest.json."""
from pathlib import Path
import hashlib, json, sys
root = Path(__file__).resolve().parent
manifest = json.loads((root / 'asset-manifest.json').read_text(encoding='utf-8'))
results = []
for item in manifest['pngs'] + manifest['fonts']:
    path = root / item['path']
    if not path.is_file():
        status = 'MISSING'
    elif path.stat().st_size != item['bytes']:
        status = 'SIZE_MISMATCH'
    elif hashlib.sha256(path.read_bytes()).hexdigest() != item['sha256']:
        status = 'HASH_MISMATCH'
    else:
        status = 'VERIFIED'
    results.append({'path': item['path'], 'status': status})
okay = all((item['status'] == 'VERIFIED' for item in results))
print(json.dumps({'version': manifest['version'], 'assembly': 'ALL_REQUIRED_ASSETS_VERIFIED' if okay else 'UNASSEMBLED', 'results': results, 'browser_verified': False}, ensure_ascii=False, indent=2))
sys.exit(0 if okay else 1)
