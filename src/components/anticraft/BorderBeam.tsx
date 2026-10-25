import type { CSSProperties, HTMLAttributes } from 'react'
import './border-beam.css'

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds for the light to travel once around the edge. */
  duration?: number
  color?: string
  paused?: boolean
}

/** A luminous edge that leaves child content and focus outlines unobstructed. */
export function BorderBeam({
  children,
  className = '',
  duration = 8,
  color = '#f19451',
  paused = false,
  style,
  ...props
}: BorderBeamProps) {
  const seconds = Number.isFinite(duration) ? Math.min(180, Math.max(1, duration)) : 8
  const beamColor = color.trim()
  const safeColor = beamColor && beamColor.length <= 200 && !/[;{}<>]/.test(beamColor)
    ? beamColor
    : '#f19451'

  return (
    <div
      {...props}
      className={`ac-border-beam ${className}`.trim()}
      data-paused={paused || undefined}
      style={{
        '--ac-border-beam-duration': `${seconds}s`,
        '--ac-border-beam-color': safeColor,
        ...style,
      } as CSSProperties}
    >
      {children}
    </div>
  )
}
