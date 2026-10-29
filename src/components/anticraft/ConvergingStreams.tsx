'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './converging-streams.css';

export interface ConvergingStreamsProps {
  /** Content in the quiet space between the streams. */
  children: ReactNode;
  colors?: string[];
  /** Seconds per packet journey. Clamped to 2–30. */
  duration?: number;
  direction?: 'inward' | 'outward';
  defaultPaused?: boolean;
  /** External pause; the built-in control remains available when false. */
  paused?: boolean;
  tone?: 'dark' | 'light';
  /** A pointer-following ASCII field. Disabled automatically for reduced motion and touch. */
  interactive?: boolean;
  className?: string;
}

const palette = ['#b8abe5', '#c5d3e9', '#d5bb78', '#d4a9cd'];

/** Curved signal paths frame arbitrary content without intercepting its controls. */
export function ConvergingStreams({ children, colors = palette, duration = 8, direction = 'inward', defaultPaused = false, paused: externalPaused = false, tone = 'dark', interactive = true, className = '' }: ConvergingStreamsProps) {
  const root = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(defaultPaused);
  const [activity, setActivity] = useState({ ready: false, visible: true, foreground: true, reduced: false });
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setActivity(value => ({ ...value, ready: true, foreground: !document.hidden, reduced: media.matches }));
    sync();
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (entry) setActivity(value => ({ ...value, visible: entry.isIntersecting }));
    });
    observer?.observe(element);
    return () => { observer?.disconnect(); media.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); };
  }, []);

  const running = activity.ready && activity.visible && activity.foreground && !activity.reduced && !paused && !externalPaused;
  useEffect(() => {
    const element = root.current;
    const canvas = field.current;
    if (!interactive || !element || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let previous = 0;
    let lastPaint = -Infinity;
    let time = 0;
    let opacity = 0;
    let inside = false;
    let disposed = false;
    let target = { x: 0, y: 0 };
    let cursor = { x: 0, y: 0 };
    let wake = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0 };
    const glyphs = ' .:-=+x*o%#@';

    function clear() {
      context!.clearRect(0, 0, width, height);
      canvas!.dataset.pointerActive = 'false';
    }
    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previous = 0;
      inside = false;
      opacity = 0;
      velocity = { x: 0, y: 0 };
      clear();
    }
    function draw() {
      context!.clearRect(0, 0, width, height);
      const radius = Math.min(310, Math.max(160, width * .29));
      const verticalRadius = radius * .72;
      const step = 10;
      const startX = Math.max(0, Math.floor(Math.min(cursor.x - radius, wake.x - radius * .8) / step)) * step + step / 2;
      const endX = Math.min(width, Math.max(cursor.x + radius, wake.x + radius * .8));
      const startY = Math.max(0, Math.floor(Math.min(cursor.y - verticalRadius, wake.y - verticalRadius * .8) / step)) * step + step / 2;
      const endY = Math.min(height, Math.max(cursor.y + verticalRadius, wake.y + verticalRadius * .8));
      context!.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
      context!.textAlign = 'center';
      context!.textBaseline = 'middle';
      context!.fillStyle = tone === 'light' ? '#65508c' : '#c9b8f5';
      for (let y = startY; y < endY; y += step) {
        for (let x = startX; x < endX; x += step) {
          const distance = Math.hypot((x - cursor.x) / radius, (y - cursor.y) / verticalRadius);
          const wakeDistance = Math.hypot((x - wake.x) / (radius * .8), (y - wake.y) / (verticalRadius * .8));
          const edge = Math.min(1, Math.max(0, 1 - distance) ** 1.5 + .38 * Math.max(0, 1 - wakeDistance) ** 1.7);
          if (edge <= 0) continue;

          // Sample a flowing surface in canvas space: moving the pointer reveals
          // different folds, rather than dragging a radial pattern with it.
          const flowX = x * .012 - time * .28;
          const flowY = y * .012 + time * .16;
          const u = flowX + .65 * Math.sin(flowY * 1.7 + time * .19) + .45 * Math.sin((flowX + flowY) * .9 - time * .14) + velocity.x * .0007 * edge;
          const v = flowY + .65 * Math.cos(flowX * 1.4 - time * .2) + .3 * Math.sin((flowY - flowX) * 1.1 + time * .2) + velocity.y * .0007 * edge;
          const a = Math.sin(u * 1.8 + v * .65);
          const b = Math.sin(v * 2.1 - u * .6 + time * .22);
          const c = Math.sin((u + v) * 1.3 - time * .14);
          const ridgeA = Math.max(0, 1 - Math.abs(a + b * .58)) ** 4;
          const ridgeB = Math.max(0, 1 - Math.abs(b - c * .68)) ** 5;
          const broad = .5 + .5 * Math.sin(u * 1.1 + Math.sin(v * .9) + time * .15);
          const light = Math.min(1, .12 + broad * .2 + ridgeA * .7 + ridgeB * .5);
          const value = Math.min(1, edge * (.2 + light * .85));
          context!.globalAlpha = opacity * edge * (.14 + light * .64);
          const glyph = glyphs[Math.max(1, Math.min(glyphs.length - 1, Math.floor(value * glyphs.length)))];
          context!.fillText(glyph, x, y);
        }
      }
      context!.globalAlpha = 1;
    }
    function tick(now: number) {
      frame = null;
      if (disposed || !running) return;
      const delta = previous ? Math.max(.001, Math.min((now - previous) / 1000, .05)) : 1 / 60;
      previous = now;
      time += delta;
      const ease = 1 - Math.exp(-delta * 12);
      const oldX = cursor.x;
      const oldY = cursor.y;
      cursor.x += (target.x - cursor.x) * ease;
      cursor.y += (target.y - cursor.y) * ease;
      const response = 1 - Math.exp(-delta * 5);
      velocity.x += (Math.max(-900, Math.min(900, (cursor.x - oldX) / delta)) - velocity.x) * response;
      velocity.y += (Math.max(-900, Math.min(900, (cursor.y - oldY) / delta)) - velocity.y) * response;
      const drift = 1 - Math.exp(-delta * 3.5);
      wake.x += (cursor.x - wake.x) * drift;
      wake.y += (cursor.y - wake.y) * drift;
      opacity += ((inside ? 1 : 0) - opacity) * (1 - Math.exp(-delta * (inside ? 10 : 7)));
      if (now - lastPaint >= 1000 / 30) { draw(); lastPaint = now; }
      if (inside || opacity > .015) frame = requestAnimationFrame(tick);
      else { previous = 0; opacity = 0; clear(); }
    }
    function resize() {
      width = element!.clientWidth;
      height = element!.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      stop();
    }
    function move(event: PointerEvent) {
      if (event.pointerType === 'touch') { stop(); return; }
      if (!running) return;
      const rect = element!.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target = { x: Math.max(0, Math.min(width, (event.clientX - rect.left) * width / rect.width)), y: Math.max(0, Math.min(height, (event.clientY - rect.top) * height / rect.height)) };
      if (!inside && opacity === 0) { cursor = { ...target }; wake = { ...target }; velocity = { x: 0, y: 0 }; }
      inside = true;
      canvas!.dataset.pointerActive = 'true';
      if (frame === null) frame = requestAnimationFrame(tick);
    }
    function leave() { inside = false; canvas!.dataset.pointerActive = 'false'; }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    observer?.observe(element);
    window.addEventListener('resize', resize);
    element.addEventListener('pointermove', move, { passive: true });
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointercancel', leave);
    resize();
    return () => {
      disposed = true;
      stop();
      observer?.disconnect();
      window.removeEventListener('resize', resize);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointercancel', leave);
    };
  }, [interactive, running, tone]);
  const seconds = Number.isFinite(duration) ? Math.max(2, Math.min(30, duration)) : 8;
  const inks = colors.length ? colors : palette;
  return <div ref={root} className={`ac-converging-streams ${className}`} data-running={running} data-direction={direction} data-tone={tone} style={{ '--ac-stream-duration': `${seconds}s` } as CSSProperties}>
    <svg className="ac-converging-streams-art" viewBox="0 0 1200 480" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      {Array.from({ length: 26 }, (_, index) => {
        const side = index < 13 ? 0 : 1;
        const lane = index % 13;
        const outer = -210 + lane * 75;
        const inner = 240 + (lane - 6) * 8;
        const d = side === 0 ? `M -80 ${outer} C 165 ${outer} 210 ${inner} 402 ${inner}` : `M 1280 ${outer} C 1035 ${outer} 990 ${inner} 798 ${inner}`;
        const color = inks[lane % inks.length];
        return <g key={index} style={{ color, '--ac-stream-delay': `${-(lane * 0.73 + side * 2.4)}s` } as CSSProperties}>
          <path d={d} className="ac-converging-streams-track" pathLength="1000" strokeDasharray={lane % 3 === 0 ? '2 13' : undefined}/>
          <path d={d} className="ac-converging-streams-packet" pathLength="1000" strokeDasharray="4 329.333333"/>
        </g>;
      })}
    </svg>
    {interactive && <canvas ref={field} className="ac-converging-streams-field" data-pointer-active="false" aria-hidden="true"/>}
    <button type="button" className="ac-converging-streams-motion" disabled={activity.reduced || externalPaused} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused || externalPaused || activity.reduced ? '▷' : 'Ⅱ'}</span>{activity.reduced ? 'Motion reduced' : externalPaused ? 'Motion paused' : paused ? 'Play motion' : 'Pause motion'}
    </button>
    <div className="ac-converging-streams-content">{children}</div>
  </div>;
}
