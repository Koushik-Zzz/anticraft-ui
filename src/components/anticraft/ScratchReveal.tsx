'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import './scratch-reveal.css'

export interface ScratchRevealProps {
  /** Artwork remains hidden from assistive technology and interaction until revealed. */
  children: ReactNode
  label?: string
  coverText?: string
  coverColor?: string
  brushSize?: number
  threshold?: number
  onReveal?: () => void
  className?: string
}

type ScratchPoint = { x: number; y: number }
type ScratchStroke = { points: ScratchPoint[]; radius: number }

/** A scratchable, locally drawn foil with a complete keyboard alternative. */
export function ScratchReveal({
  children,
  label = 'Scratch to reveal',
  coverText = 'A little curiosity pays off',
  coverColor = '#bdc4bd',
  brushSize = 36,
  threshold = 0.45,
  onReveal,
  className = '',
}: ScratchRevealProps) {
  const instanceId = useId()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const strokesRef = useRef<ScratchStroke[]>([])
  const pointerRef = useRef<number | null>(null)
  const revealedRef = useRef(false)
  const callbackRef = useRef(onReveal)
  const lastCheckRef = useRef(0)
  const drawRef = useRef<() => void>(() => {})
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)
  const brush = Number.isFinite(brushSize) ? Math.max(8, Math.min(140, brushSize)) : 36
  const target = Number.isFinite(threshold) ? Math.max(0.05, Math.min(1, threshold)) : 0.45

  useEffect(() => { callbackRef.current = onReveal }, [onReveal])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { willReadFrequently: true })
    if (!stage || !canvas || !context) return

    function draw() {
      if (!stage || !canvas || !context) return
      const { width, height } = stage.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.ceil(width * ratio)
      canvas.height = Math.ceil(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      context.globalCompositeOperation = 'source-over'
      context.fillStyle = coverColor
      context.fillRect(0, 0, width, height)
      // The foil is generated locally; no images or cross-origin pixel reads.
      context.strokeStyle = 'rgba(255,255,255,.19)'
      context.lineWidth = 1
      for (let line = -height; line < width; line += 8) {
        context.beginPath()
        context.moveTo(line, 0)
        context.lineTo(line + height, height)
        context.stroke()
      }
      context.fillStyle = 'rgba(20,35,26,.1)'
      for (let index = 0; index < 700; index += 1) {
        const x = ((index * 73 + 19) % 997) / 997 * width
        const y = ((index * 137 + 47) % 991) / 991 * height
        context.fillRect(x, y, 1, 1)
      }
      context.fillStyle = 'rgba(21,36,27,.8)'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = '500 10px system-ui, sans-serif'
      context.fillText('A SMALL DISCOVERY', width / 2, height / 2 - 46)
      context.font = `500 ${Math.min(29, width / 12)}px Georgia, serif`
      const words = coverText.split(/\s+/)
      const lines: string[] = []
      let current = ''
      for (const word of words) {
        const next = current ? `${current} ${word}` : word
        if (current && context.measureText(next).width > width - 48) {
          lines.push(current)
          current = word
        } else current = next
      }
      if (current) lines.push(current)
      const visibleLines = lines.slice(0, 3)
      visibleLines.forEach((line, index) => context.fillText(line, width / 2, height / 2 + (index - (visibleLines.length - 1) / 2) * 30, width - 32))
      context.font = '400 10px system-ui, sans-serif'
      context.fillText('SCRATCH THE SURFACE', width / 2, height / 2 + 58)
      context.globalCompositeOperation = 'destination-out'
      context.lineCap = 'round'
      context.lineJoin = 'round'
      for (const stroke of strokesRef.current) {
        context.lineWidth = stroke.radius * Math.min(width, height) * 2
        context.beginPath()
        stroke.points.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x * width, point.y * height)
          else context.lineTo(point.x * width, point.y * height)
        })
        if (stroke.points.length === 1) {
          const point = stroke.points[0]
          context.lineTo(point.x * width + 0.01, point.y * height + 0.01)
        }
        context.stroke()
      }
      setReady(true)
    }
    drawRef.current = draw
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(stage)
    return () => {
      observer.disconnect()
      drawRef.current = () => {}
      pointerRef.current = null
    }
  }, [coverColor, coverText])

  function reveal() {
    if (revealedRef.current) return
    revealedRef.current = true
    const captured = pointerRef.current
    pointerRef.current = null
    if (captured !== null && canvasRef.current?.hasPointerCapture(captured)) canvasRef.current.releasePointerCapture(captured)
    setRevealed(true)
    callbackRef.current?.()
  }

  function checkCoverage(force = false) {
    if (!force && performance.now() - lastCheckRef.current < 140) return
    lastCheckRef.current = performance.now()
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || canvas.width === 0 || canvas.height === 0) return
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    let total = 0
    // Sample the same evenly spaced grid at every density and viewport size.
    for (let y = 0; y < 48; y += 1) {
      for (let x = 0; x < 64; x += 1) {
        const px = Math.min(canvas.width - 1, Math.floor((x + 0.5) / 64 * canvas.width))
        const py = Math.min(canvas.height - 1, Math.floor((y + 0.5) / 48 * canvas.height))
        if (pixels[(py * canvas.width + px) * 4 + 3] < 80) clear += 1
        total += 1
      }
    }
    if (clear / total >= target) reveal()
  }

  function point(event: PointerEvent<HTMLCanvasElement>): ScratchPoint {
    const bounds = event.currentTarget.getBoundingClientRect()
    return { x: (event.clientX - bounds.left) / Math.max(1, bounds.width), y: (event.clientY - bounds.top) / Math.max(1, bounds.height) }
  }

  function paint(event: PointerEvent<HTMLCanvasElement>, first = false) {
    const canvas = event.currentTarget
    const context = canvas.getContext('2d')
    if (!context) return
    const bounds = canvas.getBoundingClientRect()
    const next = point(event)
    if (first) strokesRef.current.push({ points: [], radius: brush / 2 / Math.max(1, Math.min(bounds.width, bounds.height)) })
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    if (!stroke) return
    const previous = stroke.points[stroke.points.length - 1] ?? next
    stroke.points.push(next)
    context.globalCompositeOperation = 'destination-out'
    context.lineWidth = stroke.radius * Math.min(bounds.width, bounds.height) * 2
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.beginPath()
    context.moveTo(previous.x * bounds.width, previous.y * bounds.height)
    context.lineTo(next.x * bounds.width + (first ? 0.01 : 0), next.y * bounds.height + (first ? 0.01 : 0))
    context.stroke()
    checkCoverage()
  }

  function endScratch(event: PointerEvent<HTMLCanvasElement>) {
    if (pointerRef.current !== event.pointerId) return
    pointerRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    checkCoverage(true)
  }

  function reset() {
    revealedRef.current = false
    pointerRef.current = null
    strokesRef.current = []
    drawRef.current()
    setRevealed(false)
  }

  return (
    <div className={`ac-scratch-reveal ${className}`.trim()} data-revealed={revealed} data-ready={ready} style={{ '--ac-scratch-cover': coverColor } as CSSProperties}>
      <div className="ac-scratch-stage" ref={stageRef}>
        <div className="ac-scratch-artwork" id={`${instanceId}-artwork`} aria-hidden={!revealed} ref={(element) => { if (element) element.inert = !revealed }}>
          {children}
        </div>
        <div className="ac-scratch-fallback" aria-hidden="true">{coverText}</div>
        <canvas
          className="ac-scratch-canvas"
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0 || revealedRef.current) return
            pointerRef.current = event.pointerId
            event.currentTarget.setPointerCapture(event.pointerId)
            paint(event, true)
          }}
          onPointerMove={(event) => { if (pointerRef.current === event.pointerId) paint(event) }}
          onPointerUp={endScratch}
          onPointerCancel={endScratch}
          onLostPointerCapture={endScratch}
        />
      </div>
      <div className="ac-scratch-footer">
        <span className="ac-scratch-label" aria-live="polite">{revealed ? 'Discovery complete' : label}</span>
        <button type="button" className="ac-scratch-button" aria-controls={`${instanceId}-artwork`} onClick={revealed ? reset : reveal}>
          {revealed ? 'Reset artwork' : 'Reveal artwork'}<span aria-hidden="true">{revealed ? '↺' : '↗'}</span>
        </button>
      </div>
    </div>
  )
}
