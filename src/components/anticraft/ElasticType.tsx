'use client';

import { useEffect, useMemo, useRef } from 'react';
import './elastic-type.css';

export interface ElasticTypeProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  /** Letter deformation, from 0 (still) to 2. */
  strength?: number;
  /** Pointer influence in pixels. */
  radius?: number;
}

type Vector = [number, number, number, number, number];
type Letter = {
  shell: HTMLElement;
  glyph: HTMLElement;
  x: number;
  y: number;
  size: number;
  value: Vector;
  velocity: Vector;
  target: Vector;
};

function graphemes(value: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value), (segment) => segment.segment);
  }
  // A small fallback keeps common combining marks, emoji modifiers, flags,
  // and joined emoji together without adding a segmentation dependency.
  const clusters: string[] = [];
  for (const point of Array.from(value)) {
    const previous = clusters[clusters.length - 1];
    const joinsPrevious = /\p{Mark}|[\uFE00-\uFE0F\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}]/u.test(point)
      || point === '\u200D'
      || previous?.endsWith('\u200D')
      || (/^[\u{1F1E6}-\u{1F1FF}]$/u.test(point) && /^[\u{1F1E6}-\u{1F1FF}]$/u.test(previous ?? ''));
    if (previous && joinsPrevious) clusters[clusters.length - 1] += point;
    else clusters.push(point);
  }
  return clusters;
}

/** A readable phrase whose letterforms deform around a pointer and spring home. */
export function ElasticType({
  text,
  as: Element = 'p',
  className = '',
  strength = 1,
  radius = 150,
}: ElasticTypeProps) {
  const visualRef = useRef<HTMLSpanElement>(null);
  const parts = useMemo(
    () => text.split(/(\s+)/).map((part) => ({ text: part, characters: graphemes(part) })),
    [text],
  );
  const influence = Number.isFinite(strength) ? Math.min(2, Math.max(0, strength)) : 1;
  const reach = Number.isFinite(radius) ? Math.max(1, radius) : 150;

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const letters: Letter[] = Array.from(
      visual.querySelectorAll<HTMLElement>('.ac-elastic-type__letter'),
      (shell) => ({
        shell,
        glyph: shell.firstElementChild as HTMLElement,
        x: 0,
        y: 0,
        size: 16,
        value: [0, 0, 0, 0, 0],
        velocity: [0, 0, 0, 0, 0],
        target: [0, 0, 0, 0, 0],
      }),
    );
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
    let frame = 0;
    let lastTime = 0;
    let alive = true;
    let inView = true;
    let hovering = false;
    let needsMeasure = true;
    let needsTargets = true;
    let pointerX = 0;
    let pointerY = 0;

    const enabled = () => !motion.matches && finePointer.matches && influence > 0 && inView;

    const clear = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      for (const letter of letters) {
        letter.value.fill(0);
        letter.velocity.fill(0);
        letter.target.fill(0);
        letter.glyph.style.removeProperty('transform');
        letter.glyph.style.removeProperty('will-change');
      }
    };

    const measure = () => {
      // Shells remain at their natural positions while their children transform.
      // Read every rectangle before writing any animation styles.
      for (const letter of letters) {
        const rect = letter.shell.getBoundingClientRect();
        letter.x = rect.left + rect.width / 2;
        letter.y = rect.top + rect.height / 2;
        letter.size = rect.height;
      }
      needsMeasure = false;
    };

    const updateTargets = () => {
      for (const letter of letters) {
        if (!hovering) {
          letter.target.fill(0);
          continue;
        }
        const dx = (letter.x - pointerX) / reach;
        const dy = (letter.y - pointerY) / reach;
        const distance = Math.hypot(dx, dy);
        const force = Math.pow(Math.max(0, 1 - distance), 2) * influence;
        const side = Math.min(1, Math.abs(dx));
        letter.target = [
          dx * letter.size * 0.2 * force,
          -Math.min(40, letter.size * 0.3) * force + dy * letter.size * 0.08 * force,
          (0.34 - side * 0.62) * force,
          (-0.27 + side * 0.86) * force,
          dx * 13 * force,
        ];
      }
      needsTargets = false;
    };

    const animate = (time: number) => {
      frame = 0;
      if (!enabled()) {
        clear();
        return;
      }
      const step = lastTime ? Math.min(2, Math.max(0.25, (time - lastTime) / 16.667)) : 1;
      lastTime = time;
      if (needsMeasure) measure();
      if (needsTargets) updateTargets();
      let unsettled = false;

      for (const letter of letters) {
        let letterMoving = false;
        for (let index = 0; index < 5; index++) {
          const difference = letter.target[index] - letter.value[index];
          letter.velocity[index] = (letter.velocity[index] + difference * 0.14 * step) * Math.pow(0.67, step);
          letter.value[index] += letter.velocity[index] * step;
          const tolerance = index === 2 || index === 3 ? 0.0005 : 0.008;
          if (Math.abs(difference) + Math.abs(letter.velocity[index]) > tolerance) {
            letterMoving = true;
          } else {
            letter.value[index] = letter.target[index];
            letter.velocity[index] = 0;
          }
        }
        const [x, y, stretchX, stretchY, rotation] = letter.value;
        if (!letterMoving && letter.target.every((value) => value === 0)) {
          letter.glyph.style.removeProperty('transform');
          letter.glyph.style.removeProperty('will-change');
        } else {
          letter.glyph.style.transform = `translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotate(${rotation.toFixed(3)}deg) scale(${(1 + stretchX).toFixed(4)}, ${(1 + stretchY).toFixed(4)})`;
          if (letterMoving) letter.glyph.style.willChange = 'transform';
          else letter.glyph.style.removeProperty('will-change');
        }
        unsettled ||= letterMoving;
      }

      if (unsettled) frame = window.requestAnimationFrame(animate);
      else lastTime = 0;
    };

    const start = () => {
      if (!frame && enabled()) frame = window.requestAnimationFrame(animate);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !enabled()) return;
      hovering = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      needsMeasure = true;
      needsTargets = true;
      start();
    };
    const leave = () => {
      hovering = false;
      needsTargets = true;
      start();
    };
    const geometryChanged = () => {
      needsMeasure = true;
      needsTargets = true;
      if (hovering) start();
    };
    const preferenceChanged = () => {
      hovering = false;
      clear();
    };
    const visibilityChanged = () => {
      if (document.hidden) {
        hovering = false;
        clear();
      }
    };

    visual.addEventListener('pointerenter', move);
    visual.addEventListener('pointermove', move);
    visual.addEventListener('pointerleave', leave);
    visual.addEventListener('pointercancel', leave);
    window.addEventListener('scroll', geometryChanged, { capture: true, passive: true });
    window.addEventListener('resize', geometryChanged, { passive: true });
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', visibilityChanged);
    motion.addEventListener('change', preferenceChanged);
    finePointer.addEventListener('change', preferenceChanged);

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(geometryChanged) : undefined;
    resizeObserver?.observe(visual);
    const intersectionObserver = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (!inView) {
          hovering = false;
          clear();
        } else {
          needsMeasure = true;
        }
      })
      : undefined;
    intersectionObserver?.observe(visual);
    document.fonts?.ready.then(() => {
      if (alive) geometryChanged();
    });

    return () => {
      alive = false;
      clear();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      visual.removeEventListener('pointerenter', move);
      visual.removeEventListener('pointermove', move);
      visual.removeEventListener('pointerleave', leave);
      visual.removeEventListener('pointercancel', leave);
      window.removeEventListener('scroll', geometryChanged, true);
      window.removeEventListener('resize', geometryChanged);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', visibilityChanged);
      motion.removeEventListener('change', preferenceChanged);
      finePointer.removeEventListener('change', preferenceChanged);
    };
  }, [Element, text, influence, reach]);

  return (
    <Element className={`ac-elastic-type ${className}`.trim()}>
      <span className="ac-elastic-type__accessible">{text}</span>
      <span ref={visualRef} className="ac-elastic-type__visual" aria-hidden="true">
        {parts.map((part, wordIndex) => /^\s*$/.test(part.text)
          ? part.text
          : (
            <span className="ac-elastic-type__word" key={wordIndex}>
              {part.characters.map((character, characterIndex) => (
                <span className="ac-elastic-type__letter" key={characterIndex}>
                  <span className="ac-elastic-type__glyph">{character}</span>
                </span>
              ))}
            </span>
          ))}
      </span>
    </Element>
  );
}

export default ElasticType;
