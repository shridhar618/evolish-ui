import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { LogoMark } from './Logo'

/* Intro loader: logo draws in, then the curtain lifts */
export function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    let v = 0
    const t = setInterval(() => {
      v = Math.min(100, v + Math.random() * 18 + 6)
      setPct(Math.round(v))
      if (v >= 100) { clearInterval(t); setTimeout(onDone, 350) }
    }, 90)
    return () => clearInterval(t)
  }, [onDone])
  return (
    <motion.div className="preloader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
      <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -30 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 14 }}>
        <LogoMark size={88} />
      </motion.div>
      <motion.div className="pl-word" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        evolish
      </motion.div>
      <div className="pl-bar"><i style={{ width: `${pct}%` }} /></div>
      <span className="pl-pct">{pct}%</span>
    </motion.div>
  )
}

/* Button that's gently pulled toward the cursor */
export function Magnetic({ children, strength = 0.3 }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })
  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.span>
  )
}

/* Back-to-top with scroll progress ring */
export function BackToTop() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const [show, setShow] = useState(false)
  useEffect(() => scrollYProgress.on('change', (v) => setShow(v > 0.08)), [scrollYProgress])
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="to-top"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <svg viewBox="0 0 52 52" className="ring">
            <circle cx="26" cy="26" r="23" className="ring-bg" />
            <motion.circle cx="26" cy="26" r="23" className="ring-fg" style={{ pathLength: p }} />
          </svg>
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/* Track which section is currently in view */
export function useActiveSection(ids) {
  const [active, setActive] = useState(null)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [ids])
  return active
}
