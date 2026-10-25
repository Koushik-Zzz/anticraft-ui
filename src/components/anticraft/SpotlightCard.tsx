'use client'

import type { CSSProperties, HTMLAttributes, PointerEvent } from 'react'
import './spotlight-card.css'

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** The accent color of the light that follows the pointer. */
  color?: string
}

export function SpotlightCard({
  children,
  className = '',
  color = '#d7ee9e',
  style,
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  ...props
}: SpotlightCardProps) {
  function moveLight(event: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(event)
    if (
      event.defaultPrevented ||
      event.pointerType !== 'mouse' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return

    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--ac-spotlight-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--ac-spotlight-y', `${event.clientY - bounds.top}px`)
  }

  function resetLight(event: PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(event)
    event.currentTarget.style.removeProperty('--ac-spotlight-x')
    event.currentTarget.style.removeProperty('--ac-spotlight-y')
  }

  return (
    <div
      {...props}
      className={`ac-spotlight-card ${className}`.trim()}
      style={{ '--ac-spotlight-color': color, ...style } as CSSProperties}
      onPointerMove={moveLight}
      onPointerLeave={resetLight}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        event.currentTarget.style.removeProperty('--ac-spotlight-x')
        event.currentTarget.style.removeProperty('--ac-spotlight-y')
      }}
    >
      {children}
    </div>
  )
}
