'use client';

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import './signal-funnel.css';

export interface SignalFunnelGate {
  id: string;
  label: string;
}

export interface SignalFunnelProps {
  /** One to five stages. Duplicate or empty ids are ignored. An empty array removes all stages. */
  gates?: readonly SignalFunnelGate[];
  enabledGateIds?: readonly string[];
  defaultEnabledGateIds?: readonly string[];
  onGatesChange?: (enabledIds: string[]) => void;
  inputLabel?: string;
  outputLabel?: string;
  accent?: string;
  /** Stops motion externally. The built-in pause control is disabled while true. */
  paused?: boolean;
  className?: string;
}

const DEFAULT_GATES: readonly SignalFunnelGate[] = [
  { id: 'redact', label: 'Redact' },
  { id: 'validate', label: 'Validate' },
  { id: 'encrypt', label: 'Encrypt' },
];

function noise(value: number) {
  const n = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return n - Math.floor(n);
}

/** An illustrative event pipeline. Stage switches alter the visualization; they do not process data. */
export function SignalFunnel({
  gates = DEFAULT_GATES,
  enabledGateIds,
  defaultEnabledGateIds,
  onGatesChange,
  inputLabel = 'Incoming events',
  outputLabel = 'Processed events',
  accent = '#7950f2',
  paused = false,
  className = '',
}: SignalFunnelProps) {
  const titleId = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const [localPaused, setLocalPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const validGates = useMemo(() => {
    const seen = new Set<string>();
    return gates.filter((gate) => {
      if (!gate.id.trim() || seen.has(gate.id)) return false;
      seen.add(gate.id);
      return true;
    }).slice(0, 5);
  }, [gates]);
  const [internalIds, setInternalIds] = useState<string[]>(() =>
    [...(defaultEnabledGateIds ?? validGates.map((gate) => gate.id))],
  );
  const ids = enabledGateIds ?? internalIds;
  const enabled = validGates.map((gate) => ids.includes(gate.id));
  const enabledKey = enabled.map((value) => value ? '1' : '0').join('');
  const enabledCount = enabled.filter(Boolean).length;
  const isPaused = paused || localPaused;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    setReady(true);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activeGates = [...enabledKey].map((value) => value === '1');
    let width = 0;
    let height = 0;
    let particleColor = accent;
    let inkColor = '#34372e';
    let inView = true;
    let frame: number | null = null;
    let lastTime: number | null = null;
    let lastPaint = 0;
    let disposed = false;

    function draw(time: number) {
      if (!context || !canvas || !width || !height) return;
      context.clearRect(0, 0, width, height);
      const vertical = width < 600;
      const point = (u: number, v: number): [number, number] => vertical
        ? [width * (0.5 + v * 0.9), height * (0.08 + u * 0.84)]
        : [width * (0.035 + u * 0.93), height * (0.5 + v)];
      const positions = activeGates.map((_, index) => activeGates.length === 1 ? 0.46 : 0.24 + index * 0.44 / (activeGates.length - 1));
      const anchors: [number, number][] = [[0, 0.34]];
      let radius = 0.34;
      positions.forEach((position, index) => {
        if (activeGates[index]) radius *= 0.55;
        anchors.push([position, radius]);
      });
      anchors.push([0.80, activeGates.every(Boolean) ? 0.001 : Math.max(0.026, radius * 0.5)]);
      const radiusAt = (u: number) => {
        for (let i = 1; i < anchors.length; i++) {
          if (u <= anchors[i][0]) {
            const [start, first] = anchors[i - 1];
            const [end, second] = anchors[i];
            return first + (second - first) * (u - start) / (end - start);
          }
        }
        return anchors[anchors.length - 1][1];
      };
      const columns = vertical ? 80 : Math.min(145, Math.max(90, Math.floor(width / 7)));
      const rows = vertical ? 65 : 72;
      context.fillStyle = particleColor;
      for (let col = 0; col < columns; col++) {
        const u = ((col / columns + time * 0.038) % 1) * 0.8;
        const cone = radiusAt(u);
        for (let row = 0; row < rows; row++) {
          const seed = col * rows + row;
          if (noise(seed * 1.37) < 0.14) continue;
          const band = (row / (rows - 1) - 0.5) * 2;
          const sway = Math.sin(u * 18 - time * 1.2 + row * 0.45) * 0.008;
          const v = band * cone + sway * (1 - u);
          const [x, y] = point(u, v);
          const edge = 1 - Math.pow(Math.abs(band), 2);
          context.globalAlpha = 0.18 + edge * 0.60 + noise(seed + Math.floor(time * 2)) * 0.13;
          const dot = noise(seed + 61) > 0.97 ? 2.2 : 1.35;
          if (noise(seed + 31) > 0.97) {
            context.fillRect(x - 2, y, 4, 1);
            context.fillRect(x, y - 2, 1, 4);
          } else {
            context.fillRect(Math.round(x), Math.round(y), dot, dot);
          }
        }
      }
      // A handful of rejected packets peel away at enabled gates.
      positions.forEach((position, index) => {
        if (!activeGates[index]) return;
        for (let packet = 0; packet < 5; packet++) {
          const phase = (time * 0.34 + packet / 5 + index * 0.17) % 1;
          const distance = phase * 0.14;
          const [x, y] = point(position - 0.008 - distance * 0.18, radiusAt(position) + distance);
          context.globalAlpha = (1 - phase) * 0.7;
          context.fillRect(x, y, 2.3, 2.3);
        }
      });
      context.globalAlpha = 1;
      // The outgoing rail is intentionally quieter than the incoming field.
      context.strokeStyle = inkColor;
      context.lineWidth = 1;
      context.beginPath();
      const [railX, railY] = point(0.8, 0);
      const [endX, endY] = point(1, 0);
      context.moveTo(railX, railY);
      context.lineTo(endX, endY);
      context.stroke();
      context.fillStyle = particleColor;
      for (let i = 0; i < 3; i++) {
        const u = 0.8 + ((time * 0.14 + i / 3) % 1) * 0.2;
        const [x, y] = point(u, 0);
        context.fillRect(x - 2.5, y - 2.5, 5, 5);
      }
      context.fillStyle = inkColor;
      context.fillRect(endX - 5, endY - 5, 10, 10);
    }

    function cancel() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastTime = null;
    }
    function canAnimate() {
      return !disposed && !isPaused && !media.matches && !document.hidden && inView;
    }
    function tick(now: number) {
      frame = null;
      if (!canAnimate()) { lastTime = null; return; }
      if (lastTime !== null) elapsedRef.current += Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (now - lastPaint >= 1000 / 30) {
        draw(elapsedRef.current);
        lastPaint = now;
      }
      frame = window.requestAnimationFrame(tick);
    }
    function synchronize() {
      cancel();
      draw(elapsedRef.current);
      if (canAnimate()) frame = window.requestAnimationFrame(tick);
    }
    function refreshColors() {
      particleColor = window.getComputedStyle(stage!).color || accent;
      inkColor = stage!.parentElement ? window.getComputedStyle(stage!.parentElement).color : '#34372e';
      draw(elapsedRef.current);
    }
    function resize() {
      if (!canvas || !stage) return;
      width = stage.clientWidth;
      height = stage.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      refreshColors();
    }
    function onPreferenceChange() {
      setReducedMotion(media.matches);
      synchronize();
    }
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    const intersectionObserver = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
      synchronize();
    }, { threshold: 0 }) : null;
    resizeObserver?.observe(stage);
    intersectionObserver?.observe(stage);
    const themeObserver = typeof MutationObserver === 'undefined' ? null : new MutationObserver(refreshColors);
    for (let ancestor: HTMLElement | null = stage; ancestor; ancestor = ancestor.parentElement) {
      themeObserver?.observe(ancestor, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    }
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', synchronize);
    media.addEventListener('change', onPreferenceChange);
    resize();
    onPreferenceChange();
    return () => {
      disposed = true;
      cancel();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', synchronize);
      media.removeEventListener('change', onPreferenceChange);
    };
  }, [accent, enabledKey, isPaused]);

  function toggleGate(id: string) {
    const next = validGates.filter((gate) => gate.id === id ? !ids.includes(gate.id) : ids.includes(gate.id)).map((gate) => gate.id);
    if (enabledGateIds === undefined) setInternalIds(next);
    onGatesChange?.(next);
  }

  return (
    <section className={`ac-signal-funnel ${className}`} aria-labelledby={titleId} style={{ '--ac-signal-accent': accent } as CSSProperties} data-motion={reducedMotion ? 'reduced' : isPaused ? 'paused' : 'running'}>
      <header className="ac-signal-funnel__header">
        <h2 id={titleId}><span aria-hidden="true">↳</span> Signal pipeline</h2>
        <button className="ac-signal-funnel__motion" type="button" disabled={reducedMotion || paused} onClick={() => setLocalPaused((value) => !value)}>
          <span aria-hidden="true">{isPaused || reducedMotion ? '▷' : 'Ⅱ'}</span>
          {reducedMotion ? 'Reduced motion' : paused ? 'Motion paused' : localPaused ? 'Play motion' : 'Pause motion'}
        </button>
      </header>
      <div className="ac-signal-funnel__stage" ref={stageRef} data-ready={ready || undefined} data-gates={validGates.length}>
        <div className="ac-signal-funnel__fallback" aria-hidden="true" />
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="ac-signal-funnel__input">{inputLabel}</span>
        {validGates.map((gate, index) => {
          const position = validGates.length === 1 ? 0.46 : 0.24 + index * 0.44 / (validGates.length - 1);
          return <div key={gate.id} className="ac-signal-funnel__gate" data-enabled={enabled[index]} data-order={index} style={{ '--gate-x': `${(0.035 + position * 0.93) * 100}%`, '--gate-y': `${(0.08 + position * 0.84) * 100}%` } as CSSProperties}>
            <span className="ac-signal-funnel__gate-line" aria-hidden="true" />
            <button type="button" aria-pressed={enabled[index]} onClick={() => toggleGate(gate.id)} title={`${enabled[index] ? 'Bypass' : 'Enable'} ${gate.label}`}>
              <span className="ac-signal-funnel__gate-number" aria-hidden="true">0{index + 1}</span>
              <span className="ac-signal-funnel__gate-label">{gate.label}</span>
              <span className="ac-signal-funnel__gate-check" aria-hidden="true">{enabled[index] ? '✓' : '−'}</span>
            </button>
          </div>;
        })}
        <span className="ac-signal-funnel__output">{outputLabel}</span>
        {enabledCount > 0 && <span className="ac-signal-funnel__removed" aria-hidden="true"><span /> Filtered</span>}
      </div>
      <footer className="ac-signal-funnel__footer">
        <span><i aria-hidden="true" />{enabledCount} / {validGates.length} stages enabled</span>
        {validGates.length > 0 && <span>Toggle a stage to change the flow</span>}
      </footer>
      <span className="ac-signal-funnel__sr" role="status">{enabledCount} of {validGates.length} stages enabled. {validGates.map((gate, index) => `${gate.label}: ${enabled[index] ? 'enabled' : 'bypassed'}`).join('. ')}. Illustrative event flow.</span>
    </section>
  );
}
