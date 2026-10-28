'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './image-hotspots.css';

export interface ImageHotspotItem {
  id: string;
  label: string;
  /** Horizontal position in the uncropped image, from 0 to 1. */
  x: number;
  /** Vertical position in the uncropped image, from 0 to 1. */
  y: number;
  title?: string;
  description?: string;
  price?: string;
  action?: { label: string; href: string };
}

export interface ImageHotspotsProps {
  image: string;
  alt: string;
  items: ImageHotspotItem[];
  caption?: string;
  defaultActiveId?: string;
  onActiveChange?: (item: ImageHotspotItem | null) => void;
  className?: string;
}

function coordinate(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0.5;
}

/** Image annotations with native disclosure controls and bounded detail cards. */
export function ImageHotspots({ image, alt, items, caption, defaultActiveId, onActiveChange, className = '' }: ImageHotspotsProps) {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId ?? null);
  const [position, setPosition] = useState({ left: 12, top: 12, maxHeight: 10000 });
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const instance = useId();
  const panelId = `ac-hotspot-panel-${instance}`;
  const titleId = `${panelId}-title`;
  const active = items.find(item => item.id === activeId);

  function close(restoreFocus = false) {
    if (!active) return;
    setActiveId(null);
    onActiveChange?.(null);
    if (restoreFocus) triggers.current.get(active.id)?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!active) return;
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) close();
    }
    function onFocusIn(event: FocusEvent) {
      if (!root.current?.contains(event.target as Node)) close();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !event.defaultPrevented && root.current?.contains(document.activeElement)) {
        event.preventDefault();
        close(true);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  useLayoutEffect(() => {
    if (!active || !stage.current || !panel.current) return;
    const currentStage = stage.current;
    const currentPanel = panel.current;
    function measure() {
      const width = currentStage.clientWidth;
      const height = currentStage.clientHeight;
      if (width < 560) return;
      const cardWidth = currentPanel.offsetWidth;
      const maxHeight = Math.max(0, height - 24);
      const cardHeight = Math.min(currentPanel.offsetHeight, maxHeight);
      const x = coordinate(active!.x) * width;
      const y = coordinate(active!.y) * height;
      const side = width - x >= x ? x + 28 : x - cardWidth - 28;
      const left = Math.max(12, Math.min(side, width - cardWidth - 12));
      const top = Math.max(12, Math.min(y - cardHeight / 2, height - cardHeight - 12));
      setPosition(previous => previous.left === left && previous.top === top && previous.maxHeight === maxHeight ? previous : { left, top, maxHeight });
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(currentStage);
    observer.observe(currentPanel);
    return () => observer.disconnect();
  }, [active]);

  return <figure ref={root} className={`ac-image-hotspots ${className}`.trim()}>
    <div ref={stage} className="ac-hotspots-stage">
      <img className="ac-hotspots-image" src={image} alt={alt} loading="lazy" decoding="async" draggable={false} />
      {items.map((item, index) => <button
        key={item.id}
        ref={element => { if (element) triggers.current.set(item.id, element); else triggers.current.delete(item.id); }}
        type="button"
        className={`ac-hotspot-trigger${item.id === active?.id ? ' is-active' : ''}${coordinate(item.x) > 0.85 ? ' is-edge' : ''}`}
        style={{ '--ac-hotspot-x': `${coordinate(item.x) * 100}%`, '--ac-hotspot-y': `${coordinate(item.y) * 100}%` } as CSSProperties}
        aria-label={item.label}
        aria-expanded={item.id === active?.id}
        aria-controls={item.id === active?.id ? panelId : undefined}
        onClick={() => {
          const next = item.id === active?.id ? null : item;
          setActiveId(next?.id ?? null);
          onActiveChange?.(next);
        }}
      ><span className="ac-hotspot-marker" aria-hidden="true"><span /></span><span className="ac-hotspot-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></button>)}
    </div>
    {active && <div
      ref={panel}
      id={panelId}
      role="region"
      aria-labelledby={titleId}
      className="ac-hotspot-panel"
      style={{ '--ac-hotspot-panel-left': `${position.left}px`, '--ac-hotspot-panel-top': `${position.top}px`, '--ac-hotspot-panel-max-height': `${position.maxHeight}px` } as CSSProperties}
    >
      <div className="ac-hotspot-panel-top"><span>{String(items.findIndex(item => item.id === active.id) + 1).padStart(2, '0')}</span><button type="button" aria-label={`Close ${active.label}`} onClick={() => close(true)}><span aria-hidden="true">×</span></button></div>
      <h3 id={titleId}>{active.title ?? active.label}</h3>
      {active.description && <p>{active.description}</p>}
      {(active.price || active.action) && <div className="ac-hotspot-panel-bottom">{active.price && <span>{active.price}</span>}{active.action && <a href={active.action.href}>{active.action.label}<span aria-hidden="true">↗</span></a>}</div>}
    </div>}
    {caption && <figcaption className="ac-hotspots-caption">{caption}</figcaption>}
  </figure>;
}
