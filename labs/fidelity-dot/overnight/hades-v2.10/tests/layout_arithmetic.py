from pathlib import Path
import json
s = json.loads((Path(__file__).resolve().parents[1] / 'spec.json').read_text(encoding='utf-8'))

def percent(x):
    return float(x.rstrip('%')) / 100

def unit(x):
    return float(x.rstrip('cqw')) / 100
results = []
for count in [2, 3, 4]:
    c = {**s['tokens'], **s['counts'][str(count)]}
    W = 1024
    H = W * 9 / 16
    panel = (0.24 * W, 0.155 * H, 0.77 * W, (0.155+percent(c['--panel-height']))*H)
    inner = (panel[0] + 0.03 * W, panel[1] + 0.03 * W, panel[2] - 0.03 * W, panel[3] - 0.03 * W)
    labelTop = 0.155 * H + 0.0304 * W
    labelBottom = labelTop + 0.016 * W * 1.1
    width = percent(c['--list-width']) * W
    left = percent(c['--list-left']) * W
    top = percent(c['--list-top']) * H
    gap = unit(c['--list-gap']) * W
    rh = width * 435 / 1893
    scale = width / 1893
    for i in range(count):
        y = top + i * (rh + gap)
        for name, b, canvas in [('normal', s['row']['renderViewport'], s['row']['normalCanvas']), ('selection', s['row']['renderViewport'], s['row']['selectionCanvas'])]:
            bounds = (left + (b[0] - 25) * scale, y + (b[1] - 165) * scale, left + (b[2] - 25) * scale, y + (b[3] - 165) * scale)
            assert bounds[0] >= inner[0] and bounds[1] >= inner[1] and (bounds[2] <= inner[2]) and (bounds[3] <= inner[3]), (count, i, name, bounds, inner)
            assert bounds[1] >= labelBottom, (count, i, name, 'label overlap')
            if count == 4:
                full = (left - 25 * scale, y - 165 * scale, left + (canvas[0] - 25) * scale, y + (canvas[1] - 165) * scale)
                assert full[1] >= labelBottom and full[3] <= inner[3], (count, i, 'full canvas')
    results.append({'count': count, 'labelBottom': labelBottom, 'firstCoreTop': top, 'coreHeight': rh, 'lastCoreBottom': top + (count - 1) * (rh + gap) + rh, 'panelInnerBottom': inner[3], 'status': '通过'})
print(json.dumps({'scope': 'Static arithmetic only, no browser geometry or font rendering', 'results': results}, indent=2))
