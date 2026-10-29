'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './snap-delete.css';

export interface SnapDeleteProps {
  children: ReactNode;
  /** Names the item in the button label and deletion announcement. */
  label?: string;
  /** Animation length in milliseconds, clamped to 600–4000. */
  duration?: number;
  /** Dust cell size in CSS pixels, clamped to 2–8. */
  particleSize?: number;
  buttonLabel?: string;
  restoreLabel?: string;
  disabled?: boolean;
  className?: string;
  /** Called once after the visual deletion finishes. Persist data changes here. */
  onDelete?: () => void;
  /** Called when the retained content is restored. */
  onRestore?: () => void;
}

type State = 'ready' | 'deleting' | 'deleted';
type Fragment = { element: HTMLDivElement; delay: number; dx: number; dy: number; rotation: number };

const bounded = (value: number, fallback: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

// Stable noise keeps the field varied without a random animation on every render.
function noise(index: number) {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** A native delete action that disperses a frozen copy of the actual content. */
export function SnapDelete({
  children, label = 'Item', duration = 1600, particleSize = 3,
  buttonLabel = 'Delete', restoreLabel = 'Undo', disabled = false,
  className = '', onDelete, onRestore,
}: SnapDeleteProps) {
  const [state, setState] = useState<State>('ready');
  const stateRef = useRef<State>('ready');
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const focusOnComplete = useRef(false);
  const frameRef = useRef<number | null>(null);
  const mountedRef = useRef(false);
  const reducedRef = useRef(false);
  const callbacks = useRef({ onDelete, onRestore });

  useEffect(() => { callbacks.current = { onDelete, onRestore }; }, [onDelete, onRestore]);

  useEffect(() => {
    if (state !== 'deleted') return;
    const restoreFocus = focusOnComplete.current;
    focusOnComplete.current = false;
    const button = buttonRef.current;
    if (!restoreFocus || !button || button.disabled || document.hidden) return;
    const bounds = button.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
    // A disabled native button blurs in browsers. Return focus to Undo only if
    // the visitor has not moved to another control during the animation.
    if (document.activeElement === document.body || document.activeElement === button) {
      button.focus({ preventScroll: true });
    }
  }, [state]);

  function clearDust() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    dustRef.current?.replaceChildren();
  }

  function complete() {
    clearDust();
    if (!mountedRef.current || stateRef.current !== 'deleting') return;
    stateRef.current = 'deleted';
    setState('deleted');
    callbacks.current.onDelete?.();
  }

  useEffect(() => {
    mountedRef.current = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motionChange = () => {
      reducedRef.current = media.matches;
      if (media.matches) complete();
    };
    const visibilityChange = () => { if (document.hidden) complete(); };
    motionChange();
    media.addEventListener('change', motionChange);
    document.addEventListener('visibilitychange', visibilityChange);
    // Finish rather than leaving a delete action pending when it leaves the viewport.
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) complete();
    });
    if (rootRef.current) observer?.observe(rootRef.current);
    return () => {
      mountedRef.current = false;
      focusOnComplete.current = false;
      clearDust();
      observer?.disconnect();
      media.removeEventListener('change', motionChange);
      document.removeEventListener('visibilitychange', visibilityChange);
    };
  }, []);

  function erase() {
    if (disabled || stateRef.current !== 'ready') return;
    focusOnComplete.current = document.activeElement === buttonRef.current;
    stateRef.current = 'deleting';
    setState('deleting');
    const content = contentRef.current;
    const dust = dustRef.current;
    const width = content?.offsetWidth ?? 0;
    const height = content?.offsetHeight ?? 0;
    if (!content || !dust || !width || !height || reducedRef.current || document.hidden) {
      complete();
      return;
    }

    // DOM masks preserve real text, colors, and images without reading image pixels.
    // Embedded media, huge trees, or unsupported masks use a short fade instead.
    const elements = [content, ...Array.from(content.querySelectorAll('*'))];
    const supported = typeof CSS !== 'undefined' && CSS.supports('mask-image', 'linear-gradient(black, black)') &&
      elements.length <= 160 && !content.querySelector('iframe, video, audio, canvas, object, embed, script, style, link');
    const fragments: Fragment[] = [];
    if (supported) {
      const frozen = content.cloneNode(true) as HTMLDivElement;
      const copies = [frozen, ...Array.from(frozen.querySelectorAll('*'))];
      elements.forEach((element, index) => {
        const copy = copies[index];
        if (!(copy instanceof HTMLElement || copy instanceof SVGElement)) return;
        const style = window.getComputedStyle(element);
        // Freeze resolved styles once; clones need no app stylesheets or event handlers.
        for (let property = 0; property < style.length; property += 1) {
          const name = style[property];
          copy.style.setProperty(name, style.getPropertyValue(name));
        }
        copy.style.animation = 'none';
        copy.style.transition = 'none';
        copy.removeAttribute('id');
        copy.removeAttribute('name');
        copy.removeAttribute('autofocus');
        if (copy instanceof HTMLInputElement && element instanceof HTMLInputElement) {
          if (copy.type !== 'file') copy.value = element.value;
          copy.checked = element.checked;
        }
        if (copy instanceof HTMLTextAreaElement && element instanceof HTMLTextAreaElement) copy.value = element.value;
        if (copy instanceof HTMLSelectElement && element instanceof HTMLSelectElement) copy.value = element.value;
        if (copy instanceof HTMLImageElement && element instanceof HTMLImageElement && element.currentSrc) {
          copy.removeAttribute('srcset');
          copy.removeAttribute('sizes');
          copy.src = element.currentSrc;
          copy.loading = 'eager';
          copy.decoding = 'sync';
        }
      });
      Object.assign(frozen.style, { width: `${width}px`, height: `${height}px`, margin: '0', visibility: 'visible', position: 'relative', inset: 'auto', transform: 'none' });
      frozen.setAttribute('aria-hidden', 'true');
      frozen.inert = true;

      // At most 12,000 cells and 40 composited layers, even for large targets.
      let cell = Math.max(bounded(particleSize, 3, 2, 8), Math.sqrt(width * height / 12000));
      while (Math.ceil(width / cell) * Math.ceil(height / cell) > 12000) cell *= 1.02;
      const columns = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const masks: string[][] = Array.from({ length: 40 }, () => []);
      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
          const band = Math.min(7, Math.floor(x / columns * 8));
          const layer = band * 5 + Math.floor(noise(x + y * columns) * 5);
          masks[layer].push(`<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`);
        }
      }
      const collection = document.createDocumentFragment();
      masks.forEach((rects, index) => {
        if (!rects.length) return;
        const layer = document.createElement('div');
        layer.className = 'ac-snap-delete__fragment';
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g fill="white">${rects.join('')}</g></svg>`;
        layer.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
        layer.style.width = `${width}px`;
        layer.style.height = `${height}px`;
        layer.appendChild(frozen.cloneNode(true));
        collection.appendChild(layer);
        fragments.push({
          element: layer,
          delay: (1 - Math.floor(index / 5) / 7) * .38 + noise(index + 101) * .09,
          dx: 30 + noise(index + 301) * 72,
          dy: -22 - noise(index + 501) * 62,
          rotation: (noise(index + 701) - .5) * 13,
        });
      });
      dust.appendChild(collection);
    }

    rootRef.current?.setAttribute('data-renderer', fragments.length ? 'dust' : 'fade');

    const milliseconds = fragments.length ? bounded(duration, 1600, 600, 4000) : 180;
    let startedAt: number | null = null;
    function tick(now: number) {
      if (!mountedRef.current || stateRef.current !== 'deleting') return;
      if (startedAt === null) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / milliseconds);
      if (fragments.length) {
        fragments.forEach(({ element, delay, dx, dy, rotation }) => {
          const local = Math.min(1, Math.max(0, (progress - delay) / (1 - delay)));
          const drift = local ** 1.4;
          element.style.transform = `translate3d(${dx * drift}px, ${dy * drift}px, 0) rotate(${rotation * drift}deg)`;
          element.style.opacity = `${1 - local ** 1.8}`;
        });
      } else {
        content!.style.opacity = `${1 - progress}`;
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else complete();
    }
    frameRef.current = requestAnimationFrame(tick);
  }

  function restore() {
    if (disabled || stateRef.current !== 'deleted') return;
    clearDust();
    if (contentRef.current) contentRef.current.style.removeProperty('opacity');
    stateRef.current = 'ready';
    setState('ready');
    callbacks.current.onRestore?.();
  }

  const deleted = state === 'deleted';
  return <div ref={rootRef} className={`ac-snap-delete ${className}`.trim()} data-state={state} role="group" aria-label={label}>
    <div className="ac-snap-delete__stage" aria-busy={state === 'deleting'}>
      <div className="ac-snap-delete__empty" aria-hidden={!deleted}><span aria-hidden="true">⌁</span><span>Deleted</span></div>
      <div ref={element => { contentRef.current = element; if (element) element.inert = state !== 'ready'; }} className="ac-snap-delete__content" aria-hidden={state !== 'ready'}>{children}</div>
      <div ref={element => { dustRef.current = element; if (element) element.inert = true; }} className="ac-snap-delete__dust" aria-hidden="true" />
    </div>
    <div className="ac-snap-delete__controls">
      <button ref={buttonRef} type="button" className="ac-snap-delete__button" disabled={disabled || state === 'deleting'} onClick={deleted ? restore : erase} aria-label={`${deleted ? restoreLabel : buttonLabel} ${label}`}>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" width="16" height="16">
          {deleted ? <path d="M6 5 2.5 8.5 6 12M3 8.5h9a4.5 4.5 0 1 1 0 9"/> : <><path d="M3.5 5.5h13M7 5.5V3h6v2.5M5 5.5l.75 12h8.5l.75-12M8.25 8.5v6M11.75 8.5v6"/></>}
        </svg>
        {state === 'deleting' ? 'Deleting…' : deleted ? restoreLabel : buttonLabel}
      </button>
    </div>
    <span className="ac-snap-delete__announcement" role="status">{deleted ? `${label} deleted. ${restoreLabel} available.` : ''}</span>
  </div>;
}
