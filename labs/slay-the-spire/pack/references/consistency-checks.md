# Acceptance checks

Record pass, drift or not tested with observations. A successful Skill validator checks metadata, not visual quality or game behavior.

| Area | Acceptance evidence |
|---|---|
| Reference use | Agent actually opened both studies and the component specimens; no full reference image used behind interactive text |
| Distinct direction | Dark stone, worn old gold, parchment, painted objects and deep red action are present; no CRT, poker or pixel-art drift |
| Family consistency | Same item IDs use the same sprite; fonts, metal frame, paper, selection plaque and resources match across views |
| Different compositions | Rewards focus a choice; inventory uses dense slots plus details; shop compares offers with a persistent purse |
| Editability | Names, prices, effects, quantities, controls and messages remain DOM text/data |
| States | Default, hover, selected, pressed, disabled and keyboard focus are visibly distinguishable; disabled reason readable |
| Reward | Selecting grants nothing; confirming grants once; repeated confirmation cannot duplicate a reward |
| Potion | Using consumes one; HP increases but never exceeds max; zero quantity and full HP are explained |
| Purchase | Exact price deducted; inventory +1 and stock -1; insufficient funds/sold-out handled; no negative balances |
| Accessibility | Native controls, labels, visible focus, selection semantics, polite result messages; no color-only state |
| Assets | All local references load without network; font licenses retained; atlas is 1536×1024 RGBA with correct six cells |
| Fit | 1280×900 desktop and 390×844 compact layouts have no horizontal clipping or unreadable compressed cards |

Compare views side by side at one viewport. Also inspect the selected item and action at full size: no sheet fragments, neighboring sprites, blurred functional text or illegible parchment copy. Motion must respect `prefers-reduced-motion`.

Report what was actually tested, screenshots and runtime errors. Identify whether a fresh independent agent or the package author made the pages. Do not infer cross-model reliability, engine compatibility, commercial clearance or production readiness from one Web exercise. Keep independent generated screens outside this Skill's inputs.
