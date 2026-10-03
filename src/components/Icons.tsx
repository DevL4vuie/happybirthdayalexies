import type { SectionId } from '../config'

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

export function SectionIcon({ id }: { id: SectionId }) {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true" {...stroke}>
      {id === 'pictures' && (
        <>
          <rect x="8" y="12" width="48" height="40" rx="5" />
          <circle cx="22" cy="26" r="5" />
          <path d="M10 48l15-14 10 9 8-7 13 12" />
        </>
      )}
      {id === 'cake' && (
        <>
          <path d="M10 56h44M14 56V36h36v20M14 44c6 5 10-5 18 0s12-5 18 0" />
          <path d="M22 36V26M32 36V22M42 36V26" />
          <path d="M22 20c-2-3 2-4 0-8 4 2 4 5 0 8zM32 16c-2-3 2-4 0-8 4 2 4 5 0 8zM42 20c-2-3 2-4 0-8 4 2 4 5 0 8z" />
        </>
      )}
      {id === 'letter' && (
        <>
          <rect x="8" y="16" width="48" height="34" rx="4" />
          <path d="M8 20l24 18 24-18" />
          <path d="M32 38v4" />
        </>
      )}
      {id === 'flower' && (
        <>
          <circle cx="32" cy="22" r="5" />
          <path d="M32 17c-5-9 5-12 0-13-5 1 5 4 0 13zM37 22c9-5 12 5 13 0-1-5-4 5-13 0zM27 22c-9-5-12 5-13 0 1-5 4 5 13 0zM32 27c-4 9 4 11 0 12-4-1 4-3 0-12z" />
          <path d="M32 28v28M32 46c-8 0-12-5-12-9 7 0 12 3 12 9zM32 50c7 0 11-4 11-8-6 0-11 3-11 8z" />
        </>
      )}
      {id === 'song' && (
        <>
          <path d="M24 46V16l26-6v30" />
          <circle cx="18" cy="46" r="7" />
          <circle cx="44" cy="40" r="7" />
        </>
      )}
    </svg>
  )
}

export function GiftBox({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 160 160" className="gift" aria-hidden="true">
      <g className={open ? 'gift-lid open' : 'gift-lid'}>
        <rect x="22" y="46" width="116" height="26" rx="5" fill="var(--accent)" />
        <rect x="74" y="46" width="12" height="26" fill="var(--butter)" />
        <path d="M80 46c-14-22-34-14-26-4s26 4 26 4zM80 46c14-22 34-14 26-4s-26 4-26 4z" fill="var(--butter)" />
      </g>
      <rect x="30" y="72" width="100" height="64" rx="5" fill="var(--accent-deep)" />
      <rect x="74" y="72" width="12" height="64" fill="var(--butter)" />
    </svg>
  )
}
