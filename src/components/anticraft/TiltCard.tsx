'use client'

import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react'
import './tilt-card.css'

export interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum rotation in degrees, from 0 to 30. */
  maxRotation?: number
  /** Distance to the viewer in pixels. */
  perspective?: number
}

export function TiltCard({
  children,
  className = '',
  maxRotation = 8,
  perspective = 900,
  style,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...props
}: TiltCardProps) {
  const rotation = Number.isFinite(maxRotation) ? Math.max(0, Math.min(30, maxRotation)) : 8
  const depth = Number.isFinite(perspective) ? Math.max(100, perspective) : 900

  function resetTilt(element: HTMLDivElement) {
    element.style.removeProperty('--ac-tilt-x')
    element.style.removeProperty('--ac-tilt-y')
  }

  function tilt(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    if (
      event.defaultPrevented ||
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches
    ) return

    const bounds = event.currentTarget.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2))
    const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2))
    event.currentTarget.style.setProperty('--ac-tilt-x', `${-y * rotation}deg`)
    event.currentTarget.style.setProperty('--ac-tilt-y', `${x * rotation}deg`)
  }

  return (
    <div
      {...props}
      className={`ac-tilt-card ${className}`.trim()}
      style={{ '--ac-tilt-perspective': `${depth}px`, ...style } as CSSProperties}
      onPointerMove={tilt}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)
        resetTilt(event.currentTarget)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        resetTilt(event.currentTarget)
      }}
    >
      {children}
    </div>
  )
}
