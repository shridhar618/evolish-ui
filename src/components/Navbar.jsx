import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Menu, Smartphone, X, Mic, GraduationCap, BookOpen, Stethoscope, Briefcase, FileText, HelpCircle, Newspaper } from 'lucide-react'
import Logo from './Logo'
import { Magnetic, ThemeToggle, useActiveSection } from './Extras'
import useFocusTrap from './useFocusTrap'
import './Navbar.css'

const MENUS = {
  'Solutions & Courses': [
    { icon: Mic, title: 'Spoken English Course', desc: 'Speak with clarity and confidence', href: '#explore' },
    { icon: Briefcase, title: 'Placement & Interview Prep', desc: 'Get job-ready communication', href: '#explore' },
    { icon: Stethoscope, title: 'Nursing & OET English', desc: 'Healthcare-focused English', href: '#explore' },
    { icon: GraduationCap, title: 'TOEFL Exam Prep', desc: 'Structured test preparation', href: '#explore' },
  ],
  Resources: [
    { icon: Newspaper, title: 'Blog & Knowledge Hub', desc: 'Guides, tips and insights', href: '#' },
    { icon: FileText, title: 'CEFR English Assessment', desc: 'Find your level in minutes', href: '#demo' },
    { icon: HelpCircle, title: 'FAQs', desc: 'Answers to common questions', href: '#faq' },
    { icon: BookOpen, title: 'Schools English Lab', desc: 'For K-12 institutions', href: '#colleges' },
  ],
}

const SECTION_IDS = ['how', 'demo', 'cefr', 'paths', 'colleges']

const LINKS = [
  { label: 'How It Works', href: '#how' },
  { label: 'Try Demo', href: '#demo' },
  { label: 'CEFR Levels', href: '#cefr' },
  { label: 'For Colleges', href: '#colleges' },
]

export default function Navbar({ onSignIn }) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40)
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const { scrollY, scrollYProgress } = useScroll()
  const [hidden, setHidden] = useState(false)
  // Hide while scrolling down to read, reveal as soon as the user scrolls up
  // (small deltas are ignored, so the bar doesn't pop back as smooth scrolling eases to a stop)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const d = y - (scrollY.getPrevious() ?? 0)
    setScrolled(y > 40)
    if (y < 400 || d < -4) setHidden(false)
    else if (d > 4 && !mobile && !open) setHidden(true)
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // Dropdowns: close on Escape or on a tap/click anywhere outside
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    const onDown = (e) => !e.target.closest?.('.nav-drop') && setOpen(null)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  // Mobile menu behaves like a dialog: page behind is locked, Escape closes, focus stays inside
  const sheet = useRef(null)
  useFocusTrap(sheet, mobile)
  useEffect(() => {
    if (!mobile) return
    const onKey = (e) => e.key === 'Escape' && setMobile(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; window.__lenis?.start() }
  }, [mobile])

  return (
    <>
      <div className="announce">
        <div className="container announce-inner">
          <span className="badge-new">NEW</span>
          <span className="announce-text">Evolish English learning for individuals, colleges and universities.</span>
          <a href="#paths" className="announce-link">Speak with Evolish <ArrowUpRight size={16} /></a>
        </div>
      </div>

      <motion.header
        className={`nav ${scrolled ? 'is-scrolled' : ''}`}
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? '-105%' : 0, opacity: 1 }}
        transition={{ duration: hidden ? 0.35 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <Logo />
          <nav className="nav-links" onMouseLeave={() => setOpen(null)}>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className={`nav-link ${active === l.href.slice(1) ? 'current' : ''}`} aria-current={active === l.href.slice(1) ? 'true' : undefined} onMouseEnter={() => setOpen(null)}>
                {l.label}
                {active === l.href.slice(1) && <motion.span layoutId="nav-dot" className="nav-dot" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              </a>
            ))}
            {Object.keys(MENUS).map((m) => (
              <div key={m} className="nav-drop" onMouseEnter={() => setOpen(m)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen((o) => (o === m ? null : o)) }}>
                {/* keyboard (detail 0) toggles; a mouse click keeps the hover-opened menu open */}
                <button className={`nav-link ${open === m ? 'active' : ''}`} aria-expanded={open === m} aria-haspopup="true"
                  onClick={(e) => setOpen(e.detail === 0 && open === m ? null : m)}>
                  {m} <ChevronDown size={16} className="chev" />
                </button>
                <AnimatePresence>
                  {open === m && (
                    <motion.div
                      className="mega"
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {MENUS[m].map((it, i) => (
                        <motion.a
                          href={it.href}
                          key={it.title}
                          onClick={() => setOpen(null)}
                          className="mega-item"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.03 * i }}
                        >
                          <span className="mega-icon"><it.icon size={18} /></span>
                          <span>
                            <strong>{it.title}</strong>
                            <small>{it.desc}</small>
                          </span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
          <div className="nav-actions">
            <a href="#" className="app-pill"><Smartphone size={16} /> Download App</a>
            <ThemeToggle />
            <button className="signin" onClick={onSignIn}>Sign In</button>
            <Magnetic strength={0.2}><a href="#demo" className="btn btn-brand nav-cta">Take Free English Test</a></Magnetic>
            <button className="burger" onClick={() => setMobile(true)} aria-label="Open menu"><Menu /></button>
          </div>
        </div>
        <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      </motion.header>

      <AnimatePresence>
        {mobile && (
          <motion.div className="mobile-sheet" data-lenis-prevent onMouseDown={() => setMobile(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              ref={sheet} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Menu"
              onMouseDown={(e) => e.stopPropagation()}
              className="mobile-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 34 }}
            >
              <div className="mobile-top">
                <Logo />
                <button onClick={() => setMobile(false)} aria-label="Close menu"><X /></button>
              </div>
              {[...LINKS, { label: 'Solutions & Courses', href: '#explore' }, { label: 'Resources', href: '#faq' }].map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobile(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <button className="btn btn-ghost" onClick={() => { setMobile(false); onSignIn() }}>Sign In</button>
              <a href="#demo" className="btn btn-brand" onClick={() => setMobile(false)}>Take Free English Test</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
