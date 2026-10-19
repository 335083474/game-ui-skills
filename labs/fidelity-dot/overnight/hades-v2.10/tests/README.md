# Tests — hades-draft-v2.10
Pure-data recorded cases: 22, derived from data-io-results.json. Run node tests/data-io.test.cjs.
Non-browser: python tests/spec_consistency.py; python tests/utf8_io.py; python tests/layout_arithmetic.py.
Approved browser environment only:
node tests/safe-panel.cjs /absolute/package /absolute/output
node tests/option-counts.cjs /absolute/package /absolute/output
node overview-browser-test.cjs /absolute/package /absolute/output
Browser scripts are supplied but unexecuted here. safe-panel checks both screens' actual body/status geometry, normal/long statuses, warnings and screenshots. Rendering/fidelity/fresh-context acceptance require recipient review.
