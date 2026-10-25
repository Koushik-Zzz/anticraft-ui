'use client';

import { useEffect, useRef, type ButtonHTMLAttributes, type PointerEvent } from 'react';
import './magnetic-button.css';

export interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** How far the surface follows the pointer, from 0 to 1. */
  strength?: number;
}

/** A stable button hit area with a softly moving visual surface. */
export function MagneticButton({
  children,
  className = '',
  strength = 0.2,
  disabled = false,
  type = 'button',
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  onFocus,
  ...props
}: MagneticButtonProps) {
  const surfaceRef = useRef<HTMLSpanElement>(null);
  const canAnimateRef = useRef(false);

  const resetPosition = () => {
    if (surfaceRef.current) {
      surfaceRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
  };

  useEffect(() => {
    const preference = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    const updatePreference = () => {
      canAnimateRef.current = preference.matches;
      if (!preference.matches) resetPosition();
    };

    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (disabled) resetPosition();
  }, [disabled]);

  const moveSurface = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (
      event.defaultPrevented ||
      disabled ||
      !canAnimateRef.current ||
      event.pointerType === 'touch' ||
      !surfaceRef.current ||
      event.currentTarget.matches(':focus-visible')
    ) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const amount = Number.isFinite(strength) ? Math.min(1, Math.max(0, strength)) : 0.2;
    const x = (event.clientX - bounds.left - bounds.width / 2) * amount;
    const y = (event.clientY - bounds.top - bounds.height / 2) * amount;
    surfaceRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`ac-magnetic-button ${className}`.trim()}
      onPointerMove={moveSurface}
      onPointerLeave={(event) => {
        resetPosition();
        onPointerLeave?.(event);
      }}
      onPointerCancel={(event) => {
        resetPosition();
        onPointerCancel?.(event);
      }}
      onFocus={(event) => {
        resetPosition();
        onFocus?.(event);
      }}
    >
      <span ref={surfaceRef} className="ac-magnetic-button__surface">
        {children}
      </span>
    </button>
  );
}

export default MagneticButton;
