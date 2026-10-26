'use client';

import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import './rolling-text-button.css';

export interface RollingTextButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** A plain-text label. Its decorative letters roll while its accessible name stays fixed. */
  children: string;
}

/** A typographic action with a staggered, vertical letter roll. */
export const RollingTextButton = forwardRef<HTMLButtonElement, RollingTextButtonProps>(
  function RollingTextButton(
    { children, className = '', type = 'button', disabled = false, ...props },
    ref,
  ) {
    let letterIndex = 0;

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        className={`ac-rolling-text ${className}`.trim()}
      >
        <span className="ac-rolling-text__accessible">{children}</span>
        <span className="ac-rolling-text__visual" aria-hidden="true">
          {children.split(/(\s+)/).map((word, wordIndex) => {
            if (!word || /^\s+$/.test(word)) return word;

            return (
              <span key={wordIndex} className="ac-rolling-text__word">
                {Array.from(word).map((character, index) => {
                  const delay = Math.min(letterIndex++, 16) * 16;

                  return (
                    <span
                      key={index}
                      className="ac-rolling-text__window"
                      style={{ '--ac-roll-delay': `${delay}ms` } as CSSProperties}
                    >
                      <span className="ac-rolling-text__glyph">{character}</span>
                      <span className="ac-rolling-text__glyph">{character}</span>
                    </span>
                  );
                })}
              </span>
            );
          })}
        </span>
      </button>
    );
  },
);

export default RollingTextButton;
