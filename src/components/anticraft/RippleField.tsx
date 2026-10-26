'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './ripple-field.css'

export interface RippleFieldProps {
  children?: ReactNode
  label?: string
  color?: string
  /** The number of rings kept in the pool, clamped from 1 to 24. */
  maxRipples?: number
  className?: string
}

interface Ripple { id: number; x: number; y: number; angle: number; expires: number }
interface Point { x: number; y: number; time: number }

const controls = 'a, button, input, select, textarea, summary, [role="button"], [role="slider"], [contenteditable]:not([contenteditable="false"])'
const manualPositions = [[0.5, 0.5], [0.33, 0.42], [0.7, 0.61], [0.6, 0.3], [0.3, 0.68]]

function isControl(target: EventTarget | null) {
  return target instanceof Element && !!target.closest(controls)
}

/** A still surface that responds with finite, overlapping rings. */
export function RippleField({ children, label = 'Ripple field', color = '#a7c6dd', maxRipples = 12, className = '' }: RippleFieldProps) {
  const instructionsId = useId()
  const field = useRef<HTMLDivElement>(null)
  const sequence = useRef(0)
  const manualSequence = useRef(0)
  const frame = useRef<number | null>(null)
  const pending = useRef<Point | null>(null)
  const previous = useRef<Point | null>(null)
  const tapStart = useRef<(Point & { pointerId: number }) | null>(null)
  const finePointer = useRef(false)
  const reducedMotion = useRef(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [status, setStatus] = useState('')
  const safeMax = Number.isFinite(maxRipples) ? Math.max(1, Math.min(24, Math.round(maxRipples))) : 12

  function resetPointer() {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    previous.current = null
  }

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    function updatePreferences() {
      reducedMotion.current = motionQuery.matches
      finePointer.current = pointerQuery.matches && !motionQuery.matches
      resetPointer()
      setRipples([])
    }
    function visibilityChanged() {
      if (document.hidden) resetPointer()
    }
    updatePreferences()
    motionQuery.addEventListener('change', updatePreferences)
    pointerQuery.addEventListener('change', updatePreferences)
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      resetPointer()
      motionQuery.removeEventListener('change', updatePreferences)
      pointerQuery.removeEventListener('change', updatePreferences)
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  useEffect(() => {
    setRipples((current) => current.length > safeMax ? current.slice(-safeMax) : current)
  }, [safeMax])

  useEffect(() => {
    if (!ripples.length) return
    const nextExpiry = Math.min(...ripples.map((ripple) => ripple.expires))
    const timer = window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.expires > performance.now()))
    }, Math.max(16, nextExpiry - performance.now()))
    return () => window.clearTimeout(timer)
  }, [ripples])

  function addRipple(x: number, y: number, announce = false) {
    const id = sequence.current++
    const now = performance.now()
    const ripple = {
      id,
      x: Math.max(0, Math.min(1, x)),
      y: Math.max(0, Math.min(1, y)),
      angle: (id % 7 - 3) * 8,
      expires: now + (reducedMotion.current ? 500 : 1200),
    }
    setRipples((current) => [...current.filter((entry) => entry.expires > now), ripple].slice(-safeMax))
    if (announce) setStatus(`Ripple ${id + 1} made.`)
  }

  function addAtPoint(point: Point, announce = false) {
    const bounds = field.current?.getBoundingClientRect()
    if (!bounds || bounds.width <= 0 || bounds.height <= 0) return
    addRipple((point.x - bounds.left) / bounds.width, (point.y - bounds.top) / bounds.height, announce)
  }

  return (
    <section className={`ac-ripple-field ${className}`.trim()} aria-label={label} aria-describedby={instructionsId} style={{ '--ac-ripple-color': color } as CSSProperties}>
      <div
        ref={field}
        className="ac-ripple-surface"
        onPointerMove={(event) => {
          if (event.pointerType === 'touch' || !finePointer.current || document.hidden || isControl(event.target)) {
            resetPointer()
            return
          }
          pending.current = { x: event.clientX, y: event.clientY, time: performance.now() }
          if (frame.current !== null) return
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            const point = pending.current
            if (!point) return
            const origin = previous.current
            if (!origin || (point.time - origin.time >= 65 && Math.hypot(point.x - origin.x, point.y - origin.y) >= 24)) {
              addAtPoint(point)
              previous.current = point
            }
          })
        }}
        onPointerLeave={() => { resetPointer(); tapStart.current = null }}
        onPointerDown={(event) => {
          if (isControl(event.target) || (event.pointerType === 'mouse' && event.button !== 0)) return
          tapStart.current = { x: event.clientX, y: event.clientY, time: performance.now(), pointerId: event.pointerId }
        }}
        onPointerUp={(event) => {
          const start = tapStart.current
          tapStart.current = null
          if (!start || event.pointerId !== start.pointerId || isControl(event.target)) return
          const point = { x: event.clientX, y: event.clientY, time: performance.now() }
          if (point.time - start.time < 650 && Math.hypot(point.x - start.x, point.y - start.y) < 10) addAtPoint(point, true)
        }}
        onPointerCancel={() => { resetPointer(); tapStart.current = null }}
      >
        <div className="ac-ripple-light" aria-hidden="true" />
        <div className="ac-ripple-content">{children}</div>
        <div className="ac-ripple-rings" aria-hidden="true">
          {ripples.map((ripple) => (
            <div key={ripple.id} className="ac-ripple-drop" style={{ left: `${ripple.x * 100}%`, top: `${ripple.y * 100}%`, '--ac-ripple-angle': `${ripple.angle}deg` } as CSSProperties}>
              <span /><span /><span />
            </div>
          ))}
        </div>
      </div>
      <div className="ac-ripple-footer">
        <p id={instructionsId}>
          <span className="ac-ripple-hover-hint">A little movement makes waves.</span>
          <span className="ac-ripple-touch-hint">Tap the surface. Make a wave.</span>
          <span className="ac-ripple-still-hint">Leave a little mark.</span>
        </p>
        <button type="button" onClick={() => {
          const [x, y] = manualPositions[manualSequence.current++ % manualPositions.length]
          addRipple(x, y, true)
        }}><span aria-hidden="true">◉</span> Make a ripple</button>
      </div>
      <span className="ac-ripple-status" role="status" aria-live="polite" aria-atomic="true">{status}</span>
    </section>
  )
}
