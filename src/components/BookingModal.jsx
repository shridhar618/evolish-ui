import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Loader2, X, CalendarCheck, AlertCircle } from 'lucide-react'
import { BOOKING_FORM_ENDPOINT } from '../config'
import './BookingModal.css'

const EMPTY = { name: '', email: '', phone: '', college: '', role: 'Faculty', size: '100–500', message: '' }
const ROLES = ['Faculty', 'Placement officer', 'Head of department', 'Principal / Leadership', 'Other']
const SIZES = ['Under 100', '100–500', '500–2,000', '2,000+']

function validate(f) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Please enter your name'
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address'
  if (f.phone && !/^[+\d][\d\s-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number'
  if (f.college.trim().length < 2) e.college = 'Please enter your institution'
  return e
}

export default function BookingModal({ open, onClose }) {
  const [f, setF] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | failed

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; window.__lenis?.start() }
  }, [open, onClose])
  useEffect(() => { if (!open) setTimeout(() => { setStatus('idle'); setErrors({}) }, 300) }, [open])

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setStatus('sending')
    try {
      if (BOOKING_FORM_ENDPOINT) {
        const res = await fetch(BOOKING_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...f, _subject: `Walkthrough request — ${f.college}` }),
        })
        if (!res.ok) throw new Error('bad status')
      } else {
        await new Promise((r) => setTimeout(r, 1200))
      }
      setStatus('done')
      setF(EMPTY)
    } catch {
      setStatus('failed')
    }
  }

  const Field = ({ k, label, type = 'text', ph, optional }) => (
    <label className={`bk-field ${errors[k] ? 'has-err' : ''}`}>
      <span>{label}{optional && <em> (optional)</em>}</span>
      <input type={type} value={f[k]} onChange={set(k)} placeholder={ph} aria-invalid={!!errors[k]} />
      <AnimatePresence>{errors[k] && <motion.small initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{errors[k]}</motion.small>}</AnimatePresence>
    </label>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="bk-backdrop" data-lenis-prevent onMouseDown={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="bk-modal" role="dialog" aria-modal="true" aria-labelledby="bk-title"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <aside className="bk-side">
              <CalendarCheck size={30} />
              <h3>See Evolish with your own cohort.</h3>
              <ul>
                {['30-minute guided walkthrough', 'Faculty dashboard demo', 'Plan a free 10-day pilot', 'Licensing options explained'].map((t, i) => (
                  <motion.li key={t} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                    <span><Check size={13} strokeWidth={3} /></span>{t}
                  </motion.li>
                ))}
              </ul>
            </aside>

            <div className="bk-main">
              <button className="bk-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
              <AnimatePresence mode="wait">
                {status === 'done' ? (
                  <motion.div key="ok" className="bk-done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <motion.span className="bk-ok" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}><Check size={32} strokeWidth={3} /></motion.span>
                    <h3>Request received!</h3>
                    <p>Our team will reach out within one working day to schedule your walkthrough.</p>
                    <button className="btn btn-brand" onClick={onClose}>Done</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className="eyebrow">For colleges & universities</span>
                    <h2 id="bk-title">Book a college walkthrough</h2>
                    <div className="bk-grid">
                      {Field({ k: 'name', label: 'Full name', ph: 'Dr. Priya Sharma' })}
                      {Field({ k: 'email', label: 'Work email', type: 'email', ph: 'you@college.edu' })}
                      {Field({ k: 'college', label: 'Institution', ph: 'ABC Institute of Technology' })}
                      {Field({ k: 'phone', label: 'Phone', type: 'tel', ph: '+91 98765 43210', optional: true })}
                      <label className="bk-field">
                        <span>Your role</span>
                        <select value={f.role} onChange={set('role')}>{ROLES.map((r) => <option key={r}>{r}</option>)}</select>
                      </label>
                      <div className="bk-field">
                        <span>Students to onboard</span>
                        <div className="bk-chips" role="radiogroup">
                          {SIZES.map((s) => (
                            <button type="button" key={s} role="radio" aria-checked={f.size === s} className={f.size === s ? 'on' : ''} onClick={() => setF({ ...f, size: s })}>
                              {f.size === s && <motion.i layoutId="size-chip" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                              <b>{s}</b>
                            </button>
                          ))}
                        </div>
                      </div>
                      <label className="bk-field full">
                        <span>Anything we should know? <em>(optional)</em></span>
                        <textarea rows={3} value={f.message} onChange={set('message')} placeholder="e.g. Placement season starts in January; we have mixed proficiency levels." />
                      </label>
                    </div>
                    {status === 'failed' && <p className="bk-fail"><AlertCircle size={16} /> Something went wrong sending your request. Please try again.</p>}
                    <button className="btn btn-teal bk-submit" disabled={status === 'sending'}>
                      {status === 'sending' ? <><Loader2 size={18} className="spin" /> Sending…</> : <>Request walkthrough <ArrowRight size={18} /></>}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
