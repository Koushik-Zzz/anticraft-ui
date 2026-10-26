'use client'

import { useId, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './before-after.css'

export interface BeforeAfterProps {
  /** Decorative artwork without links or controls. */
  before: ReactNode
  /** Decorative artwork without links or controls. */
  after: ReactNode
  beforeLabel?: string
  afterLabel?: string
  /** Initial revealed percentage, clamped from 0 to 100. */
  defaultValue?: number
  onValueChange?: (value: number) => void
  className?: string
}

function bounded(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 50
}

/** A comparison surface with a native, keyboard-operable reveal slider. */
export function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After', defaultValue = 50, onValueChange, className = '' }: BeforeAfterProps) {
  const id = useId()
  const [value, setValue] = useState(() => bounded(defaultValue))

  return (
    <section className={`ac-before-after ${className}`.trim()} aria-label={`${beforeLabel} and ${afterLabel} comparison`} style={{ '--ac-compare-position': `${value}%` } as CSSProperties}>
      <div className="ac-compare-stage">
        <div className="ac-compare-face ac-compare-after" aria-hidden="true" ref={(element) => { element?.setAttribute('inert', '') }}>{after}</div>
        <div className="ac-compare-face ac-compare-before" aria-hidden="true" ref={(element) => { element?.setAttribute('inert', '') }}>{before}</div>
        <div className="ac-compare-labels" aria-hidden="true"><span>{beforeLabel}</span><span>{afterLabel}</span></div>
        <div className="ac-compare-divider" aria-hidden="true">
          <span className="ac-compare-handle"><svg width="22" height="18" viewBox="0 0 22 18" fill="none"><path d="m7 5-4 4 4 4m8-8 4 4-4 4M3 9h5m6 0h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </div>
        <label className="ac-compare-sr-only" htmlFor={id}>Reveal {beforeLabel} and {afterLabel}</label>
        <input
          id={id}
          className="ac-compare-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-describedby={`${id}-hint`}
          aria-valuetext={`${value}% ${beforeLabel}, ${100 - value}% ${afterLabel}`}
          onChange={(event) => {
            const next = bounded(Number(event.currentTarget.value))
            setValue(next)
            onValueChange?.(next)
          }}
        />
      </div>
      <div className="ac-compare-footer">
        <p id={`${id}-hint`}>Drag the handle. Find the difference.</p>
        <output htmlFor={id} aria-live="off">{value}<span aria-hidden="true"> / </span><span className="ac-compare-sr-only"> out of </span>100</output>
      </div>
    </section>
  )
}
