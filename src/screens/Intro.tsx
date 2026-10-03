import { useState } from 'react'
import { GiftBox } from '../components/Icons'
import { HappyBirthdayTitle } from '../components/HappyBirthdayTitle'
import { config } from '../config'

export default function Intro({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false)
  const tap = () => {
    if (open) return
    setOpen(true)
    window.setTimeout(onOpen, 900)
  }
  return (
    <main className="intro">
      <HappyBirthdayTitle name={config.recipient} />
      <button className="gift-btn late" onClick={tap} aria-label="Open the gift">
        <GiftBox open={open} />
      </button>
      <p className="intro-line late">{config.introLine}</p>
      <p className="hint late">Tap the gift</p>
    </main>
  )
}
