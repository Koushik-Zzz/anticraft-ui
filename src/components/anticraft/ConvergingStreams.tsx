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
  className?: string;
}

const palette = ['#b8abe5', '#c5d3e9', '#d5bb78', '#d4a9cd'];

/** Curved signal paths frame arbitrary content without intercepting its controls. */
export function ConvergingStreams({ children, colors = palette, duration = 8, direction = 'inward', defaultPaused = false, paused: externalPaused = false, tone = 'dark', className = '' }: ConvergingStreamsProps) {
  const root = useRef<HTMLDivElement>(null);
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
    <button type="button" className="ac-converging-streams-motion" disabled={activity.reduced || externalPaused} onClick={() => setPaused(value => !value)}>
      <span aria-hidden="true">{paused || externalPaused || activity.reduced ? '▷' : 'Ⅱ'}</span>{activity.reduced ? 'Motion reduced' : externalPaused ? 'Motion paused' : paused ? 'Play motion' : 'Pause motion'}
    </button>
    <div className="ac-converging-streams-content">{children}</div>
  </div>;
}
