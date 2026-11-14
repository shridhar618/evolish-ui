import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Menu, Smartphone, X, Mic, GraduationCap, BookOpen, Stethoscope, Briefcase, FileText, HelpCircle, Newspaper } from 'lucide-react'
import Logo from './Logo'
import { Magnetic, ThemeToggle, useActiveSection } from './Extras'
import './Navbar.css'

const MENUS = {
  'Solutions & Courses': [
    { icon: Mic, title: 'Spoken English Course', desc: 'Speak with clarity and confidence' },
    { icon: Briefcase, title: 'Placement & Interview Prep', desc: 'Get job-ready communication' },
    { icon: Stethoscope, title: 'Nursing & OET English', desc: 'Healthcare-focused English' },
    { icon: GraduationCap, title: 'TOEFL Exam Prep', desc: 'Structured test preparation' },
  ],
  Resources: [
    { icon: Newspaper, title: 'Blog & Knowledge Hub', desc: 'Guides, tips and insights' },
    { icon: FileText, title: 'CEFR English Assessment', desc: 'Find your level in minutes' },
    { icon: HelpCircle, title: 'FAQs', desc: 'Answers to common questions' },
    { icon: BookOpen, title: 'Schools English Lab', desc: 'For K-12 institutions' },
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
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="nav-inner">
          <Logo />
          <nav className="nav-links" onMouseLeave={() => setOpen(null)}>
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} className={`nav-link ${active === l.href.slice(1) ? 'current' : ''}`} onMouseEnter={() => setOpen(null)}>
                {l.label}
                {active === l.href.slice(1) && <motion.span layoutId="nav-dot" className="nav-dot" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              </a>
            ))}
            {Object.keys(MENUS).map((m) => (
              <div key={m} className="nav-drop" onMouseEnter={() => setOpen(m)}>
                <button className={`nav-link ${open === m ? 'active' : ''}`} aria-expanded={open === m}>
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
                          href="#"
                          key={it.title}
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
          <motion.div className="mobile-sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
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
              <a href="#" className="btn btn-brand">Take Free English Test</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
