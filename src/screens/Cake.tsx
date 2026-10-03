import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionShell } from '../components/SectionShell'
import { config } from '../config'

const N = 5
const ORDER = [0, 4, 1, 3, 2] // candles go out outside-in
const INK = '#1d2a57'
type Mode = 'idle' | 'listening' | 'blowing' | 'done'

export default function Cake({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<Mode>('idle')
  const [p, setP] = useState(0) // 0 = all lit, 1 = all out
  const [soundLevel, setSoundLevel] = useState(0) // 0 to 100 for visual indicator
  const [note, setNote] = useState('')
  const rt = useRef<{ stream?: MediaStream; ctx?: AudioContext; raf?: number }>({})

  const stop = useCallback(() => {
    const r = rt.current
    if (r.raf) cancelAnimationFrame(r.raf)
    r.stream?.getTracks().forEach((t) => t.stop())
    r.ctx?.close().catch(() => {})
    rt.current = {}
    setSoundLevel(0)
  }, [])
  useEffect(() => stop, [stop])

  const finish = () => { stop(); setP(1); setMode('done'); setSoundLevel(0) }

  const useMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      return setNote('Microphone is not supported in this browser!')
    }
    try {
      // Don't over-restrict audio options so all browsers/mobile work
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      const ctx: AudioContext = new Ctx()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }
      const an = ctx.createAnalyser()
      an.fftSize = 512
      an.smoothingTimeConstant = 0.2
      const source = ctx.createMediaStreamSource(stream)
      source.connect(an)

      const timeBuf = new Float32Array(an.fftSize)
      const freqBuf = new Uint8Array(an.frequencyBinCount)
      rt.current = { stream, ctx }
      setNote(''); setP(0); setMode('listening'); setSoundLevel(0)

      const t0 = performance.now()
      let ambient = 0
      let progress = 0

      const loop = (t: number) => {
        an.getFloatTimeDomainData(timeBuf)
        an.getByteFrequencyData(freqBuf)

        // 1. Calculate Time Domain RMS (loudness/air puff)
        let sumSq = 0
        for (let i = 0; i < timeBuf.length; i++) {
          sumSq += timeBuf[i] * timeBuf[i]
        }
        const rms = Math.sqrt(sumSq / timeBuf.length)

        // 2. Calculate Frequency Domain energy (great fallback on mobile/Chrome)
        let freqSum = 0
        for (let i = 0; i < freqBuf.length; i++) {
          freqSum += freqBuf[i]
        }
        const freqAvg = freqSum / freqBuf.length / 255 // normalized 0..1

        // Combined responsive level from mic
        const currentLevel = Math.max(rms * 4.0, freqAvg * 2.5)

        // Quick calibration for 250ms
        if (t - t0 < 250) {
          ambient = Math.max(ambient, currentLevel)
        } else {
          const threshold = Math.max(0.09, ambient * 1.4)
          // If user is blowing/making sound above threshold, progress goes UP towards 100%
          if (currentLevel > threshold) {
            // Fills up steadily with continued blowing (~0.6-0.8s of blowing to reach 100%)
            progress = Math.min(100, progress + 4.5)
          } else {
            // Decay gently if they pause
            progress = Math.max(0, progress - 1.5)
          }

          setSoundLevel(Math.round(progress))

          // MUST reach 100% before turning off the candles!
          if (progress >= 100) {
            setSoundLevel(100)
            return finish()
          }
        }
        rt.current.raf = requestAnimationFrame(loop)
      }
      rt.current.raf = requestAnimationFrame(loop)
    } catch (err) {
      console.error(err)
      setNote('Microphone access is blocked. Please allow mic permission!')
    }
  }

  const relight = () => { stop(); setP(0); setNote(''); setMode('idle'); setSoundLevel(0) }
  const isDone = mode === 'done' || p >= 1
  const outCount = isDone ? N : Math.floor(p * N)
  const lean = isDone ? 0 : mode === 'listening' ? 12 : 0
  const nameLen = Math.min(150, config.recipient.length * 17)

  return (
    <SectionShell title="Cake" onBack={onBack}>
      <div className="cake">
        <svg viewBox="0 0 320 350" className="cake-svg" role="img" aria-label={`Chocolate cake that says Happy Birthday ${config.recipient}`}>
          <defs>
            {/* Chocolate sponge gradients */}
            <linearGradient id="chocBottom" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A2511" />
              <stop offset="100%" stopColor="#321608" />
            </linearGradient>
            <linearGradient id="chocTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#542B14" />
              <stop offset="100%" stopColor="#3B1A0A" />
            </linearGradient>
            {/* Glossy chocolate ganache drip gradient */}
            <linearGradient id="ganache" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A1105" />
              <stop offset="100%" stopColor="#1E0C04" />
            </linearGradient>
            <filter id="ganacheShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Stand / Plate */}
          <ellipse cx="160" cy="324" rx="150" ry="18" fill="#F4E8D6" stroke={INK} strokeWidth="3" />
          <ellipse cx="160" cy="320" rx="142" ry="14" fill="#FFFFFF" stroke="none" />

          {/* Bottom Cake Tier (Rich Chocolate) */}
          <rect x="30" y="215" width="260" height="100" rx="16" fill="url(#chocBottom)" stroke={INK} strokeWidth="3" />

          {/* Bottom Tier Ganache Drips */}
          <path
            d="M30 218 
               Q45 248 60 218 
               Q72 258 84 218 
               Q100 240 116 218 
               Q134 262 152 218 
               Q170 244 188 218 
               Q206 260 224 218 
               Q238 245 252 218 
               Q272 252 290 218 
               L290 215 L30 215 Z"
            fill="url(#ganache)"
            filter="url(#ganacheShadow)"
          />

          {/* Colorful Sprinkles on Bottom Tier */}
          <g strokeWidth="2.5" strokeLinecap="round">
            <line x1="45" y1="265" x2="52" y2="260" stroke="#FF6F91" />
            <line x1="80" y1="275" x2="88" y2="272" stroke="#FFD86B" />
            <line x1="235" y1="262" x2="243" y2="266" stroke="#7FD8BE" />
            <line x1="268" y1="276" x2="274" y2="270" stroke="#FFB020" />
            <line x1="48" y1="290" x2="55" y2="293" stroke="#7FD8BE" />
            <line x1="262" y1="294" x2="270" y2="291" stroke="#FF6F91" />
          </g>

          {/* Top Cake Tier (Rich Chocolate) */}
          <rect x="70" y="135" width="180" height="80" rx="14" fill="url(#chocTop)" stroke={INK} strokeWidth="3" />

          {/* Top Tier Ganache Drips */}
          <path
            d="M70 138 
               Q84 168 98 138 
               Q114 176 130 138 
               Q145 162 160 138 
               Q175 178 190 138 
               Q205 164 220 138 
               Q235 172 250 138 
               L250 135 L70 135 Z"
            fill="url(#ganache)"
            filter="url(#ganacheShadow)"
          />

          {/* Chocolate Pearls / Piping on Borders */}
          {Array.from({ length: 9 }, (_, idx) => (
            <ellipse key={'pb' + idx} cx={78 + idx * 20.5} cy={215} rx="6.5" ry="5.5" fill="#FFE2B3" stroke={INK} strokeWidth="1.5" />
          ))}
          {Array.from({ length: 13 }, (_, idx) => (
            <ellipse key={'pt' + idx} cx={38 + idx * 20.3} cy={315} rx="6.5" ry="5.5" fill="#FFE2B3" stroke={INK} strokeWidth="1.5" />
          ))}

          {/* Decorative Strawberries on top tier */}
          <g transform="translate(74, 115)">
            {/* Left Strawberry */}
            <path d="M0 8 C-6 1 -4 -8 4 -7 C12 -8 14 1 8 8 C5 12 2 13 0 8 Z" fill="#E63946" stroke={INK} strokeWidth="1.5" />
            <path d="M4 -7 L2 -12 M4 -7 L6 -12 M4 -7 L4 -13" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="2" cy="0" r="0.8" fill="#FFF" />
            <circle cx="6" cy="2" r="0.8" fill="#FFF" />
          </g>
          <g transform="translate(232, 115)">
            {/* Right Strawberry */}
            <path d="M0 8 C-6 1 -4 -8 4 -7 C12 -8 14 1 8 8 C5 12 2 13 0 8 Z" fill="#E63946" stroke={INK} strokeWidth="1.5" />
            <path d="M4 -7 L2 -12 M4 -7 L6 -12 M4 -7 L4 -13" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="2" cy="0" r="0.8" fill="#FFF" />
            <circle cx="6" cy="2" r="0.8" fill="#FFF" />
          </g>

          {/* Golden / Cream Cake Lettering */}
          <text x="160" y="278" textAnchor="middle" className="cake-text" textLength="210" lengthAdjust="spacingAndGlyphs">Happy Birthday</text>
          <text x="160" y="303" textAnchor="middle" className="cake-subtext">From: LouiG</text>
          <text x="160" y="202" textAnchor="middle" className="cake-text" textLength={nameLen} lengthAdjust="spacingAndGlyphs">{config.recipient}</text>

          {/* Candle Decorations & Flame */}
          {Array.from({ length: N }, (_, k) => {
            const cx = 160 + (k - 2) * 28
            const out = isDone || ORDER.indexOf(k) < outCount
            const candleColor = k % 2 === 0 ? '#FFD86B' : '#FF6F91'
            const stripeColor = k % 2 === 0 ? '#FF6F91' : '#7FD8BE'
            return (
              <g key={k}>
                {/* Candle body with festive spiral pattern */}
                <rect x={cx - 4} y="98" width="8" height="37" fill={candleColor} rx="2" stroke={INK} strokeWidth="1.8" />
                <path d={`M${cx - 4} 107 L${cx + 4} 103 M${cx - 4} 118 L${cx + 4} 114 M${cx - 4} 128 L${cx + 4} 124`} stroke={stripeColor} strokeWidth="2" />
                {/* Candle Wick */}
                <line x1={cx} y1="98" x2={cx} y2="92" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
                <g transform={`translate(${cx},92)`}>
                  {/* Smoke puff when 100% blown */}
                  {out && isDone && (
                    <g className="smoke-puff">
                      <circle cx="0" cy="-6" r="3.5" fill="#ddd" opacity="0.7" />
                      <circle cx="2.5" cy="-14" r="5" fill="#eee" opacity="0.5" />
                      <circle cx="-2" cy="-22" r="6.5" fill="#fff" opacity="0.3" />
                    </g>
                  )}
                  {/* Flame completely hidden when out */}
                  <g className="flame" style={{ transform: `rotate(${lean}deg) scale(${out ? 0 : 1})`, opacity: out ? 0 : 1, transition: 'transform 0.25s, opacity 0.2s' }}>
                    <path d="M0 0 C-8 -9 -7 -18 0 -30 C7 -18 8 -9 0 0Z" fill="#FFB020" stroke={INK} strokeWidth="1.5" />
                    <path d="M0 -2 C-3 -6 -3 -10 0 -15 C3 -10 3 -6 0 -2Z" fill="#FFF3B0" />
                  </g>
                </g>
              </g>
            )
          })}
        </svg>
        <p className="cake-msg">
          {mode === 'listening' ? (
            soundLevel > 15 ? `✨ Make a wish, ${config.recipient}! Keep blowing! ✨` : `Make a wish, ${config.recipient}! Blow into your mic!`
          ) : mode === 'done' ? (
            `🎉 Yay! May all your wishes come true, ${config.recipient}! 🎂`
          ) : (
            note || `Make a wish, ${config.recipient}! Tap blow to start.`
          )}
        </p>

        {mode === 'listening' && (
          <div className="mic-meter" aria-label={`Sound level: ${soundLevel}%`}>
            <span className="mic-meter-icon">🎙️</span>
            <div className="mic-meter-track">
              <div
                className="mic-meter-fill"
                style={{ width: `${Math.max(6, soundLevel)}%` }}
              />
            </div>
            <span className="mic-meter-val">{soundLevel}%</span>
          </div>
        )}

        <div className="seg">
          {mode === 'done' ? (
            <button className="btn" onClick={relight}>Light them again</button>
          ) : (
            <button className="btn primary" onClick={useMic} disabled={mode === 'listening'}>
              {mode === 'listening' ? 'Listening to blow…' : 'Blow with mic'}
            </button>
          )}
        </div>
      </div>
    </SectionShell>
  )
}
