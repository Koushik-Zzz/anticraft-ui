'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import './particle-text.css';

export interface ParticleTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  /** Total reveal time in seconds, clamped to 1–12. */
  duration?: number;
  /** Maximum font size in pixels. The text also fits its container. */
  fontSize?: number;
  particleCount?: number;
  paused?: boolean;
  showControls?: boolean;
  className?: string;
}

export interface ParticleTextGridProps {
  children: ReactNode;
  paused?: boolean;
  showControls?: boolean;
  className?: string;
}

/** A recessed, drifting grid with rounded hover cells behind ordinary content. */
export function ParticleTextGrid({ children, paused = false, showControls = true, className = '' }: ParticleTextGridProps) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<{ sync: () => void } | null>(null);
  const pauseGate = useRef(paused);
  const [manualPaused, setManualPaused] = useState(false);
  const [activity, setActivity] = useState({ running: false, reduced: false, available: false });

  useEffect(() => {
    const element = root.current;
    const field = canvas.current;
    const ctx = field?.getContext('2d');
    if (!element || !field || !ctx) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let time = 0;
    let previous: number | null = null;
    let lastPaint = -Infinity;
    let sincePaint = 0;
    let frame: number | null = null;
    let visible = typeof IntersectionObserver === 'undefined';
    let running = false;
    let disposed = false;
    let surface = '#1e1e1e';
    let lineColor = '#8a8a8a';
    let pointer: { x: number; y: number } | null = null;
    const wake = new Map<string, number>();
    type Point = { x: number; y: number };
    type Cell = { points: Point[]; amount: number; fade: number; radius: number };

    const depth = (x: number) => .55 + .45 * Math.min(1, Math.abs(x / width * 2 - 1)) ** 1.6;
    const fade = (x: number) => .025 + .975 * Math.min(1, Math.abs(x / width * 2 - 1)) ** 2;
    const project = (x: number, row: number, step: number): Point => ({ x, y: height * .43 + row * step * depth(x) });
    function polygon(points: Point[]) {
      ctx!.beginPath();
      points.forEach((point, index) => index ? ctx!.lineTo(point.x, point.y) : ctx!.moveTo(point.x, point.y));
      ctx!.closePath();
    }
    function rounded(points: Point[], radius: number) {
      ctx!.beginPath();
      points.forEach((point, index) => {
        const before = points[(index + 3) % 4];
        const after = points[(index + 1) % 4];
        const a = Math.min(.4, radius / Math.max(1, Math.hypot(before.x - point.x, before.y - point.y)));
        const b = Math.min(.4, radius / Math.max(1, Math.hypot(after.x - point.x, after.y - point.y)));
        const start = { x: point.x + (before.x - point.x) * a, y: point.y + (before.y - point.y) * a };
        const end = { x: point.x + (after.x - point.x) * b, y: point.y + (after.y - point.y) * b };
        if (index) ctx!.lineTo(start.x, start.y); else ctx!.moveTo(start.x, start.y);
        ctx!.quadraticCurveTo(point.x, point.y, end.x, end.y);
      });
      ctx!.closePath();
    }
    function draw(delta = 0) {
      if (!width || !height) return;
      const step = Math.max(42, Math.min(64, width / 24));
      const drift = time * step / 2.8;
      const first = Math.floor(-drift / step) - 1;
      const last = Math.ceil((width - drift) / step) + 1;
      const rows = Math.ceil(height / step);
      const cells: Cell[] = [];
      const keys = new Set<string>();
      let hovered = 0;
      let idle = 0;
      ctx!.clearRect(0, 0, width, height);
      ctx!.lineWidth = .8;
      ctx!.strokeStyle = lineColor;
      // Columns remain straight. Only the row projection compresses into depth.
      for (let column = first; column <= last; column++) {
        const x = column * step + drift;
        ctx!.globalAlpha = fade(x) * .105;
        ctx!.beginPath(); ctx!.moveTo(x, 0); ctx!.lineTo(x, height); ctx!.stroke();
      }
      for (let row = -rows; row <= rows; row++) {
        for (let x = 0; x < width; x += 16) {
          const a = project(x, row, step);
          const b = project(Math.min(width, x + 16), row, step);
          ctx!.globalAlpha = fade(x + 8) * .105;
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
        }
      }
      for (let column = first; column < last; column++) for (let row = -rows; row < rows; row++) {
        const x = column * step + drift;
        const center = project(x + step / 2, row + .5, step);
        if (center.y < -step || center.y > height + step) continue;
        const key = `${column}:${row}`;
        keys.add(key);
        const distance = pointer ? Math.hypot((center.x - pointer.x) / step, (center.y - pointer.y) / (step * depth(center.x))) : Infinity;
        const target = Math.max(0, 1 - distance / 1.8);
        const old = wake.get(key) || 0;
        const value = old + (target - old) * (1 - Math.exp(-delta * (target > old ? 15 : 4)));
        if (value > .004) wake.set(key, value); else wake.delete(key);
        if (value > .1) hovered++;
        const seed = noise(column * 37 + row * 101);
        const period = 7 + noise(column * 13 + row * 71) * 7;
        const cycle = (time + seed * period) % period;
        const pulse = seed > .92 && cycle < 2.8 ? Math.sin(cycle / 2.8 * Math.PI) ** 2 * .85 : 0;
        if (pulse > .1) idle++;
        const amount = Math.max(value * 1.6, pulse);
        if (amount < .015) continue;
        const points = [project(x, row, step), project(x + step, row, step), project(x + step, row + 1, step), project(x, row + 1, step)];
        cells.push({ points, amount, fade: fade(center.x), radius: Math.min(step, step * depth(center.x)) * .24 * Math.min(1, amount) });
      }
      for (const key of wake.keys()) if (!keys.has(key)) wake.delete(key);
      // The lit space between rounded dark interiors creates the small stars
      // at neighboring corners, rather than floating a pill over the grid.
      for (const cell of cells) {
        polygon(cell.points); ctx!.globalAlpha = 1; ctx!.fillStyle = surface; ctx!.fill();
        ctx!.globalAlpha = Math.min(.7, cell.fade) * .22 * Math.min(1, cell.amount); ctx!.fillStyle = lineColor; ctx!.fill();
        rounded(cell.points, cell.radius); ctx!.globalAlpha = 1; ctx!.fillStyle = surface; ctx!.fill();
      }
      for (const cell of cells) {
        rounded(cell.points, cell.radius); ctx!.globalAlpha = cell.fade * .105 + Math.min(.65, cell.fade) * .1 * Math.min(1, cell.amount); ctx!.strokeStyle = lineColor; ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
      field!.dataset.offset = (drift % step).toFixed(3);
      field!.dataset.hoverCells = String(hovered);
      field!.dataset.idleCells = String(idle);
      field!.dataset.pointerActive = String(Boolean(pointer));
    }
    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = null;
      sincePaint = 0;
    }
    function tick(now: number) {
      frame = null;
      if (!running || disposed) return;
      const delta = previous === null ? 0 : clamp((now - previous) / 1000, 0, .05);
      previous = now;
      time += delta;
      sincePaint += delta;
      if (now - lastPaint >= 1000 / 30) { draw(sincePaint); sincePaint = 0; lastPaint = now; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (disposed) return;
      running = visible && !document.hidden && !media.matches && !pauseGate.current && width > 0 && height > 0;
      if (!running) { stop(); pointer = null; wake.clear(); draw(); }
      else if (frame === null) frame = requestAnimationFrame(tick);
      setActivity(value => value.running === running && value.reduced === media.matches && value.available ? value : { running, reduced: media.matches, available: true });
    }
    function resize() {
      width = element!.clientWidth;
      height = element!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      field!.width = Math.round(width * ratio);
      field!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const style = getComputedStyle(element!);
      surface = style.getPropertyValue('--ac-particle-grid-surface').trim() || '#1e1e1e';
      lineColor = style.getPropertyValue('--ac-particle-grid-line').trim() || '#8a8a8a';
      pointer = null; wake.clear();
      draw(); sync();
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch' || !running) { pointer = null; return; }
      const rect = element!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer = { x: (event.clientX - rect.left) * width / rect.width, y: (event.clientY - rect.top) * height / rect.height };
    }
    const leave = () => { pointer = null; };
    const scene = { sync };
    controller.current = scene;
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => { if (entry) { visible = entry.isIntersecting; sync(); } });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    intersection?.observe(element);
    observer?.observe(element);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', resize);
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);
    resize();
    return () => {
      disposed = true; running = false; stop();
      observer?.disconnect(); intersection?.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', resize);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointercancel', leave);
      if (controller.current === scene) controller.current = null;
    };
  }, []);

  useEffect(() => { pauseGate.current = paused || manualPaused; controller.current?.sync(); }, [paused, manualPaused]);

  return <div ref={root} className={`ac-particle-text-grid ${className}`.trim()} data-running={activity.running}>
    <canvas ref={canvas} className="ac-particle-grid-canvas" aria-hidden="true"/>
    <div className="ac-particle-grid-content">{children}</div>
    {showControls && <button type="button" className="ac-particle-grid-motion" disabled={paused || activity.reduced || !activity.available} onClick={() => setManualPaused(value => !value)}><span aria-hidden="true">{manualPaused || paused || activity.reduced ? '▷' : 'Ⅱ'}</span>{activity.reduced ? 'Grid motion reduced' : paused ? 'Grid paused' : manualPaused ? 'Play grid' : 'Pause grid'}</button>}
  </div>;
}

type Phase = 'waiting' | 'scatter' | 'gather' | 'resolve' | 'complete';
type Playback = { sync: (active: boolean, reduced: boolean) => void; replay: () => void };
type Particle = { x: number; y: number; dx: number; dy: number; seed: number; radius: number };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const bounded = (value: number, fallback: number, low: number, high: number) => Number.isFinite(value) ? clamp(value, low, high) : fallback;
const noise = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** A cloud of particles gathers into real, accessible typography. */
export function ParticleText({ text, as: Tag = 'h2', duration = 4.2, fontSize = 180, particleCount = 3200, paused = false, showControls = true, className = '' }: ParticleTextProps) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const playback = useRef<Playback | null>(null);
  const gate = useRef({ active: false, reduced: false });
  const [phase, setPhase] = useState<Phase>('waiting');
  const [available, setAvailable] = useState(false);
  const [manualPaused, setManualPaused] = useState(false);
  const [activity, setActivity] = useState({ ready: false, visible: false, foreground: true, reduced: false });
  const seconds = bounded(duration, 4.2, 1, 12);
  const maximum = bounded(fontSize, 180, 24, 320);
  const count = Math.round(bounded(particleCount, 3200, 300, 6000));
  const hasText = Boolean(text.trim());
  const active = activity.ready && activity.visible && activity.foreground && !activity.reduced && !paused && !manualPaused;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setActivity(value => ({ ...value, ready: true, foreground: !document.hidden, reduced: media.matches }));
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (entry) setActivity(value => ({ ...value, visible: entry.isIntersecting }));
    });
    observer?.observe(element);
    if (!observer) setActivity(value => ({ ...value, visible: true }));
    sync();
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => { observer?.disconnect(); media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  useEffect(() => {
    setAvailable(false);
    setPhase('waiting');
    const element = stage.current;
    const heading = title.current;
    const field = canvas.current;
    if (!element || !heading || !field || !hasText) { setPhase('complete'); return; }
    const ctx = field.getContext('2d');
    const mask = document.createElement('canvas');
    const ink = mask.getContext('2d', { willReadFrequently: true });
    if (!ctx || !ink) { setPhase('complete'); return; }
    let width = 0;
    let height = 0;
    let elapsed = 0;
    let previous: number | null = null;
    let frame: number | null = null;
    let particles: Particle[] = [];
    let disposed = false;
    let prepared = false;
    let current: Phase = 'waiting';

    function updatePhase(next: Phase) {
      if (current === next) return;
      current = next;
      setPhase(next);
    }
    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = null;
    }
    function finish() {
      stop();
      elapsed = seconds;
      heading!.style.opacity = '1';
      ctx!.clearRect(0, 0, width, height);
      field!.style.opacity = '0';
      field!.dataset.progress = '1.000';
      updatePhase('complete');
    }
    function paint() {
      const progress = clamp(elapsed / seconds, 0, 1);
      if (progress >= 1) { finish(); return; }
      updatePhase(progress < .18 ? 'scatter' : progress < .82 ? 'gather' : 'resolve');
      const solid = clamp((progress - .82) / .18, 0, 1);
      heading!.style.opacity = String(solid);
      field!.style.opacity = String(1 - solid);
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = getComputedStyle(heading!).color;
      for (const dot of particles) {
        const local = clamp((progress - .12 - dot.seed * .12) / .61, 0, 1);
        const gather = 1 - (1 - local) ** 4;
        const drift = 1 - gather;
        const x = dot.x + dot.dx * drift + Math.sin(elapsed * 1.6 + dot.seed * 24) * 9 * drift;
        const y = dot.y + dot.dy * drift + Math.cos(elapsed * 1.2 + dot.seed * 31) * 7 * drift;
        ctx!.globalAlpha = Math.max(.2, Math.min(1, progress / .1)) * (.45 + dot.seed * .5);
        ctx!.beginPath();
        ctx!.arc(x, y, dot.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      field!.dataset.progress = progress.toFixed(3);
    }
    function tick(now: number) {
      frame = null;
      if (disposed || !gate.current.active || gate.current.reduced || !prepared) return;
      if (previous !== null) elapsed += clamp((now - previous) / 1000, 0, .05);
      previous = now;
      paint();
      if (elapsed < seconds) frame = requestAnimationFrame(tick);
    }
    function start() {
      if (disposed || !prepared || !gate.current.active || gate.current.reduced || elapsed >= seconds || frame !== null) return;
      frame = requestAnimationFrame(tick);
    }
    function prepare() {
      if (disposed) return;
      stop();
      width = element!.clientWidth;
      if (width <= 0) return;
      const style = getComputedStyle(heading!);
      // Measure at a fixed size, then fit every explicit line to the container.
      ink!.font = `${style.fontWeight} 100px ${style.fontFamily}`;
      const lines = text.split('\n');
      const widest = Math.max(1, ...lines.map(line => ink!.measureText(line).width));
      const size = Math.min(maximum, width * .19, Math.max(.5, (width - 16) / widest * 100));
      heading!.style.fontSize = `${size}px`;
      height = element!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      field!.width = Math.round(width * ratio);
      field!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      // A CSS-pixel mask keeps the sampled particle count independent of DPR.
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      ink!.clearRect(0, 0, width, height);
      ink!.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      ink!.fillStyle = '#fff';
      ink!.textAlign = 'center';
      ink!.textBaseline = 'alphabetic';
      const stageRect = element!.getBoundingClientRect();
      const scaleY = stageRect.height / height || 1;
      for (const line of Array.from(heading!.children)) {
        const rect = line.getBoundingClientRect();
        const metrics = ink!.measureText(line.textContent || ' ');
        const ascent = metrics.fontBoundingBoxAscent ?? size * .9;
        const descent = metrics.fontBoundingBoxDescent ?? size * .23;
        const baseline = (rect.top - stageRect.top) / scaleY + (rect.height / scaleY - ascent - descent) / 2 + ascent;
        ink!.fillText(line.textContent || '', width / 2, baseline);
      }
      try {
        const pixels = ink!.getImageData(0, 0, mask.width, mask.height).data;
        const points: { x: number; y: number }[] = [];
        const step = Math.max(1.5, size / 72);
        for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) {
          if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] > 120) points.push({ x, y });
        }
        const total = Math.min(count, points.length);
        particles = Array.from({ length: total }, (_, index) => {
          const point = points[Math.floor(index * points.length / total)];
          const seed = noise(index + 1);
          return { x: point.x, y: point.y, dx: (noise(index + 17) - .5) * width * .72, dy: (noise(index + 47) - .5) * height * 1.3, seed, radius: .55 + seed * .6 };
        });
      } catch { particles = []; }
      prepared = true;
      setAvailable(particles.length > 0);
      field!.dataset.particles = String(particles.length);
      if (!particles.length || gate.current.reduced) { finish(); return; }
      if (elapsed >= seconds) { finish(); return; }
      // Retain readable HTML until the first visible animation frame.
      if (gate.current.active || elapsed > 0) paint();
      start();
    }
    const controls: Playback = {
      sync(allowed, reduced) {
        if (reduced) { finish(); return; }
        if (allowed) start(); else stop();
      },
      replay() {
        if (gate.current.reduced || !particles.length) return;
        stop();
        elapsed = 0;
        field!.dataset.progress = '0.000';
        if (gate.current.active) paint();
        else {
          heading!.style.opacity = '1';
          field!.style.opacity = '0';
          updatePhase('waiting');
        }
        start();
      },
    };
    playback.current = controls;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(prepare);
    observer?.observe(element);
    window.addEventListener('resize', prepare);
    prepare();
    void document.fonts?.ready.then(() => { if (!disposed) prepare(); });
    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      window.removeEventListener('resize', prepare);
      if (playback.current === controls) playback.current = null;
      heading!.style.removeProperty('opacity');
      heading!.style.removeProperty('font-size');
      field!.style.removeProperty('opacity');
    };
  }, [text, hasText, seconds, maximum, count, Tag]);

  useEffect(() => {
    gate.current = { active, reduced: activity.reduced };
    playback.current?.sync(active, activity.reduced);
  }, [active, activity.reduced, text, seconds, maximum, count, Tag]);

  const unavailable = activity.reduced || !hasText || !available;
  return <div ref={root} className={`ac-particle-text ${className}`.trim()} style={{ '--ac-particle-max': `${maximum}px` } as CSSProperties} data-phase={phase} data-running={active && phase !== 'complete' && phase !== 'waiting'}>
    <div ref={stage} className="ac-particle-text-stage">
      {hasText && <Tag ref={title as Ref<HTMLHeadingElement>} className="ac-particle-text-title">{text.split('\n').map((line, index) => <span key={index}>{line || '\u00a0'}</span>)}</Tag>}
      <canvas ref={canvas} className="ac-particle-text-canvas" aria-hidden="true"/>
    </div>
    {showControls && <div className="ac-particle-text-controls">
      <button type="button" disabled={unavailable} onClick={() => playback.current?.replay()}><span aria-hidden="true">↻</span> Replay animation</button>
      <button type="button" disabled={unavailable || paused || phase === 'complete'} onClick={() => setManualPaused(value => !value)}><span aria-hidden="true">{manualPaused || paused || activity.reduced ? '▷' : 'Ⅱ'}</span>{activity.reduced ? 'Motion reduced' : paused ? 'Motion paused' : manualPaused ? 'Play motion' : 'Pause motion'}</button>
    </div>}
  </div>;
}
