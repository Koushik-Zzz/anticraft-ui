'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import './scroll-expand-hero.css'

export interface ScrollExpandHeroProps {
  eyebrow?: string
  title: string
  description?: string
  /** Decorative artwork only. Keep meaningful information in the text props. */
  media: ReactNode
  action?: { label: string; href: string }
  caption?: string
  className?: string
}

function nearestViewport(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement
  while (parent && parent !== document.documentElement) {
    const overflow = window.getComputedStyle(parent).overflowY
    if (/(auto|scroll|overlay)/.test(overflow) && parent.scrollHeight > parent.clientHeight + 1) return parent
    parent = parent.parentElement
  }
  return null
}

function decorativeMedia(element: HTMLDivElement | null) {
  element?.setAttribute('inert', '')
}

/** A bounded, native-scroll hero whose framed image grows into the whole scene. */
export function ScrollExpandHero({
  eyebrow,
  title,
  description,
  media,
  action,
  caption,
  className = '',
}: ScrollExpandHeroProps) {
  const headingId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const pin = pinRef.current
    const copy = copyRef.current
    if (!root || !pin || !copy) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previousHeight = 0

    function readPosition() {
      frame = 0
      if (!root || !pin || !copy) return
      const viewport = nearestViewport(root)
      const viewportTop = viewport ? viewport.getBoundingClientRect().top + viewport.clientTop : 0
      const height = viewport?.clientHeight || window.innerHeight
      if (height !== previousHeight) {
        previousHeight = height
        root.style.setProperty('--ac-scroll-expand-view', `${height}px`)
      }
      const pinStyle = window.getComputedStyle(pin)
      const gap = Number.parseFloat(pinStyle.rowGap) || 20
      const bottomPadding = Number.parseFloat(pinStyle.paddingBottom) || 17
      const startTop = copy.offsetTop + copy.offsetHeight + gap
      const startBottom = bottomPadding + (captionRef.current ? captionRef.current.offsetHeight + gap : 0)
      // Longer copy gets enough scene height to remain readable rather than clipping.
      const contentHeight = Math.ceil(startTop + startBottom + 100)
      root.style.setProperty('--ac-scroll-expand-content-height', `${contentHeight}px`)
      root.style.setProperty('--ac-scroll-expand-start-top', `${startTop}px`)
      root.style.setProperty('--ac-scroll-expand-start-bottom', `${startBottom}px`)
      const bounds = root.getBoundingClientRect()
      const travel = Math.max(1, bounds.height - height)
      const progress = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (viewportTop - bounds.top) / travel))
      root.style.setProperty('--ac-scroll-expand-progress', progress.toFixed(4))
    }

    function scheduleRead() {
      if (!frame) frame = window.requestAnimationFrame(readPosition)
    }

    // Capturing scroll events also covers nested overflow containers.
    document.addEventListener('scroll', scheduleRead, { capture: true, passive: true })
    window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', scheduleRead)
    reducedMotion.addEventListener('change', scheduleRead)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleRead)
    let ancestor: HTMLElement | null = root
    while (ancestor && ancestor !== document.documentElement) {
      resize?.observe(ancestor)
      ancestor = ancestor.parentElement
    }
    resize?.observe(pin)
    resize?.observe(copy)
    if (captionRef.current) resize?.observe(captionRef.current)
    readPosition()

    return () => {
      document.removeEventListener('scroll', scheduleRead, true)
      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
      reducedMotion.removeEventListener('change', scheduleRead)
      resize?.disconnect()
      window.cancelAnimationFrame(frame)
      root.style.removeProperty('--ac-scroll-expand-view')
      root.style.removeProperty('--ac-scroll-expand-progress')
      root.style.removeProperty('--ac-scroll-expand-content-height')
      root.style.removeProperty('--ac-scroll-expand-start-top')
      root.style.removeProperty('--ac-scroll-expand-start-bottom')
    }
  }, [title, description, eyebrow, action?.label, caption])

  return (
    <section ref={rootRef} className={`ac-scroll-expand-hero ${className}`.trim()} aria-labelledby={headingId}>
      <div ref={pinRef} className="ac-scroll-expand-pin">
        <header ref={copyRef} className="ac-scroll-expand-copy">
          {eyebrow && <p className="ac-scroll-expand-eyebrow">{eyebrow}</p>}
          <h2 id={headingId}>{title}</h2>
          {description && <p className="ac-scroll-expand-description">{description}</p>}
          {action && <a className="ac-scroll-expand-action" href={action.href}>{action.label}<span aria-hidden="true">↗</span></a>}
        </header>
        <div ref={decorativeMedia} className="ac-scroll-expand-media" aria-hidden="true">{media}</div>
        {caption && <p ref={captionRef} className="ac-scroll-expand-caption">{caption}</p>}
      </div>
    </section>
  )
}
