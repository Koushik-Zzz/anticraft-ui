'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import './outline-trace-button.css';

export interface OutlineTraceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/** A quiet outline that draws around a stable, native button. */
export const OutlineTraceButton = forwardRef<HTMLButtonElement, OutlineTraceButtonProps>(
  function OutlineTraceButton({ children, className = '', type = 'button', ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={`ac-outline-trace-button ${className}`.trim()}
      >
        <svg className="ac-outline-trace-button__line" aria-hidden="true" focusable="false">
          <rect x="1" y="1" pathLength="100" />
        </svg>
        <span className="ac-outline-trace-button__label">{children}</span>
        <span className="ac-outline-trace-button__mark" aria-hidden="true">↗</span>
      </button>
    );
  },
);
