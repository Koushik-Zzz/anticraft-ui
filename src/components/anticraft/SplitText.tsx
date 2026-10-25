'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './split-text.css';

export interface SplitTextProps {
  text: string;
  className?: string;
  /** The stagger between words, in seconds. */
  delay?: number;
  /** Change this value to replay the reveal. */
  replayKey?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/** Reveals words once on entry while preserving one complete screen reader phrase. */
export function SplitText({
  text,
  className = '',
  delay = 0.06,
  replayKey = 0,
  as: Element = 'p',
}: SplitTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);
  const stagger = Number.isFinite(delay) ? Math.max(0, delay) : 0.06;
  let wordIndex = 0;

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    setVisible(false);

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let observer: IntersectionObserver | undefined;
    const reveal = () => {
      frame = window.requestAnimationFrame(() => setVisible(true));
      observer?.disconnect();
    };
    const handlePreference = () => {
      if (preference.matches) reveal();
    };

    if (preference.matches || !('IntersectionObserver' in window)) {
      reveal();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        { threshold: 0.1 },
      );
      observer.observe(element);
    }

    preference.addEventListener('change', handlePreference);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      preference.removeEventListener('change', handlePreference);
    };
  }, [text, replayKey]);

  return (
    <Element className={`ac-split-text ${className}`.trim()} data-visible={visible}>
      <span className="ac-split-text__accessible">{text}</span>
      <span ref={textRef} className="ac-split-text__visual" aria-hidden="true">
        {text.split(/(\s+)/).map((part, index) => {
          if (/^\s+$/.test(part)) return part;
          if (!part) return null;
          const style = { '--ac-word-delay': `${wordIndex++ * stagger}s` } as CSSProperties;
          return (
            <span className="ac-split-text__mask" key={`${replayKey}-${index}`}>
              <span className="ac-split-text__word" style={style}>{part}</span>
            </span>
          );
        })}
      </span>
    </Element>
  );
}

export default SplitText;
