'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import './morphing-stage.css'

export type MorphingStageFrame = {
  id: string
  title: string
  kicker?: string
  description?: string
  /** Decorative artwork. Keep links and controls outside the moving frame. */
  content: ReactNode
  format: 'portrait' | 'landscape' | 'circle' | 'arch'
  color?: string
}

export type MorphingStageProps = {
  frames: MorphingStageFrame[]
  className?: string
  onFrameChange?: (id: string) => void
}

type Geometry = { width: number; height: number; radius: number[]; rotation: number }

function frameGeometry(format: MorphingStageFrame['format'], width: number, height: number): Geometry {
  const availableWidth = Math.max(40, width - 64)
  const availableHeight = Math.max(40, height - 132)
  if (format === 'landscape') {
    return { width: availableWidth * 0.94, height: availableHeight * 0.68, radius: [3, 3, 3, 3], rotation: 3 }
  }
  if (format === 'circle') {
    const diameter = Math.min(availableWidth * 0.8, availableHeight * 0.98)
    return { width: diameter, height: diameter, radius: Array(4).fill(diameter / 2), rotation: 0 }
  }
  if (format === 'arch') {
    const archWidth = Math.min(availableWidth * 0.72, availableHeight * 0.9)
    return { width: archWidth, height: availableHeight * 0.96, radius: [archWidth / 2, archWidth / 2, 3, 3], rotation: -3 }
  }
  return {
    width: Math.min(availableWidth * 0.6, availableHeight * 0.74),
    height: availableHeight * 0.96,
    radius: [3, 3, 3, 3],
    rotation: -6,
  }
}

const mix = (start: number, end: number, amount: number) => start + (end - start) * amount

/** A native scroll story whose artwork changes format between chapters. */
export function MorphingStage({ frames, className = '', onFrameChange }: MorphingStageProps) {
  const instructionId = useId()
  const viewportRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const callbackRef = useRef(onFrameChange)
  const lastFrameRef = useRef<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [size, setSize] = useState({ width: 560, height: 400 })
  const [reducedMotion, setReducedMotion] = useState(false)
  const count = frames.length
  const position = Math.max(0, Math.min(Math.max(0, count - 1), progress))
  const activeIndex = Math.round(position)
  const activeFrame = frames[activeIndex]

  useEffect(() => { callbackRef.current = onFrameChange }, [onFrameChange])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    let animationFrame = 0
    const readPosition = () => {
      animationFrame = 0
      const height = viewport.clientHeight
      const width = viewport.clientWidth
      if (!height || !width) return
      setSize((current) => current.height === height && current.width === width ? current : { width, height })
      // Use the measured height: the track still has its previous height until React commits.
      const distance = Math.max(0, count - 1) * height
      setProgress(distance > 0 ? (Math.min(viewport.scrollTop, distance) / distance) * Math.max(0, count - 1) : 0)
    }
    const scheduleRead = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(readPosition)
    }
    readPosition()
    viewport.addEventListener('scroll', scheduleRead, { passive: true })
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleRead) : null
    observer?.observe(viewport)
    window.addEventListener('resize', scheduleRead)
    return () => {
      viewport.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
      observer?.disconnect()
      window.cancelAnimationFrame(animationFrame)
    }
  }, [count])

  useEffect(() => {
    if (activeFrame && lastFrameRef.current !== activeFrame.id) {
      lastFrameRef.current = activeFrame.id
      callbackRef.current?.(activeFrame.id)
    }
  }, [activeFrame?.id])

  function goToFrame(index: number, focus = false) {
    const viewport = viewportRef.current
    if (!viewport || !count) return
    const next = Math.max(0, Math.min(count - 1, index))
    const distance = viewport.scrollHeight - viewport.clientHeight
    viewport.scrollTo({
      top: count > 1 ? (next / (count - 1)) * distance : 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
    if (focus) buttonRefs.current[next]?.focus({ preventScroll: true })
  }

  function handleKeys(event: KeyboardEvent<HTMLElement>, index: number, focus = false) {
    let next: number | undefined
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)) next = index + 1
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) next = index - 1
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = count - 1
    if (!focus && event.key === ' ') next = index + (event.shiftKey ? -1 : 1)
    if (next === undefined) return
    event.preventDefault()
    goToFrame(next, focus)
  }

  if (!activeFrame) return null

  const visualPosition = reducedMotion ? activeIndex : position
  const lowerIndex = Math.floor(visualPosition)
  const upperIndex = Math.min(count - 1, lowerIndex + 1)
  const blend = visualPosition - lowerIndex
  const from = frameGeometry(frames[lowerIndex].format, size.width, size.height)
  const to = frameGeometry(frames[upperIndex].format, size.width, size.height)
  const radius = from.radius.map((value, index) => `${mix(value, to.radius[index], blend)}px`).join(' ')
  const shapeStyle = {
    width: `${mix(from.width, to.width, blend)}px`,
    height: `${mix(from.height, to.height, blend)}px`,
    borderRadius: radius,
    transform: `translate(-50%, -50%) rotate(${mix(from.rotation, to.rotation, blend)}deg)`,
  } satisfies CSSProperties

  return (
    <div className={`ac-morph-stage ${className}`.trim()}>
      <p id={instructionId} className="ac-morph-sr-only">
        Scroll inside this story to change its format. Use the chapter buttons, arrow keys, Home, or End to navigate.
        {activeFrame.description ? ` ${activeFrame.description}` : ''}
      </p>
      <div
        ref={viewportRef}
        className="ac-morph-scroll"
        role="region"
        aria-label="Changing formats story"
        aria-describedby={instructionId}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target === event.currentTarget) handleKeys(event, activeIndex)
        }}
      >
        <div className="ac-morph-track" style={{ height: `${Math.max(1, count) * size.height}px` }}>
          <div className="ac-morph-pin" style={{ height: `${size.height}px` }}>
            <div className="ac-morph-heading">
              <div className="ac-morph-heading-copy" aria-live="polite" aria-atomic="true">
                <span className="ac-morph-kicker">{activeFrame.kicker || 'A change of perspective'}</span>
                <span className="ac-morph-title">{activeFrame.title}</span>
              </div>
              <span className="ac-morph-count" aria-hidden="true">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            </div>
            <div className="ac-morph-canvas" aria-hidden="true">
              <div className="ac-morph-crosshair ac-morph-crosshair-top" />
              <div className="ac-morph-crosshair ac-morph-crosshair-bottom" />
              <div className="ac-morph-outline ac-morph-outline-back" style={shapeStyle} />
              <div className="ac-morph-outline ac-morph-outline-front" style={shapeStyle} />
              <div className="ac-morph-artwork" style={shapeStyle}>
                {frames.map((frame, index) => (
                  <div
                    key={frame.id}
                    className="ac-morph-artwork-layer"
                    style={{ opacity: Math.max(0, 1 - Math.abs(index - visualPosition)), background: frame.color || '#e8613d' }}
                  >
                    {frame.content}
                  </div>
                ))}
              </div>
              <span className="ac-morph-format-label">{activeFrame.format}</span>
            </div>
            <div className="ac-morph-footer">
              <span className="ac-morph-scroll-hint"><span aria-hidden="true">↓</span> Scroll to reshape</span>
              <nav className="ac-morph-chapters" aria-label="Story chapters">
                {frames.map((frame, index) => (
                  <button
                    key={frame.id}
                    ref={(element) => { buttonRefs.current[index] = element }}
                    className="ac-morph-chapter"
                    type="button"
                    aria-label={`Chapter ${index + 1}: ${frame.title}`}
                    aria-current={activeIndex === index ? 'step' : undefined}
                    onClick={() => goToFrame(index)}
                    onKeyDown={(event) => handleKeys(event, index, true)}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
