import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { SectionShell } from '../components/SectionShell'
import { Lightbox } from '../components/Lightbox'
import { photos } from '../config'
import { computeLayout, layouts, rest, type LayoutId } from '../lib/layouts'

const src = (name: string) => `${import.meta.env.BASE_URL}photos/${name}`
const wrap = (a: number) => ((((a + 180) % 360) + 360) % 360) - 180

export default function Pictures({ onBack }: { onBack: () => void }) {
  const [layout, setLayout] = useState<LayoutId>('table')
  const [open, setOpen] = useState<number | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const boxRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<LayoutId>(layout)
  layoutRef.current = layout

  // Measure the available area
  useLayoutEffect(() => {
    const el = boxRef.current!
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Drag to rotate, spin when idle, spring back to the layout's resting pose
  useEffect(() => {
    const box = boxRef.current!
    const stage = stageRef.current!
    const s = { rx: 0, ry: 0, vx: 0, vy: 0, down: false, lx: 0, ly: 0, sx: 0, sy: 0 }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const down = (e: PointerEvent) => { s.down = true; s.lx = s.sx = e.clientX; s.ly = s.sy = e.clientY; box.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => {
      if (!s.down) return
      const dy = (e.clientX - s.lx) * 0.35
      const dx = -(e.clientY - s.ly) * 0.35
      s.lx = e.clientX; s.ly = e.clientY
      s.ry += dy; s.rx = Math.max(-80, Math.min(80, s.rx + dx))
      s.vy = Math.max(-8, Math.min(8, dy)); s.vx = Math.max(-8, Math.min(8, dx))
    }
    const cancel = () => { s.down = false }
    const up = (e: PointerEvent) => {
      s.down = false
      if (Math.hypot(e.clientX - s.sx, e.clientY - s.sy) < 6) {
        const card = (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest<HTMLElement>('.card')
        if (card) setOpen(Number(card.dataset.i))
      }
    }
    box.addEventListener('pointerdown', down)
    box.addEventListener('pointermove', move)
    box.addEventListener('pointerup', up)
    box.addEventListener('pointercancel', cancel)

    let raf = 0
    const tick = () => {
      const r = rest[layoutRef.current]
      if (!s.down) {
        s.vx *= 0.94; s.vy *= 0.94
        s.ry += s.vy; s.rx += s.vx
        if (r.spin && !reduce) s.ry += r.spin
        else { s.ry = wrap(s.ry); s.ry += (r.ry - s.ry) * 0.06 }
        s.rx += (r.rx - s.rx) * 0.06
      }
      stage.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      box.removeEventListener('pointerdown', down)
      box.removeEventListener('pointermove', move)
      box.removeEventListener('pointerup', up)
      box.removeEventListener('pointercancel', cancel)
    }
  }, [])

  const { poses, cardW, cardH } = useMemo(() => computeLayout(layout, photos.length, size.w, size.h), [layout, size])
  const ready = size.w > 0

  return (
    <SectionShell title="Pictures" onBack={onBack}>
      <div className="pics">
        <div className="pics-box" ref={boxRef}>
          <div className="pics-stage" ref={stageRef}>
            {ready &&
              photos.map((name, i) => {
                const p = poses[i]
                return (
                  <div
                    key={name + i}
                    className="card"
                    data-i={i}
                    style={{
                      width: cardW,
                      height: cardH,
                      marginLeft: -cardW / 2,
                      marginTop: -cardH / 2,
                      background: `hsl(${(i * 47) % 360} 70% 85%)`,
                      transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateY(${p.yaw}rad) rotateX(${p.pitch}rad)`,
                      transitionDelay: `${i * 18}ms`,
                    }}
                  >
                    {name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov') ? (
                      <>
                        <video
                          src={src(name)}
                          muted
                          playsInline
                          loop
                          autoPlay
                          preload="metadata"
                          className="card-media"
                        />
                        <div className="card-badge" aria-label="Video">▶</div>
                      </>
                    ) : (
                      <img
                        src={src(name)}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        className="card-media"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                  </div>
                )
              })}
          </div>
        </div>
        <p className="pics-hint">Drag to turn, tap a photo or video to play / enlarge</p>
        <div className="seg" role="group" aria-label="Photo layout">
          {layouts.map((l) => (
            <button key={l.id} aria-pressed={layout === l.id} onClick={() => setLayout(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </SectionShell>
  )
}
