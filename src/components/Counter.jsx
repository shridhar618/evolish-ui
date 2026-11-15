import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'

// Counts up by writing to the DOM node directly, so the parent never re-renders mid-animation
export default function Counter({ to, duration = 1.6, suffix = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const el = ref.current
    const c = animate(0, to, {
      duration, delay, ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}` },
    })
    return () => c.stop()
  }, [inView, to, duration, delay, suffix])
  return <span ref={ref}>{`0${suffix}`}</span>
}
