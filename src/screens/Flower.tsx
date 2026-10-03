import { useState } from 'react'
import { SectionShell } from '../components/SectionShell'

const INK = '#1d2a57'
const BASE = { x: 160, y: 300 }
// No pink: sunflower, daisy, blue, orange, violet, cyan, butter
const BLOOMS = [
  { x: 160, y: 92, r: 48, n: 14, c: '#FFC93C', d: '#7A4A1D' },
  { x: 98, y: 140, r: 36, n: 10, c: '#FFFFFF', d: '#FFC93C' },
  { x: 222, y: 140, r: 36, n: 8, c: '#4F9DFF', d: '#FFE27A' },
  { x: 62, y: 208, r: 30, n: 8, c: '#FF9F43', d: '#7A3E00' },
  { x: 258, y: 208, r: 30, n: 8, c: '#8C7BFF', d: '#FFE27A' },
  { x: 126, y: 198, r: 28, n: 9, c: '#7FD8F0', d: '#FFC93C' },
  { x: 196, y: 200, r: 28, n: 9, c: '#FFE27A', d: '#E07B00' },
]

export default function Flower({ onBack }: { onBack: () => void }) {
  const [run, setRun] = useState(0) // changing the key replays the animation
  return (
    <SectionShell title="Flower" onBack={onBack}>
      <div className="flower">
        <svg key={run} viewBox="0 0 320 410" className="flower-svg" role="img" aria-label="A bouquet of flowers opening" onClick={() => setRun((r) => r + 1)}>
          {BLOOMS.map((b, i) => (
            <g key={i} className="sway" style={{ animationDelay: `${-i * 0.6}s` }}>
              <path className="stem" pathLength={1} d={`M${BASE.x} ${BASE.y} Q${(b.x + BASE.x) / 2} ${(b.y + BASE.y) / 2 + 20} ${b.x} ${b.y + b.r * 0.3}`} style={{ animationDelay: `${i * 0.12}s` }} />
              <g transform={`translate(${b.x},${b.y})`}>
                {Array.from({ length: b.n }, (_, k) => (
                  <g key={k} transform={`rotate(${(k * 360) / b.n})`}>
                    <ellipse className="petal" cx="0" cy={-b.r * 0.62} rx={b.r * 0.27} ry={b.r * 0.45} fill={b.c} stroke={INK} strokeWidth="1.5" style={{ animationDelay: `${0.9 + i * 0.15 + k * 0.03}s` }} />
                  </g>
                ))}
                <circle className="petal" r={b.r * 0.3} fill={b.d} stroke={INK} strokeWidth="1.5" style={{ animationDelay: `${1.2 + i * 0.15}s` }} />
              </g>
            </g>
          ))}
          <ellipse cx="116" cy="262" rx="30" ry="10" transform="rotate(-28 116 262)" fill="#58B368" stroke={INK} strokeWidth="2" />
          <ellipse cx="204" cy="262" rx="30" ry="10" transform="rotate(28 204 262)" fill="#58B368" stroke={INK} strokeWidth="2" />
          <path d="M60 250 Q160 292 260 250 L192 394 Q160 402 128 394 Z" fill="#FFF3D6" stroke={INK} strokeWidth="3" />
          <path d="M60 250 Q120 300 168 306 L128 394 Z" fill="#7FD8BE" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <g stroke={INK} strokeWidth="2.5" fill="#FFD86B">
            <ellipse cx="136" cy="326" rx="22" ry="11" transform="rotate(-20 136 326)" />
            <ellipse cx="184" cy="326" rx="22" ry="11" transform="rotate(20 184 326)" />
            <circle cx="160" cy="330" r="9" />
          </g>
        </svg>
        <p className="flower-msg">Flowers for you!</p>
        <button className="btn" onClick={() => setRun((r) => r + 1)}>Pop again</button>
      </div>
    </SectionShell>
  )
}
