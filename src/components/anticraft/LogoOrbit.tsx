'use client';

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import './logo-orbit.css';

export interface LogoOrbitItem {
  id: string;
  label: string;
  /** Decorative logo artwork without nested controls. */
  logo: ReactNode;
  orbit?: 'inner' | 'outer';
  /** Badge diameter at a 560px stage, scaled with its container. */
  size?: number;
  href?: string;
}

export interface LogoOrbitProps {
  items: LogoOrbitItem[];
  center?: ReactNode;
  centerLabel?: string;
  /** Seconds per outer revolution. Inner logos travel at 70% of this duration. */
  duration?: number;
  reverse?: boolean;
  paused?: boolean;
  defaultSelectedId?: string;
  onItemSelect?: (id: string) => void;
  className?: string;
}

/** A fixed hub surrounded by orbiting, upright integration badges. */
export function LogoOrbit({ items, center, centerLabel = 'Workspace', duration = 60, reverse = false, paused = false, defaultSelectedId, onItemSelect, className = '' }: LogoOrbitProps) {
  const root = useRef<HTMLElement>(null);
  const captionId = useId();
  const [selection, setSelection] = useState(defaultSelectedId);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [activity, setActivity] = useState({ ready: false, visible: false, foreground: true, reduced: false });
  const safeItems = useMemo(() => {
    const seen = new Set<string>();
    let innerCount = 0;
    return items.filter(item => {
      if (!item.id.trim() || !item.label.trim() || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    }).slice(0, 12).map(item => {
      const orbit = item.orbit === 'inner' && innerCount < 6 ? 'inner' : 'outer';
      if (orbit === 'inner') innerCount++;
      const size = Number.isFinite(item.size) ? Math.max(44, Math.min(orbit === 'inner' ? 64 : 80, item.size!)) : orbit === 'inner' ? 56 : 68;
      return { ...item, orbit, size };
    });
  }, [items]);
  const selected = safeItems.find(item => item.id === selection) ?? safeItems[0];
  const held = safeItems.some(item => item.id === hoveredId || item.id === focusedId);
  const seconds = Number.isFinite(duration) ? Math.max(20, Math.min(180, duration)) : 60;
  const running = activity.ready && activity.visible && activity.foreground && !activity.reduced && !paused && !manualPaused && !held && safeItems.length > 0;

  useEffect(() => {
    setHoveredId(value => safeItems.some(item => item.id === value) ? value : null);
    setFocusedId(value => safeItems.some(item => item.id === value) ? value : null);
  }, [safeItems]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setActivity(value => ({ ...value, ready: true, reduced: media.matches, foreground: !document.hidden }));
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

  return <section ref={root} className={`ac-logo-orbit ${className}`.trim()} aria-label={`${centerLabel} logo orbit`} aria-describedby={captionId} data-running={running} data-reverse={reverse}>
    <div className="ac-logo-orbit-stage" onPointerLeave={() => setHoveredId(null)}>
      <div className="ac-logo-orbit-rings" aria-hidden="true"><i/><i/><i/></div>
      {(['outer', 'inner'] as const).map(orbit => {
        const group = safeItems.filter(item => item.orbit === orbit);
        if (!group.length) return null;
        return <div key={orbit} className="ac-logo-orbit-track" data-orbit={orbit} style={{ '--ac-logo-orbit-duration': `${seconds * (orbit === 'inner' ? .7 : 1)}s` } as CSSProperties}>
          {group.map((item, index) => {
            const angle = (index / group.length * 360 + (orbit === 'outer' ? -100 : -140)) * Math.PI / 180;
            const radius = orbit === 'outer' ? 210 : 132;
            const style = { left: `${50 + Math.cos(angle) * radius / 5.6}%`, top: `${50 + Math.sin(angle) * radius / 5.6}%`, width: `${item.size / 5.6}%` };
            const common = {
              className: 'ac-logo-orbit-badge',
              'aria-label': item.label,
              'data-selected': selected?.id === item.id,
              onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => { if (event.pointerType !== 'touch') setHoveredId(item.id); },
              onPointerLeave: () => setHoveredId(value => value === item.id ? null : value),
              onFocus: () => setFocusedId(item.id),
              onBlur: () => setFocusedId(value => value === item.id ? null : value),
              onClick: () => { setSelection(item.id); onItemSelect?.(item.id); },
            };
            const content = <span className="ac-logo-orbit-logo" aria-hidden="true">{item.logo ?? item.label.slice(0, 1)}</span>;
            return <div key={item.id} className="ac-logo-orbit-position" style={style}>
              {item.href ? <a {...common} href={item.href}>{content}</a> : <button {...common} type="button" aria-pressed={selected?.id === item.id}>{content}</button>}
            </div>;
          })}
        </div>;
      })}
      <div className="ac-logo-orbit-center" role="img" aria-label={centerLabel}>{center ?? <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m10 36 14-25 14 25H10Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/><path d="M17 29h14" stroke="currentColor" strokeWidth="3"/></svg>}</div>
    </div>
    <footer className="ac-logo-orbit-footer">
      <p id={captionId} aria-live="polite" aria-atomic="true">{selected ? <><span className="ac-logo-orbit-dot" aria-hidden="true"/><strong>{selected.label}</strong><span>→ {centerLabel}</span></> : 'No logos configured.'}</p>
      <button type="button" className="ac-logo-orbit-motion" disabled={activity.reduced || paused || safeItems.length === 0} onClick={() => setManualPaused(value => !value)}><span aria-hidden="true">{manualPaused || paused || activity.reduced ? '▷' : 'Ⅱ'}</span>{activity.reduced ? 'Motion reduced' : paused ? 'Motion paused' : manualPaused ? 'Play motion' : 'Pause motion'}</button>
    </footer>
  </section>;
}
