export type LayoutId = 'table' | 'helix' | 'grid' | 'sphere'

export const layouts: { id: LayoutId; label: string }[] = [
  { id: 'table', label: 'Table' },
  { id: 'helix', label: 'Helix' },
  { id: 'grid', label: 'Grid' },
  { id: 'sphere', label: 'Sphere' },
]

export type Pose = { x: number; y: number; z: number; yaw: number; pitch: number }

// Where the whole stage rests (degrees) and whether it spins when idle.
export const rest: Record<LayoutId, { rx: number; ry: number; spin: number }> = {
  table: { rx: 0, ry: 0, spin: 0 },
  helix: { rx: 0, ry: 0, spin: 0.25 },
  grid: { rx: 12, ry: -28, spin: 0 },
  sphere: { rx: 0, ry: 0, spin: 0.25 },
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export function computeLayout(layout: LayoutId, n: number, w: number, h: number) {
  const m = Math.min(w, h)
  const boost = layout === 'sphere' ? 1.3 : layout === 'helix' ? 1.15 : 1
  const cardW = clamp(Math.min(w * 0.15, h * 0.12), 36, 110) * boost
  const cardH = cardW * 1.3
  const poses: Pose[] = []

  if (layout === 'table') {
    const cols = 5
    const rows = Math.ceil(n / cols)
    const sx = cardW * 1.15
    const sy = cardH * 1.1
    for (let i = 0; i < n; i++) {
      poses.push({ x: ((i % cols) - (cols - 1) / 2) * sx, y: (Math.floor(i / cols) - (rows - 1) / 2) * sy, z: 0, yaw: 0, pitch: 0 })
    }
  } else if (layout === 'grid') {
    const per = 9
    const layers = Math.ceil(n / per)
    for (let i = 0; i < n; i++) {
      const c = i % 3
      const r = Math.floor(i / 3) % 3
      const l = Math.floor(i / per)
      const sx = cardW * 1.6
      const sy = cardH * 1.45
      const o = l - (layers - 1) / 2
      poses.push({ x: (c - 1) * sx + o * sx * 0.5, y: (r - 1) * sy + o * sy * 0.4, z: o * cardW * 2.8, yaw: 0, pitch: 0 })
    }
  } else if (layout === 'helix') {
    const perTurn = 10
    const radius = Math.max(m * 0.3, (cardW * perTurn * 1.1) / (2 * Math.PI))
    const pitch = cardH * 1.15
    for (let i = 0; i < n; i++) {
      const a = (i * 2 * Math.PI) / perTurn
      poses.push({ x: radius * Math.sin(a), y: (i - (n - 1) / 2) * (pitch / perTurn), z: radius * Math.cos(a), yaw: Math.atan2(Math.sin(a), Math.cos(a)), pitch: 0 })
    }
  } else {
    const radius = Math.max(m * 0.34, Math.sqrt((n * cardW * cardH * 1.3) / (4 * Math.PI)))
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const up = 1 - (2 * (i + 0.5)) / n
      const ring = Math.sqrt(1 - up * up)
      const phi = i * golden
      const dx = Math.cos(phi) * ring
      const dz = Math.sin(phi) * ring
      const dy = -up // CSS y points down
      poses.push({ x: dx * radius, y: dy * radius, z: dz * radius, yaw: Math.atan2(dx, dz), pitch: -Math.asin(dy) })
    }
  }
  return { poses, cardW, cardH }
}
