import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Mic, Building2, BadgeCheck } from 'lucide-react'
import Reveal, { SplitHeading } from './Reveal'

const CARDS = [
  { icon: Mic, tone: 'p', n: '01', title: 'Speak with confidence', desc: 'Daily speaking drills with instant AI feedback on pronunciation, fluency and structure.', tag: 'Spoken English' },
  { icon: Building2, tone: 'b', n: '02', title: 'Get placement-ready', desc: 'Mock interviews, group discussions and workplace communication for your first job.', tag: 'Interview Prep' },
  { icon: BadgeCheck, tone: 't', n: '03', title: 'Certify your level', desc: 'Take a CEFR-aligned assessment and share a verified A1–C2 result with employers.', tag: 'CEFR Assessment' },
]

function TiltCard({ c, i }) {
  const ref = useRef(null)
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const rx = useSpring(useTransform(y, [0, 1], [6, -6]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(x, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })
  const glow = useTransform([x, y], ([a, b]) => `radial-gradient(400px circle at ${a * 100}% ${b * 100}%, rgba(91,71,214,.12), transparent 60%)`)

  return (
    <Reveal delay={i * 0.12}>
      <motion.a
        href="#"
        ref={ref}
        className={`explore-card grad-border tone-${c.tone}`}
        style={{ rotateX: rx, rotateY: ry }}
        onMouseMove={(e) => {
          const r = ref.current.getBoundingClientRect()
          x.set((e.clientX - r.left) / r.width)
          y.set((e.clientY - r.top) / r.height)
        }}
        onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
      >
        <motion.div className="ec-glow" style={{ background: glow }} />
        <div className="ec-top">
          <span className="ec-icon"><c.icon size={24} /></span>
          <span className="ec-n">{c.n}</span>
        </div>
        <h3>{c.title}</h3>
        <p>{c.desc}</p>
        <div className="ec-foot">
          <span className="ec-tag">{c.tag}</span>
          <span className="ec-go"><ArrowUpRight size={18} /></span>
        </div>
      </motion.a>
    </Reveal>
  )
}

export default function Explore() {
  return (
    <section className="section" id="explore">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Explore Evolish</span>
          <SplitHeading parts={['English learning for ', ['every next step.', 'accent']]} />
          <p>Choose the outcome that matters to you today.</p>
        </Reveal>
        <div className="explore-grid">
          {CARDS.map((c, i) => <TiltCard key={c.n} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}
