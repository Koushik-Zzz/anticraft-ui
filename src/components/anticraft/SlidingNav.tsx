'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import './sliding-nav.css'

export interface SlidingNavItem {
  id: string
  label: string
  href: string
}

export interface SlidingNavProps {
  items: SlidingNavItem[]
  activeId?: string
  className?: string
  label?: string
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void
}

interface IndicatorBounds { left: number; top: number; width: number; height: number }

/** Ordinary navigation links with a shared indicator that follows attention. */
export function SlidingNav({
  items,
  activeId,
  className = '',
  label = 'Primary navigation',
  onNavigate,
}: SlidingNavProps) {
  const viewportRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef(new Map<string, HTMLAnchorElement>())
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [indicator, setIndicator] = useState<IndicatorBounds | null>(null)
  const targetId = previewId ?? activeId

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return
    let frame = 0
    let alive = true

    function measure() {
      frame = 0
      const link = targetId ? linksRef.current.get(targetId) : undefined
      if (!link) {
        setIndicator(null)
        return
      }
      const bounds = { left: link.offsetLeft, top: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight }
      setIndicator((previous) => (
        previous && previous.left === bounds.left && previous.top === bounds.top &&
        previous.width === bounds.width && previous.height === bounds.height ? previous : bounds
      ))
    }

    function schedule() {
      if (!alive || frame) return
      frame = requestAnimationFrame(measure)
    }

    const observer = new ResizeObserver(schedule)
    observer.observe(track)
    observer.observe(viewport)
    linksRef.current.forEach((link) => observer.observe(link))
    viewport.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.fonts?.ready.then(schedule)
    document.fonts?.addEventListener('loadingdone', schedule)
    schedule()

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      observer.disconnect()
      viewport.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.fonts?.removeEventListener('loadingdone', schedule)
    }
  }, [targetId, items])

  function moveFocus(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || items.length < 2) return
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl'
    let next = index
    if (event.key === 'ArrowRight') next += rtl ? -1 : 1
    else if (event.key === 'ArrowLeft') next += rtl ? 1 : -1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    const link = linksRef.current.get(items[(next + items.length) % items.length].id)
    link?.focus({ preventScroll: true })
    link?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }

  return (
    <nav
      aria-label={label}
      className={`ac-sliding-nav ${className}`.trim()}
      ref={viewportRef}
      onPointerLeave={() => setPreviewId(null)}
      onPointerCancel={() => setPreviewId(null)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPreviewId(null)
      }}
    >
      <div className="ac-sliding-track" ref={trackRef} data-indicator-ready={indicator ? 'true' : undefined}>
        {indicator && (
          <span
            className="ac-sliding-indicator"
            aria-hidden="true"
            style={{
              width: indicator.width,
              height: indicator.height,
              transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            }}
          />
        )}
        {items.map((item, index) => (
          <a
            key={item.id}
            className="ac-sliding-link"
            href={item.href}
            aria-current={item.id === activeId ? 'page' : undefined}
            data-highlighted={item.id === targetId ? 'true' : undefined}
            ref={(node) => {
              if (node) linksRef.current.set(item.id, node)
              else linksRef.current.delete(item.id)
            }}
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setPreviewId(item.id)
            }}
            onFocus={() => setPreviewId(item.id)}
            onKeyDown={(event) => moveFocus(event, index)}
            onClick={(event) => onNavigate?.(item.id, event)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
