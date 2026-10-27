'use client';

import { useId, useState, type CSSProperties } from 'react';
import './product-spotlight-hero.css';

export interface ProductSpotlightImage {
  src: string;
  alt: string;
}

export interface ProductSpotlightFeature {
  id: string;
  label: string;
  detail: string;
  /** Positions from 0 to 1, relative to the complete main image. */
  x: number;
  y: number;
}

export interface ProductSpotlightView {
  id: string;
  label: string;
  image: ProductSpotlightImage;
}

export interface ProductSpotlightVariant {
  id: string;
  label: string;
  /** Any valid CSS color for the finish swatch. */
  color: string;
  image: ProductSpotlightImage;
  /** Extra images of this finish. The main image is always the first view. */
  views?: ProductSpotlightView[];
}

export interface ProductSpotlightSize {
  id: string;
  label: string;
  dimensions: string;
  /** A formatted price, including its currency. */
  price: string;
}

export interface ProductSpotlightSelection {
  variant: ProductSpotlightVariant | null;
  size: ProductSpotlightSize | null;
  view: ProductSpotlightView;
  image: ProductSpotlightImage;
}

export interface ProductSpotlightHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  kicker?: string;
  note?: string;
  image: ProductSpotlightImage;
  features: ProductSpotlightFeature[];
  productName?: string;
  /** Decorative collection number behind the product. */
  productNumber?: string;
  variants?: ProductSpotlightVariant[];
  sizes?: ProductSpotlightSize[];
  /** Called only after a visitor changes finish, model, or view. */
  onSelectionChange?: (selection: ProductSpotlightSelection) => void;
  action?: { label: string; href: string };
  className?: string;
}

const emptyVariants: ProductSpotlightVariant[] = [];
const emptySizes: ProductSpotlightSize[] = [];

function position(value: number) {
  return `${Math.min(1, Math.max(0, Number.isFinite(value) ? value : .5)) * 100}%`;
}

function viewsFor(variant: ProductSpotlightVariant | null, image: ProductSpotlightImage) {
  return [{ id: 'main', label: 'Object', image: variant?.image ?? image }, ...(variant?.views ?? []).filter(view => view.id !== 'main')];
}

/** An image-led product introduction with a compact, usable configuration panel. */
export function ProductSpotlightHero({
  eyebrow,
  title,
  description,
  kicker,
  note,
  image,
  features,
  productName = 'OBJECT / 01',
  productNumber = '01',
  variants = emptyVariants,
  sizes = emptySizes,
  onSelectionChange,
  action,
  className = '',
}: ProductSpotlightHeroProps) {
  const [variantId, setVariantId] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(null);
  const [viewId, setViewId] = useState('main');
  const [featureId, setFeatureId] = useState<string | null>(null);
  const [imageRatio, setImageRatio] = useState(1.5);
  const selectedVariant = variants.find(item => item.id === variantId) ?? variants[0] ?? null;
  const selectedSize = sizes.find(item => item.id === sizeId) ?? sizes[0] ?? null;
  const views = viewsFor(selectedVariant, image);
  const selectedView = views.find(item => item.id === viewId) ?? views[0];
  const selectedFeature = features.find(item => item.id === featureId);
  const instance = useId();
  const titleId = `ac-spotlight-title-${instance}`;
  const detailId = `ac-spotlight-detail-${instance}`;
  const summaryId = `ac-spotlight-summary-${instance}`;

  function chooseVariant(variant: ProductSpotlightVariant) {
    const view = viewsFor(variant, image)[0];
    setVariantId(variant.id);
    setViewId('main');
    setFeatureId(null);
    onSelectionChange?.({ variant, size: selectedSize, view, image: view.image });
  }

  function chooseSize(size: ProductSpotlightSize) {
    setSizeId(size.id);
    onSelectionChange?.({ variant: selectedVariant, size, view: selectedView, image: selectedView.image });
  }

  function chooseView(view: ProductSpotlightView) {
    setViewId(view.id);
    setFeatureId(null);
    onSelectionChange?.({ variant: selectedVariant, size: selectedSize, view, image: view.image });
  }

  return (
    <section className={`ac-product-spotlight-hero ${className}`.trim()} aria-labelledby={titleId}>
      <header className="ac-product-spotlight-masthead">
        <span className="ac-product-spotlight-wordmark">{productName}</span>
        <span className="ac-product-spotlight-edition">{eyebrow ?? 'AN OBJECT, CONSIDERED.'}</span>
        <span className="ac-product-spotlight-index" aria-hidden="true">({productNumber})</span>
      </header>

      <div className="ac-product-spotlight-stage">
        <div className="ac-product-spotlight-copy">
          {kicker && <span className="ac-product-spotlight-kicker"><span aria-hidden="true"/>{kicker}</span>}
          <h2 id={titleId}>{title}</h2>
          {description && <p className="ac-product-spotlight-description">{description}</p>}
          {note && <span className="ac-product-spotlight-scroll-note">{note}<span aria-hidden="true">↘</span></span>}
        </div>

        <div className="ac-product-spotlight-visual">
          <span className="ac-product-spotlight-watermark" aria-hidden="true">{productNumber}</span>
          <div className="ac-product-spotlight-image-area" data-view={selectedView.id} style={{ '--ac-spotlight-image-ratio': selectedView.id === 'main' ? imageRatio : 1.5 } as CSSProperties}>
            <img key={selectedView.image.src} src={selectedView.image.src} alt={selectedView.image.alt} onLoad={event => {
              const { naturalWidth, naturalHeight } = event.currentTarget;
              if (naturalWidth > 0 && naturalHeight > 0) setImageRatio(naturalWidth / naturalHeight);
            }} />
            {features.length > 0 && selectedView.id === 'main' && <div className="ac-product-spotlight-points" role="group" aria-label="Explore product details">
              {features.map((feature, index) => <button
                key={feature.id}
                type="button"
                className="ac-product-spotlight-point"
                style={{ left: position(feature.x), top: position(feature.y) }}
                aria-label={`Explore feature ${index + 1}: ${feature.label}`}
                aria-pressed={selectedFeature?.id === feature.id}
                aria-controls={detailId}
                onClick={() => setFeatureId(selectedFeature?.id === feature.id ? null : feature.id)}
              ><span aria-hidden="true">+</span></button>)}
            </div>}
          </div>
          <div className="ac-product-spotlight-visual-footer">
            <div className="ac-product-spotlight-view-controls" role="group" aria-label="Product views">
              {views.map((view, index) => <button key={view.id} type="button" data-view={view.id} aria-label={`View ${view.label}`} aria-pressed={selectedView.id === view.id} onClick={() => chooseView(view)}>
                <img src={view.image.src} alt="" loading="lazy"/><span className="ac-product-spotlight-view-name"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{view.label}</span><span className="ac-product-spotlight-view-arrow" aria-hidden="true">↗</span>
              </button>)}
            </div>
            <span className="ac-product-spotlight-render-label">{selectedVariant?.label ?? 'PRODUCT STUDY'}<span aria-hidden="true"> / </span>{selectedView.label}</span>
          </div>
        </div>
      </div>

      {features.length > 0 && <div className="ac-product-spotlight-detail" id={detailId} aria-live="polite" aria-atomic="true">
        <span className="ac-product-spotlight-detail-label">IN THE DETAILS <span aria-hidden="true">↗</span></span>
        <div>{selectedFeature ? <><strong>{selectedFeature.label}</strong><span>{selectedFeature.detail}</span></> : <span>Explore the + points for a closer look at the design.</span>}</div>
      </div>}

      <div className="ac-product-spotlight-configuration" data-options={Number(variants.length > 0) + Number(sizes.length > 0)}>
        {variants.length > 0 && <fieldset className="ac-product-spotlight-finish">
          <legend>01 — Finish</legend>
          <div className="ac-product-spotlight-swatches">
            {variants.map(variant => <button key={variant.id} type="button" aria-label={`Finish: ${variant.label}`} aria-pressed={selectedVariant?.id === variant.id} onClick={() => chooseVariant(variant)} style={{ '--ac-spotlight-swatch': variant.color } as CSSProperties}>
              <span className="ac-product-spotlight-swatch-chip" aria-hidden="true"><span>✓</span></span><span className="ac-product-spotlight-swatch-name">{variant.label}</span>
            </button>)}
          </div>
        </fieldset>}
        {sizes.length > 0 && <fieldset className="ac-product-spotlight-model">
          <legend>02 — Model</legend>
          <div className="ac-product-spotlight-models">
            {sizes.map(size => <button key={size.id} type="button" aria-pressed={selectedSize?.id === size.id} aria-describedby={summaryId} onClick={() => chooseSize(size)}><span>{size.label}</span><span aria-hidden="true">{selectedSize?.id === size.id ? '●' : '○'}</span></button>)}
          </div>
        </fieldset>}
        <div className="ac-product-spotlight-purchase">
          <div className="ac-product-spotlight-summary" id={summaryId} aria-live="polite" aria-atomic="true">
            <div><strong>{selectedSize?.price ?? productName}</strong><span>{selectedSize?.dimensions ?? selectedVariant?.label ?? 'Explore the design'}</span></div>
            {selectedSize && <span className="ac-product-spotlight-summary-model">{selectedSize.label}{selectedVariant ? ` / ${selectedVariant.label}` : ''}</span>}
          </div>
          {action && <a className="ac-product-spotlight-action" href={action.href}>{action.label}<span aria-hidden="true">↗</span></a>}
        </div>
      </div>
    </section>
  );
}
