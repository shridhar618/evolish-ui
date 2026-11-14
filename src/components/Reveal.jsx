import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/**
 * Scroll-triggered entrance.
 *  - default: fade + rise
 *  - clip:    the block "opens" from a slightly cropped, scaled frame (for big panels)
 */
export default function Reveal({ children, delay = 0, y = 32, clip = false, className, as = 'div', ...rest }) {
  const Tag = motion[as]
  const hidden = clip
    ? { opacity: 0, clipPath: 'inset(8% 4% 8% 4% round 32px)', scale: 0.97 }
    : { opacity: 0, y }
  const shown = clip
    ? { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1 }
    : { opacity: 1, y: 0 }
  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: clip ? 1.1 : 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Heading whose words slide up from behind a mask, one after another.
 * parts: array of strings or [text, 'accent'] tuples, e.g.
 *   ['One platform. ', ['Two very different', 'accent'], ' reasons to begin.']
 */
export function SplitHeading({ parts, as = 'h2', className = '', delay = 0, ...rest }) {
  const Tag = motion[as]
  const words = []
  parts.forEach((p) => {
    const [text, cls] = Array.isArray(p) ? p : [p, '']
    text.split(/(\s+)/).forEach((t) => {
      if (!t) return
      if (/^\s+$/.test(t)) words.push(t.includes('\n') ? { br: true } : { space: true })
      // allow long hyphenated words to wrap after the hyphen on small screens
      else t.split(/(?<=-)/).forEach((part) => words.push({ t: part, cls }))
    })
  })
  let i = 0
  return (
    <Tag className={`split-h ${className}`} initial="h" whileInView="s" viewport={{ once: true, margin: '-60px' }} {...rest}>
      <span className="sr-only">{parts.map((p) => (Array.isArray(p) ? p[0] : p)).join('')}</span>
      <span aria-hidden="true">
        {words.map((w, k) => {
          if (w.space) return ' '
          if (w.br) return <br key={k} />
          const idx = i++
          return (
            <span className="w" key={k}>
              <motion.span
                className={w.cls}
                variants={{ h: { y: '110%', rotate: 4 }, s: { y: '0%', rotate: 0 } }}
                transition={{ duration: 0.9, delay: delay + idx * 0.06, ease }}
              >
                {w.t}
              </motion.span>
            </span>
          )
        })}
      </span>
    </Tag>
  )
}
