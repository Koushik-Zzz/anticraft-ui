'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import './throw-stack.css'

export interface ThrowStackItem {
  /** A stable, unique identifier. */
  id: string
  title: string
  subtitle?: string
  /** Decorative artwork only. Links and controls belong outside the poster. */
  content: ReactNode
  color?: string
  href?: string
}

export interface ThrowStackProps {
  items: ThrowStackItem[]
  defaultValue?: string
  className?: string
  /** Called when a throw or navigation action selects a different item. */
  onValueChange?: (id: string) => void
}

interface DragSession {
  pointerId: number
  startX: number
  startY: number
  lastX: number
  lastTime: number
  velocity: number
  x: number
  y: number
  horizontal: boolean
}

function wrap(index: number, count: number) {
  return count ? ((index % count) + count) % count : 0
}

/** A cyclic deck of posters that can be picked up and thrown aside. */
export function ThrowStack({ items, defaultValue, className = '', onValueChange }: ThrowStackProps) {
  const initialIndex = Math.max(0, items.findIndex((item) => item.id === defaultValue))
  const [selectedId, setSelectedId] = useState(items[initialIndex]?.id)
  const [phase, setPhase] = useState<'idle' | 'dragging' | 'settling' | 'flying'>('idle')
  const stageRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef(items[initialIndex]?.id)
  const phaseRef = useRef(phase)
  const dragRef = useRef<DragSession | null>(null)
  const frameRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const callbackRef = useRef(onValueChange)
  const instructionsId = useId()
  const itemSignature = JSON.stringify(items.map((item) => item.id))
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId))
  const activeItem = items[selectedIndex]

  useEffect(() => { callbackRef.current = onValueChange }, [onValueChange])

  function cancelScheduled() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    if (timerRef.current !== null) clearTimeout(timerRef.current)
    frameRef.current = null
    timerRef.current = null
  }

  function setPhaseTo(nextPhase: typeof phase) {
    phaseRef.current = nextPhase
    setPhase(nextPhase)
  }

  function placeCard(x = 0, y = 0, rotation = 0) {
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--ac-throw-x', `${x}px`)
    stage.style.setProperty('--ac-throw-y', `${y}px`)
    stage.style.setProperty('--ac-throw-turn', `${rotation}deg`)
    stage.style.setProperty('--ac-throw-tilt', `${Math.max(-14, Math.min(14, x / 14))}deg`)
  }

  function releaseDrag() {
    const session = dragRef.current
    dragRef.current = null
    const stage = stageRef.current
    if (session && stage?.hasPointerCapture(session.pointerId)) {
      stage.releasePointerCapture(session.pointerId)
    }
    return session
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  function snapBack() {
    releaseDrag()
    cancelScheduled()
    setPhaseTo('settling')
    placeCard()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setPhaseTo('idle')
    }, reducedMotion() ? 0 : 320)
  }

  function selectItem(id: string) {
    selectedRef.current = id
    setSelectedId(id)
    placeCard()
    setPhaseTo('idle')
    callbackRef.current?.(id)
  }

  function throwTo(targetIndex: number, direction: -1 | 1) {
    if (items.length < 2 || phaseRef.current === 'flying') return
    const nextItem = items[wrap(targetIndex, items.length)]
    releaseDrag()
    cancelScheduled()
    if (nextItem.id === selectedRef.current) {
      snapBack()
      return
    }
    if (reducedMotion()) {
      selectItem(nextItem.id)
      return
    }
    setPhaseTo('flying')
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null
      const distance = (stageRef.current?.getBoundingClientRect().width ?? 400) + 180
      placeCard(distance * direction, -34, 32 * direction)
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        selectItem(nextItem.id)
      }, 280)
    })
  }

  // Reordered or replaced collections keep the selected identifier when possible.
  useEffect(() => {
    cancelScheduled()
    releaseDrag()
    const index = Math.max(0, items.findIndex((item) => item.id === selectedRef.current))
    selectedRef.current = items[index]?.id
    setSelectedId(items[index]?.id)
    setPhaseTo('idle')
    placeCard()
    // Collection content may change without resetting an in-progress interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSignature])

  useEffect(() => () => {
    cancelScheduled()
    releaseDrag()
  }, [])

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || items.length < 2 || phaseRef.current === 'flying') return
    cancelScheduled()
    releaseDrag()
    placeCard()
    setPhaseTo('idle')
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      x: 0,
      y: 0,
      horizontal: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus({ preventScroll: true })
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const session = dragRef.current
    if (!session || event.pointerId !== session.pointerId) return
    const x = event.clientX - session.startX
    const y = event.clientY - session.startY
    if (!session.horizontal) {
      // Vertical swipes remain native document scrolling gestures.
      if (Math.abs(y) > 8 && Math.abs(y) > Math.abs(x)) {
        snapBack()
        return
      }
      if (Math.abs(x) < 6) return
      session.horizontal = true
      setPhaseTo('dragging')
    }
    event.preventDefault()
    const elapsed = Math.max(1, event.timeStamp - session.lastTime)
    session.velocity = (event.clientX - session.lastX) / elapsed
    session.lastX = event.clientX
    session.lastTime = event.timeStamp
    session.x = x
    session.y = Math.max(-26, Math.min(26, y * 0.25))
    if (!reducedMotion() && frameRef.current === null) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        if (dragRef.current === session) placeCard(session.x, session.y, Math.max(-24, Math.min(24, session.x / 13)))
      })
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const session = dragRef.current
    if (!session || session.pointerId !== event.pointerId) return
    const width = event.currentTarget.getBoundingClientRect().width
    const velocity = event.timeStamp - session.lastTime > 100 ? 0 : session.velocity
    const farEnough = Math.abs(session.x) > Math.max(42, Math.min(90, width * 0.19))
    const fastEnough = Math.abs(velocity) > 0.5 && Math.abs(session.x) > 14
    if (session.horizontal && (farEnough || fastEnough)) {
      const direction = (farEnough ? session.x : velocity) < 0 ? -1 : 1
      throwTo(selectedIndex + (direction < 0 ? 1 : -1), direction)
    } else snapBack()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || items.length < 2) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      const next = event.key === 'ArrowRight'
      throwTo(selectedIndex + (next ? 1 : -1), next ? -1 : 1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      throwTo(event.key === 'Home' ? 0 : items.length - 1, event.key === 'Home' ? 1 : -1)
    }
  }

  return (
    <section className={`ac-throw-stack ${className}`.trim()} aria-label="Throw stack" aria-roledescription="carousel" data-phase={phase}>
      <div className="ac-throw-header" aria-hidden="true">
        <span>A small collection</span>
        <span>{String(activeItem ? selectedIndex + 1 : 0).padStart(2, '0')} <span className="ac-throw-divider">/</span> {String(items.length).padStart(2, '0')}</span>
      </div>
      <p className="ac-throw-sr-only" id={instructionsId}>Drag a poster left to advance or right to go back, then release to throw. Use the left and right arrow keys, Home, or End. The collection repeats.</p>
      <div
        ref={stageRef}
        className="ac-throw-stage"
        role="group"
        aria-label="Throw a poster"
        aria-describedby={instructionsId}
        tabIndex={items.length > 1 ? 0 : -1}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={(event) => { if (event.pointerId === dragRef.current?.pointerId) snapBack() }}
        onLostPointerCapture={(event) => { if (event.pointerId === dragRef.current?.pointerId) snapBack() }}
      >
        <div className="ac-throw-guide ac-throw-guide-left" aria-hidden="true">←</div>
        <div className="ac-throw-guide ac-throw-guide-right" aria-hidden="true">→</div>
        <div className="ac-throw-shadow" aria-hidden="true" />
        <div className="ac-throw-posters" aria-hidden="true" ref={(element) => { if (element) element.inert = true }}>
          {Array.from({ length: Math.min(items.length, 4) }, (_, depth) => {
            const index = wrap(selectedIndex + depth, items.length)
            const item = items[index]
            return (
              <div className="ac-throw-poster" key={item.id} data-depth={depth} style={{ '--ac-throw-card-color': item.color ?? '#e8caa6', zIndex: 4 - depth } as CSSProperties}>
                <div className="ac-throw-artwork">{item.content}</div>
                <span className="ac-throw-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
            )
          })}
        </div>
        <span className="ac-throw-hint" aria-hidden="true">Grab · throw · repeat</span>
      </div>
      <div className="ac-throw-footer">
        <div className="ac-throw-caption" aria-live="polite" aria-atomic="true">
          {activeItem ? <>
            <p className="ac-throw-title">{activeItem.title}</p>
            {activeItem.subtitle && <p className="ac-throw-subtitle">{activeItem.subtitle}</p>}
            {activeItem.href && <a className="ac-throw-link" href={activeItem.href}>Explore project <span aria-hidden="true">↗</span></a>}
          </> : <p className="ac-throw-title">No posters yet</p>}
        </div>
        <div className="ac-throw-controls" role="group" aria-label="Stack controls">
          <button type="button" aria-label="Previous poster" disabled={items.length < 2} aria-disabled={phase === 'flying' || items.length < 2} onClick={() => throwTo(selectedIndex - 1, 1)}><span aria-hidden="true">←</span></button>
          <button type="button" aria-label="Next poster" disabled={items.length < 2} aria-disabled={phase === 'flying' || items.length < 2} onClick={() => throwTo(selectedIndex + 1, -1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  )
}
