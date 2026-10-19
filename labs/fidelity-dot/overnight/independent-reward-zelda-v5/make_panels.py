"""Independent reward-layout panel adaptation; requires already-installed Pillow."""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
for name, w, h, color in [
    ('reward', 76, 80, (56, 208, 64)),
    ('details', 240, 66, (232, 192, 0)),
    ('actions', 240, 34, (240, 24, 24)),
]:
    image = Image.new('RGBA', (w, h))
    draw = ImageDraw.Draw(image)

    def ring(n, corner):
        left = top = n
        right, bottom = w - 1 - n, h - 1 - n
        return [(left+corner,top),(right-corner,top),(right,top+corner),
                (right,bottom-corner),(right-corner,bottom),(left+corner,bottom),
                (left,bottom-corner),(left,top+corner)]

    draw.polygon(ring(0, 4), fill=(0, 0, 0, 255))
    for n, rgba in enumerate([(0,0,0,255),(*color,255),(*color,255),(248,248,240,255)]):
        points = ring(n, 4-n)
        draw.line(points+[points[0]], fill=rgba, width=1)
    image.save(ROOT / 'app' / 'components' / ('panel_'+name+'.png'))
print('Regenerated the three independent reward panels.')
