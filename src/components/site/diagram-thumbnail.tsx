'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from './icon';

export function DiagramThumbnail({ slug, title }: { slug: string; title: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(.5);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 900));
    observer.observe(element);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => { observer.disconnect(); media.removeEventListener('change', sync); };
  }, []);
  return <div ref={root} className="diagram-thumbnail" style={{ '--diagram-scale': scale } as CSSProperties}>
    <div className="diagram-thumbnail-stage" aria-hidden="true" ref={element => element?.setAttribute('inert', '')}><ComponentDemo slug={slug} options={{ paused: paused || reduced }}/></div>
    <Link className="hero-thumbnail-open" href={`/components/${slug}`} aria-label={`Explore ${title}`}><span>Explore component <Icon name="arrow" size={14}/></span></Link>
    <button type="button" className="diagram-thumbnail-motion" disabled={reduced} onClick={() => setPaused(value => !value)} aria-label={reduced ? `${title} motion reduced` : `${paused ? 'Play' : 'Pause'} ${title} animation`}>{reduced ? 'Motion reduced' : paused ? '▷ Play' : 'Ⅱ Pause'}</button>
  </div>;
}
