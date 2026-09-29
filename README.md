# VEX Ref

A lightweight, offline-first referee tool for VEX Robotics Competition events built for tablets and phones with no internet connection required during an event. Inspired by [referee.fyi](https://referee.fyi). Created with the help of AI.

Track teams, log rule violations against the actual game manual, run robot inspections, and see which rules get broken most across an event all stored locally on the device.

## Features

- **Local events** create an event, add teams manually, and run the whole thing with zero network dependency. Everything is saved to the browser's `localStorage`.
- **Team management** add, search, and browse teams from a searchable grid, sorted alphanumerically by team number (`2A` before `10A`, not string order).
- **Violation logging** assign a violation to a team by searching or browsing the real rule set (grouped by category: Safety, General, General Game, Specific Game, etc.), color-coded by category, with a minor/major severity call and an optional note. An "Other / Uncodified" option lets you log something not covered by a listed rule code.
- **Repeat violations** the same rule broken more than once by a team shows as a `×N` count on their card, with a visual flag when any of those calls was a major.
- **Robot inspection** a simple Pass/Fail per team, with a required note on Fail. Passed inspections collapse to a compact summary so you're not re-reading a full checklist for every team; failed or not-yet-inspected teams stay expanded since those need attention.
- **Anomalies view** an event-wide breakdown of which rules are broken most often, with a minor/major split per rule, sorted by frequency.
- **Light / dark / system theme** auto-detects the OS color scheme and stays in sync with it live; a toggle in the header lets you override to light or dark manually. Preference is remembered between sessions.
- **VEX API event loading** present in the UI as a disabled option for now; local-only events are fully supported today.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

The output in `dist/` is a static site — it can be hosted anywhere or opened locally, and will run fully offline once loaded (aside from font/asset loading on first visit).

## Using the app

1. **Create or load an event** — go to **Event Setup** and start a new local event. You can optionally seed it with sample teams for testing.
2. **Add your teams** — enter each team's number and name from Event Setup. Team numbers should match what's used at the event (e.g. `1234A`).
3. **Inspect robots** — from Event Setup or an individual team's page, mark each robot **Pass** or **Fail**. A note is required on Fail so you have a record of why.
4. **Assign violations during matches** — open a team from the **Teams** page, tap **Assign Violation**, search or browse to the rule that applies, and choose **Minor** or **Major**. Add a note if it's worth remembering the specifics.
5. **Review patterns** — check **Anomalies** at any point to see which rules are being broken most across the whole event, useful for driver-meeting feedback or noticing a rule that needs re-explaining.

All of this data lives in the browser's `localStorage` under a single key, so closing the tab or losing signal doesn't lose your data — it's tied to the device and browser, not an account.

## Important: the rule set has to be filled in by you for each game manual update

`src/data/rules.json` ships with the correct **rule codes** for each category (`G1`, `SG3`, `S2`, etc.) pulled from the current game manual's structure, but the **titles and descriptions are intentionally left blank** (or are placeholder paraphrases). The official VEX game manual is copyrighted and its exact wording can't be reproduced here — you'll need to open your own copy of the current game manual and fill in each rule's `title`, `shortTitle`, and `description` field yourself.

```json
{
  "code": "SG1",
  "shortTitle": "Starting Position",
  "title": "Starting a Match",
  "description": "less than 18” from the wall, not contacting objects, in its own quadrant, and stationary",
  "severity": "variable"
}
```

- `shortTitle` — shown in the compact rule list when assigning a violation
- `title` / `description` — shown when a rule is expanded ("show more")
- `severity` — `"minor"`, `"major"`, or `"variable"` (referee chooses at the time of the call)

Update `manual` and re-check codes against `RSC`/`SC` sections at the start of each new game season, since rule numbering changes year to year.

## Customizing the inspection checklist

Inspection is intentionally freeform (Pass/Fail + note) rather than a fixed checklist, so there's nothing to configure there — but if you want to reintroduce a structured checklist later, that logic previously lived in `InspectionPanel.jsx` and can be re-added there.

## Project structure

```
src/
├── assets/
├── components/
│   ├── Header.jsx / Header.css          — top nav, current event name, theme toggle
│   ├── ThemeToggle.jsx / .css           — light/dark/system switch
│   ├── TeamCard.jsx / .css              — team grid card (status stripe, badges, inspection state)
│   ├── ViolationModal.jsx / .css        — rule search/browse + severity + note flow
│   └── InspectionPanel.jsx / .css       — pass/fail + note, collapses once complete
├── pages/
│   ├── Home.jsx / .css                  — dashboard, stats, how-to steps, nav grid
│   ├── EventSetup.jsx / .css            — create/clear event, add teams, per-team inspection
│   ├── Teams.jsx / .css                 — team list (search) + team detail (violations log)
│   ├── Anomalies.jsx / .css             — most-broken rules across the event
│   ├── Matches.jsx / Match.jsx          — not yet implemented
├── context/
│   ├── EventDataContext.jsx             — all event/team/violation/inspection state + localStorage
│   └── ThemeContext.jsx                 — theme mode state + system preference sync
├── data/
│   ├── sampleData.js                    — sample teams for test events
│   └── rules.json                       — rule codes/categories (fill in titles yourself — see above)
├── utils/
│   ├── rules.js                         — flattens rules.json into a code → rule lookup
│   └── violations.js                    — groups a team's violations by rule code
├── App.jsx                              — routing + provider setup
├── main.jsx
└── index.css                            — design tokens (colors, light/dark theme variables)
```

## Data model (stored in `localStorage`)

```js
{
  event: { id, name, source: "local" | "api", createdAt } | null,
  teams: [{ id, number, name }],
  violations: [{ id, teamId, ruleCode, severity: "minor" | "major", note, timestamp }],
  inspections: { [teamId]: { passed: boolean, note, updatedAt } }
}
```

Clearing an event (from Event Setup, behind a confirmation) wipes all of the above back to an empty state — teams, violations, and inspections included.

## Tech stack

- React + Vite
- React Router for page navigation
- Plain CSS with a custom-property token system for theming (no CSS framework)
- No backend — all state is client-side `localStorage`, by design, for offline use at events

## Known gaps / next steps

- **Matches / Match pages** are placeholders — violations currently attach to a team, not a specific match
- **VEX API event loading** is a disabled stub in Event Setup, pending an internet-connected implementation
- Shareing between multiple refs on a local connection
- Custom "Other" violations aren't grouped/deduplicated by label the way real rule codes are, since the text is free-form per entry