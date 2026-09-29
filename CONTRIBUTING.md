# Contributing to GHOSTLIFE

Thanks for taking a look at the project.

GHOSTLIFE is intentionally small, so contributions should keep the code understandable without introducing unnecessary dependencies.

## Good contributions

- better KR or EN copy
- new archetype wording
- accessibility fixes
- responsive-layout fixes
- share / poster improvements
- performance improvements
- test coverage
- documentation
- interesting remixes that can feed improvements back upstream

## Copy rule

Korean and English are **not translation pairs**.

If you change Korean copy, do not mechanically translate it into English. Rewrite the English version so it sounds native, and vice versa.

## Scoring rule

If you change scoring values or tie-breaking behavior, run:

```bash
node tests/project.test.js
```

The current model intentionally gives each of the 16 archetypes exactly 4,096 of the 65,536 possible answer paths.

A contribution may change that balance, but it should do so deliberately and explain why.

## Local development

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

No npm install is required.

## Before opening a pull request

- run the project QA test
- check both KR and EN
- check desktop and mobile if the UI changed
- do not commit credentials or private account data
- keep changes focused

## Style

Prefer small, direct browser JavaScript over abstractions that make the project harder to remix.

If a dependency is not necessary, do not add it.
