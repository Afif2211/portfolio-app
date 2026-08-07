import { useEffect, useState, useRef } from 'react'

export default function TypewriterHeading({ segments, speed = 30, startDelay = 250, className }) {
  const totalChars = segments.reduce((sum, seg) => sum + (seg.text ? seg.text.length : 0), 0)
  const [typed, setTyped] = useState(0)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setTyped(totalChars)
      return
    }
    let cancelled = false
    let i = 0
    const startTimer = setTimeout(function tick() {
      if (cancelled) return
      i += 1
      setTyped(i)
      if (i < totalChars) {
        setTimeout(tick, speed)
      }
    }, startDelay)
    return () => {
      cancelled = true
      clearTimeout(startTimer)
    }
  }, [totalChars, speed, startDelay])

  const renderSegments = (limit) => {
    const nodes = []
    let remaining = limit
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      if (seg.break) {
        if (limit === null) nodes.push(<br key={i} />)
        else if (remaining > 0 || limit === totalChars) nodes.push(<br key={i} />)
        continue
      }
      const text = seg.text
      if (limit === null) {
        nodes.push(
          <span key={i} className={seg.gradient ? 'gradient-text' : undefined}>
            {text}
          </span>
        )
        continue
      }
      if (remaining <= 0) break
      const slice = text.slice(0, remaining)
      remaining -= slice.length
      nodes.push(
        <span key={i} className={seg.gradient ? 'gradient-text' : undefined}>
          {slice}
        </span>
      )
    }
    return nodes
  }

  return (
    <span className={`relative inline-block ${className || ''}`}>
      <span className="invisible" aria-hidden="true">
        {renderSegments(null)}
      </span>

      <span className="absolute inset-0" aria-live="polite">
        {renderSegments(typed)}
        {typed < totalChars && <span className="typewriter-cursor" aria-hidden="true" />}
      </span>
    </span>
  )
}