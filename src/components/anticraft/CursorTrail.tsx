'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './cursor-trail.css'

export interface CursorTrailItem {
  id: string
  /** Decorative artwork. Links and controls inside the artwork are inert. */
  content: ReactNode
  label: string
}

export interface CursorTrailProps {
  items: CursorTrailItem[]
  /** Backdrop content remains interactive beneath the decorative trail. */
  children?: ReactNode
  className?: string
  /** Distance in pixels between pointer stamps, clamped to 16–240. */
  spacing?: number
  /** Stamp lifetime in milliseconds, clamped to 400–10000. */
  lifetime?: number
  /** Maximum number of prints, clamped to 1–24. */
  maxVisible?: number
}

interface Print {
  key: number
  item: CursorTrailItem
  x: number
  y: number
  rotation: number
  scale: number
  offsetX: number
  offsetY: number
  duration: number
  expires: number | null
}

interface Point { x: number; y: number; time: number }

const controls = 'a, button, input, select, textarea, summary, audio[controls], video[controls], [role="button"], [role="link"], [role="slider"], [role="switch"], [role="tab"], [contenteditable]:not([contenteditable="false"])'
const positions = [[0.26, 0.36], [0.67, 0.55], [0.46, 0.28], [0.34, 0.65], [0.76, 0.32], [0.55, 0.69]]

function bounded(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback
}

function isControl(target: EventTarget | null) {
  return target instanceof Element && !!target.closest(controls)
}

/** Leaves a sequenced trail of small art prints without intercepting backdrop controls. */
export function CursorTrail({
  items,
  children,
  className = '',
  spacing = 60,
  lifetime = 1400,
  maxVisible = 8,
}: CursorTrailProps) {
  const id = useId()
  const field = useRef<HTMLDivElement>(null)
  const sequence = useRef(0)
  const manualSequence = useRef(0)
  const lastStamp = useRef<Point | null>(null)
  const previousPoint = useRef<Point | null>(null)
  const pendingPoint = useRef<Point | null>(null)
  const tapStart = useRef<(Point & { pointerId: number }) | null>(null)
  const frame = useRef<number | null>(null)
  const pointerEnabled = useRef(false)
  const reducedMotion = useRef(false)
  const visible = useRef(true)
  const [prints, setPrints] = useState<Print[]>([])
  const [status, setStatus] = useState('')
  const safeSpacing = bounded(spacing, 60, 16, 240)
  const safeLifetime = bounded(lifetime, 1400, 400, 10000)
  const safeMax = Math.round(bounded(maxVisible, 8, 1, 24))

  function resetPointer() {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pendingPoint.current = null
    previousPoint.current = null
    lastStamp.current = null
  }

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    function updatePreferences() {
      reducedMotion.current = motionQuery.matches
      pointerEnabled.current = pointerQuery.matches && !motionQuery.matches
      resetPointer()
      if (motionQuery.matches) setPrints((current) => current.map((print) => ({ ...print, expires: null })))
    }
    function visibilityChanged() {
      if (document.hidden) resetPointer()
    }
    updatePreferences()
    motionQuery.addEventListener('change', updatePreferences)
    pointerQuery.addEventListener('change', updatePreferences)
    document.addEventListener('visibilitychange', visibilityChanged)
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting
      if (!entry.isIntersecting) resetPointer()
    })
    if (field.current) observer?.observe(field.current)
    return () => {
      resetPointer()
      observer?.disconnect()
      motionQuery.removeEventListener('change', updatePreferences)
      pointerQuery.removeEventListener('change', updatePreferences)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  useEffect(() => {
    setPrints((current) => current.length > safeMax ? current.slice(-safeMax) : current)
  }, [safeMax])

  useEffect(() => {
    const nextExpiry = prints.reduce((nearest, print) => print.expires === null ? nearest : Math.min(nearest, print.expires), Infinity)
    if (!Number.isFinite(nextExpiry)) return
    const timer = window.setTimeout(() => {
      const now = performance.now()
      setPrints((current) => current.filter((print) => print.expires === null || print.expires > now))
    }, Math.max(16, nextExpiry - performance.now()))
    return () => window.clearTimeout(timer)
  }, [prints])

  function stamp(x: number, y: number, dx = 0, dy = 0, manual = false) {
    if (!items.length) return
    const index = sequence.current++
    const item = items[index % items.length]
    const speed = Math.hypot(dx, dy)
    const direction = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * 180 / Math.PI
    const rotation = Math.max(-28, Math.min(28, direction * 0.075 + ((index % 5) - 2) * 5))
    const print: Print = {
      key: index,
      item,
      x: Math.max(0.08, Math.min(0.92, x)),
      y: Math.max(0.12, Math.min(0.88, y)),
      rotation,
      scale: 1 + Math.min(0.07, speed / 700),
      offsetX: Math.max(-38, Math.min(38, -dx * 0.8)),
      offsetY: Math.max(-30, Math.min(30, -dy * 0.8 - Math.min(12, speed * 0.12))),
      duration: safeLifetime,
      expires: reducedMotion.current ? null : performance.now() + safeLifetime,
    }
    setPrints((current) => [...current.filter((entry) => entry.expires === null || entry.expires > performance.now()), print].slice(-safeMax))
    if (manual) setStatus(`Print ${index + 1}: ${item.label}. ${reducedMotion.current ? 'Use Clear trail to remove the artwork.' : ''}`)
  }

  function stampAtPoint(point: Point, previous: Point | null, manual = false) {
    const bounds = field.current?.getBoundingClientRect()
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) return
    const elapsed = previous ? Math.max(16, point.time - previous.time) : 16
    const dx = previous ? (point.x - previous.x) * 16 / elapsed : 0
    const dy = previous ? (point.y - previous.y) * 16 / elapsed : 0
    stamp((point.x - bounds.left) / bounds.width, (point.y - bounds.top) / bounds.height, dx, dy, manual)
  }

  return (
    <section className={`ac-cursor-trail ${className}`.trim()} aria-label="Artwork cursor trail" aria-describedby={`${id}-instructions`}>
      <div
        ref={field}
        className="ac-trail-field"
        onPointerMove={(event) => {
          if (event.pointerType === 'touch' || !pointerEnabled.current || !visible.current || document.hidden || isControl(event.target)) {
            resetPointer()
            return
          }
          pendingPoint.current = { x: event.clientX, y: event.clientY, time: performance.now() }
          if (frame.current !== null) return
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            const point = pendingPoint.current
            if (!point) return
            const origin = lastStamp.current
            if (!origin) lastStamp.current = point
            else if (Math.hypot(point.x - origin.x, point.y - origin.y) >= safeSpacing) {
              stampAtPoint(point, previousPoint.current)
              lastStamp.current = point
            }
            previousPoint.current = point
          })
        }}
        onPointerLeave={resetPointer}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' || isControl(event.target)) return
          tapStart.current = { x: event.clientX, y: event.clientY, time: performance.now(), pointerId: event.pointerId }
        }}
        onPointerUp={(event) => {
          const start = tapStart.current
          tapStart.current = null
          if (!start || event.pointerId !== start.pointerId || isControl(event.target)) return
          const point = { x: event.clientX, y: event.clientY, time: performance.now() }
          if (point.time - start.time < 650 && Math.hypot(point.x - start.x, point.y - start.y) < 10) stampAtPoint(point, null, true)
        }}
        onPointerCancel={() => { tapStart.current = null; resetPointer() }}
      >
        <div className="ac-trail-backdrop">{children}</div>
        <div className="ac-trail-prints" aria-hidden="true" ref={(element) => { element?.setAttribute('inert', '') }}>
          {prints.map((print) => (
            <div
              className="ac-trail-stamp"
              key={print.key}
              data-persistent={print.expires === null ? '' : undefined}
              style={{
                left: `${print.x * 100}%`, top: `${print.y * 100}%`,
                '--ac-trail-rotation': `${print.rotation}deg`,
                '--ac-trail-scale': print.scale,
                '--ac-trail-offset-x': `${print.offsetX}px`,
                '--ac-trail-offset-y': `${print.offsetY}px`,
                '--ac-trail-lifetime': `${print.duration}ms`,
              } as CSSProperties}
            >
              <div className="ac-trail-artwork">{print.item.content}</div>
              <span className="ac-trail-print-number">{String(print.key + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ac-trail-footer">
        <p id={`${id}-instructions`} className="ac-trail-instructions">
          <span className="ac-trail-hover-instruction">Move to leave a little art.</span>
          <span className="ac-trail-touch-instruction">Tap to leave a little art.</span>
          <span className="ac-trail-motion-instruction">Stamp a little art, at your pace.</span>
        </p>
        <div className="ac-trail-controls">
          <button type="button" disabled={!items.length} onClick={() => {
            const [x, y] = positions[manualSequence.current++ % positions.length]
            stamp(x, y, 0, 0, true)
          }}><span aria-hidden="true">↗</span> Stamp artwork</button>
          <button type="button" disabled={!prints.length} onClick={() => {
            resetPointer()
            setPrints([])
            setStatus('Trail cleared.')
          }}>Clear trail</button>
        </div>
      </div>
      <span className="ac-trail-status" role="status" aria-live="polite" aria-atomic="true">{status}</span>
    </section>
  )
}
