'use client'

import { useEffect, useId, useRef } from 'react'
import './editorial-hero.css'

export interface EditorialHeroProps {
  eyebrow?: string
  title: string
  description?: string
  image: { src: string; alt: string }
  action?: { label: string; href: string }
  meta?: string
  className?: string
}

function nearestViewport(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement
  while (parent && parent !== document.documentElement) {
    if (/(auto|scroll|overlay)/.test(window.getComputedStyle(parent).overflowY) && parent.scrollHeight > parent.clientHeight + 1) return parent
    parent = parent.parentElement
  }
  return null
}

/** Oversized editorial typography with an image that moves at most 24px. */
export function EditorialHero({ eyebrow, title, description, image, action, meta, className = '' }: EditorialHeroProps) {
  const headingId = useId()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function readPosition() {
      frame = 0
      if (!root) return
      const viewport = nearestViewport(root)
      const viewportTop = viewport ? viewport.getBoundingClientRect().top + viewport.clientTop : 0
      const height = viewport?.clientHeight || window.innerHeight
      const bounds = root.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (viewportTop + height - bounds.top) / Math.max(1, height + bounds.height)))
      const shift = reducedMotion.matches || bounds.width < 600 ? 0 : (progress - .5) * 48
      root.style.setProperty('--ac-editorial-shift', `${shift.toFixed(2)}px`)
    }

    function scheduleRead() {
      if (!frame) frame = window.requestAnimationFrame(readPosition)
    }

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
    readPosition()

    return () => {
      document.removeEventListener('scroll', scheduleRead, true)
      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
      reducedMotion.removeEventListener('change', scheduleRead)
      resize?.disconnect()
      window.cancelAnimationFrame(frame)
      root.style.removeProperty('--ac-editorial-shift')
    }
  }, [])

  return (
    <section ref={rootRef} className={`ac-editorial-hero ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-editorial-topline">
        {eyebrow && <p>{eyebrow}</p>}
        {meta && <span>{meta}</span>}
      </header>
      <h2 id={headingId} className="ac-editorial-title">{title}</h2>
      <div className="ac-editorial-body">
        <div className="ac-editorial-copy">
          <span className="ac-editorial-marker" aria-hidden="true">↘</span>
          {description && <p>{description}</p>}
          {action && <a href={action.href}>{action.label}<span aria-hidden="true">↗</span></a>}
        </div>
        <figure className="ac-editorial-image">
          <img src={image.src} alt={image.alt} decoding="async" />
        </figure>
      </div>
    </section>
  )
}
