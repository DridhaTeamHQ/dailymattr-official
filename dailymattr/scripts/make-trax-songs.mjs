// Makes the placeholder songs for the Trax hero player: `npm run trax-songs`.
//
// Original music written by this script (synthesised notes, seeded random melodies), so there
// are no samples or third-party recordings to license. Each track below becomes
// public/trax/hero/audio/<id>.mp3 and is played by the hero's player (components/trax/
// content.ts). The seeds make it repeatable: re-running gives the same songs. Swap the files
// for real episode audio when it exists.
// Needs ffmpeg on PATH.

import { execFileSync } from "node:child_process"
import { mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "trax", "hero", "audio")
const SR = 44100

const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  // Raag Bhairav's notes, for the "Made in India" track
  bhairav: [0, 1, 4, 5, 7, 8, 11],
}

/**
 * One entry per episode. degrees are 0-based scale steps for each bar's chord; drums picks a
 * pattern; lead is the melody voice.
 */
const TRACKS = [
  { id: "cricket", seed: 11, bpm: 100, root: 50, scale: "major", degrees: [0, 4, 5, 3], bars: 20, drums: "pop", lead: "pluck", pad: 0.5, swing: 0 },
  { id: "insurance", seed: 23, bpm: 78, root: 45, scale: "dorian", degrees: [0, 3, 0, 6], bars: 16, drums: "lofi", lead: "keys", pad: 0.8, swing: 0.12 },
  { id: "fevicol", seed: 37, bpm: 92, root: 49, scale: "bhairav", degrees: [0, 0, 3, 0], bars: 18, drums: "tabla", lead: "sitar", pad: 0, swing: 0, drone: true },
  { id: "cricket-balls", seed: 41, bpm: 112, root: 40, scale: "minor", degrees: [0, 5, 2, 6], bars: 24, drums: "four", lead: "pluck", pad: 0.5, swing: 0, arp: true },
  { id: "self-driving-cars", seed: 53, bpm: 96, root: 41, scale: "minor", degrees: [0, 5, 6, 4], bars: 20, drums: "four", lead: "saw", pad: 0.9, swing: 0, arp: true },
]

// ---------------------------------------------------------------- helpers

function mulberry32(seed) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

/** MIDI note of scale step `step` (any integer) above the track's root. */
function note(track, step, octave = 0) {
  const scale = SCALES[track.scale]
  const o = Math.floor(step / 7)
  return track.root + 12 * (o + octave) + scale[((step % 7) + 7) % 7]
}

class Mix {
  constructor(seconds) {
    const n = Math.ceil(seconds * SR)
    this.L = new Float32Array(n)
    this.R = new Float32Array(n)
    this.sendL = new Float32Array(n) // reverb send
    this.sendR = new Float32Array(n)
  }
  /** Adds one mono voice, panned (-1..1) with a reverb send amount. */
  add(t, samples, gain, pan = 0, send = 0.2) {
    const start = Math.round(t * SR)
    const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4)
    const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4)
    for (let i = 0; i < samples.length; i++) {
      const j = start + i
      if (j >= this.L.length) break
      const s = samples[i]
      this.L[j] += s * gl
      this.R[j] += s * gr
      this.sendL[j] += s * gl * send
      this.sendR[j] += s * gr * send
    }
  }
}

/** One-pole low-pass, in place. */
function lowpass(buf, cutoff) {
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR)
  let y = 0
  for (let i = 0; i < buf.length; i++) buf[i] = y += a * (buf[i] - y)
  return buf
}

// ---------------------------------------------------------------- instruments

/** Karplus–Strong plucked string: guitar-ish when dull, sitar-ish when bright. */
function pluck(rnd, freq, seconds, { bright = 0.5, decay = 0.996, buzz = 0 } = {}) {
  const out = new Float32Array(Math.ceil(seconds * SR))
  const period = Math.max(2, Math.round(SR / freq))
  const ring = new Float32Array(period)
  let prev = 0
  for (let i = 0; i < period; i++) {
    const r = rnd() * 2 - 1
    ring[i] = prev = prev + bright * (r - prev) // brighter = less smoothing of the noise burst
  }
  let idx = 0
  for (let i = 0; i < out.length; i++) {
    const next = (idx + 1) % period
    const v = ring[idx]
    ring[idx] = decay * 0.5 * (v + ring[next])
    // a touch of asymmetric clipping gives the jawari buzz of a sitar
    out[i] = buzz ? v + buzz * Math.max(0, v) ** 2 : v
    idx = next
  }
  fadeOut(out, 0.02)
  return out
}

function osc(wave, phase) {
  const p = phase - Math.floor(phase)
  if (wave === "sine") return Math.sin(2 * Math.PI * p)
  if (wave === "tri") return 1 - 4 * Math.abs(p - 0.5)
  if (wave === "square") return p < 0.5 ? 1 : -1
  return 2 * p - 1 // saw
}

/** Oscillator note with attack/decay envelope and a low-pass. */
function tone(freq, seconds, { wave = "sine", attack = 0.005, decay = 3, cutoff = 4000, detune = 0, sustain = 0 } = {}) {
  const out = new Float32Array(Math.ceil(seconds * SR))
  let p1 = 0, p2 = 0.37
  for (let i = 0; i < out.length; i++) {
    const t = i / SR
    const env = Math.min(1, t / attack) * (sustain + (1 - sustain) * Math.exp(-t * decay))
    p1 += freq / SR
    p2 += (freq * (1 + detune)) / SR
    out[i] = env * (detune ? 0.5 * (osc(wave, p1) + osc(wave, p2)) : osc(wave, p1))
  }
  lowpass(out, cutoff)
  fadeOut(out, 0.03)
  return out
}

/** Soft electric piano: sine with a decaying bell partial. */
function keys(freq, seconds) {
  const out = new Float32Array(Math.ceil(seconds * SR))
  for (let i = 0; i < out.length; i++) {
    const t = i / SR
    const env = Math.min(1, t / 0.004) * Math.exp(-t * 2.2)
    out[i] = env * (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.exp(-t * 9) * Math.sin(2 * Math.PI * freq * 3 * t))
  }
  fadeOut(out, 0.03)
  return out
}

/** Slow-swelling chord pad of detuned saws. */
function pad(freqs, seconds) {
  const out = new Float32Array(Math.ceil(seconds * SR))
  for (const f of freqs) {
    const v = tone(f, seconds, { wave: "saw", attack: seconds * 0.35, decay: 0.15, sustain: 0.6, cutoff: 900, detune: 0.004 })
    for (let i = 0; i < out.length; i++) out[i] += v[i] / freqs.length
  }
  fadeOut(out, Math.min(0.6, seconds * 0.3))
  return out
}

function kick() {
  const out = new Float32Array(Math.ceil(0.4 * SR))
  let phase = 0
  for (let i = 0; i < out.length; i++) {
    const t = i / SR
    phase += (45 + 90 * Math.exp(-t * 28)) / SR
    out[i] = Math.tanh(1.6 * Math.sin(2 * Math.PI * phase)) * Math.exp(-t * 8)
  }
  return out
}

function snare(rnd) {
  const out = new Float32Array(Math.ceil(0.3 * SR))
  let prev = 0
  for (let i = 0; i < out.length; i++) {
    const t = i / SR
    const n = rnd() * 2 - 1
    const hp = n - prev // crude high-pass on the noise
    prev = n
    out[i] = 0.55 * hp * Math.exp(-t * 16) + 0.5 * Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 30)
  }
  return out
}

function hat(rnd, open = false) {
  const out = new Float32Array(Math.ceil((open ? 0.3 : 0.06) * SR))
  let prev = 0
  for (let i = 0; i < out.length; i++) {
    const n = rnd() * 2 - 1
    out[i] = (n - prev) * Math.exp((-i / SR) * (open ? 14 : 70))
    prev = n
  }
  return out
}

/** Tabla strokes: a gliding low "ge" and a ringing high "na". */
function tabla(rnd, stroke, pitch) {
  if (stroke === "ge") {
    const out = new Float32Array(Math.ceil(0.5 * SR))
    let phase = 0
    for (let i = 0; i < out.length; i++) {
      const t = i / SR
      phase += (70 + 25 * Math.min(1, t * 6)) / SR // the palm pushes the pitch up
      out[i] = Math.sin(2 * Math.PI * phase) * Math.exp(-t * 7)
    }
    return out
  }
  return pluck(rnd, pitch, 0.35, { bright: 0.95, decay: 0.985 })
}

/** Tanpura-style drone: root and fifth with slow shimmer. */
function drone(track, seconds) {
  const out = new Float32Array(Math.ceil(seconds * SR))
  const notes = [hz(track.root - 12), hz(track.root - 5), hz(track.root), hz(track.root - 12) * 2.002]
  for (let n = 0; n < notes.length; n++) {
    const f = notes[n]
    for (let i = 0; i < out.length; i++) {
      const t = i / SR
      const shimmer = 0.6 + 0.4 * Math.sin(2 * Math.PI * (0.15 + n * 0.07) * t + n)
      let s = 0
      for (let h = 1; h <= 6; h++) s += Math.sin(2 * Math.PI * f * h * t) / h ** 1.3
      out[i] += (s * shimmer) / notes.length
    }
  }
  lowpass(out, 1600)
  return out
}

// ---------------------------------------------------------------- effects

/** Small Schroeder reverb over the send bus, mixed back in. */
function reverb(mix, wet = 0.35) {
  for (const [send, dry] of [[mix.sendL, mix.L], [mix.sendR, mix.R]]) {
    const combs = (dry === mix.L ? [1557, 1617, 1491, 1422] : [1580, 1640, 1514, 1445]).map((d) => ({ d, buf: new Float32Array(d), i: 0, lp: 0 }))
    const allpasses = [225, 556].map((d) => ({ d, buf: new Float32Array(d), i: 0 }))
    for (let n = 0; n < send.length; n++) {
      let s = 0
      for (const c of combs) {
        const y = c.buf[c.i]
        c.lp = y * 0.7 + c.lp * 0.3 // damping
        c.buf[c.i] = send[n] + c.lp * 0.84
        c.i = (c.i + 1) % c.d
        s += y
      }
      s /= combs.length
      for (const a of allpasses) {
        const y = a.buf[a.i]
        a.buf[a.i] = s + y * 0.5
        s = y - s * 0.5
        a.i = (a.i + 1) % a.d
      }
      dry[n] += s * wet
    }
  }
}

function fadeOut(buf, seconds) {
  const n = Math.min(buf.length, Math.round(seconds * SR))
  for (let i = 0; i < n; i++) buf[buf.length - 1 - i] *= i / n
}

// ---------------------------------------------------------------- composition

/** A one-bar melody: eight 8th-note steps, each a rest or a scale step above the chord root. */
function motif(rnd) {
  const steps = []
  let pos = [0, 2, 4][Math.floor(rnd() * 3)]
  for (let i = 0; i < 8; i++) {
    const strong = i % 2 === 0
    if (rnd() < (strong ? 0.8 : 0.45)) {
      pos += Math.round((rnd() - 0.5) * 4)
      pos = Math.max(-2, Math.min(9, pos))
      if (strong && rnd() < 0.6) pos = [0, 2, 4, 7][Math.floor(rnd() * 4)] // land on chord tones
      steps.push({ i, pos, len: rnd() < 0.3 ? 2 : 1 })
    }
  }
  return steps
}

function render(track) {
  const rnd = mulberry32(track.seed)
  const beat = 60 / track.bpm
  const bar = beat * 4
  const intro = 2
  const outro = 2
  const seconds = track.bars * bar + 3
  const mix = new Mix(seconds)
  const motifs = [motif(rnd), motif(rnd), motif(rnd)]
  const form = [0, 0, 1, 0, 0, 2, 1, 2] // which motif plays in each bar, cycling
  const swing = (step) => (step % 2 ? track.swing * beat : 0)
  const K = kick()

  if (track.drone) mix.add(0, drone(track, seconds), 0.32, 0, 0.3)

  for (let b = 0; b < track.bars; b++) {
    const t0 = b * bar
    const degree = track.degrees[b % track.degrees.length]
    const groove = b >= intro && b < track.bars - outro
    const last = b === track.bars - 1

    // chord pad
    if (track.pad) {
      const chord = [0, 2, 4].map((s) => hz(note(track, degree + s, 0)))
      mix.add(t0, pad(chord, bar + 0.4), 0.16 * track.pad, 0, 0.5)
    }

    // bass: root on 1, then a pickup on the "and" of 3
    if (groove || b === track.bars - outro) {
      const f = hz(note(track, degree, -1))
      const wave = track.lead === "saw" ? "saw" : "tri"
      mix.add(t0, tone(f, beat * 2, { wave, decay: 1.4, cutoff: 500 }), 0.5)
      if (!last) mix.add(t0 + beat * 2.5, tone(f, beat * 1.4, { wave, decay: 2, cutoff: 500 }), 0.38)
      if (track.arp) mix.add(t0 + beat * 1.5, tone(f, beat * 0.5, { wave, decay: 4, cutoff: 500 }), 0.3)
    }

    // arpeggio: 16ths through the chord
    if (track.arp && b >= 1 && !last) {
      for (let s = 0; s < 16; s++) {
        const step = degree + [0, 2, 4, 7, 4, 2, 0, 2][s % 8]
        const f = hz(note(track, step, 1))
        const v = track.lead === "saw" ? tone(f, beat * 0.5, { wave: "saw", decay: 9, cutoff: 2200, detune: 0.003 }) : pluck(rnd, f, beat, { bright: 0.6 })
        mix.add(t0 + s * (beat / 4), v, 0.07, s % 2 ? 0.45 : -0.45, 0.35)
      }
    }

    // melody: rests on the intro's first bar and the last bar
    if (b >= 1 && !last) {
      for (const n of motifs[form[b % form.length]]) {
        const f = hz(note(track, degree + n.pos, 1))
        const len = n.len * (beat / 2)
        const t = t0 + n.i * (beat / 2) + swing(n.i)
        let v
        if (track.lead === "sitar") v = pluck(rnd, f, len + 1.2, { bright: 0.9, decay: 0.998, buzz: 0.6 })
        else if (track.lead === "keys") v = keys(f, len + 0.8)
        else if (track.lead === "saw") v = tone(f, len + 0.3, { wave: "square", decay: 2.5, cutoff: 1800, detune: 0.005 })
        else v = pluck(rnd, f, len + 1, { bright: 0.45, decay: 0.997 })
        mix.add(t, v, track.lead === "saw" ? 0.13 : 0.3, 0.15, 0.35)
      }
    }

    if (!groove) continue

    // drums, on a 16-step grid
    for (let s = 0; s < 16; s++) {
      const t = t0 + s * (beat / 4) + (s % 4 === 2 ? track.swing * beat : 0)
      const q = s % 4 === 0
      switch (track.drums) {
        case "four":
          if (q) mix.add(t, K, 0.75, 0, 0.05)
          if (s === 4 || s === 12) mix.add(t, snare(rnd), 0.42, 0, 0.35)
          if (s % 2 === 0) mix.add(t, hat(rnd, s % 4 === 2), s % 4 === 2 ? 0.12 : 0.08, 0.3, 0.1)
          break
        case "pop":
          if (s === 0 || s === 8 || s === 10) mix.add(t, K, 0.7, 0, 0.05)
          if (s === 4 || s === 12) mix.add(t, snare(rnd), 0.38, 0, 0.3)
          if (s % 2 === 0) mix.add(t, hat(rnd), 0.09, 0.3, 0.1)
          break
        case "lofi":
          if (s === 0 || s === 7 || s === 10) mix.add(t, K, 0.6, 0, 0.05)
          if (s === 4 || s === 12) mix.add(t, lowpass(snare(rnd), 3000), 0.4, 0, 0.4)
          if (s % 2 === 0) mix.add(t, hat(rnd), 0.06, 0.35, 0.1)
          break
        case "tabla": {
          // Keherwa-like: dha ge na ti na ka dhi na
          const ge = [0, 6, 8, 14]
          const na = [2, 4, 6, 10, 12, 15]
          if (ge.includes(s)) mix.add(t, tabla(rnd, "ge"), 0.6, -0.2, 0.15)
          if (na.includes(s)) mix.add(t, tabla(rnd, "na", hz(track.root + 12)), 0.22, 0.25, 0.2)
          break
        }
      }
    }
  }

  reverb(mix)

  // master: gentle saturation, normalise to -1 dBFS, fade the tail
  let peak = 0
  for (const ch of [mix.L, mix.R]) for (let i = 0; i < ch.length; i++) peak = Math.max(peak, Math.abs(Math.tanh(ch[i])))
  const gain = 0.89 / peak
  const fade = Math.round(2.5 * SR)
  const pcm = new Float32Array(mix.L.length * 2)
  for (let i = 0; i < mix.L.length; i++) {
    const f = Math.min(1, (mix.L.length - i) / fade, i / (0.02 * SR))
    pcm[2 * i] = Math.tanh(mix.L[i]) * gain * f
    pcm[2 * i + 1] = Math.tanh(mix.R[i]) * gain * f
  }
  return pcm
}

try {
  execFileSync("ffmpeg", ["-version"], { stdio: "ignore" })
} catch {
  console.error("ffmpeg was not found on PATH. Install it (https://ffmpeg.org) and try again.")
  process.exit(1)
}

mkdirSync(OUT, { recursive: true })
for (const track of TRACKS) {
  const pcm = render(track)
  const file = path.join(OUT, `${track.id}.mp3`)
  execFileSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", String(SR), "-ac", "2", "-i", "pipe:0", "-codec:a", "libmp3lame", "-q:a", "5", file],
    { input: Buffer.from(pcm.buffer) },
  )
  console.log(`${track.id}.mp3  ${(pcm.length / 2 / SR).toFixed(1)} s`)
}
