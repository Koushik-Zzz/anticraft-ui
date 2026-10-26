'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './lenticular-panel.css'

export interface LenticularPanelProps {
  /** Decorative artwork only; interactive children are intentionally inert. */
  front: ReactNode
  /** Decorative artwork only; interactive children are intentionally inert. */
  back: ReactNode
  frontLabel?: string
  backLabel?: string
  /** The number of vertical lenses, clamped to 4–24. */
  segments?: number
  /** The initial viewing angle: 0 shows the front and 1 shows the back. */
  defaultValue?: number
  className?: string
  onValueChange?: (value: number) => void
}

function clamp(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0
}

/** A two-sided print divided into rotating lenses, with an accessible angle control. */
export function LenticularPanel({
  front,
  back,
  frontLabel = 'First artwork',
  backLabel = 'Second artwork',
  segments = 12,
  defaultValue = 0,
  className = '',
  onValueChange,
}: LenticularPanelProps) {
  const id = useId()
  const lensCount = Number.isFinite(segments) ? Math.max(4, Math.min(24, Math.round(segments))) : 12
  const [value, setValue] = useState(() => clamp(defaultValue))
  const [reducedMotion, setReducedMotion] = useState(false)
  const pointerEnabled = useRef(false)
  const frame = useRef<number | null>(null)
  const pendingValue = useRef(value)
  const currentValue = useRef(value)
  const changeCallback = useRef(onValueChange)

  useEffect(() => {
    changeCallback.current = onValueChange
  }, [onValueChange])

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    function updatePreferences() {
      pointerEnabled.current = pointerQuery.matches && !motionQuery.matches
      setReducedMotion(motionQuery.matches)
      if (!pointerEnabled.current && frame.current !== null) {
        cancelAnimationFrame(frame.current)
        frame.current = null
      }
    }
    updatePreferences()
    motionQuery.addEventListener('change', updatePreferences)
    pointerQuery.addEventListener('change', updatePreferences)
    return () => {
      motionQuery.removeEventListener('change', updatePreferences)
      pointerQuery.removeEventListener('change', updatePreferences)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [])

  function commitValue(next: number) {
    const safeValue = clamp(next)
    if (safeValue === currentValue.current) return
    currentValue.current = safeValue
    setValue(safeValue)
    changeCallback.current?.(safeValue)
  }

  function setImmediateValue(next: number) {
    if (frame.current !== null) {
      cancelAnimationFrame(frame.current)
      frame.current = null
    }
    commitValue(next)
  }

  const visibleValue = reducedMotion ? Number(value >= 0.5) : value
  const artworkLabel = value < 0.5 ? frontLabel : backLabel
  const panelStyle = {
    '--ac-lenticular-segments': lensCount,
    '--ac-lenticular-angle': `${visibleValue * -180}deg`,
    '--ac-lenticular-wave': `${Math.sin(visibleValue * Math.PI) * 22}deg`,
    '--ac-lenticular-glint': Math.sin(visibleValue * Math.PI).toFixed(3),
  } as CSSProperties

  return (
    <section className={`ac-lenticular-panel ${className}`.trim()} style={panelStyle} data-side={value < 0.5 ? 'front' : 'back'} aria-label="Lenticular print">
      <div className="ac-lenticular-heading" aria-hidden="true">
        <span>Two views. One surface.</span>
        <span>{String(Math.round(value * 180)).padStart(3, '0')}°</span>
      </div>
      <div
        className="ac-lenticular-print"
        aria-hidden="true"
        onPointerMove={(event) => {
          if (event.pointerType === 'touch' || !pointerEnabled.current) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (bounds.width <= 0) return
          pendingValue.current = clamp((event.clientX - bounds.left) / bounds.width)
          if (frame.current !== null) return
          frame.current = requestAnimationFrame(() => {
            frame.current = null
            commitValue(pendingValue.current)
          })
        }}
      >
        <div className="ac-lenticular-lenses" ref={(element) => { element?.setAttribute('inert', '') }}>
          {Array.from({ length: lensCount }, (_, index) => (
            <div className="ac-lenticular-lens" key={index} style={{ '--ac-lenticular-index': index, '--ac-lenticular-phase': index / (lensCount - 1) - 0.5 } as CSSProperties}>
              <div className="ac-lenticular-face ac-lenticular-face-front">
                <div className="ac-lenticular-artwork">{front}</div>
              </div>
              <div className="ac-lenticular-face ac-lenticular-face-back">
                <div className="ac-lenticular-artwork">{back}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="ac-lenticular-glass" />
      </div>
      <div className="ac-lenticular-controls">
        <div className="ac-lenticular-control-heading">
          <label htmlFor={`${id}-angle`}>Viewing angle</label>
          <span aria-hidden="true">{Math.round(value * 100)}%</span>
        </div>
        <input
          id={`${id}-angle`}
          className="ac-lenticular-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(value * 100)}
          aria-describedby={`${id}-instructions`}
          aria-valuetext={reducedMotion ? artworkLabel : `${Math.round(value * 100)}%, ${artworkLabel}`}
          onChange={(event) => setImmediateValue(Number(event.currentTarget.value) / 100)}
        />
        <div className="ac-lenticular-endpoints">
          <button type="button" onClick={() => setImmediateValue(0)} aria-pressed={value === 0}>
            <span aria-hidden="true">↙</span> {frontLabel}
          </button>
          <button type="button" onClick={() => setImmediateValue(1)} aria-pressed={value === 1}>
            {backLabel} <span aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="ac-lenticular-instructions" id={`${id}-instructions`}>
          {reducedMotion ? 'Adjust the viewing angle to switch artwork.' : 'Move across the print, or adjust the viewing angle.'}
        </p>
      </div>
    </section>
  )
}
