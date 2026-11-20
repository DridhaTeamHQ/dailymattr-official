// Encodes every local video for the web: `npm run videos`.
//
// Originals live in media-src/ (git-ignored, so large masters never reach GitHub or Vercel).
// Each entry below becomes three files in public/videos/ (or public/<dir>/), matching localVideo() in
// lib/videos.ts:
//   <name>.webm         VP9  — smallest, preferred by Chrome, Firefox, Edge, Safari 17+
//   <name>.mp4          H.264 — fallback that plays everywhere, moov atom up front
//   <name>-poster.webp  first frame, so the box is never blank while the video loads
// Set posterAt (seconds) when the first frame is blank. Set scrub: true for videos driven by
// scroll position (dense keyframes, so any frame can be shown at once). Set length (seconds)
// to keep only the start of the clip, and fps to drop the frame rate. Masters with an alpha
// channel (e.g. a .mov cut out on transparency) need background, a "#rrggbb" colour they are
// flattened onto, since web H.264/VP9 have no alpha; choke (pixels) shrinks their mask first,
// to trim a halo of the backdrop they were cut from. skipFrames lists [from, to] source frame
// numbers to drop (e.g. a badly cut frame), each shown as the frame before it; start cuts
// that many frames off the front (e.g. a black first frame). Set rgb: true for an RGB master
// with no transparency to flatten (QuickTime Animation, PNG .mov), so it still gets the HD
// colour conversion. posterQuality (WebP, 0-100) defaults to 70. av1Crf adds <name>.av1.mp4, a
// full-colour (4:4:4) AV1 encode of an RGB master (localVideo's fullColor option; see the home
// hero below for why). libaom is slow: about 6 s of encoding per second of 1080p60.
// Audio is dropped unless an entry sets audio: true (AAC in the mp4, Opus in the webm).
// Needs ffmpeg on PATH.
//
//   npm run videos            encode anything missing or older than its original
//   npm run videos -- --force re-encode everything
//   npm run videos -- --force --only=a,b   re-encode just these names

import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, statSync } from "node:fs"
import path from "node:path"

// Per-video settings. crf = quality (lower is sharper and bigger): h264 ~23-28, vp9 ~32-42.
// Tune each clip so its .webm comes out smaller than its .mp4 (the script warns if not),
// since browsers that support WebM pick it first. When VP9 gains nothing for a clip, set
// webm: false here and pass { webm: false } to its localVideo() in lib/videos.ts.
const VIDEOS = [
  // Home hero, scrubbed by scroll rather than played. scrub: a keyframe every 4 frames so
  // seeking to any scroll position is instant; VP9 seeks slower, so mp4 only. The master is a
  // lossless QuickTime Animation (RGB) export on pure white (#ffffff, the page's --background,
  // alpha fully opaque), so the hand sits straight on the page with no box around it. Kept at
  // full quality on purpose: native 1920x1080, every one of its 60 fps frames (real 60 fps
  // motion, not padded 24), near-lossless CRF. Its first frame is a stray all-black frame, which
  // would show as a black box at the top of the page and as the poster: start: 1 drops it.
  // av1Crf: the H.264 file is 4:2:0 (colour stored at half resolution, all that hardware H.264
  // decoders take), which smears the phone screen's coloured text: its screen area only matches
  // the master to ~34 dB, however low the CRF. The 4:4:4 AV1 keeps full-resolution colour and
  // reaches ~42 dB there, the most Chrome's own pipeline gives, at about the same file size.
  // Desktop scrubs that one where the browser can decode it; phones and Safari use the mp4.
  {
    name: "home-hero", input: "dailymattr hand with mobile white bg.mov", h264Crf: 12, webm: false, scrub: true,
    rgb: true, start: 1, posterQuality: 95, av1Crf: 10,
  },
  // Low-detail footage: H.264 already lands at ~0.7 MB and VP9 could not beat it.
  { name: "day-by-day", input: "Day_by_day_video.mp4", h264Crf: 26, webm: false },
  { name: "pix-entry", input: "pix_entry_video.mp4", h264Crf: 26, vp9Crf: 36 },
  // Explainers gallery on the home page, played with sound.
  { name: "customer-story-2", input: "dailymattr_Customer_Story_2_new.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
  // 1:11 customer story; also stands in for the curiosity explainer panels.
  { name: "customer-story-2-v2", input: "dailymattr_Customer_Story_2_v2.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
  // "A whole world of stories" cards on the home page: 9:16 brand stories, played with sound on
  // hover. Masters are 1080x1920; the cards are under 300px wide, so 720 wide is plenty for 2x
  // screens. Originals in media-src/stories/, output to public/stories/. Only the stories the
  // carousel shows are kept: add a name back here (and in lib/videos.ts) to bring one back.
  ...["amaron", "asian-paints", "fevicol", "havells", "jockey", "mrf", "nilkamal", "videocon"].map(
    (name) => ({
      name, input: `stories/${name}.mp4`, dir: "stories", maxWidth: 720, h264Crf: 26, vp9Crf: 36, audio: true,
      // Opens on a white frame; VP9 gains nothing on it either.
      ...(name === "jockey" ? { posterAt: 1, webm: false } : {}),
    })
  ),
]

/** Longest edge; the masters are 1080p and the widest use is a full-screen hero. */
const MAX_WIDTH = 1920

const root = path.resolve(import.meta.dirname, "..")
const srcDir = path.join(root, "media-src")
const publicDir = path.join(root, "public")
const force = process.argv.includes("--force")
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",")

try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
} catch {
  console.error("ffmpeg was not found on PATH. Install it (https://ffmpeg.org) and try again.")
  process.exit(1)
}

const scaleTo = (maxWidth) => `scale='min(${maxWidth},iw)':-2`

/**
 * Lays an alpha master over a solid "#rrggbb" frame of its own size, blended in RGB, after
 * shrinking its mask by `choke` pixels.
 */
const flattenOnto = (hex, choke = 0) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const trim = choke ? `split[c][a];[a]alphaextract${",erosion".repeat(choke)}[m];[c][m]alphamerge,` : ""
  return `format=rgba,${trim}split[fg][s];[s]lutrgb=r=${r}:g=${g}:b=${b}:a=255[bg];[bg][fg]overlay=format=rgb`
}
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`

const outputs = (outDir, name) => ({
  mp4: path.join(outDir, `${name}.mp4`),
  av1: path.join(outDir, `${name}.av1.mp4`),
  webm: path.join(outDir, `${name}.webm`),
  poster: path.join(outDir, `${name}-poster.webp`),
})

const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" })

for (const { name, input, dir = "videos", maxWidth = MAX_WIDTH, h264Crf = 26, vp9Crf = 36, webm = true, audio = false, posterAt = 0, scrub = false, length, fps, background, choke = 0, skipFrames = [], start = 0, rgb = false, posterQuality = 70, av1Crf } of VIDEOS) {
  if (only && !only.includes(name)) continue
  const source = path.join(srcDir, input)
  if (!existsSync(source)) {
    console.warn(`skip ${name}: ${path.relative(root, source)} not found`)
    continue
  }
  const outDir = path.join(publicDir, dir)
  mkdirSync(outDir, { recursive: true })
  const scale = scaleTo(maxWidth)
  const flatten = background ? [flattenOnto(background, choke)] : []
  // Cut frames off the front and restart the clock, so the clip still begins at 0 s.
  const trimStart = start ? [`trim=start_frame=${start}`, "setpts=PTS-STARTPTS"] : []
  // First in the chain, so `n` counts the master's own frames; fps then fills each gap.
  const skip = skipFrames.length
    ? [`select='not(${skipFrames.map(([from, to]) => `between(n,${from},${to})`).join("+")})'`]
    : []
  // An RGB master (alpha or Animation .mov) is converted with the HD colour matrix and tagged
  // as such, so browsers don't shift its colours, using swscale's most accurate path (full
  // chroma, exact rounding) so the conversion costs as little as possible; YUV masters already
  // carry their own.
  const rgbMaster = background || rgb
  const videoFilters = [
    ...skip,
    ...trimStart,
    ...flatten,
    ...(fps ? [`fps=${fps}`] : []),
    ...(rgbMaster
      ? [
          `${scale}:flags=lanczos+accurate_rnd+full_chroma_int:out_color_matrix=bt709:out_range=tv`,
          "setparams=colorspace=bt709:color_primaries=bt709:color_trc=bt709:range=tv",
        ]
      : [scale]),
  ].join(",")
  const trimmed = ["-i", source, ...(length ? ["-t", String(length)] : [])]
  const out = outputs(outDir, name)
  const stale = (file) => force || !existsSync(file) || statSync(file).mtimeMs < statSync(source).mtimeMs

  console.log(`\n${name}  (${input}, ${kb(source)})`)

  if (stale(out.mp4)) {
    ffmpeg([
      ...trimmed, "-dn", ...(audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]), "-vf", videoFilters,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(h264Crf), "-profile:v", "high",
      "-pix_fmt", "yuv420p",
      ...(scrub ? ["-g", "4", "-keyint_min", "4", "-sc_threshold", "0"] : ["-maxrate", "5M", "-bufsize", "10M"]),
      // No timecode track (.mov masters carry one); browsers have no use for it.
      "-write_tmcd", "0", "-movflags", "+faststart", out.mp4,
    ])
  }
  console.log(`  mp4     ${kb(out.mp4)}`)

  if (av1Crf !== undefined) {
    if (stale(out.av1)) {
      ffmpeg([
        ...trimmed, "-dn", "-an", "-vf", videoFilters,
        // libaom, as SVT-AV1 only writes 4:2:0. Look-ahead stays on (it halves the size);
        // tiles and row-mt let the decoder spread one frame over several cores.
        "-c:v", "libaom-av1", "-crf", String(av1Crf), "-b:v", "0", "-cpu-used", "5", "-row-mt", "1",
        "-tile-columns", "2", "-tile-rows", "1", "-pix_fmt", "yuv444p",
        ...(scrub ? ["-g", "4", "-keyint_min", "4"] : []),
        "-write_tmcd", "0", "-movflags", "+faststart", out.av1,
      ])
    }
    console.log(`  av1     ${kb(out.av1)}`)
  }

  if (webm) {
    if (stale(out.webm)) {
      ffmpeg([
        ...trimmed, "-dn", ...(audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"]), "-vf", videoFilters,
        "-c:v", "libvpx-vp9", "-crf", String(vp9Crf), "-b:v", "0", "-row-mt", "1",
        "-pix_fmt", "yuv420p",
        "-deadline", "good", "-cpu-used", "2", out.webm,
      ])
    }
    console.log(`  webm    ${kb(out.webm)}`)
  }

  if (stale(out.poster)) {
    const posterFilters = [...trimStart, ...flatten, scale].join(",")
    ffmpeg(["-ss", String(posterAt), "-i", source, "-frames:v", "1", "-vf", posterFilters, "-c:v", "libwebp", "-quality", String(posterQuality), out.poster])
  }
  console.log(`  poster  ${kb(out.poster)}`)

  if (webm && statSync(out.webm).size >= statSync(out.mp4).size) {
    console.warn(`  ! ${name}.webm is not smaller than the mp4: raise vp9Crf for it and run with --force`)
  }
}
