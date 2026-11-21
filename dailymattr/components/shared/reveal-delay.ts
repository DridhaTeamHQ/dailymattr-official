// Stagger timing for FadeIn. Kept out of fade-in.tsx: that is a "use client" module, so its
// exports are client references in server components and can't be called there.

/** Delay between neighbouring reveals: heading 0s, copy 0.2s, image or card 0.4s, then 0.6s. */
export const REVEAL_STEP = 0.2

/** Delay for item `i` of a grid or list: steps along a row of `perRow` items, then starts over. */
export const revealDelay = (i: number, perRow = 3) => (i % perRow) * REVEAL_STEP
