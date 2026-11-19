// Builds the navbar's animated logo from the logo reveal master: `npm run logo-sprite`.
//
// The master (media-src/Logo Reveal Alpha.mov, git-ignored like the other masters) is white
// artwork on black with no real alpha channel. Its first 59 frames are the reveal (the big
// quote marks fill in, shrink, then open out into "dailymattr"); the rest is a still hold.
// This crops those frames to the logo, uses each frame's brightness as its alpha and stacks
// them top to bottom in one lossless WebP of white artwork:
//   public/logo_animation/logo-reveal.webp
// components/navbar/animated-logo.tsx tints it (blue, or white on dark routes) and steps
// through the frames. Keep FRAMES and CELL in step with SPRITE in that file.
// Needs ffmpeg on PATH.

import { execFileSync } from "node:child_process"
import { statSync } from "node:fs"
import path from "node:path"

const FRAMES = 59
// The logo's bounds across every frame, padded a few pixels: x, y, width, height in the
// 1080x1920 master.
const CROP = { x: 260, y: 862, w: 564, h: 196 }
// Each frame in the sprite: about 3x the size the navbar draws it (8.5rem wide), so it is
// scaled down, never up, even on 3x phone screens.
const CELL = { w: 432, h: 150 }
// The master has a few faint stray pixels between the big quote marks; blank them while the
// quotes are big (frames 0-30), before the shrinking marks reach that spot.
const SPECKS = { x: 533, y: 936, w: 15, h: 54, untilFrame: 30 }

const root = path.resolve(import.meta.dirname, "..")
const input = path.join(root, "media-src", "Logo Reveal Alpha.mov")
const output = path.join(root, "public", "logo_animation", "logo-reveal.webp")

// Each frame's brightness, cropped and scaled to the cell.
const alpha = [
  `trim=end_frame=${FRAMES}`,
  "setpts=PTS-STARTPTS",
  "format=gray",
  `drawbox=x=${SPECKS.x}:y=${SPECKS.y}:w=${SPECKS.w}:h=${SPECKS.h}:color=black:t=fill:enable='lte(n,${SPECKS.untilFrame})'`,
  `crop=${CROP.w}:${CROP.h}:${CROP.x}:${CROP.y}`,
  `scale=${CELL.w}:${CELL.h}:flags=lanczos`,
].join(",")

const graph = [
  `[0:v]${alpha}[alpha]`,
  // Solid white the length of the reveal, with that brightness as its alpha.
  `color=white:s=${CELL.w}x${CELL.h}:r=25:d=${FRAMES / 25},format=rgb24[white]`,
  `[white][alpha]alphamerge,format=rgba,tile=1x${FRAMES}[sprite]`,
].join(";")

execFileSync(
  "ffmpeg",
  [
    "-hide_banner", "-loglevel", "error", "-y", "-i", input,
    "-filter_complex", graph, "-map", "[sprite]", "-frames:v", "1",
    "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", output,
  ],
  { stdio: "inherit" }
)

console.log(`${path.relative(root, output)}  ${CELL.w}x${CELL.h * FRAMES}, ${Math.round(statSync(output).size / 1024)} KB`)
