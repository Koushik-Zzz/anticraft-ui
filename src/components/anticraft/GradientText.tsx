import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import './gradient-text.css'

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
  /** At least two CSS colors, arranged in reading order. */
  colors?: string[]
  /** Duration in seconds of one color sweep. */
  speed?: number
  paused?: boolean
}

const defaultColors = ['#ef9b61', '#f7e6cf', '#b8a0e9', '#ef9b61']

/** Keeps its text in the document while animating only its painted color. */
export function GradientText({
  children,
  className = '',
  colors = defaultColors,
  speed = 8,
  paused = false,
  style,
  ...props
}: GradientTextProps) {
  const safeColors = colors
    .filter((color) => typeof color === 'string' && color.trim() && color.length <= 200 && !/[;{}<>]/.test(color))
    .slice(0, 8)
  const palette = safeColors.length >= 2 ? safeColors : defaultColors
  const duration = Number.isFinite(speed) ? Math.min(180, Math.max(1, speed)) : 8

  return (
    <span
      {...props}
      className={`ac-gradient-text ${className}`.trim()}
      data-paused={paused || undefined}
      style={{
        '--ac-gradient-text-colors': palette.join(', '),
        '--ac-gradient-text-speed': `${duration}s`,
        ...style,
      } as CSSProperties}
    >
      {children}
    </span>
  )
}
