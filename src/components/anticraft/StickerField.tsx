'use client'

import { useEffect, useId, useRef } from 'react'
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react'
import './sticker-field.css'

export interface StickerFieldItem {
  /** Unique, stable identifier. */
  id: string
  /** Decorative content only: do not include links, buttons, or form controls. */
  content: ReactNode
  label: string
  /** Center position as a fraction of the field, from 0 to 1. */
  x: number
  /** Center position as a fraction of the field, from 0 to 1. */
  y: number
  rotation?: number
  /** Dimensions in pixels. Stickers shrink to fit smaller fields. */
  width?: number
  height?: number
}

export interface StickerFieldPosition {
  id: string
  x: number
  y: number
  rotation: number
}

export interface StickerFieldProps {
  items: StickerFieldItem[]
  children?: ReactNode
  className?: string
  /** Change this value to restore every sticker to its supplied position. */
  resetKey?: number
  /** Called with serializable positions after a drag, throw, or keyboard move settles. */
  onChange?: (positions: StickerFieldPosition[]) => void
  /** A gentle release glide. Automatically disabled for reduced motion. */
  inertia?: boolean
}

interface StickerState {
  x: number
  y: number
  rotation: number
  initialX: number
  initialY: number
  initialRotation: number
}

interface DragState {
  id: string
  pointerId: number
  startX: number
  startY: number
  clientX: number
  clientY: number
  lastX: number
  lastY: number
  lastTime: number
  velocityX: number
  velocityY: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const finite = (value: number | undefined, fallback: number) => Number.isFinite(value) ? value as number : fallback
const position = (value: number) => clamp(finite(value, 0.5), 0, 1)
const dimension = (value: number | undefined) => Math.max(44, finite(value, 160))

function createState(item: StickerFieldItem): StickerState {
  return {
    x: position(item.x),
    y: position(item.y),
    rotation: finite(item.rotation, 0),
    initialX: position(item.x),
    initialY: position(item.y),
    initialRotation: finite(item.rotation, 0),
  }
}

/** An accessible, freely arranged collage. x/y always describe sticker centers. */
export function StickerField({
  items,
  children,
  className = '',
  resetKey,
  onChange,
  inertia = true,
}: StickerFieldProps) {
  const helpId = useId()
  const fieldRef = useRef<HTMLDivElement>(null)
  const elements = useRef(new Map<string, HTMLButtonElement>())
  const states = useRef(new Map(items.map((item) => [item.id, createState(item)])))
  const drag = useRef<DragState | null>(null)
  const momentum = useRef<{ id: string; x: number; y: number; time: number } | null>(null)
  const animation = useRef<number | null>(null)
  const observer = useRef<ResizeObserver | null>(null)
  const stack = useRef(items.length + 1)
  const reducedMotion = useRef(false)
  const previousReset = useRef(resetKey)
  const latest = useRef({ items, onChange, inertia })
  latest.current = { items, onChange, inertia }

  function notifyChange() {
    latest.current.onChange?.(latest.current.items.flatMap((item) => {
      const state = states.current.get(item.id)
      return state ? [{ id: item.id, x: state.x, y: state.y, rotation: state.rotation }] : []
    }))
  }

  function paint(id: string, tilt = 0) {
    const element = elements.current.get(id)
    const state = states.current.get(id)
    const field = fieldRef.current
    if (!element || !state || !field) return

    // Account for the rotated silhouette so the whole sticker stays reachable.
    const radians = state.rotation * Math.PI / 180
    const halfWidth = (Math.abs(Math.cos(radians)) * element.offsetWidth + Math.abs(Math.sin(radians)) * element.offsetHeight) / 2
    const halfHeight = (Math.abs(Math.sin(radians)) * element.offsetWidth + Math.abs(Math.cos(radians)) * element.offsetHeight) / 2
    if (field.clientWidth) {
      const inset = Math.min(0.5, (halfWidth + 5) / field.clientWidth)
      state.x = clamp(state.x, inset, 1 - inset)
    }
    if (field.clientHeight) {
      const inset = Math.min(0.5, (halfHeight + 5) / field.clientHeight)
      state.y = clamp(state.y, inset, 1 - inset)
    }

    element.style.left = `${state.x * 100}%`
    element.style.top = `${state.y * 100}%`
    element.style.setProperty('--ac-sticker-rotation', `${state.rotation + (reducedMotion.current ? 0 : tilt)}deg`)
  }

  function stopMomentum(notify = false) {
    if (animation.current !== null) cancelAnimationFrame(animation.current)
    animation.current = null
    const movingId = momentum.current?.id
    momentum.current = null
    if (movingId) {
      paint(movingId)
      if (notify) notifyChange()
    }
  }

  function glide(time: number) {
    const moving = momentum.current
    const field = fieldRef.current
    const state = moving ? states.current.get(moving.id) : undefined
    if (!moving || !state || !field) {
      stopMomentum()
      return
    }

    const elapsed = Math.min(32, Math.max(1, time - moving.time))
    moving.time = time
    const nextX = state.x + moving.x * elapsed / Math.max(1, field.clientWidth)
    const nextY = state.y + moving.y * elapsed / Math.max(1, field.clientHeight)
    state.x = nextX
    state.y = nextY
    paint(moving.id)
    const friction = Math.exp(-elapsed / 155)
    moving.x = Math.abs(state.x - nextX) > 0.00001 ? 0 : moving.x * friction
    moving.y = Math.abs(state.y - nextY) > 0.00001 ? 0 : moving.y * friction

    if (Math.abs(moving.x) + Math.abs(moving.y) < 0.025 || reducedMotion.current || !latest.current.inertia) {
      stopMomentum(true)
    } else {
      animation.current = requestAnimationFrame(glide)
    }
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>, allowGlide: boolean) {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    drag.current = null
    const element = elements.current.get(current.id)
    element?.removeAttribute('data-dragging')
    if (element?.hasPointerCapture(current.pointerId)) element.releasePointerCapture(current.pointerId)
    paint(current.id)

    const fresh = performance.now() - current.lastTime < 100
    if (allowGlide && latest.current.inertia && !reducedMotion.current && fresh &&
      Math.abs(current.velocityX) + Math.abs(current.velocityY) > 0.08) {
      momentum.current = { id: current.id, x: current.velocityX, y: current.velocityY, time: performance.now() }
      animation.current = requestAnimationFrame(glide)
    } else {
      notifyChange()
    }
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (event.button !== 0 || !event.isPrimary || drag.current) return
    const state = states.current.get(id)
    if (!state) return
    stopMomentum(true)
    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.setAttribute('data-dragging', 'true')
    event.currentTarget.style.zIndex = `${++stack.current}`
    drag.current = {
      id,
      pointerId: event.pointerId,
      startX: state.x,
      startY: state.y,
      clientX: event.clientX,
      clientY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocityX: 0,
      velocityY: 0,
    }
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const current = drag.current
    const field = fieldRef.current
    if (!current || current.pointerId !== event.pointerId || !field) return
    const state = states.current.get(current.id)
    if (!state) return
    const bounds = field.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const now = performance.now()
    const elapsed = Math.max(8, now - current.lastTime)
    const velocityX = (event.clientX - current.lastX) * field.clientWidth / bounds.width / elapsed
    const velocityY = (event.clientY - current.lastY) * field.clientHeight / bounds.height / elapsed
    current.velocityX = clamp(current.velocityX * 0.35 + velocityX * 0.65, -1.2, 1.2)
    current.velocityY = clamp(current.velocityY * 0.35 + velocityY * 0.65, -1.2, 1.2)
    current.lastX = event.clientX
    current.lastY = event.clientY
    current.lastTime = now
    state.x = current.startX + (event.clientX - current.clientX) / bounds.width
    state.y = current.startY + (event.clientY - current.clientY) / bounds.height
    paint(current.id, clamp(current.velocityX * 4, -5, 5))
  }

  function moveWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, id: string) {
    const field = fieldRef.current
    const state = states.current.get(id)
    if (!field || !state || drag.current) return
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '[', ']', 'Home'].includes(event.key)) return
    event.preventDefault()
    stopMomentum()
    const step = event.shiftKey ? 30 : 10
    if (event.key === 'ArrowLeft') state.x -= step / Math.max(1, field.clientWidth)
    if (event.key === 'ArrowRight') state.x += step / Math.max(1, field.clientWidth)
    if (event.key === 'ArrowUp') state.y -= step / Math.max(1, field.clientHeight)
    if (event.key === 'ArrowDown') state.y += step / Math.max(1, field.clientHeight)
    if (event.key === '[') state.rotation -= 5
    if (event.key === ']') state.rotation += 5
    if (event.key === 'Home') {
      state.x = state.initialX
      state.y = state.initialY
      state.rotation = state.initialRotation
    }
    event.currentTarget.style.zIndex = `${++stack.current}`
    paint(id)
    notifyChange()
  }

  useEffect(() => {
    const field = fieldRef.current
    if (!field) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function syncMotion() {
      reducedMotion.current = preference.matches
      if (preference.matches) stopMomentum(true)
      for (const id of states.current.keys()) paint(id)
    }
    syncMotion()
    preference.addEventListener('change', syncMotion)
    const resize = new ResizeObserver(() => {
      for (const id of states.current.keys()) paint(id)
    })
    observer.current = resize
    resize.observe(field)
    for (const element of elements.current.values()) resize.observe(element)
    return () => {
      preference.removeEventListener('change', syncMotion)
      resize.disconnect()
      observer.current = null
      stopMomentum()
      drag.current = null
    }
    // All event and animation data live in refs; subscription lasts one mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const reset = previousReset.current !== resetKey
    previousReset.current = resetKey
    const ids = new Set(items.map((item) => item.id))
    if (momentum.current && (reset || !ids.has(momentum.current.id))) stopMomentum()
    const draggingItem = items.find((item) => item.id === drag.current?.id)
    const draggingState = drag.current ? states.current.get(drag.current.id) : undefined
    const draggingOriginChanged = draggingItem && draggingState && (
      draggingState.initialX !== position(draggingItem.x) ||
      draggingState.initialY !== position(draggingItem.y) ||
      draggingState.initialRotation !== finite(draggingItem.rotation, 0)
    )
    if (drag.current && (reset || !ids.has(drag.current.id) || draggingOriginChanged)) {
      const current = drag.current
      drag.current = null
      const element = elements.current.get(current.id)
      element?.removeAttribute('data-dragging')
      if (element?.hasPointerCapture(current.pointerId)) element.releasePointerCapture(current.pointerId)
    }
    for (const id of states.current.keys()) if (!ids.has(id)) states.current.delete(id)
    for (const item of items) {
      const state = states.current.get(item.id)
      const next = createState(item)
      if (!state || reset || state.initialX !== next.initialX || state.initialY !== next.initialY || state.initialRotation !== next.initialRotation) {
        states.current.set(item.id, next)
      }
      paint(item.id)
    }
    if (reset) notifyChange()
    // Content changes preserve placement unless supplied coordinates or resetKey change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, resetKey])

  return (
    <div ref={fieldRef} className={`ac-sticker-field ${className}`.trim()}>
      <div className="ac-sticker-backdrop">{children}</div>
      <span id={helpId} className="ac-sticker-help">
        Drag to arrange. Or use arrow keys to move, Shift and arrows for larger steps,
        left and right brackets to rotate, and Home to restore this sticker.
      </span>
      {items.map((item, index) => {
        const state = states.current.get(item.id) ?? createState(item)
        return (
          <button
            key={item.id}
            ref={(element) => {
              const previous = elements.current.get(item.id)
              if (previous) observer.current?.unobserve(previous)
              if (element) {
                elements.current.set(item.id, element)
                observer.current?.observe(element)
              } else elements.current.delete(item.id)
            }}
            type="button"
            className="ac-sticker-item"
            aria-label={item.label}
            aria-roledescription="draggable sticker"
            aria-describedby={helpId}
            style={{
              left: `${state.x * 100}%`,
              top: `${state.y * 100}%`,
              '--ac-sticker-width': `${dimension(item.width)}px`,
              '--ac-sticker-height': `${dimension(item.height)}px`,
              '--ac-sticker-rotation': `${state.rotation}deg`,
              zIndex: index + 1,
            } as CSSProperties}
            onPointerDown={(event) => startDrag(event, item.id)}
            onPointerMove={moveDrag}
            onPointerUp={(event) => finishDrag(event, true)}
            onPointerCancel={(event) => finishDrag(event, false)}
            onLostPointerCapture={(event) => finishDrag(event, false)}
            onKeyDown={(event) => moveWithKeyboard(event, item.id)}
            onFocus={(event) => { event.currentTarget.style.zIndex = `${++stack.current}` }}
            onDragStart={(event) => event.preventDefault()}
          >
            <span className="ac-sticker-content" aria-hidden="true">{item.content}</span>
          </button>
        )
      })}
    </div>
  )
}
