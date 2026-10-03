import { SectionShell } from '../components/SectionShell'

export default function Song({ onBack }: { onBack: () => void }) {
  const videoSrc = `${import.meta.env.BASE_URL}photos/bdsong.mp4`

  return (
    <SectionShell title="Birthday Song" onBack={onBack}>
      <div className="song-screen">
        <div className="song-video-wrap">
          <video
            src={videoSrc}
            controls
            autoPlay
            playsInline
            className="song-video"
          />
        </div>
        <p className="song-caption">🎵 Happy Birthday Video & Song! 🎶</p>
      </div>
    </SectionShell>
  )
}
