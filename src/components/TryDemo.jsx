import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Square, RotateCcw, Sparkles, Volume2, Wand2, FileText, AlertCircle } from 'lucide-react'
import Reveal from './Reveal'
import Counter from './Counter'
import { analyse, SpeechRecognition } from './speechAnalysis'

const PROMPTS = [
  { q: 'Tell me a little about yourself.', sample: 'Hello, my name is Arjun and I am working as a software developer since two years. Basically I like solving problems and it give me a lot of satisfaction. I am learning new technologies every week.' },
  { q: 'Why do you want this job?', sample: 'I want this job because it give me a chance to grow and work with a talented team. Um, I believe my skills match with your requirements and I am eager to contribute from day one.' },
  { q: 'Describe a challenge you solved.', sample: 'In my final year project our database was very slow. I analysed the queries, added the right indexes and the response time became more faster, around three times quicker than before.' },
]

const ease = [0.22, 1, 0.36, 1]
const MAX_SECS = 60

export default function TryDemo() {
  const [p, setP] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | rec | analyzing | done
  const [secs, setSecs] = useState(0)
  const [live, setLive] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isSample, setIsSample] = useState(false)
  const rec = useRef(null)
  const timer = useRef()
  const started = useRef(0)
  const finalText = useRef('')
  const conf = useRef([])
  const supported = Boolean(SpeechRecognition)

  useEffect(() => () => { clearInterval(timer.current); rec.current?.abort() }, [])
  useEffect(() => { if (phase === 'rec' && secs >= MAX_SECS) stop() }, [phase, secs]) // eslint-disable-line

  const finish = (text, seconds, confidence, sample = false) => {
    setPhase('analyzing')
    setIsSample(sample)
    setTimeout(() => { setResult(analyse(text, seconds, confidence)); setPhase('done') }, 1100)
  }

  const runSample = () => {
    rec.current?.abort(); clearInterval(timer.current); setError('')
    const s = PROMPTS[p].sample
    finish(s, s.split(/\s+/).length / 2.2, 0.9, true) // ~132 wpm
  }

  const start = () => {
    setError('')
    if (!supported) { runSample(); return }
    finalText.current = ''; conf.current = []; setLive(''); setSecs(0)
    const r = new SpeechRecognition()
    r.lang = navigator.language?.startsWith('en') ? navigator.language : 'en-US'
    r.continuous = true
    r.interimResults = true
    r.onresult = (e) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal) { finalText.current += res[0].transcript + ' '; conf.current.push(res[0].confidence || 0.85) }
        else interim += res[0].transcript
      }
      setLive(finalText.current + interim)
    }
    r.onerror = (e) => {
      clearInterval(timer.current)
      setPhase('idle')
      setError(e.error === 'not-allowed' || e.error === 'service-not-allowed'
        ? 'Microphone access was blocked. Allow it in your browser, or try the sample answer.'
        : e.error === 'no-speech' ? 'We didn’t hear anything. Check your microphone and try again.'
        : 'Speech recognition stopped unexpectedly. Try again or use the sample answer.')
    }
    r.onend = () => {
      clearInterval(timer.current)
      if (rec.current !== r) return
      rec.current = null
      const text = finalText.current.trim()
      if (!text) { setPhase((ph) => (ph === 'rec' ? 'idle' : ph)); return }
      const seconds = (performance.now() - started.current) / 1000
      const c = conf.current.length ? conf.current.reduce((a, b) => a + b, 0) / conf.current.length : 0.85
      finish(text, seconds, c)
    }
    rec.current = r
    try { r.start() } catch { setError('Could not start the microphone.'); return }
    started.current = performance.now()
    setPhase('rec')
    timer.current = setInterval(() => setSecs((s) => s + 1), 1000)
  }

  const stop = () => { clearInterval(timer.current); rec.current?.stop() }
  const reset = (next = p) => { rec.current?.abort(); rec.current = null; clearInterval(timer.current); setP(next); setPhase('idle'); setSecs(0); setLive(''); setResult(null); setError('') }

  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`

  return (
    <section className="section demo" id="demo">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Try it now</span>
          <h2>Hear what your AI coach hears.</h2>
          <p>Pick a prompt, press the mic and answer out loud. You’ll get instant feedback on pace, fillers, grammar and vocabulary.</p>
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
              <div className="mic-status" aria-live="polite">
                {phase === 'idle' && (supported ? 'Tap the mic and start speaking' : 'Voice input isn’t supported in this browser')}
                {phase === 'rec' && <>Listening <b>{mm}</b> · tap to finish</>}
                {phase === 'analyzing' && 'Analysing your response…'}
                {phase === 'done' && 'Try again or pick another prompt'}
              </div>
              {phase === 'rec' && (
                <div className="live-wave">
                  {Array.from({ length: 32 }).map((_, i) => <i key={i} style={{ animationDelay: `${(i % 9) * -0.11}s` }} />)}
                </div>
              )}
              {phase === 'idle' && (
                <button className="sample-btn" onClick={runSample}><FileText size={15} /> Use a sample answer instead</button>
              )}
              <AnimatePresence>
                {error && (
                  <motion.div className="demo-error" role="alert" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="demo-right">
            <AnimatePresence mode="wait">
              {phase !== 'done' || !result ? (
                <motion.div key={phase === 'rec' ? 'rec' : 'wait'} className="demo-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {phase === 'rec' ? (
                    <div className="live-transcript">
                      <span className="eyebrow" style={{ fontSize: 11.5, color: '#e5484d' }}><span className="rec-pip" /> Live transcript</span>
                      <p>{live || <em>Start speaking — your words will appear here…</em>}</p>
                    </div>
                  ) : phase === 'analyzing' ? (
                    <>
                      <div className="scan"><Sparkles size={28} /></div>
                      <strong>Analysing pace, fillers, grammar and vocabulary</strong>
                      <div className="skeleton"><i /><i /><i /></div>
                    </>
                  ) : (
                    <>
                      <div className="ghost-ic"><Volume2 size={28} /></div>
                      <strong>Your feedback will appear here</strong>
                      <p>{supported ? 'Your voice is processed by your browser’s speech recognition. Nothing is stored by Evolish.' : 'Open this page in Chrome, Edge or Safari to use your voice, or try the sample answer.'}</p>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }}>
                  <div className="fb-head">
                    <span className="eyebrow" style={{ fontSize: 11.5, color: 'var(--teal)' }}><Sparkles size={13} /> {isSample ? 'Sample feedback' : 'Your feedback'}</span>
                    <span className="lvl-badge">Estimated {result.level}</span>
                  </div>
                  <div className="transcript">
                    {result.segments.map((s, i) => (
                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }}>
                        {typeof s === 'string' ? s
                          : s.filler ? <mark className="filler" title="Filler word">{s.filler}</mark>
                          : (
                            <span className="fix" title={s.why}>
                              <s>{s.fix[0]}</s>
                              <motion.ins initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.05 }}>{s.fix[1]}</motion.ins>
                            </span>
                          )}
                      </motion.span>
                    ))}
                  </div>
                  <div className="mini-stats">
                    <span><b>{result.stats.wpm}</b> words/min</span>
                    <span><b>{result.stats.words}</b> words</span>
                    <span><b>{result.stats.fillers}</b> fillers</span>
                    <span><b>{result.stats.fixes}</b> corrections</span>
                  </div>
                  <div className="score-grid">
                    {Object.entries(result.scores).map(([k, v], i) => (
                      <div key={k} className="score">
                        <svg viewBox="0 0 44 44">
                          <circle cx="22" cy="22" r="19" className="sc-bg" />
                          <motion.circle cx="22" cy="22" r="19" className="sc-fg"
                            style={{ stroke: v >= 80 ? 'var(--teal)' : v >= 65 ? '#f5a524' : '#e5484d' }}
                            initial={{ pathLength: 0 }} animate={{ pathLength: v / 100 }} transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease }} />
                        </svg>
                        <strong><Counter to={v} delay={0.3 + i * 0.1} /></strong>
                        <small>{k}</small>
                      </div>
                    ))}
                  </div>
                  <motion.div className="tip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                    <Wand2 size={18} />
                    <span><b>Coach tip:</b> {result.tip}</span>
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
