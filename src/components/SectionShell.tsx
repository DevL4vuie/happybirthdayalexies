import type { ReactNode } from 'react'

export function SectionShell({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <section className="shell">
      <header className="shell-bar">
        <button className="back" onClick={onBack} aria-label="Back to menu">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h2>{title}</h2>
      </header>
      <div className="shell-body">{children}</div>
    </section>
  )
}
