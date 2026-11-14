// Lightweight, fully client-side speaking analysis.
// Not a substitute for a real AI model — it uses simple, explainable rules.

const NUM = '(?:\\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few)'

// [pattern, replacement (string or fn), explanation]
export const GRAMMAR_RULES = [
  [new RegExp(`\\bsince (${NUM} (?:years?|months?|weeks?|days?|hours?))`, 'gi'), (m, p) => `for ${p}`, 'Use “for” with a length of time and “since” with a starting point (since 2023).'],
  [/\bdiscuss about\b/gi, 'discuss', '“Discuss” already means “talk about”, so drop “about”.'],
  [/\bmatch(es)? with\b/gi, (m, s) => `match${s || ''}`, 'As a verb, “match” takes a direct object — your skills match the role.'],
  [/\bexplain me\b/gi, 'explain to me', 'Say “explain to me”, not “explain me”.'],
  [/\b(return|revert) back\b/gi, (m, v) => v, '“Return/revert” already includes “back”.'],
  [/\bcope up with\b/gi, 'cope with', 'The phrase is “cope with”.'],
  [/\bi am agree\b/gi, 'I agree', '“Agree” is a verb — say “I agree”.'],
  [/\bmore (better|easier|faster|bigger|smarter)\b/gi, (m, a) => a, 'Comparatives like “better” don’t need “more”.'],
  [/\b(he|she|it) (don't|do not)\b/gi, (m, p, d) => `${p} ${d.includes(' ') ? 'does not' : "doesn't"}`, 'Use “doesn’t” with he / she / it.'],
  [/(?<!\b(?:did|does|do|will|can|could|would|should|must|might|may|let|make|made|makes|to|help|helps|see|watch|hear)\s)\b(he|she|it) (have)\b/gi, (m, p) => `${p} has`, 'Use “has” with he / she / it.'],
  [/(?<!\b(?:did|does|do|will|can|could|would|should|must|might|may|let|make|made|makes|to|help|helps|see|watch|hear)\s)\b(it|he|she) (give|make|take|want|need|go|come|help)\b(?! to\b)/gi, (m, p, v) => `${p} ${v === 'go' ? 'goes' : v + 's'}`, 'Third-person singular verbs take -s (it gives, she wants).'],
  [/\bi (is|are)\b/gi, 'I am', 'Use “I am”.'],
  [/\b(they|we|you) (is|was)\b/gi, (m, p, v) => `${p} ${v === 'is' ? 'are' : 'were'}`, 'Use “are/were” with they, we and you.'],
  [/\bdid (went|came|saw|did|ate|took|made)\b/gi, (m, v) => `did ${{ went: 'go', came: 'come', saw: 'see', did: 'do', ate: 'eat', took: 'take', made: 'make' }[v.toLowerCase()]}`, 'After “did”, use the base verb (did go).'],
  [/\bhave (went|came|ate|took|wrote|spoke|saw)\b/gi, (m, v) => `have ${{ went: 'gone', came: 'come', ate: 'eaten', took: 'taken', wrote: 'written', spoke: 'spoken', saw: 'seen' }[v.toLowerCase()]}`, 'Use the past participle after “have” (have gone).'],
  [/\bin the morning time\b/gi, 'in the morning', '“Morning” already refers to a time.'],
  [/\bpass ?out (from|of)\b/gi, 'graduate from', 'In international English, “pass out” means faint — say “graduate from”.'],
  [/\bdo the needful\b/gi, 'do what is needed', '“Do the needful” sounds dated outside India — be specific.'],
  [/\bprepone\b/gi, 'bring forward', '“Prepone” isn’t widely understood — say “bring forward”.'],
  [/\bwhat is your good name\b/gi, 'may I know your name', '“Good name” is a local idiom — keep it neutral.'],
]

const FILLERS = ['um', 'umm', 'uh', 'uhh', 'er', 'like', 'you know', 'basically', 'actually', 'literally', 'i mean', 'kind of', 'sort of']
const fillerRe = new RegExp(`\\b(${FILLERS.map((f) => f.replace(' ', '\\s')).join('|')})\\b`, 'gi')

/** Split text into segments: plain strings, {fix: [orig, corrected]} and {filler: word}. */
function segment(text) {
  const hits = []
  GRAMMAR_RULES.forEach(([re, rep, why]) => {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text))) {
      const fixed = typeof rep === 'function' ? rep(...m) : rep
      hits.push({ start: m.index, end: m.index + m[0].length, orig: m[0], fixed, why })
    }
  })
  fillerRe.lastIndex = 0
  let m
  while ((m = fillerRe.exec(text))) hits.push({ start: m.index, end: m.index + m[0].length, filler: m[0] })

  hits.sort((a, b) => a.start - b.start || b.end - a.end)
  const out = []
  let pos = 0
  const used = []
  for (const h of hits) {
    if (h.start < pos) continue // skip overlaps
    if (h.start > pos) out.push(text.slice(pos, h.start))
    out.push(h.filler ? { filler: h.filler } : { fix: [h.orig, h.fixed], why: h.why })
    used.push(h)
    pos = h.end
  }
  if (pos < text.length) out.push(text.slice(pos))
  return { segments: out, hits: used }
}

const clamp = (v, a = 35, b = 98) => Math.round(Math.max(a, Math.min(b, v)))

export function analyse(text, seconds, confidence = 0.85) {
  const clean = text.trim()
  const words = clean.split(/\s+/).filter(Boolean)
  const n = words.length
  const { segments, hits } = segment(clean)
  const grammar = hits.filter((h) => !h.filler)
  const fillers = hits.filter((h) => h.filler)

  const wpm = seconds > 0 ? Math.round((n / seconds) * 60) : 0
  const unique = new Set(words.map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))).size
  const ttr = n ? unique / n : 0
  const longWords = words.filter((w) => w.replace(/[^a-z]/gi, '').length >= 7).length / Math.max(1, n)

  // Fluency: best between 110 and 160 wpm, penalised for fillers
  const paceScore = wpm === 0 ? 50 : 100 - Math.min(45, Math.abs(wpm - 135) * 0.6)
  const fluency = clamp(paceScore - fillers.length * 6 - (n < 12 ? 12 : 0))
  const grammarScore = clamp(95 - (grammar.length / Math.max(1, n / 20)) * 20)
  const vocabulary = clamp(40 + ttr * 35 + longWords * 45)
  const clarity = clamp(confidence * 100 + 4)

  // Rough CEFR estimate from the overall score
  const overall = (fluency + grammarScore + vocabulary + clarity) / 4
  const level = overall >= 92 ? 'C1' : overall >= 86 ? 'B2' : overall >= 78 ? 'B1+' : overall >= 70 ? 'B1' : overall >= 58 ? 'A2' : 'A1'

  let tip
  if (n < 12) tip = 'Try speaking for at least 20–30 seconds so there’s enough to assess — add an example or a reason.'
  else if (grammar.length) tip = grammar[0].why
  else if (fillers.length >= 2) tip = `You used ${fillers.length} filler words. Replace them with a short, confident pause.`
  else if (wpm > 170) tip = `You spoke at ${wpm} words per minute — slow down slightly and pause between ideas.`
  else if (wpm && wpm < 100) tip = `You spoke at ${wpm} words per minute — aim for 120–150 to sound more fluent.`
  else if (ttr < 0.55) tip = 'Good control. Try varying your vocabulary — avoid repeating the same words.'
  else tip = 'Excellent! Clear structure and natural pace. Next, try adding a short example to support your point.'

  return {
    segments,
    scores: { Clarity: clarity, Fluency: fluency, Grammar: grammarScore, Vocabulary: vocabulary },
    level,
    tip,
    stats: { words: n, wpm, fillers: fillers.length, fixes: grammar.length, seconds: Math.round(seconds) },
  }
}

export const SpeechRecognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined
