import { motion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Download } from 'lucide-react'
import Reveal, { SplitHeading } from './Reveal'
import Counter from './Counter'

const STEPS = [
  ['01', 'Start with a 10-day pilot', 'Evaluate the experience with a representative cohort.'],
  ['02', 'Review actual participation', 'See how students practise and where support is needed.'],
  ['03', 'Choose the right model', 'College-wide licences or direct student purchase.'],
]
const CHART = [['Jul', 48, 60], ['Aug', 56, 68], ['Sep', 64, 78], ['Oct', 72, 88]]
const ease = [0.22, 1, 0.36, 1]

export default function Colleges({ onBook }) {
  return (
    <section className="section colleges" id="colleges">
      <div className="container colleges-inner">
        <div className="colleges-copy">
          <Reveal><span className="eyebrow">For institutions</span></Reveal>
          <SplitHeading parts={['More than a language lab. ', ['A communication-readiness system.', 'accent']]} />
          <Reveal delay={0.1}><p className="lead">Support mixed proficiency levels, extend faculty capacity and connect English development with employability.</p></Reveal>
          <ol className="pilot">
            {STEPS.map(([n, t, d], i) => (
              <Reveal as="li" key={n} delay={0.15 + i * 0.1} y={20}>
                <span className="pilot-n">{n}</span>
                <div><strong>{t}</strong><p>{d}</p></div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.4}><button className="btn btn-teal" onClick={onBook}>Book a college walkthrough <ArrowUpRight size={18} /></button></Reveal>
        </div>

        <Reveal delay={0.1} className="dash-wrap">
          <div className="dash">
            <div className="dash-head">
              <div><span className="eyebrow" style={{ fontSize: 11.5 }}>Faculty dashboard</span><h4>Communication readiness</h4></div>
              <button className="export"><Download size={14} /> Export report</button>
            </div>
            <div className="kpis">
              <div><small>Weekly participation</small><strong><Counter to={89} suffix="%" /></strong><em className="up"><ArrowUp size={12} /> 6% this month</em></div>
              <div><small>Average mastery</small><strong><Counter to={76} suffix="%" /></strong><em>Across four skills</em></div>
              <div><small>At placement target</small><strong><Counter to={68} suffix="%" /></strong><em>Sample cohort</em></div>
            </div>
            <div className="chart">
              <div className="chart-head">
                <strong>Skill development</strong>
                <span className="legend"><i className="p" />Speaking <i className="t" />Overall</span>
              </div>
              <div className="bars">
                {CHART.map(([m, a, b], i) => (
                  <div className="bar-group" key={m}>
                    <div className="bar-pair">
                      <motion.i className="p" initial={{ height: 0 }} whileInView={{ height: `${a}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 + i * 0.12, ease }}><b>{a}</b></motion.i>
                      <motion.i className="t" initial={{ height: 0 }} whileInView={{ height: `${b}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4 + i * 0.12, ease }}><b>{b}</b></motion.i>
                    </div>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <small className="illus">Illustrative data</small>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
