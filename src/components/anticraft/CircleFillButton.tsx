'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import './circle-fill-button.css';

export interface CircleFillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/** A native button with a circular background reveal and a directional arrow. */
export const CircleFillButton = forwardRef<HTMLButtonElement, CircleFillButtonProps>(
  function CircleFillButton({ children, className = '', type = 'button', ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={`ac-circle-fill-button ${className}`.trim()}
      >
        <span className="ac-circle-fill-button__surface">
          <span className="ac-circle-fill-button__label">{children}</span>
          <svg
            className="ac-circle-fill-button__arrow"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      </button>
    );
  },
);

export default CircleFillButton;
