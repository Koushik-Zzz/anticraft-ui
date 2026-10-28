'use client'

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import './orbit-network.css'

export interface OrbitNetworkNode {
  id: string
  label: string
  /** Decorative artwork. The button receives its accessible name from label. */
  symbol?: ReactNode
}

export interface OrbitNetworkProps {
  nodes?: OrbitNetworkNode[]
  center?: ReactNode
  centerLabel?: string
  defaultSelectedId?: string
  onNodeChange?: (id: string) => void
  /** External pause. The visitor can also pause from the component's own control. */
  paused?: boolean
  /** Animation multiplier, clamped between 0.2 and 2. */
  speed?: number
  color?: string
  className?: string
}

const paths = [
  'M5 7c0-4 14-4 14 0s-14 4-14 0m0 0v10c0 4 14 4 14 0V7M5 12c0 4 14 4 14 0',
  'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  'm4 5 6 7-6 7m7-14 6 7-6 7m9-14v14',
  'M4 19V9m5 10V4m6 15v-7m5 7V7',
  'm12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z',
  'M4 7h16M4 12h16M4 17h16M8 4v6m8-1v6m-7-1v6',
  'M12 3v6m0 6v6M3 12h6m6 0h6M6 6l4 4m4 4 4 4M6 18l4-4m4-4 4-4',
  'm12 3 8 4v10l-8 4-8-4V7l8-4Zm0 0v18M4 7l8 5 8-5',
]

function SymbolMark({ index }: { index: number }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true"><path d={paths[index % paths.length]} /></svg>
}

const defaultNodes: OrbitNetworkNode[] = ['Database', 'Storage', 'Queue', 'Analytics', 'Search', 'Automation', 'Events', 'Compute'].map((label, index) => ({
  id: label.toLowerCase(), label, symbol: <SymbolMark index={index} />,
}))

function point(index: number, count: number, radius: number) {
  const angle = (index / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2
  return { x: 250 + Math.cos(angle) * radius, y: 250 + Math.sin(angle) * radius }
}

/** A rotating integration map with an ASCII particle field and inbound packets. */
export function OrbitNetwork({ nodes = defaultNodes, center, centerLabel = 'Workspace', defaultSelectedId, onNodeChange, paused = false, speed = 1, color = '#5d43ee', className = '' }: OrbitNetworkProps) {
  const captionId = useId()
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const packets = useRef<(SVGRectElement | null)[]>([])
  const phase = useRef(0)
  const [selection, setSelection] = useState(defaultSelectedId)
  const [manualPaused, setManualPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const safeNodes = useMemo(() => {
    const seen = new Set<string>()
    return nodes.filter(node => {
      if (!node.id || !node.label || seen.has(node.id)) return false
      seen.add(node.id)
      return true
    }).slice(0, 12)
  }, [nodes])
  const selected = safeNodes.find(node => node.id === selection) ?? safeNodes[0]
  const safeSpeed = Number.isFinite(speed) ? Math.max(0.2, Math.min(2, speed)) : 1
  const count = safeNodes.length

  useEffect(() => {
    const element = stage.current
    const surface = canvas.current
    if (!element || !surface) return
    const context = surface.getContext('2d')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame: number | null = null
    let lastTime = 0
    let lastDraw = -Infinity
    let visible = typeof IntersectionObserver === 'undefined'
    let alive = true
    let scale = 1
    let particleColor = color
    const canRun = () => alive && count > 0 && !paused && !manualPaused && !interacting && !motion.matches && visible && !document.hidden

    function draw(time: number) {
      const angle = time * 2.5
      element!.style.setProperty('--ac-orbit-turn', `${angle.toFixed(4)}deg`)
      for (let index = 0; index < count * 2; index++) {
        const spoke = Math.floor(index / 2)
        const offset = index % 2
        const progress = (time / (3.2 + spoke % 3 * 0.4) + spoke * 0.17 + offset * 0.5) % 1
        const position = point(spoke, count, 174 * (1 - progress))
        const packet = packets.current[index]
        packet?.setAttribute('x', (position.x - 2).toFixed(3))
        packet?.setAttribute('y', (position.y - 2).toFixed(3))
        packet?.setAttribute('opacity', progress < 0.04 || progress > 0.86 ? '0' : offset ? '0.45' : '1')
      }
      if (!context) return
      context.setTransform(scale, 0, 0, scale, 0, 0)
      context.clearRect(0, 0, 500, 500)
      context.fillStyle = particleColor
      context.font = '6px ui-monospace, SFMono-Regular, Consolas, monospace'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      const flicker = Math.floor(time * 4)
      for (let row = 0; row < 65; row++) {
        for (let col = 0; col < 65; col++) {
          const x = 10 + col * 7.5
          const y = 10 + row * 7.5
          const dx = x - 250
          const dy = y - 250
          const distance = Math.hypot(dx, dy)
          const seed = (col * 31 + row * 47 + col * row * 7) % 101
          const annulus = Math.max(0, 1 - Math.abs(distance - 158) / 74)
          const wave = 0.64 + 0.36 * Math.sin(Math.atan2(dy, dx) * 5 + distance / 28 - time * 0.85)
          const density = annulus * wave
          if (distance < 82 || distance > 240) continue
          context.globalAlpha = distance > 223 ? 0.09 : Math.min(0.78, 0.1 + density * 0.64)
          if (density > 0.28 && seed % 4 !== 0) {
            const glyph = ['+', '×', ':', '·', '+', '×'][(seed + flicker + Math.floor(distance / 18)) % 6]
            context.fillText(glyph, x, y)
          } else context.fillRect(x, y, seed % 5 === 0 ? 1 : 0.7, seed % 5 === 0 ? 1 : 0.7)
        }
      }
      context.globalAlpha = 1
    }

    function tick(timestamp: number) {
      frame = null
      if (!canRun()) return
      if (lastTime) phase.current += Math.min(64, timestamp - lastTime) / 1000 * safeSpeed
      lastTime = timestamp
      if (timestamp - lastDraw >= 32) {
        draw(phase.current)
        lastDraw = timestamp
      }
      frame = requestAnimationFrame(tick)
    }

    function sync() {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
      lastTime = 0
      draw(phase.current)
      if (canRun()) frame = requestAnimationFrame(tick)
    }

    function resize() {
      const width = element!.getBoundingClientRect().width || 500
      const pixels = Math.max(1, Math.round(width * Math.min(window.devicePixelRatio || 1, 2)))
      surface!.width = pixels
      surface!.height = pixels
      scale = pixels / 500
      particleColor = window.getComputedStyle(surface!).color
      draw(phase.current)
    }

    function preferenceChanged() { setReducedMotion(motion.matches); sync() }
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting)
      sync()
    }, { threshold: 0.05 })
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    intersection?.observe(element)
    resizeObserver?.observe(element)
    motion.addEventListener('change', preferenceChanged)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('resize', resize)
    setReducedMotion(motion.matches)
    resize()
    sync()
    return () => {
      alive = false
      if (frame !== null) cancelAnimationFrame(frame)
      intersection?.disconnect()
      resizeObserver?.disconnect()
      motion.removeEventListener('change', preferenceChanged)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('resize', resize)
    }
  }, [color, count, safeSpeed, paused, manualPaused, interacting])

  return <section className={`ac-orbit-network ${className}`.trim()} aria-label={`${centerLabel} integration network`} style={{ '--ac-orbit-color': color } as CSSProperties}>
    <div className="ac-orbit-network-stage" ref={stage}>
      <canvas ref={canvas} className="ac-orbit-network-field" aria-hidden="true" />
      <svg className="ac-orbit-network-geometry" viewBox="0 0 500 500" fill="none" aria-hidden="true">
        <g className="ac-orbit-network-rotor">
          <circle cx="250" cy="250" r="183" className="ac-orbit-network-ring" />
          {count > 1 && <><polygon points={safeNodes.map((_, index) => { const p = point(index, count, 174); return `${p.x.toFixed(3)},${p.y.toFixed(3)}` }).join(' ')} className="ac-orbit-network-polygon" /><polygon points={safeNodes.map((_, index) => { const p = point(index, count, 96); return `${p.x.toFixed(3)},${p.y.toFixed(3)}` }).join(' ')} className="ac-orbit-network-polygon" /></>}
          {safeNodes.map((node, index) => {
            const outer = point(index, count, 174)
            const inner = point(index, count, 96)
            return <g key={node.id}>
              <line x1="250" y1="250" x2={outer.x} y2={outer.y} className={`ac-orbit-network-spoke${selected?.id === node.id ? ' is-selected' : ''}`} />
              <rect x={inner.x - 3} y={inner.y - 3} width="6" height="6" className="ac-orbit-network-junction" />
              {[0, 1].map(offset => { const initial = point(index, count, offset ? 115 : 59); return <rect key={offset} ref={value => { packets.current[index * 2 + offset] = value }} x={initial.x - 2} y={initial.y - 2} width="4" height="4" className="ac-orbit-network-packet" /> })}
            </g>
          })}
        </g>
      </svg>
      <div className="ac-orbit-network-nodes ac-orbit-network-rotor">
        {safeNodes.map((node, index) => {
          const p = point(index, count, 174)
          return <button key={node.id} type="button" className="ac-orbit-network-node" style={{ left: `${p.x / 5}%`, top: `${p.y / 5}%` }} aria-label={node.label} aria-pressed={selected?.id === node.id} aria-describedby={captionId}
            onPointerEnter={() => setInteracting(true)} onPointerLeave={() => { if (!stage.current?.contains(document.activeElement)) setInteracting(false) }} onFocus={() => setInteracting(true)} onBlur={() => setInteracting(false)}
            onClick={() => { setSelection(node.id); onNodeChange?.(node.id) }}>
            <span className="ac-orbit-network-tile" aria-hidden="true">{node.symbol ?? node.label.slice(0, 1)}</span>
          </button>
        })}
      </div>
      <div className="ac-orbit-network-center" role="img" aria-label={centerLabel}>{center ?? <SymbolMark index={6} />}</div>
    </div>
    <footer className="ac-orbit-network-footer">
      <p id={captionId} aria-live="polite" aria-atomic="true">{selected ? <><span className="ac-orbit-network-status" aria-hidden="true" /><strong>{selected.label}</strong><span>→ {centerLabel}</span></> : 'No connections configured.'}</p>
      <button type="button" className="ac-orbit-network-pause" disabled={reducedMotion || paused} onClick={() => setManualPaused(value => !value)}>
        <span aria-hidden="true">{reducedMotion || paused || manualPaused ? '▶' : 'Ⅱ'}</span>{reducedMotion ? 'Motion reduced' : paused ? 'Motion paused' : manualPaused ? 'Resume motion' : 'Pause motion'}
      </button>
    </footer>
  </section>
}
