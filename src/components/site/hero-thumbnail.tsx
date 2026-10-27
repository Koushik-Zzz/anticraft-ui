'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from './icon';

/** Fits a complete desktop composition into a gallery card. Open the live page to interact. */
export function HeroThumbnail({ slug, title }: { slug: string; title: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1 / 3);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const resize = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1200));
    resize.observe(element);
    return () => resize.disconnect();
  }, []);
  return <div ref={root} className="hero-thumbnail" style={{ '--hero-thumbnail-scale': scale } as CSSProperties}>
    <div className="hero-thumbnail-stage" aria-hidden="true" ref={element => { element?.setAttribute('inert', ''); }}><ComponentDemo slug={slug}/></div>
    <Link className="hero-thumbnail-open" href={`/preview/${slug}`} aria-label={`Open ${title} full preview`}><span>Explore full preview <Icon name="arrow" size={14}/></span></Link>
  </div>;
}
