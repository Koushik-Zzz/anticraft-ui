'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import './pixel-swap.css'

export type PixelSwapSide = 'front' | 'back'

export interface PixelSwapProps {
  /** Decorative artwork only; controls inside either face are intentionally inert. */
  front: ReactNode
  back: ReactNode
  frontLabel?: string
  backLabel?: string
  buttonLabel?: string
  columns?: number
  rows?: number
  duration?: number
  onValueChange?: (side: PixelSwapSide) => void
  className?: string
}

type Phase = 'idle' | 'covering' | 'clearing'

function clampInteger(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, Math.round(value))) : fallback
}

/** A deterministic pixel curtain that changes artwork only when completely covered. */
export function PixelSwap({
  front,
  back,
  frontLabel = 'First artwork',
  backLabel = 'Second artwork',
  buttonLabel = 'Swap artwork',
  columns = 8,
  rows = 6,
  duration = 800,
  onValueChange,
  className = '',
}: PixelSwapProps) {
  const [side, setSide] = useState<PixelSwapSide>('front')
  const [phase, setPhase] = useState<Phase>('idle')
  const sideRef = useRef<PixelSwapSide>('front')
  const targetRef = useRef<PixelSwapSide>('front')
  const busyRef = useRef(false)
  const reducedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const callbackRef = useRef(onValueChange)
  const columnCount = clampInteger(columns, 8, 2, 20)
  const rowCount = clampInteger(rows, 6, 2, 16)
  const timing = Number.isFinite(duration) ? Math.max(240, Math.min(3000, duration)) : 800
  // Freeze transition geometry until the current curtain finishes.
  const [transition, setTransition] = useState({ columns: columnCount, rows: rowCount, duration: timing })
  const visibleColumns = phase === 'idle' ? columnCount : transition.columns
  const visibleRows = phase === 'idle' ? rowCount : transition.rows
  const visibleDuration = phase === 'idle' ? timing : transition.duration

  useEffect(() => { callbackRef.current = onValueChange }, [onValueChange])

  function clearTimers() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  function commitSide(next: PixelSwapSide) {
    if (sideRef.current === next) return
    sideRef.current = next
    setSide(next)
    callbackRef.current?.(next)
  }

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    function updateMotion() {
      reducedRef.current = media.matches
      if (media.matches && busyRef.current) {
        clearTimers()
        commitSide(targetRef.current)
        busyRef.current = false
        setPhase('idle')
      }
    }
    updateMotion()
    media.addEventListener('change', updateMotion)
    return () => {
      media.removeEventListener('change', updateMotion)
      clearTimers()
      busyRef.current = false
    }
  }, [])

  function swap() {
    if (busyRef.current) return
    const next = sideRef.current === 'front' ? 'back' : 'front'
    targetRef.current = next
    if (reducedRef.current) {
      commitSide(next)
      return
    }
    busyRef.current = true
    setTransition({ columns: columnCount, rows: rowCount, duration: timing })
    setPhase('covering')
    timersRef.current = [
      setTimeout(() => {
        commitSide(next)
        setPhase('clearing')
      }, timing * 0.48),
      setTimeout(() => {
        timersRef.current = []
        busyRef.current = false
        setPhase('idle')
      }, timing),
    ]
  }

  const currentLabel = side === 'front' ? frontLabel : backLabel
  const style = {
    '--ac-pixel-columns': visibleColumns,
    '--ac-pixel-rows': visibleRows,
    '--ac-pixel-cell-duration': `${visibleDuration * 0.24}ms`,
  } as CSSProperties

  return (
    <div className={`ac-pixel-swap ${className}`.trim()} style={style} data-phase={phase} data-side={side}>
      <div className="ac-pixel-stage">
        <div className="ac-pixel-face" hidden={side !== 'front'} role="img" aria-label={frontLabel}>
          <div aria-hidden="true" ref={(element) => { if (element) element.inert = true }}>{front}</div>
        </div>
        <div className="ac-pixel-face" hidden={side !== 'back'} role="img" aria-label={backLabel}>
          <div aria-hidden="true" ref={(element) => { if (element) element.inert = true }}>{back}</div>
        </div>
        <div className="ac-pixel-grid" aria-hidden="true">
          {Array.from({ length: visibleColumns * visibleRows }, (_, index) => {
            const x = index % visibleColumns
            const y = Math.floor(index / visibleColumns)
            const order = (x / (visibleColumns - 1) + (visibleRows - 1 - y) / (visibleRows - 1)) / 2
            return <span key={index} className="ac-pixel-cell" data-tone={(x + y) % 3} style={{ '--ac-pixel-delay': `${order * visibleDuration * 0.22}ms` } as CSSProperties} />
          })}
        </div>
      </div>
      <div className="ac-pixel-footer">
        <span className="ac-pixel-label" aria-live="polite" aria-atomic="true">{currentLabel}</span>
        <button type="button" className="ac-pixel-button" onClick={swap} aria-disabled={phase !== 'idle'}>
          <span>{buttonLabel}</span><span aria-hidden="true">⇄</span>
        </button>
      </div>
    </div>
  )
}
