# Moodboard Radio

**Find your somewhere.** An illustrated listening room by Anqi Chen.

[Listen](https://onlyanqi.github.io/moodboard-radio/) · [Product brief & storyboard](docs/product-brief.md)

## Three listening rooms

Choose Rainy Window (a lavender desk and rain), Golden Hour (sunset over the water), or Night Train (a moonlit passing city). Each original SVG scene animates during playback, with a motion toggle. All rooms use the same three-track guitar-led lo-fi collection by **HoliznaCC0**, ordered with a different opening track. Optional rain has its own volume control.

- Keeping Cool — 2:33
- Come Again — 3:03
- Poor But Happy — 2:08

Full recordings play in sequence and wrap to the beginning. Next track and the expandable playlist let you choose; changing tracks while paused does not start playback. Pause/resume retains your place. Music and rain have independent volume controls, and rain follows music's play/pause/buffering state. Rain starts off on every visit.

The scene includes a saved-room preference, motion toggle, keyboard-accessible controls, and a responsive layout. Room switching preserves listening intent: playing continues on the new room’s opening track, while paused stays paused. Saving a room makes it the default on return, without autoplay. This is a curated playlist, not a live broadcast.

## Run locally

Node 22+ and Python 3. No npm dependencies to install.

```sh
npm run dev
# open http://localhost:4173
npm run check
npm test
npm run build
```

GitHub Actions checks JavaScript, tests playback and audio-file integrity, builds static files, and deploys `dist/` to GitHub Pages. Music files are hosted with the site; there is no dependency on expiring stream URLs.

## Music credits

Keeping Cool, Come Again, and Poor But Happy by **HoliznaCC0**, from [Lofi Jazz Guitar](https://holiznacc0.bandcamp.com/album/lofi-jazz-guitar), licensed under [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).

The album describes a public-domain dedication, while its formal license link points to CC BY 4.0. We follow CC BY 4.0 and provide attribution. The artist-provided MP3 encodings are unmodified. Optional synthesized rain is mixed separately during playback. No endorsement is implied. See [track sources, licenses, and file hashes](docs/music-sources.json).

The music is separately licensed; the project's MIT license does not replace its license. Please support the artist through the album page if you enjoy their work.

## What was built and reused

The scene, interface, and application integration are original work for this project. The playback controller adapts patterns from Markus Steinbrecher's MIT-licensed **rrradio**, with bounded retries, stale-event isolation, finite-track completion, and position restoration. See [attribution](docs/attribution.md).

Music uses a single active audio element. Each connection disposes its predecessor, and generation checks prevent stale callbacks from changing the current player. A failed track retries once per listening attempt; failures then offer Retry or Next track. Rain is original filtered noise synthesized with Web Audio, with no external samples.

## Limits and privacy

- Real iOS/Android device testing is still needed. System volume behavior varies on mobile browsers.
- No beat analysis is claimed. Illustration motion indicates playback, not audio amplitude.
- Room and motion preferences stay in localStorage. No accounts or app analytics. Google Fonts serves the fonts; GitHub Pages serves the site and audio.
- SomaFM was evaluated but not integrated: its terms prohibit new third-party embedded players.
- User research has not been conducted. The brief describes planned validation, not measured outcomes.

## Next

Validate the listening experience and test real mobile devices, then refine the scene curation from feedback.
