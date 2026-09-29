# GHOSTLIFE

**그때 다른 선택을 했다면, 나는 지금 어떤 삶을 살고 있을까?**

GHOSTLIFE is an open-source alternate-life identity experience by **chirpyworks / RUDA**.

## Try it

https://chirpyworks.github.io/ghostlife/

## What it is

Choose between four options across eight imagined scenes.  
At the end, GHOSTLIFE maps those choices to one of 16 alternate-life archetypes.

It is designed as an entertainment experience, not as a psychological or personality diagnosis.

## Features

- 8 scene-based choices
- 16 alternate-life archetypes
- Korean / English toggle with separately written native copy
- shareable result posters
- friend invite flow
- dual-result scenes
- responsive desktop / mobile layouts
- GA4 product-event instrumentation
- GitHub Pages deployment
- automatic KR / EN Open Graph preview rendering

## Run locally

No build step is required.

```bash
git clone https://github.com/chirpyworks/ghostlife.git
cd ghostlife
python3 -m http.server 8080
```

Then open:

`http://localhost:8080`

You can also open `index.html` directly, although a local web server is more reliable for browser features.

## Remix

Fork it, rewrite the questions, replace the archetypes, change the visual grammar, or turn it into a completely different choice-based experience.

The current project intentionally keeps the implementation simple: static HTML, CSS and JavaScript, with no login or backend required for the core experience.

If you make something interesting from it, attribution back to GHOSTLIFE / chirpyworks is appreciated.

## Project structure

- `index.html` — main application
- `privacy.html` — KR / EN privacy notice
- `en.html` — English social-share entry page
- `og-ghostlife*.svg/png` — social preview assets
- `.github/workflows/` — release guard and OG raster automation

## License

MIT. See [LICENSE](LICENSE).

Copyright © 2026 chirpyworks.
