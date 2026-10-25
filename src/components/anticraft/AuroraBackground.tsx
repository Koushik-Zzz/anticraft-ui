import type { CSSProperties, HTMLAttributes } from 'react'
import './aurora-background.css'

export interface AuroraBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Duration, in seconds, of one complete drift. */
  speed?: number
  /** Freeze the atmosphere while keeping its color and texture. */
  paused?: boolean
  color1?: string
  color2?: string
  color3?: string
}

function colorOrDefault(value: string, fallback: string) {
  const color = value.trim()
  return color && color.length <= 200 && !/[;{}<>]/.test(color) ? color : fallback
}

/** A slow-moving atmosphere with a separate, readable content layer. */
export function AuroraBackground({
  children,
  className = '',
  speed = 16,
  paused = false,
  color1 = '#e89c62',
  color2 = '#9280da',
  color3 = '#edd1a3',
  style,
  ...props
}: AuroraBackgroundProps) {
  const duration = Number.isFinite(speed) ? Math.min(180, Math.max(2, speed)) : 16

  return (
    <div
      {...props}
      className={`ac-aurora-background ${className}`.trim()}
      data-paused={paused || undefined}
      style={{
        '--ac-aurora-speed': `${duration}s`,
        '--ac-aurora-color-one': colorOrDefault(color1, '#e89c62'),
        '--ac-aurora-color-two': colorOrDefault(color2, '#9280da'),
        '--ac-aurora-color-three': colorOrDefault(color3, '#edd1a3'),
        ...style,
      } as CSSProperties}
    >
      <div className="ac-aurora-field" aria-hidden="true">
        <span className="ac-aurora-band ac-aurora-band-one" />
        <span className="ac-aurora-band ac-aurora-band-two" />
        <span className="ac-aurora-band ac-aurora-band-three" />
      </div>
      <div className="ac-aurora-content">{children}</div>
    </div>
  )
}
