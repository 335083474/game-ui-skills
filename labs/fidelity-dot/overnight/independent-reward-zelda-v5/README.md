# Independent customer build: reward choice

Entry: http://127.0.0.1:4211/ while the local server is running.

Run from PowerShell, from any working directory:

```powershell
python -m http.server 4211 --bind 127.0.0.1 --directory 'D:\SEA\receiver-tests\zelda-skill-v5\independent\app'
```

Open that HTTP URL in Edge. Only `app/` is served. Stop with Ctrl+C. Port 4211 had no listener before the independent server started. The test server was left running for review. No build, package installation, account or paid service is required. Do not use file://: this new page loads its JSON with fetch.

The scene itself is a 256×224 canvas. Desktop CSS displays it at 512×448; narrow layouts display it at 256×224. The HTML controls, configuration editor and scrollable description dialog deliberately sit outside the native scene.

Mouse: select one of the three cards or corresponding accessible buttons; Review opens its original complete description; Claim awards the named quantity once. Back to choices closes reading without awarding. Cancel reward closes the selection without awarding. Return to choices reopens a cancelled cache.

Keyboard: focus the scene with Tab/click. Arrows choose; Home/End choose first/last; Enter/Space review; PageUp/PageDown paginate native description. Escape in the dialog returns to choices; Escape on the scene cancels. Tab moves through dialog actions and Enter activates a focused action. HTML controls also work with normal Tab navigation.

Edit `app/rewards.json`, then reload to change defaults. Or expand “Replace reward configuration”, edit the JSON, and Apply. `app/replacement.json` demonstrates changing the second reward to Golden Boots ×7 with a different local icon and description. The page's replacement button loads it. Edits applied in the browser are not saved back to JSON. The event ID is cache identity: changing it deliberately creates a new cache.

Configuration fields: `eventId` (1–64 letters/digits/underscore/hyphen), short `title` (1–28 characters), `selectedIndex` (0–2), and exactly three `rewards`. Each reward has unique nonempty `id`, `name`, relative `components/*.png` `icon`, integer `count` 1–9999, and nonempty `description`. Name/description text is preserved verbatim; native text uses uppercase bitmap glyphs. Unsupported glyphs produce `?` and diagnostics; original full text remains readable in the dialog. Long names wrap in three card lines and mark continuation with `+`; the full name remains in the dialog and accessible button. Existing local 16×16 icons are expected; image failure is visible and diagnosed.

The independent runtime is `app/reward.js`, not an added screen name in the package's two-screen API. Layout coordinates are explicit there. Panel geometry can be regenerated with the existing Python/Pillow installation:

```powershell
python 'D:\SEA\receiver-tests\zelda-skill-v5\independent\make_panels.py'
node --check 'D:\SEA\receiver-tests\zelda-skill-v5\independent\app\reward.js'
```

Receipts are localStorage records under `independent-zelda-reward-v1:<eventId>`. They survive reload and same-ID configuration application. Existing receipts are read before claiming; the receipt snapshots the actual name, icon, quantity and original description. This is a local demo ledger, not inventory integration or a secure backend. Clearing browser storage, using another origin/browser, or changing event ID creates an independent ledger. Simultaneous claims in separate tabs were not tested; localStorage is not a transactional server ledger.

The test consumed `forest-cache-01` (Field Notes ×1) and `mountain-cache-02` (Golden Boots ×7). The delivered forest default uses a fresh `forest-cache-demo-03`, left unclaimed for review. Evidence retains the exact original test configuration. All files here are independent test outputs; `input.zip` and extracted package files were not modified.

Read `independent-use-report.md` for observations, actual failures/fixes and evidence. No author-provided QA result was used as proof.
