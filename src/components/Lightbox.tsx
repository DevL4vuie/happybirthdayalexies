import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { isVideo, mediaSrc } from '../lib/media'

type Props = { photos: string[]; index: number; onChange: (i: number) => void; onClose: () => void; muteVideo?: boolean }

export function Lightbox({ photos, index, onChange, onClose, muteVideo }: Props) {
  const n = photos.length
  const go = (d: number) => onChange((index + d + n) % n)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  })
  const step = (d: number) => (e: React.MouseEvent) => { e.stopPropagation(); go(d) }
  const name = photos[index]
  return createPortal(
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true" aria-label={isVideo(name) ? 'Video' : 'Photo'}>
      {isVideo(name) ? (
        <video key={index} src={mediaSrc(name)} controls autoPlay playsInline loop muted={muteVideo} onClick={(e) => e.stopPropagation()} />
      ) : (
        <img key={index} src={mediaSrc(name)} alt="" onClick={(e) => e.stopPropagation()} />
      )}
      <button className="lb-x" onClick={onClose} aria-label="Close">✕</button>
      <button className="lb-nav prev" onClick={step(-1)} aria-label="Previous">‹</button>
      <button className="lb-nav next" onClick={step(1)} aria-label="Next">›</button>
      <span className="lb-count">{index + 1} / {n}</span>
    </div>,
    document.body,
  )
}