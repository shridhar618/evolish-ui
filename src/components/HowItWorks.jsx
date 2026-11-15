import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Radar, TrendingUp, ArrowRight } from 'lucide-react'
import Reveal, { SplitHeading } from './Reveal'

const STEPS = [
  { icon: Play, n: '01', title: 'Practise real English', desc: 'Work through listening, speaking, reading and writing activities based on practical contexts.' },
  { icon: Radar, n: '02', title: 'Get immediate feedback', desc: 'Use AI-powered guidance to understand pronunciation, fluency, writing and grammar.' },
  { icon: TrendingUp, n: '03', title: 'See your progress', desc: 'Follow level-wise development individually or review learning across an entire cohort.' },
]

const LEVELS = [
  { code: 'A1', name: 'Beginner', can: 'Introduce yourself and use everyday expressions.' },
  { code: 'A2', name: 'Elementary', can: 'Handle simple, routine tasks and describe your background.' },
  { code: 'B1', name: 'Intermediate', can: 'Deal with most travel situations and describe experiences and plans.' },
  { code: 'B2', name: 'Upper-Intermediate', can: 'Interact fluently with native speakers and argue a viewpoint.' },
  { code: 'C1', name: 'Advanced', can: 'Use English flexibly for social, academic and professional purposes.' },
  { code: 'C2', name: 'Proficient', can: 'Understand virtually everything and express yourself precisely.' },
]

const ease = [0.22, 1, 0.36, 1]

export default function HowItWorks() {
  const [lvl, setLvl] = useState(2)
  // Cursor spotlight: moved with a transform (compositor only), at most once per frame
  const spot = useRef(null)
  const pending = useRef(0)
  const onMove = (e) => {
    if (pending.current) return
    const { clientX, clientY, currentTarget } = e
    pending.current = requestAnimationFrame(() => {
      pending.current = 0
      const r = currentTarget.getBoundingClientRect()
      if (spot.current) spot.current.style.transform = `translate3d(${clientX - r.left - r.width / 2}px, ${clientY - r.top - r.height / 2}px, 0)`
    })
  }
  return (
    <section className="section how" id="how" onMouseMove={onMove}>
      <div className="how-aurora" aria-hidden="true" />
      <div className="spot" ref={spot} aria-hidden="true" />
      <div className="container">
        <div className="how-head">
          <Reveal>
            <span className="eyebrow light">How Evolish works</span>
            <SplitHeading parts={['Practice. Feedback.\nProgress. ', ['Repeat.', 'mint']]} />
          </Reveal>
          <Reveal delay={0.15}>
            <p>Language improves through consistent use. Evolish turns that simple principle into a guided experience for every learner.</p>
          </Reveal>
        </div>

        <div className="steps">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12} className="step">
              <div className="step-top">
                <span className="step-icon"><s.icon size={22} /></span>
                <span className="step-n">{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < 2 && <ArrowRight className="step-arrow" size={20} />}
            </Reveal>
          ))}
        </div>

        <Reveal className="cefr" id="cefr">
          <div className="cefr-copy">
            <span className="eyebrow">Structured progression</span>
            <h3>A clear path from A1 to C2.</h3>
            <p>Every lesson maps to the Common European Framework of Reference, so progress means the same thing to learners, faculty and employers.</p>
          </div>
          <div className="cefr-ladder">
            <div className="ladder" role="tablist" aria-label="CEFR levels">
              {LEVELS.map((l, i) => (
                <button
                  key={l.code}
                  role="tab"
                  aria-selected={lvl === i}
                  className={`rung ${i <= lvl ? 'reached' : ''}`}
                  style={{ '--i': i }}
                  onMouseEnter={() => setLvl(i)}
                  onFocus={() => setLvl(i)}
                  onClick={() => setLvl(i)}
                >
                  {lvl === i && <motion.span layoutId="rung-active" className="rung-active" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className="rung-code">{l.code}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={lvl} className="cefr-detail"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }}>
                <strong>{LEVELS[lvl].code} · {LEVELS[lvl].name}</strong>
                <p>{LEVELS[lvl].can}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
