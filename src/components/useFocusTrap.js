import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Keeps keyboard focus inside an open dialog and hands it back to whatever
 * opened the dialog when it closes. The container needs tabIndex={-1}.
 */
export default function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return
    const opener = document.activeElement
    const items = () => (ref.current ? [...ref.current.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length) : [])
    const raf = requestAnimationFrame(() => {
      const node = ref.current
      if (node && !node.contains(document.activeElement)) node.focus({ preventScroll: true })
    })
    const onKey = (e) => {
      if (e.key !== 'Tab' || !ref.current) return
      const list = items()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      const cur = document.activeElement
      if (!ref.current.contains(cur) || cur === ref.current) { e.preventDefault(); (e.shiftKey ? last : first).focus() }
      else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      if (opener && opener.isConnected) opener.focus?.({ preventScroll: true })
    }
  }, [ref, active])
}
