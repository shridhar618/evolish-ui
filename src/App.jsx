import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, cancelFrame, frame } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
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
    // lerp-based easing feels smooth without the 'floaty' lag of long durations
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, anchors: { offset: -80 } })
    // Drive Lenis from framer-motion's frame loop so scroll-linked animations
    // (parallax, progress bar) read the new scroll position in the same frame
    const update = ({ timestamp }) => lenis.raf(timestamp)
    frame.update(update, true)
    window.__lenis = lenis
    return () => { cancelFrame(update); lenis.destroy(); window.__lenis = null }
  }, [])

  // Pause looping CSS animations in sections that are off-screen (saves GPU, keeps scrolling smooth)
  useEffect(() => {
    if (loading) return
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '200px 0px' },
    )
    document.querySelectorAll('main > section').forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [loading])

  useEffect(() => {
    if (login || loading) window.__lenis?.stop()
    else window.__lenis?.start()
  }, [login, loading])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader onDone={done} />}</AnimatePresence>
      {!loading && (
        <>
          <a href="#main" className="skip-link" onClick={() => document.getElementById('main')?.focus({ preventScroll: true })}>Skip to content</a>
          <Navbar onSignIn={() => setLogin(true)} />
          <main id="main" tabIndex={-1}>
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
