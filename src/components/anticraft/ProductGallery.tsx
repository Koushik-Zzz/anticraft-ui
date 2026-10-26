'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import './product-gallery.css';

export interface ProductGalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  thumbnail?: string;
}

export interface ProductGalleryProps {
  items: ProductGalleryItem[];
  title?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

/** A manual product image gallery with thumbnails and a native image viewer. */
export function ProductGallery({ items, title = 'A closer look', defaultValue, onValueChange, className = '' }: ProductGalleryProps) {
  const [value, setValue] = useState(defaultValue ?? items[0]?.id ?? '');
  const [expanded, setExpanded] = useState(false);
  const viewer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const thumbnails = useRef(new Map<string, HTMLButtonElement>());
  const instance = useId();
  const headingId = `ac-product-title-${instance}`;
  const viewerId = `ac-product-viewer-${instance}`;
  const viewerTitleId = `${viewerId}-title`;
  const foundIndex = items.findIndex(item => item.id === value);
  const index = foundIndex < 0 ? 0 : foundIndex;
  const selected = items[index];
  const hasItems = items.length > 0;

  useEffect(() => {
    if (!expanded || !hasItems) return;
    const modal = viewer.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [expanded, hasItems]);

  function choose(nextIndex: number) {
    const next = items[(nextIndex + items.length) % items.length];
    if (!next || next.id === selected?.id) return;
    setValue(next.id);
    onValueChange?.(next.id);
  }

  function onThumbnailKey(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;
    else return;
    event.preventDefault();
    choose(nextIndex);
    thumbnails.current.get(items[nextIndex].id)?.focus({ preventScroll: true });
    thumbnails.current.get(items[nextIndex].id)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }

  return (
    <section className={`ac-product-gallery ${className}`.trim()} aria-labelledby={title ? headingId : undefined} aria-label={title ? undefined : 'Product images'}>
      {title && <header className="ac-product-gallery-heading"><span>IN THE DETAILS</span><h2 id={headingId}>{title}</h2></header>}
      {selected ? <>
        <figure className="ac-product-gallery-figure">
          <div className="ac-product-gallery-stage">
            <img key={selected.id} src={selected.src} alt={selected.alt} className="ac-product-gallery-image" />
            <button ref={opener} type="button" className="ac-product-gallery-expand" aria-label="Expand image" aria-haspopup="dialog" aria-controls={viewerId} aria-expanded={expanded} onClick={() => setExpanded(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
          {selected.caption && <figcaption>{selected.caption}</figcaption>}
        </figure>
        <div className="ac-product-gallery-controls">
          <span className="ac-product-gallery-count" aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} <span aria-hidden="true">/</span><span className="ac-product-gallery-sr"> of </span> {String(items.length).padStart(2, '0')}</span>
          <div className="ac-product-gallery-arrows"><button type="button" aria-label="Previous image" disabled={items.length < 2} onClick={() => choose(index - 1)}>←</button><button type="button" aria-label="Next image" disabled={items.length < 2} onClick={() => choose(index + 1)}>→</button></div>
        </div>
        <div className="ac-product-gallery-thumbnails" role="group" aria-label="Choose a product image">
          {items.map((item, itemIndex) => <button key={item.id} type="button" ref={element => { if (element) thumbnails.current.set(item.id, element); else thumbnails.current.delete(item.id); }} aria-label={`Show image ${itemIndex + 1}: ${item.alt}`} aria-pressed={item.id === selected.id} onClick={() => choose(itemIndex)} onKeyDown={event => onThumbnailKey(event, itemIndex)}><img src={item.thumbnail ?? item.src} alt="" loading="lazy" /></button>)}
        </div>
      </> : <p className="ac-product-gallery-empty">Product images will appear here.</p>}
      <dialog ref={viewer} id={viewerId} className="ac-product-gallery-dialog" aria-labelledby={viewerTitleId} onCancel={event => { event.preventDefault(); setExpanded(false); }} onClose={() => { if (!viewer.current?.open) setExpanded(false); }}>
        <header><h2 id={viewerTitleId}>{title || 'Product image'}</h2><button className="ac-product-gallery-close" type="button" onClick={() => setExpanded(false)}>Close <span aria-hidden="true">×</span></button></header>
        {selected && <><figure><img src={selected.src} alt={selected.alt} />{selected.caption && <figcaption>{selected.caption}</figcaption>}</figure><div className="ac-product-gallery-dialog-controls"><button type="button" aria-label="Previous image in viewer" disabled={items.length < 2} onClick={() => choose(index - 1)}>← <span>Previous</span></button><span aria-live="polite" aria-atomic="true">Image {index + 1} of {items.length}</span><button type="button" aria-label="Next image in viewer" disabled={items.length < 2} onClick={() => choose(index + 1)}><span>Next</span> →</button></div></>}
      </dialog>
    </section>
  );
}
