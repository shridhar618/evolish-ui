import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus, Sparkles } from 'lucide-react'
import Reveal from './Reveal'
import Logo from './Logo'
import { Magnetic } from './Extras'

const FAQS = [
  ['Is Evolish for individuals or institutions?', 'Both. Individuals follow personal learning paths, while colleges organise cohorts, guide practice and monitor progress.'],
  ['Which English skills are covered?', 'All four core skills — listening, speaking, reading and writing (LSRW) — plus vocabulary, grammar and workplace communication.'],
  ['What does CEFR A1–C2 mean?', 'CEFR is the international standard for describing language ability, from A1 (beginner) to C2 (proficient). Every Evolish lesson maps to a level.'],
  ['Can colleges evaluate Evolish before purchasing?', 'Yes. Colleges can start with a 10-day pilot for a representative cohort and review real participation data before choosing a model.'],
]

export function FAQ({ onBook }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq" id="faq">
      <div className="container faq-inner">
        <Reveal className="faq-side">
          <span className="eyebrow">Common questions</span>
          <h2>Start with the path that fits you.</h2>
          <p>Need help deciding? <button className="u-link" onClick={onBook}>Talk to the Evolish team.</button></p>
        </Reveal>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <Reveal key={q} delay={i * 0.06} y={16} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span>{q}</span>
                  <motion.span className="faq-icon" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }}><Plus size={20} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="faq-a">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CTA({ onBook }) {
  const words = 'Start with your ambition. Evolish will help you find the words.'.split(' ')
  return (
    <section className="cta">
      <div className="cta-rings" aria-hidden="true"><i /><i /><i /></div>
      <div className="container cta-inner">
        <div>
          <Reveal><span className="eyebrow light">Better English. Brighter future.</span></Reveal>
          <motion.h2 initial="h" whileInView="s" viewport={{ once: true }} transition={{ staggerChildren: 0.05 }}>
            {words.map((w, i) => (
              <motion.span key={i} className="cta-word"
                variants={{ h: { opacity: 0, y: 30, filter: 'blur(6px)' }, s: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                {w}&nbsp;
              </motion.span>
            ))}
          </motion.h2>
        </div>
        <Reveal delay={0.3} className="cta-actions">
          <Magnetic><a href="#" className="btn btn-white">Start learning English <ArrowUpRight size={18} /></a></Magnetic>
          <button className="cta-sub" onClick={onBook}>Talk to us about your college <ArrowUpRight size={14} /></button>
        </Reveal>
      </div>
    </section>
  )
}

const COLS = [
  ['Institutional hubs', 'p', [['Schools English Lab', 'school.evolish.com'], ['Nursing & OET English', 'nursing.evolish.com'], ['College Employability & Placement'], ['Android App (APK Direct)']]],
  ['Courses & exams', 'b', [['Spoken English Course'], ['Placement & Interview Prep'], ['CEFR English Assessment'], ['TOEFL Exam Prep Hub']]],
  ['Company & legal', 'c', [['About Evolish'], ['Blog & Knowledge Hub'], ['Frequently Asked Questions'], ['Contact Support'], ['Privacy Policy']]],
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>AI-powered spoken English practice, LSRW skills training, and CEFR language assessment platform for learners and institutions.</p>
          <span className="cert"><Sparkles size={14} /> CEFR A1–C2 aligned</span>
        </div>
        {COLS.map(([h, tone, links]) => (
          <div key={h} className="footer-col">
            <h5><i className={tone} />{h}</h5>
            {links.map(([l, sub]) => (
              <a href="#" key={l}>{l}{sub && <span className={`sub ${tone}`}>{sub}</span>}</a>
            ))}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Evolish English Learning. All rights reserved.</span>
        <span>Made for every ambition.</span>
      </div>
    </footer>
  )
}
