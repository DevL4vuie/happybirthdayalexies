import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Intro from './screens/Intro'
import Menu from './screens/Menu'
import Section from './screens/Section'
import { config, type SectionId } from './config'

type Screen = 'intro' | 'menu' | SectionId

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro')

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          className="screen"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {screen === 'intro' && <Intro onOpen={() => setScreen('menu')} />}
          {screen === 'menu' && <Menu onPick={setScreen} />}
          {screen !== 'intro' && screen !== 'menu' && <Section id={screen} onBack={() => setScreen('menu')} />}
        </motion.div>
      </AnimatePresence>
      <footer className="site-watermark" aria-hidden="true">
        <span>{config.watermark}</span>
      </footer>
    </div>
  )
}
