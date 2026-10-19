# Visual rules

## Art direction

An unfinished paper map where route geometry is the primary control surface.

## Reusable grammar

- Let point, line, shape, spacing, and short labels do nearly all of the work. Use a quiet paper ground, crisp geometry, and a small route palette; omit shadows, card stacks, gradients, and decorative city illustrations.
- Station shape encodes type, route color encodes line, and text describes the selected or overloaded state. Keep a visible legend and never rely on color alone.
- The route editor is an open topology canvas. Keep junctions, transfer points, and line segments visible; show the focused line with weight or a numbered label, not a large floating panel.
- Capacity upgrades read as a small resource choice attached to the network, using pictograms and current/next counts. Results return to the same map with passenger flow and bottlenecks highlighted.
- At mobile widths, preserve the complete network where possible, allow pan/zoom in the eventual app, and move only brief line/capacity details into a slim edge inspector. Avoid turning the map into stacked metric cards.

## Screen patterns

Read [screen-patterns.md](screen-patterns.md) for the three screen contracts. Reuse only the components that serve the requested task.

## Source and accuracy boundary

The product page and original-art boundary are recorded in [sources.md](sources.md). Treat every supplied number, item, route, and status as a synthetic specimen unless a future output has its own authoritative data source.
