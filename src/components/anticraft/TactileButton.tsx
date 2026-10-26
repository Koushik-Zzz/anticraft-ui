'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import './tactile-button.css';

export interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/** A raised key with a fixed hit area and a mechanical pressed surface. */
export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  function TactileButton({ children, className = '', type = 'button', ...props }, ref) {
    return (
      <button {...props} ref={ref} type={type} className={`ac-tactile-button ${className}`.trim()}>
        <span className="ac-tactile-button__surface">
          <span className="ac-tactile-button__label">{children}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M19 5v9H5m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    );
  },
);
