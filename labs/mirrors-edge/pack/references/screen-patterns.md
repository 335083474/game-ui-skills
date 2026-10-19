# Screen patterns and invented demo state

All destinations, objectives, times, route risks, and key mappings in these examples are invented. They are not extracted game data.

## Runner Map — runner-map

Draw one starting position, one endpoint, and two possible paths. Add a small name and trade-off at each route, such as exposed/open versus longer/covered. Keep north, distance, and route notes explicit. Selecting a line previews it; “Plot line” confirms the page-session choice; “Clear preview” cancels.

Demo routes: Canal Edge (2.4 km demo estimate, open crossing) and Service Roof (3.1 km demo estimate, covered approach). Estimates are illustrative and have no connection to a real game map.

## Mission Brief — mission-brief

Separate purpose from navigation. Show a short operation name, one target, a three-step objective list, a route note, and one primary action. “Accept brief” confirms only the local demo state. “Back” cancels the brief choice.

Demo operation: “North Relay Courier.” Objective list: reach the relay door, carry the sealed packet, leave via the east stair. The words and sequence are synthetic.

## Movement HUD — movement-hud

Show a compact edge cue over a pale architectural sample. The cue names the current obstacle, shows one directional arrow, and displays a key marked “demo mapping.” It can be dismissed and restored; long objectives stay out of the movement view.

Demo cue: “Vault the low barrier,” with Space shown only as this specimen’s local demo key. Selecting “Use cue” changes the page-session status; it does not control a game character.

## Interaction contract

Keep map preview and confirmation distinct. Mission acceptance and cue state are temporary. Use accessible text for every arrow or icon, aria-live for feedback, native keyboard-operable buttons, visible focus, and no persistent user data.
