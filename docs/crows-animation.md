# Flying birds reference

Inspected https://sondaven.com/en on 2026-09-14, including its public
[scene script](https://assets.slater.app/slater/18883/55210.js?v=296591)
(`initSceneAbout`, `initSceneFaq`, and `createCanvasInstance`).

The effect uses looping bird footage with a black background removed by a
WebGL shader. Brightness becomes vertical strokes on a 100 × 100 grid, with
taupe (#a89474) as the background ink and brown (#2c2824) as the stroke ink.
About reverses the brightness levels to produce dark birds on its light surface.

| Scene | Flight choreography |
| --- | --- |
| About, desktop | Flock moves from -33.33% to 100% in 5 seconds at y=10%, with a 5-second repeat delay. The companion bird flies diagonally from (45%, 65%) to (-40%, 0%) over 6 seconds, starting after 4 seconds and repeating after a 6-second delay. |
| FAQ, desktop | Two flocks cross sequentially at y=0% and y=55%, each taking 5 seconds, followed by a 5-second pause. |
| FAQ, mobile | Same sequence with full-width bird layers and 2.5-second crossings. |

Implementation uses the project's existing bird videos and GSAP choreography.
`faq-birds-top-h264.mp4` is a compatible H.264 transcode of the existing HEVC
`faq-birds-top.mp4`; the original is retained. No remote media is needed at runtime.

`birdCanvas.ts` owns bird rendering, video loading, sizing and disposal, without
changing the shared prologue renderer. Scene playback follows actual canvas
visibility and pauses in hidden tabs. Reduced motion releases the bird scenes.
About retains the project's existing placement and desktop-only layout.

Validation: production build, TypeScript, and changed-file ESLint pass. Chromium
checks confirmed visible contrasting pixels in both scenes, mobile FAQ playback,
offscreen video pausing, zero bird players after enabling reduced motion, and
exactly four players after returning to desktop motion. No page errors occurred.
