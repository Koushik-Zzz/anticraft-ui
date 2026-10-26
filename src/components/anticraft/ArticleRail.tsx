'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './article-rail.css';

export interface ArticleRailItem {
  id: string;
  title: string;
  category: string;
  href: string;
  readTime?: string;
  date?: string;
  /** Decorative article artwork without nested controls. */
  media: ReactNode;
}

export interface ArticleRailProps {
  items: ArticleRailItem[];
  title?: string;
  className?: string;
}

/** A touch-scrollable journal rail with ordinary article links and bounded paging controls. */
export function ArticleRail({ items, title = 'Ideas worth sharing', className = '' }: ArticleRailProps) {
  const instance = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: items.length < 2 });

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let frame = 0;
    function measure() {
      if (!element) return;
      const maximum = Math.max(0, element.scrollWidth - element.clientWidth);
      const position = Math.max(0, element.scrollLeft);
      // Scroll snapping aligns the first card after the viewport's focus-ring inset.
      const startInset = Number.parseFloat(getComputedStyle(element).paddingLeft) || 0;
      const next = { start: position <= startInset + 2, end: position >= maximum - 2 };
      setEdges(previous => previous.start === next.start && previous.end === next.end ? previous : next);
    }
    function scheduleMeasure() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    }
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(scheduleMeasure);
    observer?.observe(element);
    if (track.current) observer?.observe(track.current);
    element.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      element.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
    };
  }, [items.length]);

  function move(direction: -1 | 1) {
    const element = viewport.current;
    const cards = track.current?.children;
    if (!element || !cards?.length) return;
    const first = cards[0] as HTMLElement;
    const second = cards[1] as HTMLElement | undefined;
    const step = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollBy({ left: direction * step, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  if (!items.length) return null;

  return <section className={`ac-article-rail ${className}`.trim()} aria-labelledby={`${instance}-heading`}>
    <header className="ac-article-rail-header"><div><span className="ac-article-rail-eyebrow">THE JOURNAL</span><h2 id={`${instance}-heading`}>{title}</h2></div><div className="ac-article-rail-controls"><button type="button" aria-label="Previous articles" aria-controls={`${instance}-viewport`} disabled={edges.start} onClick={() => move(-1)}><span aria-hidden="true">←</span></button><button type="button" aria-label="Next articles" aria-controls={`${instance}-viewport`} disabled={edges.end} onClick={() => move(1)}><span aria-hidden="true">→</span></button></div></header>
    <div className="ac-article-rail-viewport" ref={viewport} id={`${instance}-viewport`}>
      <ul className="ac-article-rail-track" ref={track}>{items.map((item, index) => <li className="ac-article-rail-item" key={item.id}><article><a className="ac-article-rail-link" href={item.href} aria-labelledby={`${instance}-article-${index}`} aria-describedby={`${instance}-meta-${index}`}><div className="ac-article-rail-media" aria-hidden="true" ref={node => { if (node) node.setAttribute('inert', ''); }}>{item.media}<span className="ac-article-rail-link-arrow" aria-hidden="true">↗</span></div><div className="ac-article-rail-meta" id={`${instance}-meta-${index}`}><span>{item.category}</span><span>{[item.date, item.readTime].filter(Boolean).join(' · ')}</span></div><h3 id={`${instance}-article-${index}`}><span>{item.title}</span></h3></a></article></li>)}</ul>
    </div>
  </section>;
}
