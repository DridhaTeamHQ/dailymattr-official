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

