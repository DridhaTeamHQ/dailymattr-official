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
// to keep only the start of the clip.
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
  // seeking to any scroll position is instant; VP9 seeks slower, so mp4 only.
  { name: "home-hero", input: "hand-phone-rising.mp4", h264Crf: 26, webm: false, scrub: true, length: 7 },
  // Low-detail footage: H.264 already lands at ~0.7 MB and VP9 could not beat it.
  { name: "day-by-day", input: "Day_by_day_video.mp4", h264Crf: 26, webm: false },
  { name: "pix-entry", input: "pix_entry_video.mp4", h264Crf: 26, vp9Crf: 36 },
  // Explainers gallery on the home page, played with sound.
  { name: "customer-story-2", input: "dailymattr_Customer_Story_2_new.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
  // 1:11 customer story; also stands in for the curiosity explainer panels.
  { name: "customer-story-2-v2", input: "dailymattr_Customer_Story_2_v2.mp4", h264Crf: 27, vp9Crf: 38, audio: true },
  // "A whole world of stories" cards on the home page: 9:16 brand stories, played with sound on
  // hover. Masters are 1080x1920; the cards are under 300px wide, so 720 wide is plenty for 2x
  // screens. Originals in media-src/stories/, output to public/stories/.
  ...["amaron", "asian-paints", "ather", "dixon", "fevicol", "havells", "jockey", "mrf", "nilkamal", "relaxo", "videocon"].map(
    (name) => ({
      name, input: `stories/${name}.mp4`, dir: "stories", maxWidth: 720, h264Crf: 26, vp9Crf: 36, audio: true,
      // These two open on a white frame; VP9 gains nothing on them either.
      ...(name === "ather" || name === "jockey" ? { posterAt: 1, webm: false } : {}),
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
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`

const outputs = (outDir, name) => ({
  mp4: path.join(outDir, `${name}.mp4`),
  webm: path.join(outDir, `${name}.webm`),
  poster: path.join(outDir, `${name}-poster.webp`),
})

const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" })

for (const { name, input, dir = "videos", maxWidth = MAX_WIDTH, h264Crf = 26, vp9Crf = 36, webm = true, audio = false, posterAt = 0, scrub = false, length } of VIDEOS) {
  if (only && !only.includes(name)) continue
  const source = path.join(srcDir, input)
  if (!existsSync(source)) {
    console.warn(`skip ${name}: ${path.relative(root, source)} not found`)
    continue
  }
  const outDir = path.join(publicDir, dir)
  mkdirSync(outDir, { recursive: true })
  const scale = scaleTo(maxWidth)
  const out = outputs(outDir, name)
  const stale = (file) => force || !existsSync(file) || statSync(file).mtimeMs < statSync(source).mtimeMs

  console.log(`\n${name}  (${input}, ${kb(source)})`)

  if (stale(out.mp4)) {
    ffmpeg([
      "-i", source, ...(length ? ["-t", String(length)] : []), ...(audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"]), "-vf", scale,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(h264Crf), "-profile:v", "high",
      "-pix_fmt", "yuv420p",
      ...(scrub ? ["-g", "4", "-keyint_min", "4", "-sc_threshold", "0"] : ["-maxrate", "5M", "-bufsize", "10M"]),
      "-movflags", "+faststart", out.mp4,
    ])
  }
  console.log(`  mp4     ${kb(out.mp4)}`)

  if (webm) {
    if (stale(out.webm)) {
      ffmpeg([
        "-i", source, ...(audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"]), "-vf", scale,
        "-c:v", "libvpx-vp9", "-crf", String(vp9Crf), "-b:v", "0", "-row-mt", "1",
        "-deadline", "good", "-cpu-used", "2", out.webm,
      ])
    }
    console.log(`  webm    ${kb(out.webm)}`)
  }

  if (stale(out.poster)) {
    ffmpeg(["-ss", String(posterAt), "-i", source, "-frames:v", "1", "-vf", scale, "-c:v", "libwebp", "-quality", "70", out.poster])
  }
  console.log(`  poster  ${kb(out.poster)}`)

  if (webm && statSync(out.webm).size >= statSync(out.mp4).size) {
    console.warn(`  ! ${name}.webm is not smaller than the mp4: raise vp9Crf for it and run with --force`)
  }
}
