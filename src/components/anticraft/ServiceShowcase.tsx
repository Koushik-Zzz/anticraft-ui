'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import './service-showcase.css';

export interface ServiceShowcaseItem {
  id: string;
  title: string;
  description: string;
  capabilities: string[];
  /** Decorative media without nested controls; provide a separate href for the call to action. */
  media: ReactNode;
  href?: string;
  linkLabel?: string;
}

export interface ServiceShowcaseProps {
  items: ServiceShowcaseItem[];
  title?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

/** An editorial services section with one accessible tab panel per offering. */
export function ServiceShowcase({ items, title = 'How we can help', defaultValue, onValueChange, className = '' }: ServiceShowcaseProps) {
  const instance = useId();
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.id);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const activeId = items.some(item => item.id === selected) ? selected : items[0]?.id;

  function select(index: number, focus = false) {
    const item = items[index];
    if (!item) return;
    if (item.id !== activeId) {
      setSelected(item.id);
      onValueChange?.(item.id);
    }
    if (focus) buttons.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(next, true);
  }

  if (!items.length) return null;

  return <section className={`ac-service-showcase ${className}`.trim()} aria-labelledby={`${instance}-heading`}>
    <header className="ac-service-showcase-header"><span aria-hidden="true">OUR EXPERTISE</span><h2 id={`${instance}-heading`}>{title}</h2></header>
    <div className="ac-service-showcase-layout">
      <div className="ac-service-showcase-tabs" role="tablist" aria-label={title} aria-orientation="vertical">
        {items.map((item, index) => <button ref={node => { buttons.current[index] = node; }} type="button" role="tab" id={`${instance}-tab-${index}`} aria-selected={item.id === activeId} aria-controls={`${instance}-panel-${index}`} tabIndex={item.id === activeId ? 0 : -1} className="ac-service-showcase-tab" key={item.id} onClick={() => select(index)} onKeyDown={event => onKeyDown(event, index)}><span className="ac-service-showcase-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{item.title}</span><span className="ac-service-showcase-arrow" aria-hidden="true">↗</span></button>)}
      </div>
      <div className="ac-service-showcase-panels">
        {items.map((item, index) => <div role="tabpanel" id={`${instance}-panel-${index}`} aria-labelledby={`${instance}-tab-${index}`} tabIndex={0} hidden={item.id !== activeId} className="ac-service-showcase-panel" key={item.id}>
          <div className="ac-service-showcase-media" aria-hidden="true" ref={node => { if (node) node.setAttribute('inert', ''); }}>{item.media}</div>
          <div className="ac-service-showcase-copy"><p>{item.description}</p><ul className="ac-service-showcase-capabilities" aria-label={`${item.title} capabilities`}>{item.capabilities.map((capability, capabilityIndex) => <li key={`${capability}-${capabilityIndex}`}>{capability}</li>)}</ul>{item.href && <a className="ac-service-showcase-link" href={item.href}>{item.linkLabel ?? `Explore ${item.title}`}<span aria-hidden="true">↗</span></a>}</div>
        </div>)}
      </div>
    </div>
  </section>;
}
