import { SectionShell } from '../components/SectionShell'
import { sections, type SectionId } from '../config'
import Pictures from './Pictures'
import Cake from './Cake'
import Letter from './Letter'
import Flower from './Flower'
import Song from './Song'

export default function Section({ id, onBack }: { id: SectionId; onBack: () => void }) {
  if (id === 'pictures') return <Pictures onBack={onBack} />
  if (id === 'cake') return <Cake onBack={onBack} />
  if (id === 'letter') return <Letter onBack={onBack} />
  if (id === 'flower') return <Flower onBack={onBack} />
  if (id === 'song') return <Song onBack={onBack} />
  const label = sections.find((s) => s.id === id)!.label
  return (
    <SectionShell title={label} onBack={onBack}>
      <p className="stub">{label} goes here.</p>
    </SectionShell>
  )
}
