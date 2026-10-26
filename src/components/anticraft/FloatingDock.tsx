'use client'

import { useEffect, useRef } from 'react'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import './floating-dock.css'

export interface FloatingDockItem {
  id: string
  label: string
  href: string
  icon: ReactNode
}

export interface FloatingDockProps {
  items: FloatingDockItem[]
  activeId?: string
  className?: string
  label?: string
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void
}

/** A magnifying navigation dock. Icons are decorative; every link keeps its own label. */
export function FloatingDock({
  items,
  activeId,
  className = '',
  label = 'Primary navigation',
  onNavigate,
}: FloatingDockProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef(new Map<string, HTMLAnchorElement>())
  const frameRef = useRef(0)
  const pointerRef = useRef<number | null>(null)

  function reset() {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    pointerRef.current = null
    linksRef.current.forEach((link) => {
      link.style.removeProperty('--ac-dock-proximity')
      link.style.removeProperty('--ac-dock-shift')
    })
  }

  function magnify(clientX: number) {
    if (
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    pointerRef.current = clientX
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      const track = trackRef.current
      const pointer = pointerRef.current
      if (!track || pointer === null) return
      const left = track.getBoundingClientRect().left

      linksRef.current.forEach((link) => {
        // Measure the fixed hit target, not the transformed artwork inside it.
        const distance = left + link.offsetLeft + link.offsetWidth / 2 - pointer
        const proximity = (Math.cos(Math.min(Math.abs(distance) / 120, 1) * Math.PI) + 1) / 2
        link.style.setProperty('--ac-dock-proximity', proximity.toFixed(3))
        link.style.setProperty('--ac-dock-shift', `${(Math.sign(distance) * proximity * 10).toFixed(2)}px`)
      })
    })
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new ResizeObserver(reset)
    observer.observe(track)
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    motion.addEventListener('change', reset)
    pointer.addEventListener('change', reset)
    return () => {
      observer.disconnect()
      motion.removeEventListener('change', reset)
      pointer.removeEventListener('change', reset)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

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
      className={`ac-dock ${className}`.trim()}
      onPointerMove={(event) => {
        if (event.pointerType === 'mouse') magnify(event.clientX)
      }}
      onPointerLeave={reset}
      onPointerCancel={reset}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) reset()
      }}
    >
      <div className="ac-dock-viewport" onScroll={reset}>
        <div className="ac-dock-track" ref={trackRef}>
          {items.map((item, index) => (
            <a
              key={item.id}
              ref={(node) => {
                if (node) linksRef.current.set(item.id, node)
                else linksRef.current.delete(item.id)
              }}
              className="ac-dock-link"
              href={item.href}
              aria-label={item.label}
              aria-current={item.id === activeId ? 'page' : undefined}
              onFocus={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect()
                magnify(bounds.left + bounds.width / 2)
              }}
              onKeyDown={(event) => moveFocus(event, index)}
              onClick={(event) => onNavigate?.(item.id, event)}
            >
              <span className="ac-dock-artwork" aria-hidden="true">{item.icon}</span>
              <span className="ac-dock-label" aria-hidden="true">{item.label}</span>
              <span className="ac-dock-dot" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
