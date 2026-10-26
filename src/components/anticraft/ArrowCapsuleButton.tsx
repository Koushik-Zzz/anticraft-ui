'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import './arrow-capsule-button.css';

export interface ArrowCapsuleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** A decorative icon. Defaults to a diagonal arrow. */
  icon?: ReactNode;
}

function DiagonalArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" focusable="false">
      <path
        d="M6 18 18 6M6 6h12v12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function makeDecorative(node: HTMLSpanElement | null) {
  node?.setAttribute('inert', '');
}

/** A capsule action with a clipped, repeating arrow inside its circular end cap. */
export const ArrowCapsuleButton = forwardRef<HTMLButtonElement, ArrowCapsuleButtonProps>(
  function ArrowCapsuleButton(
    { children, icon, className = '', type = 'button', disabled = false, ...props },
    ref,
  ) {
    const arrow = icon ?? <DiagonalArrow />;

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        disabled={disabled}
        className={`ac-arrow-capsule ${className}`.trim()}
      >
        <span className="ac-arrow-capsule__label">{children}</span>
        <span
          ref={makeDecorative}
          className="ac-arrow-capsule__circle"
          aria-hidden="true"
        >
          <span className="ac-arrow-capsule__icon ac-arrow-capsule__icon--first">
            {arrow}
          </span>
          <span className="ac-arrow-capsule__icon ac-arrow-capsule__icon--next">
            {arrow}
          </span>
        </span>
      </button>
    );
  },
);

export default ArrowCapsuleButton;
