'use client';

import { useId, useState } from 'react';
import './product-spotlight-hero.css';

export interface ProductSpotlightFeature {
  id: string;
  label: string;
  detail: string;
  /** Horizontal and vertical positions from 0 to 1, relative to the full image. */
  x: number;
  y: number;
}

export interface ProductSpotlightHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  image: { src: string; alt: string };
  features: ProductSpotlightFeature[];
  action?: { label: string; href: string };
  className?: string;
}

function position(value: number) {
  return `${Math.min(1, Math.max(0, Number.isFinite(value) ? value : .5)) * 100}%`;
}

/** A product introduction with two equivalent ways to explore its details. */
export function ProductSpotlightHero({
  eyebrow,
  title,
  description,
  image,
  features,
  action,
  className = '',
}: ProductSpotlightHeroProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedIndex = features.findIndex(feature => feature.id === selectedId);
  const selected = features[selectedIndex];
  const instance = useId();
  const titleId = `ac-spotlight-hero-title-${instance}`;
  const detailId = `ac-spotlight-hero-detail-${instance}`;

  return (
    <section className={`ac-product-spotlight-hero ${className}`.trim()} aria-labelledby={titleId}>
      <div className="ac-product-spotlight-layout">
      <div className="ac-product-spotlight-copy">
        {eyebrow && <p className="ac-product-spotlight-eyebrow">{eyebrow}</p>}
        <h2 id={titleId}>{title}</h2>
        {description && <p className="ac-product-spotlight-description">{description}</p>}
      </div>
      <div className="ac-product-spotlight-visual">
        <div className="ac-product-spotlight-image-area">
          <img src={image.src} alt={image.alt} />
          {features.length > 0 && <div className="ac-product-spotlight-points" role="group" aria-label="Product image feature points">
            {features.map((feature, index) => <button
              key={feature.id}
              type="button"
              className="ac-product-spotlight-point"
              style={{ left: position(feature.x), top: position(feature.y) }}
              aria-label={`Explore feature ${index + 1}: ${feature.label}`}
              aria-pressed={selectedId === feature.id}
              aria-controls={detailId}
              onClick={() => setSelectedId(feature.id)}
            ><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></button>)}
          </div>}
        </div>
        {features.length > 0 && <div className="ac-product-spotlight-detail" id={detailId} aria-live="polite" aria-atomic="true">
          <span className="ac-product-spotlight-detail-index" aria-hidden="true">{selected ? String(selectedIndex + 1).padStart(2, '0') : '+'}</span>
          <div><strong>{selected?.label ?? 'A closer look.'}</strong><p>{selected?.detail ?? 'Choose a point on the image or a feature from the list to explore the details.'}</p></div>
        </div>}
      </div>
      <div className="ac-product-spotlight-features">
        {features.length > 0 && <ol className="ac-product-spotlight-list" aria-label="Explore the product features">
          {features.map((feature, index) => <li key={feature.id}>
            <button type="button" aria-pressed={selectedId === feature.id} aria-controls={detailId} onClick={() => setSelectedId(feature.id)}>
              <span className="ac-product-spotlight-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span><strong>{feature.label}</strong><span className="ac-product-spotlight-list-detail">{feature.detail}</span></span>
              <span className="ac-product-spotlight-list-arrow" aria-hidden="true">↗</span>
            </button>
          </li>)}
        </ol>}
        {action && <a className="ac-product-spotlight-action" href={action.href}>{action.label}<span aria-hidden="true">↗</span></a>}
      </div>
      </div>
    </section>
  );
}
