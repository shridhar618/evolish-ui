import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, Home, Mic, TrendingUp, BarChart3, Sparkles } from 'lucide-react'
import { LogoMark } from './Logo'
import Counter from './Counter'
import { Magnetic } from './Extras'
import './Hero.css'

const WORDS = ['ambition.', 'interview.', 'classroom.', 'career.']
const ease = [0.22, 1, 0.36, 1]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }

function Waveform() {
  const bars = Array.from({ length: 24 })
  return (
    <div className="wave" aria-hidden="true">
      {bars.map((_, i) => (
        <span key={i} style={{ animationDelay: `${(i % 7) * -0.13}s`, '--h': `${30 + ((i * 37) % 70)}%` }} />
      ))}
    </div>
  )
}

export default function Hero() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setW((v) => (v + 1) % WORDS.length), 2600)
    return () => clearInterval(t)
  }, [])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 18 })
  const sy = useSpring(my, { stiffness: 80, damping: 18 })
  const rotY = useTransform(sx, [-0.5, 0.5], [-10, 6])
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8])
  const cardX = useTransform(sx, [-0.5, 0.5], [-18, 18])
  const cardY = useTransform(sy, [-0.5, 0.5], [-14, 14])
  const chipX = useTransform(sx, [-0.5, 0.5], [24, -24])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-slant" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
      </div>

      <div className="container hero-inner">
        <motion.div className="hero-copy" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} className="hero-brand">
            <LogoMark size={64} />
            <span>Evolish</span>
          </motion.div>
          <motion.div variants={item} className="eyebrow"><span className="rule" /> AI-powered English learning</motion.div>
          <motion.h1 variants={item}>
            {'Better English for'.split(' ').map((word, wi) => (
              <span className="split-word" key={wi}>
                {word.split('').map((ch, ci) => (
                  <motion.span key={ci} className="split-char"
                    initial={{ opacity: 0, y: '0.6em', rotate: 8 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 + (wi * 6 + ci) * 0.025, ease }}>
                    {ch}
                  </motion.span>
                ))}
                {wi < 2 && '\u00a0'}
              </span>
            ))}
            <br />
            <span className="rotator">
              every{' '}
              <span className="rotator-slot">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={WORDS[w]}
                    className="gradient-text"
                    initial={{ y: '70%', opacity: 0, filter: 'blur(8px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-70%', opacity: 0, filter: 'blur(8px)' }}
                    transition={{ duration: 0.55, ease }}
                  >
                    {WORDS[w]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </motion.h1>
          <motion.p variants={item} className="hero-sub">
            Build real communication confidence through guided practice, instant AI feedback and a clear
            CEFR-aligned learning path.
          </motion.p>
          <motion.div variants={item} className="hero-ctas">
            <Magnetic><a href="#paths" className="btn btn-primary">I want to learn English <ArrowUpRight size={18} /></a></Magnetic>
            <Magnetic><a href="#colleges" className="btn btn-ghost down">I represent a college <ArrowDown size={18} /></a></Magnetic>
          </motion.div>
          <motion.ul variants={item} className="hero-checks">
            {['Listening, speaking, reading & writing', 'CEFR levels A1–C2', 'Personal and institutional progress'].map((t) => (
              <li key={t}><span className="check"><Check size={15} strokeWidth={3} /></span>{t}</li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          className="hero-visual"
          onMouseMove={onMove}
          onMouseLeave={() => { mx.set(0); my.set(0) }}
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease }}
        >
          <motion.div className="phone" style={{ rotateY: rotY, rotateX: rotX }}>
            <div className="phone-notch" />
            <div className="phone-screen">
              <div className="ps-time">9:41</div>
              <div className="ps-greet">
                <LogoMark size={30} />
                <div><small>GOOD MORNING</small><strong>Continue learning</strong></div>
              </div>
              <div className="ps-level">
                <small>Current level</small>
                <strong>B1 Intermediate</strong>
                <div className="ps-bar"><motion.i initial={{ width: 0 }} animate={{ width: '64%' }} transition={{ duration: 1.6, delay: 1, ease }} /></div>
              </div>
              <div className="ps-lesson">
                <small>SPEAKING · 8 MIN</small>
                <strong>Speak clearly in a self-introduction.</strong>
                <button className="ps-start"><span className="rec-dot" /> Start speaking</button>
              </div>
              <div className="ps-tabs">
                <span><Home size={14} />Home</span>
                <span className="on"><Mic size={14} />Practice</span>
                <span><BarChart3 size={14} />Progress</span>
              </div>
            </div>
          </motion.div>

          <motion.div className="coach-card" style={{ x: cardX, y: cardY }}
            initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.8, ease }}>
            <div className="coach-head">
              <div><small><Sparkles size={11} /> AI SPEECH COACH</small><strong>Your response</strong></div>
              <span className="lvl">B1</span>
            </div>
            <Waveform />
            <div className="scores">
              {[['Clarity', 86], ['Fluency', 78], ['Accuracy', 82]].map(([k, v], i) => (
                <div key={k}><strong><Counter to={v} delay={1.2 + i * 0.15} /></strong><small>{k}</small></div>
              ))}
            </div>
            <motion.div className="coach-tip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
              <span className="check"><Check size={13} strokeWidth={3} /></span>
              Good structure. Try pausing before your final point.
            </motion.div>
          </motion.div>

          <motion.div className="faculty-chip" style={{ x: chipX }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.4, ease }}>
            <span className="fc-icon"><TrendingUp size={18} /></span>
            <div><small>FACULTY VIEW</small><strong>Cohort progress is visible</strong></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
