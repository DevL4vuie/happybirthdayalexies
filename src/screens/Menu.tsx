import { SectionIcon } from '../components/Icons'
import { config, sections, type SectionId } from '../config'

export default function Menu({ onPick }: { onPick: (id: SectionId) => void }) {
  return (
    <main className="menu">
      <h1>{config.menuHint}</h1>
      <nav className="menu-grid" aria-label="Greeting sections">
        {sections.map((s, i) => (
          <button key={s.id} className="tile" style={{ animationDelay: `${i * 0.4}s` }} onClick={() => onPick(s.id)}>
            <span className="tile-icon"><SectionIcon id={s.id} /></span>
            <span className="tile-label">{s.label}</span>
          </button>
        ))}
      </nav>
    </main>
  )
}
