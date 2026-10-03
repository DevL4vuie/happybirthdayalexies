import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { SectionIcon } from './Icons'

// Dot pops in, grows into a badge, the text slides out to its left, then a ball drops onto the "i".
export function HappyBirthdayTitle({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const measure = () => ref.current && setW(ref.current.scrollWidth)
    measure()
    document.fonts?.ready.then(measure)
  }, [])
  return (
    <div className="hb" role="heading" aria-level={1} aria-label={`Happy Birthday ${name}`} style={{ '--w': `${w}px` } as CSSProperties}>
      <div className="hb-row" aria-hidden="true">
        <span className="hb-text" ref={ref}>
          Happy B<span className="hb-i">ı<i /></span>rthday
        </span>
        <span className="hb-badge"><SectionIcon id="cake" /></span>
      </div>
      <div className="hb-name" aria-hidden="true">{name}</div>
    </div>
  )
}
