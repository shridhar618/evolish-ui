import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Paths, { StatsStrip } from './components/Paths'
import HowItWorks from './components/HowItWorks'
import TryDemo from './components/TryDemo'
import Colleges from './components/Colleges'
import Testimonials from './components/Testimonials'
import Explore from './components/Explore'
import { FAQ, CTA, Footer } from './components/Closing'
import LoginModal from './components/LoginModal'
import BookingModal from './components/BookingModal'
import { BackToTop, Preloader } from './components/Extras'
import './components/sections.css'
import './components/extras.css'

const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [login, setLogin] = useState(false)
  // Show the intro loader only on the first visit of a browser session
  const [loading, setLoading] = useState(() => {
    if (reduced) return false
    try { return !sessionStorage.getItem('evolish-seen') } catch { return true }
  })
  const close = useCallback(() => setLogin(false), [])
  const [booking, setBooking] = useState(false)
  const openBook = useCallback(() => setBooking(true), [])
  const closeBook = useCallback(() => setBooking(false), [])
  const done = useCallback(() => {
    try { sessionStorage.setItem('evolish-seen', '1') } catch { /* ignore */ }
    setLoading(false)
  }, [])

  // Smooth inertial scrolling (disabled for reduced-motion users)
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80 } })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    window.__lenis = lenis
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  useEffect(() => {
    if (login || loading) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [login, loading])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      {!loading && (
        <>
          <Navbar onSignIn={() => setLogin(true)} />
          <main>
            <Hero />
            <StatsStrip />
            <Paths />
            <HowItWorks />
            <TryDemo />
            <Colleges onBook={openBook} />
            <Testimonials />
            <Explore />
            <FAQ onBook={openBook} />
            <CTA onBook={openBook} />
          </main>
          <Footer />
          <BackToTop />
          <LoginModal open={login} onClose={close} />
          <BookingModal open={booking} onClose={closeBook} />
        </>
      )}
    </MotionConfig>
  )
}
