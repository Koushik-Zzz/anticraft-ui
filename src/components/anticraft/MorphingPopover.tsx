'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import './morphing-popover.css';

export interface MorphingPopoverProps {
  /** Decorative content for the native pill button. Do not nest other controls. */
  trigger: ReactNode;
  /** Accessible name for the expanded card. */
  label: string;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsedWidth?: number;
  expandedWidth?: number;
  /** Shape transition in milliseconds, clamped to 160–900. */
  duration?: number;
  className?: string;
}

const finite = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

/** One surface morphs between a compact pill and an accessible, nonmodal card. */
export function MorphingPopover({
  trigger, label, children, open, defaultOpen = false, onOpenChange,
  collapsedWidth = 240, expandedWidth = 350, duration = 420, className = '',
}: MorphingPopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const expanded = open ?? internalOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousOpen = useRef(expanded);
  const restoreFocus = useRef(false);
  const moveFocus = useRef(false);
  const focusInside = useRef(false);
  const outsideClose = useRef(false);
  const panelId = `ac-morph-panel-${useId()}`;
  const width = finite(expandedWidth, 350, 240, 560);
  const style = {
    '--ac-morph-collapsed-width': `${Math.min(width, finite(collapsedWidth, 240, 160, 360))}px`,
    '--ac-morph-expanded-width': `${width}px`,
    '--ac-morph-duration': `${finite(duration, 420, 160, 900)}ms`,
  } as CSSProperties;

  function requestOpen(next: boolean, focus = true) {
    if (next === expanded) return;
    outsideClose.current = !focus;
    if (next) moveFocus.current = focus;
    else restoreFocus.current = focus && Boolean(rootRef.current?.contains(document.activeElement));
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return;
    let active = true;
    function measure() {
      if (!active || !root || !panel) return;
      // The hidden panel keeps its natural layout; no scaled text or duplicate tree.
      root.style.setProperty('--ac-morph-open-height', `${Math.ceil(panel.getBoundingClientRect().height)}px`);
    }
    measure();
    root.dataset.ready = 'true';
    // Commit the measured layout before enabling transitions. An initially open
    // card must not animate from its server-rendered, in-flow positioning.
    panel.getBoundingClientRect();
    root.dataset.animated = 'true';
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(panel);
    window.addEventListener('resize', measure);
    return () => {
      active = false;
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const changed = previousOpen.current !== expanded;
    previousOpen.current = expanded;
    if (!changed) return;
    if (expanded) {
      if (moveFocus.current || rootRef.current?.contains(document.activeElement)) {
        closeRef.current?.focus({ preventScroll: true });
      }
      moveFocus.current = false;
    } else {
      // Controlled closure from a child action also returns focus to the pill.
      const focusStillHere = document.activeElement === document.body || Boolean(rootRef.current?.contains(document.activeElement));
      if (!outsideClose.current && !document.hidden && focusStillHere && (restoreFocus.current || focusInside.current)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
      restoreFocus.current = false;
    }
    outsideClose.current = false;
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) requestOpen(false, false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded, open, onOpenChange]);

  return <div
    ref={rootRef}
    className={`ac-morph-popover ${className}`.trim()}
    style={style}
    data-open={expanded}
    onFocusCapture={() => { focusInside.current = true; outsideClose.current = false; }}
    onBlurCapture={event => {
      if (event.relatedTarget instanceof Node && !rootRef.current?.contains(event.relatedTarget)) {
        focusInside.current = false;
        restoreFocus.current = false;
        moveFocus.current = false;
      }
    }}
    onKeyDown={event => {
      if (event.key === 'Escape' && expanded && !event.defaultPrevented) {
        event.preventDefault();
        event.stopPropagation();
        requestOpen(false);
      }
    }}
  >
    <div className="ac-morph-popover__surface" aria-hidden="true"><div className="ac-morph-popover__grain"/></div>
    <div className="ac-morph-popover__motes" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
    <button
      ref={element => { triggerRef.current = element; if (element) element.inert = expanded; }}
      type="button"
      className="ac-morph-popover__trigger"
      aria-label={`Open ${label}`}
      aria-expanded={expanded}
      aria-controls={panelId}
      aria-haspopup="dialog"
      aria-hidden={expanded}
      tabIndex={expanded ? -1 : 0}
      onClick={() => requestOpen(true)}
    >{trigger}</button>
    <div
      ref={element => { panelRef.current = element; if (element) element.inert = !expanded; }}
      id={panelId}
      role="dialog"
      aria-label={label}
      aria-hidden={!expanded}
      className="ac-morph-popover__panel"
    >
      <button ref={closeRef} type="button" className="ac-morph-popover__close" aria-label={`Close ${label}`} onClick={() => requestOpen(false)}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8"/></svg>
      </button>
      <div className="ac-morph-popover__body">{children}</div>
    </div>
  </div>;
}
