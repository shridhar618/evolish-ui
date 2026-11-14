import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useAnimationFrame, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Lock, Mail, X, Building2, Loader2, Check } from 'lucide-react'
import { LogoMark } from './Logo'
import './LoginModal.css'

const TABS = [
  { id: 'learner', label: 'Learner Login', title: 'Welcome back', sub: 'Sign in to continue your learning journey', field: 'Email address', ph: 'you@example.com' },
  { id: 'inst', label: 'Institution Login', title: 'Institution portal', sub: 'Manage cohorts, faculty and progress reports', field: 'Institution email', ph: 'faculty@college.edu' },
]

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState(0)
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | done | error

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open, onClose])

  useEffect(() => { if (!open) { setStatus('idle'); setPw('') } }, [open])

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email) || pw.length < 4) { setStatus('error'); return }
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1400)
  }

  const t = TABS[tab]

  // 3D tilt driven by pointer position over the whole backdrop
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 120, damping: 18 })
  const sy = useSpring(py, { stiffness: 120, damping: 18 })
  const rotY = useTransform(sx, [0, 1], [-7, 7])
  const rotX = useTransform(sy, [0, 1], [6, -6])
  const glareX = useTransform(sx, [0, 1], [0, 100])
  const glareY = useTransform(sy, [0, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(255,255,255,.55), transparent 55%)`
  // Whole-card flip (added on top of the tilt)
  const flip = useMotionValue(0)
  const flipScale = useTransform(flip, [-90, 0, 90], [0.92, 1, 0.92])

  // Idle float: gentle sway while the pointer is away; fades out as soon as the user hovers
  const hover = useMotionValue(0)
  const hoverS = useSpring(hover, { stiffness: 70, damping: 18 })
  const idleX = useMotionValue(0)
  const idleY = useMotionValue(0)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useAnimationFrame((time) => {
    if (!open || reduced) return
    const k = 1 - hoverS.get()
    idleX.set(Math.sin(time / 1900) * 2.4 * k)
    idleY.set(Math.cos(time / 2600) * 3.6 * k)
  })

  // Entrance: swings up from a backwards tilt
  const enterX = useMotionValue(0)

  // One source of truth for the card's angle — every 3D effect derives from it
  const degX = useTransform([rotX, idleX, enterX], ([a, b, c]) => a + b + c)
  const degY = useTransform([rotY, idleY, flip], ([a, b, c]) => a + b + c)

  // Solid 3D slab: stacked edge layers + soft drop shadow that follow tilt and flip
  const EDGE = ['#ece9fe', '#e2ddfd', '#d6cffc', '#c9c0fb', '#bbb0fa', '#ab9ef9', '#9b8cf8', '#8b7bf7', '#7c6af5', '#6a5af9']
  const rad = (d) => (d * Math.PI) / 180
  const clampN = (v, m) => Math.max(-m, Math.min(m, v))
  const shadow = useTransform([degX, degY], ([ax, ay]) => {
    const lx = clampN(-Math.sin(rad(ay)) * 46, 22)   // edge leans away from the turn
    const ly = 13 + clampN(ax, 20) * 0.55            // thicker when the top tips toward you
    const n = EDGE.length
    const edge = EDGE.map((c, i) => `${((lx * (i + 1)) / n).toFixed(2)}px ${((ly * (i + 1)) / n).toFixed(2)}px 0 ${c}`).join(', ')
    const dx = lx * 2.6
    return `${edge}, ${dx.toFixed(1)}px ${(46 + ly * 2.2).toFixed(1)}px 70px -18px rgba(28,20,110,.5), ${(dx / 3).toFixed(1)}px 18px 30px -12px rgba(28,20,110,.32)`
  })

  // Floor shadow under the card: slides opposite the tilt and narrows as the card turns
  const floorX = useTransform(degY, (a) => clampN(-Math.sin(rad(a)) * 120, 60))
  const floorScale = useTransform(degY, (a) => 1 - Math.abs(Math.sin(rad(a))) * 0.45)
  const floorOpacity = useTransform(degX, (a) => 0.85 + clampN(a, 20) * 0.01)

  // Rim light that follows the pointer around the card's border
  const rim = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, #8b7bff, rgba(79,227,193,.9) 34%, rgba(124,108,255,.25) 60%, transparent 75%)`
  const rimOpacity = useTransform(hoverS, [0, 1], [0.35, 1])

  // Layers start flat, then rise one after another once the card has landed
  const [phase, setPhase] = useState('flat') // flat | rising | idle
  useEffect(() => {
    if (!open) return
    setPhase('flat')
    enterX.jump(reduced ? 0 : 28)
    const a = animate(enterX, 0, { type: 'spring', stiffness: 120, damping: 15, mass: 1 })
    const t1 = setTimeout(() => setPhase('rising'), 380)
    const t2 = setTimeout(() => setPhase('idle'), 1100)
    return () => { a.stop(); clearTimeout(t1); clearTimeout(t2) }
  }, [open, enterX, reduced])

  const [flipping, setFlipping] = useState(false)
  const busy = useRef(false)
  const switchTab = async (i) => {
    if (i === tab || busy.current) return
    busy.current = true
    const dir = i > tab ? 1 : -1
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTab(i); setStatus('idle'); busy.current = false; return
    }
    setFlipping(true)                                   // flatten depth layers first
    await new Promise((r) => setTimeout(r, 90))
    await animate(flip, 90 * dir, { duration: 0.32, ease: [0.55, 0, 0.9, 0.4] })
    setTab(i); setStatus('idle')                        // swap content while edge-on (invisible)
    flip.jump(-90 * dir)
    await animate(flip, 0, { type: 'spring', stiffness: 160, damping: 19, mass: 0.9 })
    setFlipping(false)
    busy.current = false
  }
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine) and (min-width: 700px)').matches

  // Tilt only while the pointer is over the card, measured from the card's own centre,
  // so the card always rests perfectly straight.
  const onMove = (e) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    hover.set(1)
    px.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)))
    py.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)))
  }
  const recenter = () => { px.set(0.5); py.set(0.5); hover.set(0) }
  useEffect(() => { if (open) { px.jump(0.5); py.jump(0.5); sx.jump(0.5); sy.jump(0.5) } }, [open, px, py, sx, sy])

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal-backdrop" data-lenis-prevent onMouseDown={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="modal-aura" aria-hidden="true" />

          <div className="modal-stage">
          <motion.div
            role="dialog" aria-modal="true" aria-labelledby="login-title"
            onMouseDown={(e) => e.stopPropagation()}
            onMouseMove={onMove}
            onMouseLeave={recenter}
            className={`modal ${flipping || phase === 'flat' ? 'is-flipping' : ''} ${phase === 'rising' ? 'is-rising' : ''}`}
            style={{ rotateX: degX, rotateY: degY, scale: flipScale, boxShadow: shadow }}
            initial={{ opacity: 0, z: -320, y: 40 }}
            animate={{ opacity: 1, z: 0, y: 0 }}
            exit={{ opacity: 0, z: -220, y: 30, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 150, damping: 22 }}
          >
            <div className="modal-clip" aria-hidden="true">
              <div className="modal-sheen" />
              {fine && <motion.div className="modal-rim" style={{ background: rim, opacity: rimOpacity }} />}
              {fine && <motion.div className="modal-glare" style={{ background: glare }} />}
            </div>
            <button className="modal-close z2" onClick={onClose} aria-label="Close"><X size={20} /></button>

            <motion.div className="modal-logo z3" initial={{ scale: 0.6, rotateY: -180 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.15 }}>
              <LogoMark size={58} />
            </motion.div>

            <div className="modal-heading z2">
              <h2 id="login-title">{t.title}</h2>
              <p>{t.sub}</p>
            </div>

            <div className="tabs z1" role="tablist">
              {TABS.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => switchTab(i)} disabled={flipping}>
                  {tab === i && <motion.span layoutId={flipping ? undefined : 'tab-pill'} className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="tab-label">{i === 1 && <Building2 size={15} />}{x.label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" className="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.span className="success-ring" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>
                    <Check size={30} strokeWidth={3} />
                  </motion.span>
                  <h3>You're signed in</h3>
                  <p>Redirecting to your dashboard…</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate
                  className={`modal-form ${status === 'error' ? 'shake' : ''}`}
                  onAnimationEnd={() => status === 'error' && setStatus('idle')}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label className="field-label" htmlFor="email">{t.field}</label>
                  <div className="field">
                    <Mail size={18} />
                    <input id="email" type="email" placeholder={t.ph} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                  </div>

                  <div className="field-row">
                    <label className="field-label" htmlFor="pw">Password</label>
                    <a href="#" className="forgot">Forgot?</a>
                  </div>
                  <div className="field">
                    <Lock size={18} />
                    <input id="pw" type={show ? 'text' : 'password'} placeholder="Enter your password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
                    <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span key={show ? 'off' : 'on'} initial={{ opacity: 0, rotate: -60 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 60 }} transition={{ duration: 0.15 }}>
                          {show ? <EyeOff size={18} /> : <Eye size={18} />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>

                  <div className="field-row remember-row">
                    <label className="remember">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                      <span className="box">{remember && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={13} strokeWidth={3.5} /></motion.span>}</span>
                      Remember me
                    </label>
                    <span className="hint">{remember ? 'Stays signed in for 30 days' : 'Signs out on close'}</span>
                  </div>

                  <button className="btn btn-grad submit z3" disabled={status === 'loading'}>
                    {status === 'loading' ? <><Loader2 size={18} className="spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} /></>}
                  </button>

                  <div className="divider"><span>Or continue with</span></div>
                  <button type="button" className="google z2"><GoogleIcon /> Sign in with Google</button>
                  <p className="new">New to Evolish? <a href="#">Create account</a></p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div className="modal-floor" aria-hidden="true" style={{ x: floorX, scaleX: floorScale, opacity: floorOpacity }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
