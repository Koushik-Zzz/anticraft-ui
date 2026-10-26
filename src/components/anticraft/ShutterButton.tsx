'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import './shutter-button.css';

export interface ShutterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/** A native button with opposing diagonal shutters and a rotating plus. */
export const ShutterButton = forwardRef<HTMLButtonElement, ShutterButtonProps>(
  function ShutterButton({ children, className = '', type = 'button', ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={`ac-shutter-button ${className}`.trim()}
      >
        <span className="ac-shutter-button__surface">
          <span className="ac-shutter-button__label">{children}</span>
          <svg
            className="ac-shutter-button__plus"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M5 12h14M12 5v14" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      </button>
    );
  },
);

export default ShutterButton;
