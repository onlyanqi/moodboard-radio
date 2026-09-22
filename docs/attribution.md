# Attribution and implementation decisions

## Radio foundation

Playback patterns adapted from `src/player.ts` in [MarkusSteinbrecher/rrradio](https://github.com/MarkusSteinbrecher/rrradio), inspected at commit `420c0de01ccf644fdfe794ef15df6e9b6efad4e1` on 2026-09-22. Its [MIT license](rrradio-LICENSE.txt) is preserved here.

Adapted ideas and structure: HTMLAudioElement playback controller, explicit player states, treating AbortError and NotAllowedError as cancellation, fresh live connections on resume, generation checks, and Media Session integration. The original application and its full test suite were not built or imported. This project has its own focused controller tests. HLS, catalog infrastructure, telemetry, and proxy services were not imported.

Our changes: per-connection event isolation, bounded retries and deadlines, scene-state integration, original SVG artwork, accessible controls, and the product brief. Each previous audio is stopped and unloaded before a new connection is created. There is only one active stream.

## Music and rain

Keeping Cool, Come Again, and Poor But Happy by HoliznaCC0, from [Lofi Jazz Guitar](https://holiznacc0.bandcamp.com/album/lofi-jazz-guitar). Retrieved 2026-09-22 as unmodified artist-provided MP3-128 encodings; served locally to avoid expiring source URLs. [Manifest with individual sources and SHA-256 hashes](music-sources.json).

The album description dedicates the recordings to the public domain, but its formal license link points to [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). We follow that attribution requirement: artist name and track source appear in the player, with album and license links below it and in the room details. Audio is separately licensed from the MIT application code. No artist endorsement is implied.

Optional rain-like ambience is original filtered noise, synthesized independently in `src/rain.js`. It is mixed only during playback and defaults to off; it is not baked into or redistributed as an altered artist recording.

The earlier Window Light and Soft Rain prototype files were replaced. SomaFM was evaluated and rejected before publication because its [terms](https://somafm.com/contact/tos.html) prohibit new embedded players. This release is a curated local playlist, not a live radio service.

## Design

Original SVG illustration; Playfair Display, Inter, and JetBrains Mono served via Google Fonts. Lavender #e4d8ee, blush #e7c9d3, mist blue #a8bdce, paper #f5eff4, ink #40374d. The window is the focal point; controls form a quiet listening console below it. The layout follows the approved brief and applies Anthropic's frontend-design skill, with the user's existing portfolio typography and palette taking precedence.
