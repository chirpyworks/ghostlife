# GHOSTLIFE Architecture

GHOSTLIFE is deliberately small: static HTML, CSS, and browser JavaScript.

There is no framework, build tool, database, authentication layer, or required backend.

## Runtime flow

```text
Landing
  ↓
8-choice test
  ↓
SIGNAL → SPLIT → LOCK reveal
  ↓
Archetype result
  ├─ Save poster
  ├─ Share result
  ├─ Invite friend (?with=KEY)
  └─ Compare code
          ↓
      Dual timeline
          ├─ Save dual poster
          └─ Share duo (?duo=KEY-KEY)
```

## Source boundaries

### `src/data.js`

Content and presentation data:

- question scoring matrix
- Korean question copy
- English question copy
- 16 Korean archetype narratives
- 16 English archetype narratives
- KR/EN UI strings
- KR/EN dual-scene copy
- 16 visual profiles

This is the main file to edit when making a remix.

### `src/scoring.js`

Pure scoring logic.

It receives accumulated axis scores and the eight selected answer indices, resolves ties deterministically, and returns a four-character archetype key.

It has no DOM dependency and is intentionally testable in isolation.

### `src/analytics.js`

Small analytics adapter.

Events are buffered locally and may be forwarded to GA4 or an optional endpoint. The core experience still works if analytics is unavailable.

### `src/app.js`

Browser behavior:

- language state
- screen state
- question rendering
- result rendering
- generative poster drawing
- sharing
- invite and duo flows
- URL state
- accessibility focus handoff

### `styles/main.css`

Visual system and responsive behavior.

The result art direction is generated from the same four-axis key used by the scoring model, so the result is not only a label: the composition changes with the archetype.

## Scoring

The four axes are:

```text
STAY       ↔ LEAVE
ORDER      ↔ IMPULSE
HIDDEN     ↔ SEEN
BUILD      ↔ EXPERIENCE
```

The four binary outcomes form 16 possible archetype keys.

Example:

`LOHB`

- L = LEAVE
- O = ORDER
- H = HIDDEN
- B = BUILD

## Tests

`tests/project.test.js` checks:

- 8 questions exist in both languages
- all questions have 4 answers
- all 16 archetypes exist
- all 16 English result narratives exist
- all 16 visual profiles exist
- KR/EN UI keysets match
- dual-scene copy is complete
- all 65,536 answer paths resolve
- each archetype is reached exactly 4,096 times
- required source files exist and are loaded by `index.html`

GitHub Actions runs the test on push and pull requests.

## Social previews

Korean and English Open Graph images are generated from SVG sources in GitHub Actions.

The English share entry page exists because static GitHub Pages cannot vary Open Graph metadata from a query parameter alone.
