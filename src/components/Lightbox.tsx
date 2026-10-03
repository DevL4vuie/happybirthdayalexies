import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = { photos: string[]; index: number; onChange: (i: number) => void; onClose: () => void }

export function Lightbox({ photos, index, onChange, onClose }: Props) {
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
  return createPortal(
    <div className="lb" onClick={onClose} role="dialog" aria-modal="true" aria-label="Media preview">
      {photos[index].endsWith('.mp4') || photos[index].endsWith('.webm') || photos[index].endsWith('.mov') ? (
        <video
          key={index}
          src={`${import.meta.env.BASE_URL}photos/${photos[index]}`}
          controls
          autoPlay
          playsInline
          className="lb-media"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          key={index}
          src={`${import.meta.env.BASE_URL}photos/${photos[index]}`}
          alt=""
          className="lb-media"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <button className="lb-x" onClick={onClose} aria-label="Close">✕</button>
      <button className="lb-nav prev" onClick={step(-1)} aria-label="Previous photo">‹</button>
      <button className="lb-nav next" onClick={step(1)} aria-label="Next photo">›</button>
      <span className="lb-count">{index + 1} / {n}</span>
    </div>,
    document.body,
  )
}
