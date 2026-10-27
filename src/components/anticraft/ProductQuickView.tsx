'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import './product-quick-view.css';

export interface ProductQuickViewImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductQuickViewVariant {
  id: string;
  label: string;
  color?: string;
  images: ProductQuickViewImage[];
  price?: string;
}

export interface ProductQuickViewSpecification {
  label: string;
  value: string;
}

export interface ProductQuickViewSelection {
  variant?: ProductQuickViewVariant;
  image?: ProductQuickViewImage;
}

export interface ProductQuickViewProps {
  title: string;
  description: string;
  price: string;
  images: ProductQuickViewImage[];
  eyebrow?: string;
  subtitle?: string;
  variants?: ProductQuickViewVariant[];
  specifications?: ProductQuickViewSpecification[];
  defaultVariant?: string;
  defaultImage?: string;
  action?: { label: string; href: string };
  onSelectionChange?: (selection: ProductQuickViewSelection) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A product card with an intentionally opened native product-detail dialog. */
export function ProductQuickView({
  title,
  description,
  price,
  images,
  eyebrow,
  subtitle,
  variants = [],
  specifications = [],
  defaultVariant,
  defaultImage,
  action,
  onSelectionChange,
  onOpenChange,
  className = '',
}: ProductQuickViewProps) {
  const [variantId, setVariantId] = useState(defaultVariant ?? variants[0]?.id ?? '');
  const [imageId, setImageId] = useState(defaultImage ?? '');
  const [expanded, setExpanded] = useState(false);
  const isOpen = useRef(false);
  const modal = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const imageButtons = useRef(new Map<string, HTMLButtonElement>());
  const backdropStarted = useRef(false);
  const instance = useId();
  const titleId = `ac-quick-view-title-${instance}`;
  const dialogId = `ac-quick-view-dialog-${instance}`;
  const dialogTitleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const variant = variants.find(item => item.id === variantId) ?? variants[0];
  const currentImages = variant?.images.length ? variant.images : images;
  const foundImage = currentImages.findIndex(item => item.id === imageId);
  const imageIndex = foundImage < 0 ? 0 : foundImage;
  const image = currentImages[imageIndex];
  const currentPrice = variant?.price ?? price;

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [expanded]);

  useEffect(() => {
    const dialog = modal.current;
    return () => { if (dialog?.open) dialog.close(); };
  }, []);

  function publishOpen(next: boolean) {
    if (isOpen.current === next) return;
    isOpen.current = next;
    setExpanded(next);
    onOpenChange?.(next);
  }

  function open() {
    if (!modal.current || modal.current.open) return;
    modal.current.showModal();
    publishOpen(true);
  }

  function close() {
    if (modal.current?.open) modal.current.close();
    publishOpen(false);
    opener.current?.focus({ preventScroll: true });
  }

  function chooseImage(index: number) {
    const next = currentImages[index];
    if (!next || next.id === image?.id) return;
    setImageId(next.id);
    onSelectionChange?.({ variant, image: next });
  }

  function chooseVariant(next: ProductQuickViewVariant) {
    if (next.id === variant?.id) return;
    const nextImage = (next.images.length ? next.images : images)[0];
    setVariantId(next.id);
    setImageId(nextImage?.id ?? '');
    onSelectionChange?.({ variant: next, image: nextImage });
  }

  function onImageKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % currentImages.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + currentImages.length) % currentImages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = currentImages.length - 1;
    else return;
    event.preventDefault();
    chooseImage(next);
    imageButtons.current.get(currentImages[next].id)?.focus({ preventScroll: true });
    imageButtons.current.get(currentImages[next].id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function isBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  }

  return <article className={`ac-product-quick-view ${className}`.trim()} aria-labelledby={titleId}>
    <div className="ac-quick-view-card-stage">
      {eyebrow && <span className="ac-quick-view-eyebrow">{eyebrow}</span>}
      {image ? <img className="ac-quick-view-card-image" src={image.src} alt={image.alt} loading="lazy" /> : <span className="ac-quick-view-empty">Image coming soon</span>}
      <button ref={opener} type="button" className="ac-quick-view-trigger" aria-haspopup="dialog" aria-expanded={expanded} aria-controls={dialogId} aria-label={`Quick view ${title}`} onClick={open}>
        <span>Quick view</span><span aria-hidden="true">↗</span>
      </button>
    </div>
    <div className="ac-quick-view-card-info">
      <div><h3 id={titleId}>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
      <span className="ac-quick-view-card-price">{currentPrice}</span>
    </div>
    <dialog
      ref={modal}
      id={dialogId}
      className="ac-quick-view-dialog"
      aria-labelledby={dialogTitleId}
      aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); close(); }}
      onClose={() => { if (!modal.current?.open && isOpen.current) close(); }}
      onPointerDown={event => { backdropStarted.current = isBackdrop(event); }}
      onPointerCancel={() => { backdropStarted.current = false; }}
      onClick={event => { if (backdropStarted.current && isBackdrop(event)) close(); backdropStarted.current = false; }}
    >
      <div className="ac-quick-view-dialog-shell">
        <header className="ac-quick-view-dialog-top"><span>{eyebrow ?? 'A CLOSER LOOK'}</span><button type="button" className="ac-quick-view-close" autoFocus aria-label={`Close ${title} quick view`} onClick={close}><span>Close</span><span aria-hidden="true">×</span></button></header>
        <div className="ac-quick-view-dialog-layout">
          <div className="ac-quick-view-gallery">
            <div className="ac-quick-view-image-stage">{image ? <img key={`${variant?.id ?? ''}-${image.id}`} src={image.src} alt={image.alt} className="ac-quick-view-large-image" /> : <span className="ac-quick-view-empty">Image coming soon</span>}</div>
            {currentImages.length > 1 && <div className="ac-quick-view-gallery-bottom"><div className="ac-quick-view-thumbnails" role="group" aria-label={`Images of ${title}`}>
              {currentImages.map((item, index) => <button key={item.id} ref={element => { if (element) imageButtons.current.set(item.id, element); else imageButtons.current.delete(item.id); }} type="button" aria-label={`Show image ${index + 1}: ${item.alt}`} aria-pressed={item.id === image?.id} onClick={() => chooseImage(index)} onKeyDown={event => onImageKey(event, index)}><img src={item.src} alt="" loading="lazy" /></button>)}
            </div><span className="ac-quick-view-image-count" aria-live="polite" aria-atomic="true">{imageIndex + 1} / {currentImages.length}</span></div>}
          </div>
          <div className="ac-quick-view-details">
            <div className="ac-quick-view-dialog-heading"><p className="ac-quick-view-overline">CONSIDERED IN EVERY DETAIL</p><h2 id={dialogTitleId}>{title}</h2>{subtitle && <p className="ac-quick-view-subtitle">{subtitle}</p>}</div>
            <p className="ac-quick-view-price" aria-live="polite" aria-atomic="true">{currentPrice}</p>
            <p id={descriptionId} className="ac-quick-view-description">{description}</p>
            {variants.length > 0 && <fieldset className="ac-quick-view-finishes"><legend>Finish <span aria-live="polite">/ {variant?.label}</span></legend><div>{variants.map(item => <button type="button" key={item.id} aria-label={`Finish: ${item.label}`} aria-pressed={item.id === variant?.id} onClick={() => chooseVariant(item)}><span className="ac-quick-view-swatch" style={{ background: item.color ?? 'currentColor' }} aria-hidden="true" /><span>{item.label}</span><span className="ac-quick-view-finish-indicator" aria-hidden="true">{item.id === variant?.id ? '●' : '○'}</span></button>)}</div></fieldset>}
            {specifications.length > 0 && <dl className="ac-quick-view-specifications">{specifications.map((item, index) => <div key={`${item.label}-${index}`}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>}
            {action && <a className="ac-quick-view-action" href={action.href} onClick={close}><span>{action.label}</span><span aria-hidden="true">↗</span></a>}
          </div>
        </div>
      </div>
    </dialog>
  </article>;
}
