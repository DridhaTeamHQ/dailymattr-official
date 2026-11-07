// DUMMY MEDIA — random stock photos and short clips for checking layouts. Delete this file
// and its usages when the real visuals are ready (grep for "dummy-media").

/** A seeded Picsum photo, so the same box always shows the same picture. */
export const dummyImage = (id: number, width: number, height: number) =>
  `https://picsum.photos/seed/dm${id}/${width}/${height}`

/** Short (10s, ~1MB) full-frame sample clips (no letterbox bars, so they crop cleanly). */
export const dummyVideos = [
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
  "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
]

export const dummyVideo = (i: number) => dummyVideos[i % dummyVideos.length]

/**
 * Hero clip: aerial flyover of a busy city at sunset, 25s, 1920×1080. Mixkit free stock
 * video #49837 (mixkit.co/free-stock-video/landscape-from-an-aerial-view-of-a-big-city-49837),
 * Mixkit License. Swap for the real hero video when it is ready.
 */
export const heroVideo = "https://assets.mixkit.co/videos/49837/49837-1080.mp4"

/**
 * "Make staying informed part of your routine": hands leafing through the day's newspaper,
 * 9s, 1920×1080. Mixkit free stock video #41192
 * (mixkit.co/free-stock-video/pov-flipping-through-a-newspaper-41192).
 */
export const routineVideo = "https://assets.mixkit.co/videos/41192/41192-1080.mp4"
