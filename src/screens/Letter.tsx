import { useEffect, useRef, useState } from 'react'
import { SectionShell } from '../components/SectionShell'
import { config } from '../config'
import { letter } from '../letterContent'

type Stage = 'closed' | 'open' | 'read'
const FLAPS = ['up', 'right', 'down', 'left'] // open in this order

export default function Letter({ onBack }: { onBack: () => void }) {
  const [stage, setStage] = useState<Stage>('closed')
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const openIt = () => {
    if (stage !== 'closed') return
    setStage('open')
    timer.current = window.setTimeout(() => setStage('read'), 2400)
  }

  return (
    <SectionShell title="Letter" onBack={onBack}>
      <div className="letter-stage">
        <div className={`env ${stage}`} onClick={openIt} onKeyDown={(e) => e.key === 'Enter' && openIt()} role="button" tabIndex={0} aria-label="Open the envelope">
          <div className="env-in" />
          {FLAPS.map((f) => (
            <div key={f} className={`flap f-${f}`}><b /><i /></div>
          ))}
          <div className="rib rib-v" />
          <div className="rib rib-h" />
          <div className="bow" />
        </div>
        {stage === 'closed' && <p className="hint letter-hint">Tap the envelope</p>}
        {stage === 'read' && (
          <article className="paper">
            <p>{letter.greeting}</p>
            {letter.paragraphs.map((t, i) => <p key={i}>{t}</p>)}
            <p>{letter.closing}<br />{config.from}</p>
            <button className="btn" onClick={() => setStage('closed')}>Close letter</button>
          </article>
        )}
      </div>
    </SectionShell>
  )
}
