# Sources and edition boundary

Checked 2026-10-16. The target is the original Final Fantasy VII blue menu family (1997 PlayStation and classic PC ports). This package is a new Web interpretation with original demo characters and generated assets; it does not include extracted game resources. No official screenshots or manual pages are redistributed.

## Primary publisher listing

- [Square Enix — FINAL FANTASY VII, Steam app 3837340](https://store.steampowered.com/app/3837340/) is the user-selected primary source. At inspection it identifies Square Enix/FINE and describes an upgraded version of FINAL FANTASY VII – 2013 Edition with additional convenience features. The page displays 24 July 2013 as release date. Do not treat that date as the first release of the original 1997 game or infer an exact binary build number from the listing. The package does not claim pixel-exact equivalence to this port.
- [Steam appdetails endpoint](https://store.steampowered.com/api/appdetails?appids=3837340&l=english) supplied the gallery URLs saved in [steam-gallery.json](steam-gallery.json). These URLs identify the precise images inspected; the query cache timestamp is retained. The gallery is authoritative publisher-supplied visual material for this store edition, not a licensing grant for reuse.
- [Gallery entry 0 — summon with command/status windows](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3837340/1ac9db3267d37c0a96a926fdd8b09dfa7831e044/ss_1ac9db3267d37c0a96a926fdd8b09dfa7831e044.1920x1080.jpg?t=1775108423): observed narrow blue command list, white hand cursor, numeric HP/MP, separate Limit and Wait columns.
- [Gallery entry 5 — guard-machine battle](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3837340/348f025dd039ad6b927d2a08a6f24c2af2dd81ec/ss_348f025dd039ad6b927d2a08a6f24c2af2dd81ec.1920x1080.jpg?t=1775108423): observed bottom blue status band, thin silver frame, green Time gauge and compact white figures.
- [Gallery entry 6 — command list and target triangle](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3837340/4a9a0ee662b510a6f9e2eced9e54c352de1c448c/ss_4a9a0ee662b510a6f9e2eced9e54c352de1c448c.1920x1080.jpg?t=1775108423): observed command window overlapping status area and yellow actor marker in battle arena.
- [Gallery entry 8 — Limit command](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3837340/b6763d320ea4329faebba832f8a277f6433316f3/ss_b6763d320ea4329faebba832f8a277f6433316f3.1920x1080.jpg?t=1775108423): observed top action strip and separate bottom status/command windows.

The inspected Steam gallery primarily supplies battle, field, minigame and cinematic views. It was not treated as proof of detailed party/equipment layouts.

## Original-menu corroboration

- [Gears — A Look Inside the Final Fantasy VII Game Engine, Joshua Walker and the Qhimm Team](https://q-gears.sourceforge.net/gears.pdf#page=59). This is a fan reverse-engineering document, not an official Square Enix manual. PDF page 59 (zero-based 58) shows original-style Party, Item and Magic menus; page 60 (zero-based 59) shows Equip, Stat and Change/Order. Both pages were visually inspected. Observed: left portraits and compact resources, right menu list, small cyan category labels, sparse silver frames, dense equipment/stat columns, and the Order cursor layered over party rows. The screenshots depict classic PC-era menu anatomy; the document does not establish the exact build of the current Steam port.
- [Original-menu index at the Final Fantasy Wiki](https://finalfantasy.fandom.com/wiki/Menu_(Final_Fantasy_VII)) was used for locating the original-menu subject and differentiating it from Remake. It reports four default blue corner values (176, 128, 80, 32), used here as design starting colors; they are not a calibrated color sample from the current Steam screenshots. Package tokens and CSS are approximations.

## Redistributable font

- [Google Fonts primary repository — IBM Plex Sans](https://github.com/google/fonts/tree/main/ofl/ibmplexsans).
- [Downloaded font source](https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsans/IBMPlexSans%5Bwdth,wght%5D.ttf), saved as `assets/fonts/IBMPlexSans-Variable.ttf`; internal font version **3.201**, copyright **2019 IBM Corp.**; fetched 2026-10-16.
- [Original OFL license text](https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsans/OFL.txt), preserved at `assets/fonts/OFL.txt`. Font is a visually appropriate redistributable substitute, not a reproduction of the game's bitmap glyphs. A SHA-256 is recorded in [validation.json](validation.json).

## Package-created material

- `references/images/screen-direction.png`: built-in image generation, 1536×1024 RGB, a generated interpretation. The generated image includes accidental franchise names and spell costs; they are not data or a claim of authentic text. Follow the rules and original demo-state names instead.
- `assets/items-atlas.png`: built-in image generation, 1536×1024 RGBA, six distinct original portrait/item studies. Art roles, coordinates and measured alpha bounds are in asset-map.json. The final PNG is unchanged from tool output.
- `assets/components/index.html` and `theme.css`: newly authored isolated HTML/CSS primitives using the local atlas and font. The later component-board PNG is a real browser capture of this file, not a generated substitute for QA.
- Exact prompts and original tool save paths are in [generation.json](generation.json). No claim is made that generated interpretation art is official game imagery, extracted sprites, a production engine export or a cleared Square Enix asset license.
