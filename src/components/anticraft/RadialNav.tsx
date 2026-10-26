"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import './radial-nav.css';

export type RadialNavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

export type RadialNavProps = {
  items: RadialNavItem[];
  activeId?: string;
  className?: string;
  label?: string;
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  onOpenChange?: (open: boolean) => void;
};

/** A disclosure with ordinary links arranged around its central trigger. */
export function RadialNav({ items, activeId, className = '', label = 'Explore', onNavigate, onOpenChange }: RadialNavProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const links = useRef<Array<HTMLAnchorElement | null>>([]);
  const focusOnOpen = useRef<'first' | 'last' | null>(null);
  const panelId = useId();

  const changeOpen = useCallback((next: boolean, restoreFocus = false) => {
    if (restoreFocus) trigger.current?.focus();
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
    onOpenChange?.(next);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    if (focusOnOpen.current) {
      links.current[focusOnOpen.current === 'first' ? 0 : items.length - 1]?.focus();
      focusOnOpen.current = null;
    }
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) changeOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open, items.length, changeOpen]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && openRef.current) {
      event.preventDefault();
      event.stopPropagation();
      changeOpen(false, true);
      return;
    }
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if (!forward && !backward && event.key !== 'Home' && event.key !== 'End') return;
    if (!items.length) return;
    event.preventDefault();
    if (!openRef.current) {
      focusOnOpen.current = backward || event.key === 'End' ? 'last' : 'first';
      changeOpen(true);
      return;
    }
    const current = links.current.findIndex((element) => element === event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : current < 0 ? backward ? items.length - 1 : 0 : (current + (backward ? -1 : 1) + items.length) % items.length;
    links.current[next]?.focus();
  }

  return <div
    ref={root}
    className={`ac-radial-nav ${className}`.trim()}
    data-open={open}
    onKeyDown={handleKeyDown}
    onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) changeOpen(false);
    }}
  >
    <div className="ac-radial-orbit" aria-hidden="true" />
    <button
      ref={trigger}
      type="button"
      className="ac-radial-trigger"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={`${label} navigation`}
      onClick={() => changeOpen(!openRef.current)}
    >
      <span className="ac-radial-symbol" aria-hidden="true"><span /><span /><span /><span /></span>
      <span className="ac-radial-trigger-label">{label}</span>
    </button>
    <nav id={panelId} aria-label={label} hidden={!open} className="ac-radial-links">
      {open && items.map((item, index) => {
        const angle = index / items.length * Math.PI * 2 - Math.PI / 2;
        const style = {
          '--ac-radial-x': Math.cos(angle),
          '--ac-radial-y': Math.sin(angle),
          '--ac-radial-delay': `${Math.min(index * 25, 140)}ms`,
        } as CSSProperties;
        return <a
          key={item.id}
          ref={(element) => { links.current[index] = element; }}
          className="ac-radial-link"
          href={item.href}
          style={style}
          aria-current={activeId === item.id ? 'page' : undefined}
          onClick={(event) => {
            onNavigate?.(item.id, event);
            changeOpen(false, true);
          }}
        >
          <span className="ac-radial-icon" aria-hidden="true">{item.icon}</span>
          <span className="ac-radial-link-label">{item.label}</span>
        </a>;
      })}
    </nav>
  </div>;
}
