# Verification rubric

Render related screens at the same viewport; inspect images together. Mark pass / drift / not tested with actual observations. Reference targets do not replace observing the output.

| Check | Observable evidence |
|---|---|
| Palette and felt | Same teal backdrop, cream, coral primary, blue secondary, gold money |
| Typeface | Same bundled font and hierarchy; no accidental browser serif |
| Geometry | Matching edge, hard shadow, compact corners, slots |
| Art | Same actual atlas sprite for the same item |
| State language | Label/check plus selected border; distinct disabled; keyboard focus |
| Hierarchy | Reward chooses; inventory scans slots; shop compares prices; three different layouts |
| Editability | Real text and controls; no full-screen screenshot as UI |
| Behavior | Reward grants once; inventory consumes; shop charges and rejects insufficient funds |
| Fit | Desktop and compact widths without clipped text or page-wide overflow |

Web exercise: desktop 1440x900 or 1280x800, compact 390x844; inspect 809px when adapting the catalog side-panel. Reflow rather than shrinking a desktop screenshot.

Record runtime errors and broken assets. State whether a fresh independent agent, shared session or deterministic renderer made the outputs. One run does not establish cross-model reliability.
