import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { tracks } from '../config'
import { loadYouTubeApi, parseYouTubeId } from '../lib/youtube'

const list = tracks
  .map((t) => ({ title: t.title, id: parseYouTubeId(t.url) }))
  .filter((t): t is { title: string; id: string } => !!t.id)

const PLAY = 'M8 5v14l11-7z'
const PAUSE = 'M6 5h4v14H6zM14 5h4v14h-4z'
const NEXT = 'M6 6l8.5 6L6 18zM16 6h2v12h-2z'
const NOTE = 'M9 18V6l10-2v12M9 18a3 3 0 11-3-3M19 16a3 3 0 11-3-3'

const Icon = ({ d, stroke }: { d: string; stroke?: boolean }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill={stroke ? 'none' : 'currentColor'} stroke={stroke ? 'currentColor' : 'none'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

export default function MusicPlayer({ onPlayingChange }: { onPlayingChange?: (playing: boolean) => void }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const idx = useRef(0)
  const errors = useRef(0)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const cb = useRef(onPlayingChange)
  cb.current = onPlayingChange

  const goTo = useCallback((i: number) => {
    const n = (i + list.length) % list.length
    idx.current = n
    setIndex(n)
    playerRef.current?.loadVideoById(list[n].id)
  }, [])

  useEffect(() => {
    if (!list.length) return
    let dead = false
    loadYouTubeApi().then((YT) => {
      if (dead || !hostRef.current) return
      const mount = document.createElement('div')
      hostRef.current.appendChild(mount)
      playerRef.current = new YT.Player(mount, {
        width: '100%',
        height: '100%',
        videoId: list[0].id,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.PLAYING) { errors.current = 0; setPlaying(true) }
            else if (e.data === YT.PlayerState.PAUSED) setPlaying(false)
            else if (e.data === YT.PlayerState.ENDED) goTo(idx.current + 1)
          },
          onError: () => {
            // skip songs that can't be embedded, but stop if every song fails
            if (++errors.current < list.length) goTo(idx.current + 1)
            else setPlaying(false)
          },
        },
      })
    })
    return () => {
      dead = true
      try { playerRef.current?.destroy() } catch { /* already gone */ }
      playerRef.current = null
    }
  }, [goTo])

  useEffect(() => { cb.current?.(playing) }, [playing])
  useEffect(() => () => cb.current?.(false), [])

  if (!list.length) return null

  const toggle = () => {
    const p = playerRef.current
    if (!p || !ready) return
    if (playing) p.pauseVideo()
    else p.playVideo()
  }

  const panel = (
    <div className={'mp-panel' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="mp-head">
        <b>Music</b>
        <button className="mp-x" onClick={() => setOpen(false)} aria-label="Close music list">✕</button>
      </div>
      <div className="mp-video" ref={hostRef} />
      <ul className="mp-list">
        {list.map((t, i) => (
          <li key={t.id + i}>
            <button className={i === index ? 'on' : ''} onClick={() => goTo(i)}>{t.title}</button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <div className="mp" role="group" aria-label="Music player">
        <button className="mp-btn" onClick={toggle} disabled={!ready} aria-label={playing ? 'Pause music' : 'Play music'}>
          <Icon d={playing ? PAUSE : PLAY} />
        </button>
        <button className="mp-btn ghost" onClick={() => goTo(index + 1)} disabled={!ready} aria-label="Next song">
          <Icon d={NEXT} />
        </button>
        <button className="mp-title" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <Icon d={NOTE} stroke /> <span>{list[index].title}</span>
        </button>
      </div>
      {createPortal(panel, document.body)}
    </>
  )
}