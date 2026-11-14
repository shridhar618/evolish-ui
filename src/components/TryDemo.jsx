import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Square, RotateCcw, Sparkles, Volume2, Wand2 } from 'lucide-react'
import Reveal from './Reveal'
import Counter from './Counter'

const PROMPTS = [
  {
    q: 'Tell me a little about yourself.',
    said: [['Hello, my name is Arjun and I am'], ['working', 'currently working'], ['as a software developer since two years.', 'as a software developer for two years.'], ['I like solving problems and learning new technologies.']],
    scores: { Clarity: 84, Fluency: 76, Grammar: 71, Vocabulary: 80 },
    tip: 'Use "for" with a duration (for two years) and "since" with a starting point (since 2023).',
  },
  {
    q: 'Why do you want this job?',
    said: [['I want this job because'], ['it give me', 'it gives me'], ['a chance to grow and work with a talented team.'], ['I believe my skills match with', 'I believe my skills match'], ['your requirements.']],
    scores: { Clarity: 88, Fluency: 81, Grammar: 69, Vocabulary: 83 },
    tip: '"Match" doesn\'t need "with" when used as a verb — your skills match the requirements.',
  },
]

const ease = [0.22, 1, 0.36, 1]

export default function TryDemo() {
  const [p, setP] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | rec | analyzing | done
  const [secs, setSecs] = useState(0)
  const timer = useRef()

  useEffect(() => () => clearInterval(timer.current), [])
  useEffect(() => { if (phase === 'rec' && secs >= 6) stop() }, [phase, secs])

  const start = () => {
    setPhase('rec'); setSecs(0)
    timer.current = setInterval(() => setSecs((s) => s + 1), 1000)
  }
  const stop = () => {
    clearInterval(timer.current)
    setPhase('analyzing')
    setTimeout(() => setPhase('done'), 1600)
  }
  const reset = (next = p) => { clearInterval(timer.current); setP(next); setPhase('idle'); setSecs(0) }

  const cur = PROMPTS[p]

  return (
    <section className="section demo" id="demo">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Try it now</span>
          <h2>Hear what your AI coach hears.</h2>
          <p>Pick a prompt, press the mic and see the kind of feedback Evolish gives — in seconds.</p>
        </Reveal>

        <Reveal className="demo-shell">
          <div className="demo-left">
            <span className="demo-label">Choose a prompt</span>
            {PROMPTS.map((x, i) => (
              <button key={i} className={`prompt ${p === i ? 'on' : ''}`} onClick={() => reset(i)}>
                <span className="prompt-n">0{i + 1}</span>
                <span>{x.q}</span>
                {p === i && <motion.span layoutId="prompt-bg" className="prompt-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              </button>
            ))}

            <div className="mic-zone">
              <div className={`mic-wrap ${phase === 'rec' ? 'live' : ''}`}>
                {phase === 'rec' && [0, 1, 2].map((i) => <span key={i} className="mic-pulse" style={{ animationDelay: `${i * 0.5}s` }} />)}
                <motion.button
                  className="mic"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={phase === 'rec' ? stop : phase === 'idle' ? start : () => reset()}
                  aria-label={phase === 'rec' ? 'Stop recording' : phase === 'idle' ? 'Start recording' : 'Try again'}
                  disabled={phase === 'analyzing'}
                >
                  {phase === 'rec' ? <Square size={26} fill="currentColor" /> : phase === 'idle' ? <Mic size={30} /> : <RotateCcw size={26} />}
                </motion.button>
              </div>
              <div className="mic-status">
                {phase === 'idle' && 'Tap to answer (demo)'}
                {phase === 'rec' && <>Recording <b>0:0{Math.min(secs, 6)}</b> · tap to finish</>}
                {phase === 'analyzing' && 'Analysing your response…'}
                {phase === 'done' && 'Try again or pick another prompt'}
              </div>
              {phase === 'rec' && (
                <div className="live-wave">
                  {Array.from({ length: 32 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 9) * -0.11}s` }} />)}
                </div>
              )}
            </div>
          </div>

          <div className="demo-right">
            <AnimatePresence mode="wait">
              {phase !== 'done' ? (
                <motion.div key="wait" className="demo-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {phase === 'analyzing' ? (
                    <>
                      <div className="scan"><Sparkles size={28} /></div>
                      <strong>Analysing pronunciation, fluency and grammar</strong>
                      <div className="skeleton"><i /><i /><i /></div>
                    </>
                  ) : (
                    <>
                      <div className="ghost-ic"><Volume2 size={28} /></div>
                      <strong>Your feedback will appear here</strong>
                      <p>This is a simulated demo with a sample answer — no microphone access needed.</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
                  <div className="fb-head">
                    <span className="eyebrow" style={{ fontSize: 11.5, color: 'var(--teal)' }}><Sparkles size={13} /> AI feedback</span>
                    <span className="lvl-badge">Estimated B1+</span>
                  </div>
                  <div className="transcript">
                    {cur.said.map(([a, fix], i) => (
                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.18 }}>
                        {fix ? (
                          <span className="fix">
                            <s>{a}</s>
                            <motion.ins initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.18 }}>{fix}</motion.ins>
                          </span>
                        ) : a}{' '}
                      </motion.span>
                    ))}
                  </div>
                  <div className="score-grid">
                    {Object.entries(cur.scores).map(([k, v], i) => (
                      <div key={k} className="score">
                        <svg viewBox="0 0 44 44">
                          <circle cx="22" cy="22" r="19" className="sc-bg" />
                          <motion.circle cx="22" cy="22" r="19" className="sc-fg"
                            initial={{ pathLength: 0 }} animate={{ pathLength: v / 100 }} transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease }} />
                        </svg>
                        <strong><Counter to={v} delay={0.3 + i * 0.1} /></strong>
                        <small>{k}</small>
                      </div>
                    ))}
                  </div>
                  <motion.div className="tip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                    <Wand2 size={18} />
                    <span><b>Coach tip:</b> {cur.tip}</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
