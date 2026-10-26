'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import './peel-reveal.css'

export interface PeelRevealProps {
  /** Decorative cover artwork. Keep links and other controls in children instead. */
  front: ReactNode
  /** Content uncovered by the paper. It becomes interactive once the peel opens. */
  children: ReactNode
  label?: string
  defaultOpen?: boolean
  className?: string
  onOpenChange?: (open: boolean) => void
}

type Point = { x: number; y: number }
type Drag = { pointerId: number; x: number; y: number; startProgress: number; moved: boolean }

function clipPaper(points: Point[], crease: number, front: boolean): Point[] {
  const clipped: Point[] = []
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]
    const b = points[(index + 1) % points.length]
    const aDistance = a.x + a.y - crease
    const bDistance = b.x + b.y - crease
    const aInside = front ? aDistance <= 0 : aDistance >= 0
    const bInside = front ? bDistance <= 0 : bDistance >= 0
    if (aInside) clipped.push(a)
    if (aInside !== bInside) {
      const amount = aDistance / (aDistance - bDistance)
      clipped.push({ x: a.x + (b.x - a.x) * amount, y: a.y + (b.y - a.y) * amount })
    }
  }
  return clipped
}

function polygon(points: Point[]) {
  return points.length >= 3
    ? `polygon(${points.map(({ x, y }) => `${x.toFixed(2)}px ${y.toFixed(2)}px`).join(', ')})`
    : 'polygon(0 0, 0 0, 0 0)'
}

/** A folded paper cover with a touch-safe drag corner and a keyboard alternative. */
export function PeelReveal({
  front,
  children,
  label = 'Peel to reveal',
  defaultOpen = false,
  className = '',
  onOpenChange,
}: PeelRevealProps) {
  const instanceId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef(defaultOpen ? 1 : 0)
  const frameRef = useRef<number | null>(null)
  const dragRef = useRef<Drag | null>(null)
  const suppressClick = useRef(false)
  const reducedMotion = useRef(false)
  const animatingRef = useRef(false)
  const animationTarget = useRef<boolean | null>(null)
  const openRef = useRef(defaultOpen)
  const focusOnCommit = useRef(false)
  const callbackRef = useRef(onOpenChange)
  const [open, setOpen] = useState(defaultOpen)
  const [progress, setProgress] = useState(defaultOpen ? 1 : 0)
  const [dragging, setDragging] = useState(false)
  const [size, setSize] = useState({ width: 400, height: 360 })
  const [measured, setMeasured] = useState(false)

  useEffect(() => { callbackRef.current = onOpenChange }, [onOpenChange])

  useEffect(() => {
    if (!focusOnCommit.current) return
    focusOnCommit.current = false
    ;(open ? closeRef.current : frontRef.current)?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    function measure() {
      if (!root) return
      setSize({ width: root.clientWidth, height: root.clientHeight })
      setMeasured(true)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => {
      reducedMotion.current = media.matches
      if (media.matches && animatingRef.current && animationTarget.current !== null) {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
        frameRef.current = null
        const target = animationTarget.current
        animationTarget.current = null
        animatingRef.current = false
        updateProgress(target ? 1 : 0)
        commitOpen(target, Boolean(root?.contains(document.activeElement)))
      }
    }
    updateMotion()
    media.addEventListener('change', updateMotion)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', updateMotion)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  function updateProgress(value: number) {
    progressRef.current = Math.min(1, Math.max(0, value))
    setProgress(progressRef.current)
  }

  function commitOpen(next: boolean, moveFocus: boolean) {
    if (openRef.current === next) return
    openRef.current = next
    focusOnCommit.current = moveFocus
    setOpen(next)
    callbackRef.current?.(next)
  }

  function settle(next: boolean) {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    const from = progressRef.current
    const target = next ? 1 : 0
    const focusInside = Boolean(rootRef.current?.contains(document.activeElement))
    const duration = reducedMotion.current ? 0 : 560 * Math.max(0.35, Math.abs(target - from))
    // Closing immediately removes the uncovered controls from the tab order.
    if (!next) commitOpen(false, focusInside)
    animatingRef.current = true
    animationTarget.current = next
    const startedAt = performance.now()
    function tick(time: number) {
      const elapsed = duration === 0 ? 1 : Math.min(1, (time - startedAt) / duration)
      const eased = 1 - (1 - elapsed) ** 3
      updateProgress(from + (target - from) * eased)
      if (elapsed < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
        animatingRef.current = false
        animationTarget.current = null
        if (next) commitOpen(true, focusInside)
      }
    }
    if (duration === 0) tick(startedAt)
    else frameRef.current = requestAnimationFrame(tick)
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0 || openRef.current) return
    event.preventDefault()
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    animatingRef.current = false
    animationTarget.current = null
    suppressClick.current = false
    frontRef.current?.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startProgress: progressRef.current, moved: false }
    setDragging(true)
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const x = drag.x - event.clientX
    const y = drag.y - event.clientY
    if (Math.hypot(x, y) > 5) drag.moved = true
    updateProgress(drag.startProgress + (x + y) / Math.max(1, size.width + size.height) * 1.5)
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    // The synthetic click after a drag must not reverse its snap decision.
    suppressClick.current = drag.moved || cancelled
    if (drag.moved || cancelled) settle(!cancelled && progressRef.current >= 0.38)
  }

  const { width, height } = size
  const peek = Math.min(64, Math.max(44, Math.min(width, height) * 0.17))
  const crease = (width + height - peek) * (1 - progress) - 72 * progress
  const corners = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: height }, { x: 0, y: height }]
  // Before measurement, percentage-based clipping covers every SSR container size.
  // Keep the initial client render identical to the server-rendered markup.
  const emptyClip = 'polygon(0 0, 0 0, 0 0)'
  const frontClip = measured ? polygon(clipPaper(corners, crease, true)) : defaultOpen ? emptyClip : 'inset(0)'
  // Reflect the lifted paper across x + y = crease to produce the visible underside.
  const foldClip = measured ? polygon(clipPaper(corners, crease, false).map(({ x, y }) => ({ x: crease - y, y: crease - x }))) : emptyClip
  const style = {
    '--ac-peel-fold-stop': `${Math.max(0, crease / Math.max(1, width + height) * 100)}%`,
    '--ac-peel-handle-x': `${-progress * width * 0.65}px`,
    '--ac-peel-handle-y': `${-progress * height * 0.65}px`,
    '--ac-peel-handle-opacity': Math.max(0, 1 - progress * 4),
  } as CSSProperties

  return (
    <div
      className={`ac-peel-reveal ${className}`.trim()}
      ref={rootRef}
      data-open={open}
      data-dragging={dragging}
      style={style}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && openRef.current) {
          event.preventDefault()
          event.stopPropagation()
          settle(false)
        }
      }}
    >
      <div
        className="ac-peel-content"
        id={`${instanceId}-content`}
        role="region"
        aria-label="Revealed content"
        aria-hidden={!open}
        ref={(element) => {
          // A DOM property avoids React 18's unknown-boolean-attribute warning.
          if (element) element.inert = !open
        }}
      >
        {children}
      </div>
      <div className="ac-peel-front" aria-hidden="true" style={{ clipPath: frontClip }}>
        <div className="ac-peel-artwork" ref={(element) => { if (element) element.inert = true }}>{front}</div>
      </div>
      <div className="ac-peel-fold-shadow" aria-hidden="true" style={{ clipPath: foldClip }} />
      <div className="ac-peel-fold" aria-hidden="true" style={{ clipPath: foldClip }} />
      <button
        className="ac-peel-trigger"
        type="button"
        ref={frontRef}
        tabIndex={open ? -1 : 0}
        aria-hidden={open}
        aria-label={label}
        aria-expanded={open}
        aria-controls={`${instanceId}-content`}
        aria-describedby={`${instanceId}-instruction`}
        style={{ clipPath: frontClip }}
        onClick={() => { if (!animatingRef.current) settle(true) }}
      />
      <button
        className="ac-peel-handle"
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        hidden={open}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={(event) => endDrag(event)}
        onPointerCancel={(event) => endDrag(event, true)}
        onLostPointerCapture={(event) => endDrag(event, true)}
        onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return }
          if (!animatingRef.current) settle(true)
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 5 5 15m0 0V7m0 8h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className="ac-peel-close" type="button" ref={closeRef} hidden={!open} onClick={() => settle(false)}>
        <span aria-hidden="true">↘</span> Close peel
      </button>
      <span className="ac-peel-instruction" id={`${instanceId}-instruction`}>Pull the bottom-right corner inward, or activate the cover to reveal its contents.</span>
    </div>
  )
}
