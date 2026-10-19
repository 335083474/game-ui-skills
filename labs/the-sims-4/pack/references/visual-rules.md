# Visual rules

## Scope and confidence

This package defines a **base-game The Sims 4 UI hypothesis** from the frozen research entry. That entry does not name a build / patch number or record completed current-version screen sampling. Treat the rules as a design starting point; freeze and inspect the selected edition before making a claim of exact fidelity. The goal is a bright household simulation surface, not a general social network or CRM.

## Surface and color

Use an off-white shell (`#f7f9fb`), pure but softened content panels (`#ffffff`), cool light gray (`#e7edf2`), sky blue (`#3c82ba`) for navigation and actions, teal (`#45a995`) for active / filled meters, and fresh green (`#67b94b`) for positive states. Keep the page light and airy with a clear foreground / background split. Panel borders are thin cool-gray lines and shadows are soft, short, and low opacity. Corners are visibly rounded (12–20px) but not capsule-shaped. Avoid dark app chrome, rough paper, neon, metal frames, and overly decorative gradients.

## Type, people, and needs

Use a friendly neutral sans such as system UI / Arial. Keep names clear, body labels around 15–18px, and numbers tabular. One selected member is the primary identity; the rest of the household may appear as a small switcher. If real or generated portraits are available, show one clear, uncropped face in a rounded-rectangle portrait frame. The component board uses initials only as placeholders. Do not use initials as a finished character portrait.

Need meters pair a short label / icon with a text value or accessible progress value. Use consistent fills and empty tracks; no unlabeled decorative bars. Do not imply that a full meter means happiness across every need or that the shown values represent a real game save. Important / low states use a written cue or small symbol in addition to hue.

## Catalog and social graph

Object catalogue tiles show one simple object thumbnail, name, category, and price. Selecting a tile updates a single preview and placement controls; it does not buy or place an item. Use a comfortable shelf/grid with clear room or category filters. Keep the purchased / placed state separate from focus.

Relationships use a small graph or family / friend connection view: people are nodes, relationship is the line, and direction / type is labeled. A selected relation opens one detail surface with names and a short tie description. Don't use a global heatmap or equal-sized contact cards. Limit the initial visible graph to a few relationships; let the user open a larger map when needed.

## Screen composition

- Needs: one selected household member, six clearly named need meters, and a small member switcher. Keep aspiration / mood detail in one secondary surface.
- Build catalogue: a search / room filter, object shelf, and one selected preview. Keep price and placement controls near the selected object.
- Relationships: a small linked graph, selected member / relation detail, and a filter for friendship / family / tense ties. Preserve node labels when the graph shifts.

At narrow widths, stack selected-member identity above needs, collapse catalog filters behind one labelled control, and make the relationship graph pan or zoom without hiding the selected relation. Keep touch targets at least 44px. Use only short transitions for selection / placement state; respect reduced motion.

## Asset and data boundary

The style-reference SVG and component specimens are authored with generic sample data. There are no Sims portraits, Plumbob marks, furniture models, official screenshots, copied UI text, or font files. Make new character / object art original and confirm rights separately before distribution. Do not present this UI hypothesis as a current patch capture.
