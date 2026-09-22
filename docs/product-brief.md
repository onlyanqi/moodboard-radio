# Moodboard Radio

## Product brief · proposed v0.1

Implementation note (2026-09-22): the first vertical slice uses original synthesized ambient loops. Live radio remains planned because the initially evaluated broadcaster does not permit new embedded players. This document records the original target, not a claim that every feature is shipped.

**Find your somewhere.** Three illustrated places to listen, focus, or take a breath.

### The opportunity

For people who want background music while working or unwinding, choosing what to play can become another task. Our hypothesis is that a few thoughtfully curated environments can make getting started easier and make returning feel familiar.

This is a hypothesis to test, not a validated user finding. The first audience is people who already use background radio or music at a desk. Anqi can recruit a small group of peers for an initial usability study.

### The distinctive idea

Choose a place, then let it settle around you. Each scene combines a listening intention, curated live stations, an original illustration, a restrained motion pattern, and a short piece of writing. The distinctive work is the relationship between these elements.

Radio programming varies. Scene descriptions communicate our curation intent, not a guarantee about every track. Show the broadcaster's identity and link to its site.

### Three places

| Scene | Intention and draft copy | Art direction | Motion while playing |
| --- | --- | --- | --- |
| Rainy Window | Focus. “A little rain. A little room to think.” | Lavender window, blush desk, mist-blue street; warm lamp | Sparse droplets and a slow reflection |
| Golden Hour | Pause. “Let the afternoon take its time.” | Apricot sky, cream buildings, dusty-rose water | Clouds and soft water reflections |
| Night Train | Unwind. “Nothing to catch. Just somewhere to go.” | Muted indigo, mauve seats, warm cream window lights | A slowly passing landscape |

Use the portfolio's Playfair Display, Inter, and JetBrains Mono as the proposed type system. Preserve readable contrast in every scene. Draw original SVG scenes so their layers can respond to playback and motion preferences. Keep a consistent illustration grammar: simple geometry, generous space, and one small human detail in each setting.

### First release

- Three scenes, each with one primary and one alternative station, selected after browser playback and broadcaster-terms checks.
- Play/pause, volume, station identity, clear playback status, and scene selection.
- One favorite scene, saved on this device, with an obvious way to clear it.
- A motion toggle and a static composition for reduced-motion preferences.
- A small “Behind this room” panel explaining the curation and linking to the broadcaster and project credits.
- Responsive desktop and mobile layouts, keyboard access, and visible focus.

Accounts, personal recommendations, uploaded music, chat, and a station directory are outside v0.1. No artificial song titles, listener counts, or audio-reactive visualizer: the scene motion indicates playback state, not beat analysis.

## Storyboard

| Frame | What the visitor sees and does | Product behavior |
| --- | --- | --- |
| 1 · Arrive | A still Rainy Window illustration; “Find your somewhere.”; three labeled scene choices and “Listen to Rainy Window” | No autoplay. A returning visitor sees their saved favorite scene, still paused. |
| 2 · Choose | Select Golden Hour using a scene label, keyboard, or the illustrated dial | Preview its artwork and copy without starting audio. The dial and labeled controls represent the same selection. |
| 3 · Listen | Press Listen; status becomes “Tuning in…” | Start a single audio stream after this explicit action. Motion begins once playback is confirmed. |
| 4 · Settle | The station name, Pause, volume, and scene selector remain available | Introductory copy becomes visually quieter. Controls stay visible; no disappearing navigation. |
| 5 · Travel | While listening, select Night Train | Stop the previous stream, tune the new one, and transition the artwork. Rapid selections leave only the latest selection active. No overlapping audio or promised audio crossfade. |
| 6 · Recover | “This station isn't responding.” with “Try another station” and Retry | Attempt at most one automatic retry for a transient failure; then offer a deliberate next action. Do not unexpectedly change broadcasters. |
| 7 · Return | Favorite the current scene, then revisit later | Restore the selected scene and preference; audio stays paused until Listen is pressed. |

### Layout sketches

Desktop

```text
MOODBOARD RADIO                          Behind this room

                 Find your somewhere.

       ┌──────────────────────────────────────┐
       │                                      │
       │       Illustrated listening scene    │
       │                                      │
       └──────────────────────────────────────┘

                     Rainy Window
             A little rain. A little room to think.

          Rainy Window   ◉ dial   Golden Hour   Night Train

       [ Listen ]   Station name ↗   Volume   Motion   Favorite
```

Mobile

```text
MOODBOARD RADIO                     About
Find your somewhere.
┌───────────────────────────────────────┐
│          Illustrated scene            │
│                                       │
└───────────────────────────────────────┘
Rainy Window
A little rain. A little room to think.

[Rainy Window] [Golden Hour] [Night Train]
                  ◉
             [ Listen ]
             Station name ↗
       Volume · Motion · Favorite
```

The dial is a signature visual, but understanding or dragging it is never required. Labeled scene buttons remain the primary accessible selection controls. On narrow screens, preserve the scene's focal point and avoid sideways scrolling.

## Engineering decisions to demonstrate

### Foundation

Proposed starting point: selected playback and station-handling code from [rrradio](https://github.com/MarkusSteinbrecher/rrradio), with its MIT notice and relevant third-party notices preserved. The research reviewed repository metadata, manifests, and license text; no upstream build or playback has been verified yet.

Before reuse, run the upstream build, trace its player lifecycle, review the exact files being reused, and check their dependencies and notices. Reuse only what serves this small product. Keep Anqi's scene model and presentation separate from the station provider so another source can be substituted later.

### Playback model

```text
idle → connecting → playing ⇄ paused
           │           │
           └→ error ← buffering
                         │
                         └→ playing
```

The diagram is simplified. Implement explicit transitions for station switching, retry, and cancellation. Use one audio element; associate asynchronous results with the current playback request so an old result cannot overwrite a newer selection. Handle rejected play requests and clear obsolete timers and listeners. Keep user intent (wants to listen) separate from actual playback state (connecting, playing, stalled, paused, error).

### Release checks

- Rapidly switch all three scenes: only the final selected station can play, and its UI matches the audio.
- Pause while connecting: a late result must not start playback.
- Simulate a stalled or unavailable stream: retry stays bounded and recovery controls work.
- Reload after favoriting a scene: selection persists without autoplay.
- Navigate using only a keyboard; test mobile playback and reduced motion.
- Check audio behavior on a real phone, including supported lock-screen controls, before claiming mobile support.
- Verify every station's HTTPS playback and applicable terms; credit its broadcaster. Code licensing does not license the audio.

### Hosting

Target a static build in a separate `moodboard-radio` repository, with GitHub Pages at the proposed address `https://onlyanqi.github.io/moodboard-radio/`. This address is not created yet. No server is required for the proposed first release. Add a station-health service later only if observed failures justify it.

## Validation and portfolio evidence

Run an initial study with about five people who listen to background music. This is qualitative research, not enough to establish population-level improvements.

1. Ask them to choose something for a focused half-hour without explaining the controls. Observe their first action, time to successful playback, hesitation, and whether they understand the scene labels.
2. Ask them to change the atmosphere and then pause. Watch for confusion between previewing a scene and changing an active stream.
3. Show a failed-station state. Can they recover without guidance?
4. Ask what made the scene fit or fail to fit their intention, whether movement distracted them, and what they would return for.

Use observations to revise the product; do not invent a baseline or improvement percentage. Save consented, anonymized notes, before/after screens, and one decision that changed because of feedback.

### Case-study outline

1. **Problem and hypothesis:** choosing background audio can interrupt the activity it is meant to support.
2. **Design exploration:** alternatives considered, scene sketches, typography, and motion decisions.
3. **Technical depth:** player state, cancellation, failure handling, and accessibility.
4. **Validation:** actual observations, limitations, and resulting changes.
5. **Attribution:** which upstream components were reused and what Anqi designed and implemented.

Draft project description, to use only once implemented:

> I designed and built Moodboard Radio, a browser-based listening experience organized around three illustrated places. Building on an open-source radio foundation, I developed the scene system and accessible interactions, then focused on reliable playback during station changes and stream failures.

### Next milestone

Build one complete vertical slice: Rainy Window, one verified stream, play/pause, connecting/error states, responsive artwork, and reduced motion. Validate that experience before expanding it to three scenes. This gives us a working product early and tests the riskiest assumption: whether the atmosphere and playback actually work well together.
