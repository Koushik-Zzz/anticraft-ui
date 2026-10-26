'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import './feature-bento.css';

export interface FeatureBentoItem {
  id: string;
  title: string;
  description: string;
  /** Decorative artwork only; keep meaningful information in the title and description. */
  media?: ReactNode;
  eyebrow?: string;
  span?: 'default' | 'wide' | 'tall';
  href?: string;
  linkLabel?: string;
}

export interface FeatureBentoProps {
  items: FeatureBentoItem[];
  title?: string;
  className?: string;
}

/** A responsive product-benefits grid, with optional links and decorative previews. */
export function FeatureBento({ items, title = 'Small details. A better day.', className = '' }: FeatureBentoProps) {
  const headingId = useId();
  if (!items.length) return null;

  return (
    <section className={`ac-feature-bento ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-feature-bento-header">
        <span>MADE FOR YOUR EVERYDAY</span>
        <h2 id={headingId}>{title}</h2>
      </header>
      <div className="ac-feature-bento-grid">
        {items.map(item => (
          <article className={`ac-feature-bento-card ac-feature-bento-${item.span ?? 'default'}`} key={item.id}>
            {item.media && <div className="ac-feature-bento-media" aria-hidden="true" ref={node => { if (node) node.setAttribute('inert', ''); }}>{item.media}</div>}
            <div className="ac-feature-bento-copy">
              {item.eyebrow && <span className="ac-feature-bento-eyebrow">{item.eyebrow}</span>}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.href && <a href={item.href} className="ac-feature-bento-link">{item.linkLabel ?? `Explore ${item.title}`}<span aria-hidden="true">↗</span></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
