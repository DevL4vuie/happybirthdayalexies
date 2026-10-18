// import { useState } from 'react'
// import { SectionShell } from '../components/SectionShell'

// const INK = '#1d2a57'
// const BASE = { x: 160, y: 300 }
// // No pink: sunflower, daisy, blue, orange, violet, cyan, butter
// const BLOOMS = [
//   { x: 160, y: 92, r: 48, n: 14, c: '#FFC93C', d: '#7A4A1D' },
//   { x: 98, y: 140, r: 36, n: 10, c: '#FFFFFF', d: '#FFC93C' },
//   { x: 222, y: 140, r: 36, n: 8, c: '#4F9DFF', d: '#FFE27A' },
//   { x: 62, y: 208, r: 30, n: 8, c: '#FF9F43', d: '#7A3E00' },
//   { x: 258, y: 208, r: 30, n: 8, c: '#8C7BFF', d: '#FFE27A' },
//   { x: 126, y: 198, r: 28, n: 9, c: '#7FD8F0', d: '#FFC93C' },
//   { x: 196, y: 200, r: 28, n: 9, c: '#FFE27A', d: '#E07B00' },
// ]

// export default function Flower({ onBack }: { onBack: () => void }) {
//   const [run, setRun] = useState(0) // changing the key replays the animation
//   return (
//     <SectionShell title="Flower" onBack={onBack}>
//       <div className="flower">
//         <svg key={run} viewBox="0 0 320 410" className="flower-svg" role="img" aria-label="A bouquet of flowers opening" onClick={() => setRun((r) => r + 1)}>
//           {BLOOMS.map((b, i) => (
//             <g key={i} className="sway" style={{ animationDelay: `${-i * 0.6}s` }}>
//               <path className="stem" pathLength={1} d={`M${BASE.x} ${BASE.y} Q${(b.x + BASE.x) / 2} ${(b.y + BASE.y) / 2 + 20} ${b.x} ${b.y + b.r * 0.3}`} style={{ animationDelay: `${i * 0.12}s` }} />
//               <g transform={`translate(${b.x},${b.y})`}>
//                 {Array.from({ length: b.n }, (_, k) => (
//                   <g key={k} transform={`rotate(${(k * 360) / b.n})`}>
//                     <ellipse className="petal" cx="0" cy={-b.r * 0.62} rx={b.r * 0.27} ry={b.r * 0.45} fill={b.c} stroke={INK} strokeWidth="1.5" style={{ animationDelay: `${0.9 + i * 0.15 + k * 0.03}s` }} />
//                   </g>
//                 ))}
//                 <circle className="petal" r={b.r * 0.3} fill={b.d} stroke={INK} strokeWidth="1.5" style={{ animationDelay: `${1.2 + i * 0.15}s` }} />
//               </g>
//             </g>
//           ))}
//           <ellipse cx="116" cy="262" rx="30" ry="10" transform="rotate(-28 116 262)" fill="#58B368" stroke={INK} strokeWidth="2" />
//           <ellipse cx="204" cy="262" rx="30" ry="10" transform="rotate(28 204 262)" fill="#58B368" stroke={INK} strokeWidth="2" />
//           <path d="M60 250 Q160 292 260 250 L192 394 Q160 402 128 394 Z" fill="#FFF3D6" stroke={INK} strokeWidth="3" />
//           <path d="M60 250 Q120 300 168 306 L128 394 Z" fill="#7FD8BE" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
//           <g stroke={INK} strokeWidth="2.5" fill="#FFD86B">
//             <ellipse cx="136" cy="326" rx="22" ry="11" transform="rotate(-20 136 326)" />
//             <ellipse cx="184" cy="326" rx="22" ry="11" transform="rotate(20 184 326)" />
//             <circle cx="160" cy="330" r="9" />
//           </g>
//         </svg>
//         <p className="flower-msg">Flowers for you!</p>
//         <button className="btn" onClick={() => setRun((r) => r + 1)}>Pop again</button>
//       </div>
//     </SectionShell>
//   )
// }










import { useState, type CSSProperties, type ReactNode } from 'react'
import { SectionShell } from '../components/SectionShell'
import './Flower.css'

// 1 = the reference video's speed. Bigger = slower and longer (1.8 -> about 13.5s start to finish).
const SLOW = 1.8

// ---- colors sampled directly from the reference video ----
type Kind = 'peony' | 'lily' | 'hydrangea'
type Def = { kind: Kind; c: string; c2: string; d: string }
const PINK: Def = { kind: 'peony', c: '#E89DA6', c2: '#DE8992', d: '#C5757B' }
const DEEP: Def = { kind: 'peony', c: '#DA8C90', c2: '#CF7F80', d: '#B85C62' }
const BLUSH: Def = { kind: 'peony', c: '#EBB9B0', c2: '#F2DBC9', d: '#D99892' }
const CREAM: Def = { kind: 'peony', c: '#F1E4CF', c2: '#F9F0E0', d: '#DCB9A3' }
const RED: Def = { kind: 'peony', c: '#C25255', c2: '#A82D2D', d: '#7E1F20' } // the deep red "roses" at the bottom
const LILY: Def = { kind: 'lily', c: '#EFC3B7', c2: '#E4A89B', d: '#954E3E' }
const HYD: Def = { kind: 'hydrangea', c: '#DA9397', c2: '#E8B3AE', d: '#BE797C' }

type Bloom = Def & { x: number; y: number; r: number }
type WallBloom = Bloom & { rot: number; delay: number }

// Bouquet ball, drawn back -> front like the video: cream round the edge,
// lily on top, hydrangea on the right, reds at the bottom, pink peonies in the middle.
const LAYOUT: [Def, number, number, number][] = [
  [CREAM, 98, 185, 44],
  [CREAM, 118, 128, 40],
  [LILY, 172, 118, 48],
  [LILY, 226, 140, 36],
  [HYD, 236, 192, 36],
  [CREAM, 96, 245, 36],
  [CREAM, 225, 250, 34],
  [RED, 130, 282, 32],
  [RED, 192, 284, 30],
  [RED, 160, 296, 34],
  [DEEP, 118, 215, 42],
  [BLUSH, 205, 210, 40],
  [PINK, 160, 175, 48],
  [PINK, 152, 245, 40],
  [DEEP, 165, 212, 40],
]
const BLOOMS: (Bloom & { delay: number })[] = LAYOUT.map(([def, x, y, r]) => ({
  ...def,
  x,
  y,
  r,
  // heads near the middle appear first, outer ones follow (video 1.9s -> 2.8s)
  delay: 0.95 + (Math.hypot(x - 165, y - 200) / 130) * 0.75,
}))

// ---- the "wall of flowers" that fills the screen (reference video 3.4s-7.4s) ----
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
// weighted like the video: lots of pink + cream peonies, some peach, a few reds / lilies / hydrangea
const MIX: Def[] = [PINK, PINK, PINK, DEEP, DEEP, BLUSH, BLUSH, CREAM, CREAM, CREAM, RED, LILY, LILY, HYD]
const WALL: WallBloom[] = (() => {
  const rand = rng(11)
  const out: WallBloom[] = []
  // grid runs past the viewBox on every side so the slow zoom/rotate never shows an edge
  for (let gy = -2; gy <= 7; gy++) {
    for (let gx = -2; gx <= 5; gx++) {
      const def = MIX[Math.floor(rand() * MIX.length)]
      const x = gx * 70 + (gy & 1 ? 35 : 0) + (rand() - 0.5) * 18
      const y = gy * 64 + (rand() - 0.5) * 18
      const dist = Math.hypot(x - 160, y - 205)
      out.push({
        ...def,
        x,
        y,
        r: 36 + rand() * 16,
        rot: rand() * 360,
        delay: 1.1 + Math.min(dist / 300, 1) * 1.5, // spreads outward: 1.1s -> 2.6s after the tap
      })
    }
  }
  return out
})()

function Ring({ n, dist, rx, ry, fill, off = 0, d }: { n: number; dist: number; rx: number; ry: number; fill: string; off?: number; d: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <ellipse key={k} transform={`rotate(${off + (k * 360) / n})`} cy={-dist} rx={rx} ry={ry} fill={fill} stroke={d} strokeOpacity={0.35} strokeWidth={0.8} />
      ))}
    </>
  )
}

function Head({ b, rot = 0 }: { b: Bloom; rot?: number }) {
  const { r, c, c2, d } = b
  let art: ReactNode
  if (b.kind === 'lily') {
    const petal = `M0 0 C${-0.52 * r} ${-0.2 * r} ${-0.46 * r} ${-0.78 * r} 0 ${-0.96 * r} C${0.46 * r} ${-0.78 * r} ${0.52 * r} ${-0.2 * r} 0 0Z`
    art = (
      <>
        {Array.from({ length: 6 }, (_, k) => (
          <g key={k} transform={`rotate(${k * 60})`}>
            <path d={petal} fill={k % 2 ? c2 : c} stroke={d} strokeOpacity={0.3} strokeWidth={0.8} />
            <path d={`M0 ${-0.1 * r} L0 ${-0.62 * r}`} stroke={c2} strokeWidth={1.4} strokeLinecap="round" opacity={0.8} />
          </g>
        ))}
        {Array.from({ length: 5 }, (_, k) => (
          <g key={k} transform={`rotate(${k * 72 + 20})`}>
            <path d={`M0 0 L0 ${-0.34 * r}`} stroke={d} strokeWidth={1} />
            <ellipse cy={-0.36 * r} rx={r * 0.045} ry={r * 0.08} fill={d} />
          </g>
        ))}
      </>
    )
  } else if (b.kind === 'hydrangea') {
    const rings: [number, number][] = [[1, 0], [6, 0.3], [12, 0.58], [18, 0.86]]
    art = (
      <>
        {rings.map(([m, dd], i) =>
          Array.from({ length: m }, (_, k) => {
            const a = ((k * 360) / m + i * 12) * (Math.PI / 180)
            return (
              <circle key={`${i}-${k}`} cx={Math.sin(a) * dd * r} cy={-Math.cos(a) * dd * r} r={r * 0.15} fill={(i + k) % 2 ? c : c2} stroke={d} strokeOpacity={0.4} strokeWidth={0.7} />
            )
          }),
        )}
      </>
    )
  } else {
    // peony / rose: three overlapping rings of petals + a tiny core
    art = (
      <>
        <Ring n={9} dist={r * 0.58} rx={r * 0.3} ry={r * 0.36} fill={c} d={d} />
        <Ring n={7} dist={r * 0.36} rx={r * 0.24} ry={r * 0.28} fill={c2} off={20} d={d} />
        <Ring n={5} dist={r * 0.17} rx={r * 0.16} ry={r * 0.18} fill={c} off={10} d={d} />
        <circle r={r * 0.07} fill={d} opacity={0.8} />
      </>
    )
  }
  return <g transform={`translate(${b.x},${b.y}) rotate(${rot})`}>{art}</g>
}

export default function Flower({ onBack }: { onBack: () => void }) {
  const [run, setRun] = useState(0) // changing the key remounts the stage = replays everything
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)

  const start = () => setOpen(true)
  const replay = () => {
    setOpen(false)
    setDone(false)
    setRun((r) => r + 1)
  }

  return (
    <SectionShell title="Flower" onBack={onBack}>
      <div className="flower">
        <div
          key={run}
          className={`fl-stage${open ? ' is-open' : ''}`}
          role="button"
          tabIndex={0}
          style={{ '--slow': SLOW } as CSSProperties}
          aria-label={open ? 'A bouquet of flowers opening' : 'Tap to open the envelope'}
          onClick={start}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              start()
            }
          }}
        >
          {/* layer 1: flower wall that grows outward and keeps drifting */}
          <svg className="fl-layer" viewBox="0 0 320 410" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g className="fl-wall">
              <rect className="fl-wall-bg" x="-120" y="-130" width="560" height="670" fill="#E8B0A8" />
              {WALL.map((w, i) => (
                <g key={i} className="fl-wall-bloom" style={{ animationDelay: `${w.delay * SLOW}s` }}>
                  <Head b={w} rot={w.rot} />
                </g>
              ))}
            </g>
          </svg>

          {/* layer 2: envelope + the bouquet that comes out of it */}
          <svg className="fl-layer" viewBox="0 0 320 410" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {/* envelope: back half (interior, letter, flap) */}
            <g className="fl-env">
              <rect x="100" y="178" width="120" height="84" rx="2" fill="#CDB894" stroke="#B8A07C" strokeWidth="1.2" />
              <rect className="fl-paper" x="108" y="184" width="104" height="60" fill="#F6EEDD" stroke="#E0D2B8" strokeWidth="1" />
              <g className="fl-flap">
                <path className="fl-flap-path" fill="#EBDDC3" d="M100 178 L220 178 L160 226 Z" stroke="#B8A07C" strokeWidth="1.2" strokeLinejoin="round" />
                {/* painted sprig on the flap: pink bells, purple berries, grey-green leaves, lavender wax seal */}
                <g className="fl-seal">
                  <path d="M160 222 C160 208 159 198 158 188" stroke="#7FA07A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                  <g fill="#E39AA6">
                    <ellipse cx="158" cy="187" rx="2.4" ry="3.4" />
                    <ellipse cx="164" cy="190" rx="2.4" ry="3.4" />
                    <ellipse cx="154" cy="194" rx="2.4" ry="3.4" />
                  </g>
                  <path d="M156 214 C148 208 143 204 140 197" stroke="#7FA07A" strokeWidth="1" fill="none" />
                  <g fill="#8E6FA8">
                    <circle cx="140" cy="197" r="2.4" />
                    <circle cx="136" cy="203" r="2.4" />
                    <circle cx="146" cy="205" r="2.4" />
                  </g>
                  <g fill="#8FA396">
                    <ellipse cx="172" cy="204" rx="2.6" ry="6" transform="rotate(50 172 204)" />
                    <ellipse cx="177" cy="198" rx="2.6" ry="6" transform="rotate(35 177 198)" />
                    <ellipse cx="181" cy="209" rx="2.6" ry="6" transform="rotate(65 181 209)" />
                  </g>
                </g>
              </g>
            </g>

            {/* bouquet: emerge (grows out of the envelope) -> zoom (keeps growing until it fills the frame) */}
            <g className="fl-emerge">
              <g className="fl-zoom">
                {BLOOMS.map((b, i) => (
                  <g key={i} className="fl-pop" style={{ animationDelay: `${b.delay * SLOW}s` }}>
                    <Head b={b} />
                  </g>
                ))}
              </g>
            </g>

            {/* envelope: front pocket (drawn over the bouquet so it looks like it comes OUT of it) */}
            <g className="fl-env">
              <path d="M100 178 L160 226 L220 178 L220 260 Q220 262 218 262 L102 262 Q100 262 100 260 Z" fill="#DCC9AB" stroke="#B8A07C" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M101 261 L156 226 M219 261 L164 226" stroke="#B8A07C" strokeWidth="1" fill="none" />
              <circle className="fl-seal" cx="160" cy="226" r="7" fill="#A48BB4" stroke="#8B73A0" strokeWidth="1" />
            </g>
          </svg>

          <span className="fl-hint">Tap to open</span>

          {/* dissolve + final message (the video's "next page") */}
          <div className="fl-wash" />
          <div className="fl-reveal" onAnimationEnd={() => setDone(true)}>
            <p className="flower-msg">Flowers for you!</p>
          </div>
        </div>

        {done && (
          <button className="btn" onClick={replay}>
            Pop again
          </button>
        )}
      </div>
    </SectionShell>
  )
}
