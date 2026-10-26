"use client";

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import './expanding-menu.css';

export type ExpandingMenuItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
};

export type ExpandingMenuProps = {
  items: ExpandingMenuItem[];
  activeId?: string;
  className?: string;
  label?: string;
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  onOpenChange?: (open: boolean) => void;
};

/** An inline navigation disclosure. It leaves the rest of the page available. */
export function ExpandingMenu({ items, activeId, className = '', label = 'Menu', onNavigate, onOpenChange }: ExpandingMenuProps) {
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
    if (event.target === trigger.current && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      const edge = event.key === 'ArrowDown' ? 'first' : 'last';
      if (openRef.current) links.current[edge === 'first' ? 0 : items.length - 1]?.focus();
      else {
        focusOnOpen.current = edge;
        changeOpen(true);
      }
    }
  }

  return <div
    ref={root}
    className={`ac-expand-menu ${className}`.trim()}
    data-open={open}
    onKeyDown={handleKeyDown}
    onBlur={(event) => {
      if (event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget)) changeOpen(false);
    }}
  >
    <button
      ref={trigger}
      type="button"
      className="ac-expand-trigger"
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => changeOpen(!openRef.current)}
    >
      <span className="ac-expand-mark" aria-hidden="true">✳</span>
      <span className="ac-expand-label">{label}</span>
      <span className="ac-expand-toggle" aria-hidden="true"><span /><span /></span>
    </button>
    <div id={panelId} hidden={!open} className="ac-expand-panel">
      {open && <>
        <div className="ac-expand-heading"><span>Find your way</span><span>{String(items.length).padStart(2, '0')} destinations</span></div>
        <nav aria-label={label} className="ac-expand-links">
          {items.map((item, index) => <a
            key={item.id}
            ref={(element) => { links.current[index] = element; }}
            href={item.href}
            className="ac-expand-link"
            aria-current={activeId === item.id ? 'page' : undefined}
            onClick={(event) => {
              onNavigate?.(item.id, event);
              changeOpen(false, true);
            }}
          >
            <span className="ac-expand-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="ac-expand-copy"><span className="ac-expand-title">{item.label}</span>{item.description && <span className="ac-expand-description">{item.description}</span>}</span>
            <svg className="ac-expand-arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" /></svg>
          </a>)}
        </nav>
      </>}
    </div>
  </div>;
}
