import { Quote, Star } from 'lucide-react'
import Reveal from './Reveal'

// Sample content for the UI — replace with real learner stories.
const ROW1 = [
  ['I finally stopped freezing in interviews. The daily speaking drills made the difference.', 'Final-year B.Tech student', 'A2 → B1', 'p'],
  ['The feedback on my pauses and filler words was surprisingly specific.', 'Customer support professional', 'B1 → B2', 'b'],
  ['We could see which sections needed help before placement season started.', 'Training & placement officer', 'Cohort of 240', 't'],
  ['Practising privately meant I wasn’t embarrassed to make mistakes.', 'Nursing graduate', 'B1 → B2', 'p'],
  ['Short lessons fit between my classes. I practise on the bus.', 'Commerce undergraduate', 'A2 → B1', 'b'],
]
const ROW2 = [
  ['The CEFR levels gave our faculty a common language for progress.', 'Head of English department', 'Pilot college', 't'],
  ['My writing feedback showed the same grammar mistake I’d made for years.', 'Job seeker', 'B1 → B2', 'p'],
  ['Group discussion practice helped me speak up in meetings.', 'Junior analyst', 'B2 → C1', 'b'],
  ['Dashboards replaced three spreadsheets we used to maintain by hand.', 'Academic coordinator', 'Cohort of 520', 't'],
  ['I like seeing my streak grow. It keeps me consistent.', 'Self-learner', 'A1 → A2', 'p'],
]

function Card({ c: [quote, role, tag, tone] }) {
  return (
    <figure className="t-card">
      <Quote size={22} className={`t-q ${tone}`} />
      <blockquote>{quote}</blockquote>
      <figcaption>
        <span className={`t-av ${tone}`}>{role[0]}</span>
        <span><strong>{role}</strong><small><span className="stars">{[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}</span>{tag}</small></span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  return (
    <section className="section testi">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Learner stories</span>
          <h2>Confidence you can hear.</h2>
          <p>From first-year students to placement officers, here's what changes when practice becomes a habit.</p>
        </Reveal>
      </div>
      <div className="marquee" aria-label="Learner testimonials">
        <div className="track">{[...ROW1, ...ROW1].map((c, i) => <Card key={i} c={c} />)}</div>
      </div>
      <div className="marquee reverse">
        <div className="track">{[...ROW2, ...ROW2].map((c, i) => <Card key={i} c={c} />)}</div>
      </div>
    </section>
  )
}
