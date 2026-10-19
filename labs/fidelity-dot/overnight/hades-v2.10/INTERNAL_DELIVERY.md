# Transfer/release instructions
This deliverable guide is for release assembly, not customer setup. The marked-TXT payload contains code/docs only. Decode BEGIN_BASE64..END_BASE64, verify published ZIP SHA, extract into a new folder. Reuse the exact already-verified 10 PNGs and 7 TTFs and licenses from the existing assembled asset folder at their original relative paths. No v2.10 image bytes change.
Run verify_assets.py and build_spec.py --check; then freeze a complete folder ZIP for the customer/fresh-context test. Include overview.html as second scene.
Do not overwrite frozen old packages or independent third-screen output. Customer README assumes assembly complete. A folder containing only code transport must honestly display UNASSEMBLED.
