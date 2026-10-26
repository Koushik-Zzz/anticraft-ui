'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import './orbit-gallery.css'

export interface OrbitGalleryItem {
  /** A stable, unique identifier. */
  id: string
  title: string
  subtitle?: string
  /** Decorative artwork only. Do not include links, buttons, or form controls. */
  content: ReactNode
  color?: string
  href?: string
}

export interface OrbitGalleryProps {
  items: OrbitGalleryItem[]
  defaultValue?: string
  className?: string
  /** Called after a drag or navigation action selects a different item. */
  onValueChange?: (id: string) => void
}

interface DragSession {
  pointerId: number
  startX: number
  startY: number
  position: number
  pixelsPerItem: number
  horizontal: boolean
}

function wrap(value: number, count: number) {
  return count > 0 ? ((value % count) + count) % count : 0
}

/** A hand-operated wheel of project artwork, with a single accessible active item. */
export function OrbitGallery({
  items,
  defaultValue,
  className = '',
  onValueChange,
}: OrbitGalleryProps) {
  const instructionsId = useId()
  const initialIndex = Math.max(0, items.findIndex((item) => item.id === defaultValue))
  const stageRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const positionRef = useRef(initialIndex)
  const selectedRef = useRef(items[initialIndex]?.id)
  const [position, setPosition] = useState(initialIndex)
  const [selectedId, setSelectedId] = useState(items[initialIndex]?.id)
  const [dragging, setDragging] = useState(false)
  const itemSignature = JSON.stringify(items.map((item) => item.id))
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === selectedId))
  const activeItem = items[selectedIndex]

  // If a collection changes, preserve its selected identifier and abandon any old drag.
  useEffect(() => {
    const index = Math.max(0, items.findIndex((item) => item.id === selectedRef.current))
    const stage = stageRef.current
    const pointerId = dragRef.current?.pointerId
    dragRef.current = null
    if (stage && pointerId !== undefined && stage.hasPointerCapture(pointerId)) {
      stage.releasePointerCapture(pointerId)
    }
    positionRef.current = index
    selectedRef.current = items[index]?.id
    setPosition(index)
    setSelectedId(items[index]?.id)
    setDragging(false)
    // Only collection identity/order changes should reset the wheel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSignature])

  function moveTo(nextPosition: number, notify = true) {
    if (!items.length) return
    const snapped = Math.round(nextPosition)
    const nextItem = items[wrap(snapped, items.length)]
    positionRef.current = snapped
    setPosition(snapped)
    setDragging(false)
    setSelectedId(nextItem.id)
    if (selectedRef.current !== nextItem.id) {
      selectedRef.current = nextItem.id
      if (notify) onValueChange?.(nextItem.id)
    }
  }

  function stopDrag(restore: boolean) {
    const session = dragRef.current
    if (!session) return
    dragRef.current = null
    const stage = stageRef.current
    if (stage?.hasPointerCapture(session.pointerId)) {
      stage.releasePointerCapture(session.pointerId)
    }
    moveTo(restore ? session.position : positionRef.current, !restore)
  }

  function navigate(direction: number) {
    stopDrag(true)
    moveTo(Math.round(positionRef.current) + direction)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || items.length < 2) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      navigate(event.key === 'ArrowRight' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      stopDrag(true)
      const current = Math.round(positionRef.current)
      const target = event.key === 'Home' ? 0 : items.length - 1
      let offset = target - wrap(current, items.length)
      if (offset > items.length / 2) offset -= items.length
      if (offset < -items.length / 2) offset += items.length
      moveTo(current + offset)
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !event.isPrimary || items.length < 2) return
    stopDrag(true)
    const width = event.currentTarget.getBoundingClientRect().width
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      position: positionRef.current,
      pixelsPerItem: Math.max(92, Math.min(170, width * 0.3)),
      horizontal: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.focus({ preventScroll: true })
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const session = dragRef.current
    if (!session || session.pointerId !== event.pointerId) return
    const distanceX = event.clientX - session.startX
    const distanceY = event.clientY - session.startY
    if (!session.horizontal) {
      // Let vertical gestures continue scrolling the surrounding document.
      if (Math.abs(distanceY) > 8 && Math.abs(distanceY) > Math.abs(distanceX)) {
        stopDrag(true)
        return
      }
      if (Math.abs(distanceX) < 6) return
      session.horizontal = true
      setDragging(true)
    }
    event.preventDefault()
    const next = session.position - distanceX / session.pixelsPerItem
    positionRef.current = next
    // Reduced-motion visitors keep a still composition until the drag commits.
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPosition(next)
  }

  return (
    <section
      className={`ac-orbit-gallery ${className}`.trim()}
      aria-label="Orbit gallery"
      aria-roledescription="carousel"
      data-dragging={dragging}
      onKeyDown={handleKeyDown}
    >
      <div className="ac-orbit-header" aria-hidden="true">
        <span>Orbit index</span>
        <span>{String(activeItem ? selectedIndex + 1 : 0).padStart(2, '0')} <span className="ac-orbit-divider">/</span> {String(items.length).padStart(2, '0')}</span>
      </div>
      <p className="ac-orbit-sr-only" id={instructionsId}>
        Drag horizontally or use the left and right arrow keys to rotate. Home selects the first item and End selects the last.
      </p>
      <div
        className="ac-orbit-stage"
        ref={stageRef}
        role="group"
        aria-label="Rotate the gallery"
        aria-describedby={instructionsId}
        tabIndex={items.length > 1 ? 0 : -1}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => { if (event.pointerId === dragRef.current?.pointerId) stopDrag(false) }}
        onPointerCancel={(event) => { if (event.pointerId === dragRef.current?.pointerId) stopDrag(true) }}
        onLostPointerCapture={(event) => { if (event.pointerId === dragRef.current?.pointerId) stopDrag(true) }}
      >
        <div className="ac-orbit-ring" aria-hidden="true" />
        <div className="ac-orbit-floor" aria-hidden="true" />
        <div
          className="ac-orbit-artworks"
          aria-hidden="true"
          ref={(element) => { if (element) element.inert = true }}
        >
          {items.map((item, index) => {
            let distance = wrap(index - position + items.length / 2, items.length) - items.length / 2
            if (items.length === 1) distance = 0
            const absoluteDistance = Math.abs(distance)
            const radians = distance * 0.66
            const opacity = absoluteDistance >= 2 ? 0 : absoluteDistance > 1 ? (2 - absoluteDistance) * 0.5 : 1 - absoluteDistance * 0.5
            const style = {
              '--ac-orbit-x': Math.sin(radians),
              '--ac-orbit-y': (1 - Math.cos(radians)) * 0.58,
              '--ac-orbit-depth': `${-absoluteDistance * 72}px`,
              '--ac-orbit-roll': `${distance * 12}deg`,
              '--ac-orbit-turn': `${distance * -22}deg`,
              '--ac-orbit-scale': Math.max(0.65, 1 - absoluteDistance * 0.08),
              '--ac-orbit-card-color': item.color ?? '#d4d0bf',
              opacity,
              zIndex: Math.round((items.length - absoluteDistance) * 10),
            } as CSSProperties
            return (
              <div className="ac-orbit-card" key={item.id} style={style}>
                <div className="ac-orbit-card-art">{item.content}</div>
                <span className="ac-orbit-card-number">{String(index + 1).padStart(2, '0')}</span>
              </div>
            )
          })}
        </div>
        <span className="ac-orbit-indicator" aria-hidden="true"><span /> Drag to rotate</span>
      </div>
      <div className="ac-orbit-footer">
        <div className="ac-orbit-caption" aria-live="polite" aria-atomic="true">
          {activeItem ? <>
            <p className="ac-orbit-title">{activeItem.title}</p>
            {activeItem.subtitle && <p className="ac-orbit-subtitle">{activeItem.subtitle}</p>}
            {activeItem.href && <a className="ac-orbit-link" href={activeItem.href}>Explore project <span aria-hidden="true">↗</span></a>}
          </> : <p className="ac-orbit-title">No items yet</p>}
        </div>
        <div className="ac-orbit-controls" role="group" aria-label="Gallery controls">
          <button type="button" aria-label="Previous item" disabled={items.length < 2} onClick={() => navigate(-1)}><span aria-hidden="true">←</span></button>
          <button type="button" aria-label="Next item" disabled={items.length < 2} onClick={() => navigate(1)}><span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  )
}
