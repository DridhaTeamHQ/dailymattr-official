import QRCode from "qrcode"

// The white "dm" mark from app/icon.svg (viewBox 0 0 3467 3467), drawn in the middle of the code.
const ICON_VIEWBOX = 3467
const MARK = [
  "M1628.31 1579.16V772.766H814.537V1803.89C814.537 1924.26 842.942 2043.3 900.307 2149.12C939.642 2221.67 997.077 2297.55 1080.9 2363.34C1318.78 2550.06 1585.49 2510.93 1628.38 2503.9V2189.22C1598.72 2187.48 1410.75 2173.21 1283.42 2011.07C1132.55 1819.06 1201.41 1590.99 1207.53 1571.78C1320.94 1574.21 1514.9 1576.72 1628.38 1579.16H1628.31Z",
  "M2651 1579.16V772.766H1837.23V1803.89C1837.23 1924.26 1865.64 2043.3 1923 2149.12C1962.34 2221.67 2019.77 2297.55 2103.59 2363.34C2341.48 2550.06 2608.19 2510.93 2651.07 2503.9V2189.22C2621.42 2187.48 2433.45 2173.21 2306.12 2011.07C2155.25 1819.06 2224.1 1590.99 2230.23 1571.78C2343.64 1574.21 2537.6 1576.72 2651.07 1579.16H2651Z",
]

const DARK = "#1c1c1e"
/** White modules kept around the code (the card around it adds more). */
const QUIET = 2

/**
 * A QR code drawn on the server as one SVG: square modules, rounded finder eyes and the app
 * icon in the middle. Error correction is the highest level (H, ~30% recoverable), so the
 * modules hidden under the icon (about 6%) don't stop it scanning.
 */
export function QrCode({ value, label, className }: { value: string; label: string; className?: string }) {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "H" })
  const n = modules.size
  const at = (row: number, col: number) => modules.get(row, col) === 1

  // Finder eyes: top-left, top-right, bottom-left, each 7 × 7.
  const eyes: [number, number][] = [
    [0, 0],
    [0, n - 7],
    [n - 7, 0],
  ]
  const inEye = (row: number, col: number) =>
    eyes.some(([r, c]) => row >= r && row < r + 7 && col >= c && col < c + 7)

  // Square, odd-sized hole in the middle for the icon (9 of 37 modules for this URL).
  const hole = Math.round(n * 0.24) | 1
  const holeStart = (n - hole) / 2
  const inHole = (row: number, col: number) =>
    row >= holeStart && row < holeStart + hole && col >= holeStart && col < holeStart + hole

  let d = ""
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (at(row, col) && !inEye(row, col) && !inHole(row, col)) d += `M${col} ${row}h1v1h-1z`
    }
  }

  const size = n + QUIET * 2
  return (
    <svg
      viewBox={`${-QUIET} ${-QUIET} ${size} ${size}`}
      role="img"
      aria-label={label}
      className={className}
    >
      <rect x={-QUIET} y={-QUIET} width={size} height={size} fill="#fff" />
      <path d={d} fill={DARK} shapeRendering="crispEdges" />
      {eyes.map(([r, c]) => (
        <g key={`${r}-${c}`}>
          <rect x={c} y={r} width={7} height={7} rx={2} fill={DARK} />
          <rect x={c + 1} y={r + 1} width={5} height={5} rx={1.25} fill="#fff" />
          <rect x={c + 2} y={r + 2} width={3} height={3} rx={0.875} fill={DARK} />
        </g>
      ))}
      {/* Half a module of white around the icon, so it doesn't touch the modules */}
      <svg
        x={holeStart + 0.5}
        y={holeStart + 0.5}
        width={hole - 1}
        height={hole - 1}
        viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`}
      >
        <rect width={ICON_VIEWBOX} height={ICON_VIEWBOX} rx={640} fill="#3979ff" />
        <g transform="translate(0 90.5)" fill="#fff">
          {MARK.map((p) => (
            <path key={p.slice(0, 12)} d={p} />
          ))}
        </g>
      </svg>
    </svg>
  )
}
