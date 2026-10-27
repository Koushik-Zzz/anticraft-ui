'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import './reveal-footer.css'

export interface RevealFooterLink {
  label: string
  href: string
}

export interface RevealFooterProps {
  /** Opaque page content that scrolls away to uncover the footer. */
  children?: ReactNode
  title: string
  brand: string
  contact: RevealFooterLink
  availability?: string
  links?: RevealFooterLink[]
  note?: string
  legal?: string
  reveal?: boolean
  className?: string
}

function findScrollViewport(element: HTMLElement) {
  let parent = element.parentElement
  while (parent && parent !== document.body) {
    if (/(auto|scroll|overlay)/.test(window.getComputedStyle(parent).overflowY)) return parent
    parent = parent.parentElement
  }
  return null
}

/** A native-scroll footer, confined to its own content and nearest scroll viewport. */
export function RevealFooter({ children, title, brand, contact, availability, links = [], note, legal, reveal = true, className = '' }: RevealFooterProps) {
  const root = useRef<HTMLDivElement>(null)
  const footer = useRef<HTMLElement>(null)
  const titleId = useId()
  const [canReveal, setCanReveal] = useState(false)

  useEffect(() => {
    const element = root.current
    const foot = footer.current
    if (!element || !foot || !reveal || !children) {
      setCanReveal(false)
      return
    }
    const viewport = findScrollViewport(element)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    function measure() {
      frame = 0
      const availableHeight = viewport?.clientHeight ?? window.innerHeight
      // A footer taller than its scrollport must remain in normal flow.
      const fits = element!.clientWidth > 600 && foot!.getBoundingClientRect().height + 24 < availableHeight
      setCanReveal(fits && !reducedMotion.matches)
    }
    function scheduleMeasure() {
      if (!frame) frame = window.requestAnimationFrame(measure)
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure)
    observer?.observe(foot)
    observer?.observe(element)
    if (viewport) observer?.observe(viewport)
    window.addEventListener('resize', scheduleMeasure)
    reducedMotion.addEventListener('change', scheduleMeasure)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      reducedMotion.removeEventListener('change', scheduleMeasure)
      window.cancelAnimationFrame(frame)
    }
  }, [reveal, children])

  return <div ref={root} className={`ac-reveal-footer ${className}`.trim()} data-reveal={canReveal ? 'true' : 'false'}>
    {children && <div className="ac-reveal-footer-content">{children}</div>}
    <footer
      ref={footer}
      className="ac-reveal-footer-panel"
      aria-labelledby={titleId}
      onFocusCapture={(event) => {
        // :focus-within removes the overlap before bringing a keyboard target into view.
        if (event.target instanceof HTMLElement) event.target.scrollIntoView({ block: 'nearest', behavior: 'instant' })
      }}
    >
      <div className="ac-reveal-footer-topline"><span>THE NEXT CHAPTER</span>{availability && <span className="ac-reveal-footer-availability"><i aria-hidden="true" />{availability}</span>}</div>
      <div className="ac-reveal-footer-invitation">
        <h2 id={titleId}>{title}</h2>
        <a className="ac-reveal-footer-contact" href={contact.href}><span>{contact.label}</span><span aria-hidden="true">↗</span></a>
      </div>
      <div className="ac-reveal-footer-details">{note && <p>{note}</p>}{links.length > 0 && <ul aria-label="More ways to connect">{links.map((link, index) => <li key={`${link.href}-${index}`}><a href={link.href}>{link.label}<span aria-hidden="true">↗</span></a></li>)}</ul>}</div>
      <div className="ac-reveal-footer-wordmark"><span className="ac-reveal-footer-brand">{brand}</span><span className="ac-reveal-footer-registered" aria-hidden="true">®</span></div>
      {legal && <p className="ac-reveal-footer-legal">{legal}</p>}
    </footer>
  </div>
}
