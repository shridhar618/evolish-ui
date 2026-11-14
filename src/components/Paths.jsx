import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Flame, Users } from 'lucide-react'
import Reveal, { SplitHeading } from './Reveal'
import Counter from './Counter'

const STATS = [
  ['LSRW', 'Four-skill practice'],
  ['A1–C2', 'CEFR progression'],
  ['AI feedback', 'Speaking and writing'],
  ['Progress', 'Learner and cohort views'],
]

export function StatsStrip() {
  return (
    <div className="stats-strip">
      <div className="stats-inner">
        <div className="stats-label">One platform for complete English development</div>
        {STATS.map(([t, s], i) => (
          <Reveal key={t} delay={i * 0.08} y={16} className="stat">
            <strong>{t}</strong>
            <span>{s}</span>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

const ease = [0.22, 1, 0.36, 1]

export default function Paths() {
  return (
    <section className="section" id="paths">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Choose your path</span>
          <SplitHeading parts={['One platform. ', ['Two very different', 'accent'], ' reasons to begin.']} />
          <p>Evolish gives learners the confidence to communicate and institutions the structure to make progress measurable.</p>
        </Reveal>

        {/* Individuals */}
        <Reveal clip className="path-card">
          <div className="path-copy">
            <span className="eyebrow">For individual learners</span>
            <h3>Practise privately. Improve visibly. Speak confidently.</h3>
            <p>For students, job seekers, professionals and self-learners who want practical English—not more theory.</p>
            <ul className="ticks">
              {['Personalised level-wise learning', 'AI speaking and writing feedback', 'Real-life and workplace topics'].map((t, i) => (
                <motion.li key={t} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, ease }}>
                  <span className="check"><Check size={14} strokeWidth={3} /></span>{t}
                </motion.li>
              ))}
            </ul>
            <a href="#explore" className="link-arrow">Explore learner courses <ArrowUpRight size={18} /></a>
          </div>
          <div className="path-visual purple">
            <div className="pv-glow" />
            <motion.div
              className="lesson-card"
              initial={{ rotate: 0, y: 40, opacity: 0 }}
              whileInView={{ rotate: -2, y: 0, opacity: 1 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease }}
            >
              <span className="eyebrow" style={{ fontSize: 12 }}>Today's lesson</span>
              <h4>Introducing yourself professionally</h4>
              <p>Speaking · Vocabulary · Grammar</p>
              <div className="lesson-steps">
                {[0, 1, 2, 3].map((i) => (
                  <motion.i key={i} className={i < 3 ? 'done' : ''}
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.18, duration: 0.5, ease }} />
                ))}
              </div>
            </motion.div>
            <motion.div className="mini-feedback"
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.8, ease }}>
              <span className="mf-dot" /> Pronunciation improved <b>+12%</b> this week
            </motion.div>
            <motion.div className="streak"
              initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.9 }}>
              <Flame size={22} className="flame" />
              <strong><Counter to={12} delay={1} /></strong>
              <span>day practice<br />streak</span>
            </motion.div>
          </div>
        </Reveal>

        {/* Colleges */}
        <Reveal clip className="path-card reverse">
          <div className="path-visual blue">
            <div className="cohort-card">
              <div className="cohort-head">
                <div><small>Cohort overview</small><strong>B.Tech 2nd Year · Section A</strong></div>
                <span className="live"><i /> Live</span>
              </div>
              <div className="cohort-kpis">
                <div><small><Users size={12} /> Active learners</small><strong><Counter to={324} /></strong></div>
                <div><small>Avg. completion</small><strong><Counter to={82} suffix="%" /></strong></div>
              </div>
              {[['Listening', 82], ['Speaking', 68], ['Reading', 76], ['Writing', 71]].map(([k, v], i) => (
                <div className="skill-row" key={k}>
                  <div><span>{k}</span><span>{v}%</span></div>
                  <div className="skill-track">
                    <motion.i initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: 0.3 + i * 0.12, ease }} />
                  </div>
                </div>
              ))}
              <small className="illus">Illustrative cohort data</small>
            </div>
          </div>
          <div className="path-copy">
            <span className="eyebrow">For colleges & universities</span>
            <h3>Structured English. Measurable outcomes.</h3>
            <p>Give students structured LSRW practice while faculty monitor participation, skill growth and placement readiness.</p>
            <ul className="ticks">
              {['CEFR-aligned cohort pathways', 'Faculty and leadership dashboards', 'Interview and employability preparation'].map((t, i) => (
                <motion.li key={t} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, ease }}>
                  <span className="check"><Check size={14} strokeWidth={3} /></span>{t}
                </motion.li>
              ))}
            </ul>
            <a href="#colleges" className="link-arrow">Explore college solutions <ArrowUpRight size={18} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
