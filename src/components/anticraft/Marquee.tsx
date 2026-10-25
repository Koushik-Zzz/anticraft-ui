'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import './marquee.css';

export interface MarqueeProps {
  children: ReactNode;
  /** Duration of one loop, in seconds. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

/** A seamless strip with one accessible copy and a persistent pause control. */
export function Marquee({
  children,
  speed = 24,
  reverse = false,
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const duration = Number.isFinite(speed) && speed > 0 ? speed : 24;
  const style = { '--ac-marquee-duration': `${duration}s` } as CSSProperties;

  return (
    <div
      className={`ac-marquee ${className}`.trim()}
      style={style}
      data-reverse={reverse}
      data-paused={paused}
      data-pause-on-hover={pauseOnHover}
    >
      <div className="ac-marquee__track">
        <div className="ac-marquee__group">{children}</div>
        <div
          className="ac-marquee__group ac-marquee__duplicate"
          aria-hidden="true"
          ref={(element) => { element?.setAttribute('inert', ''); }}
        >
          {children}
        </div>
      </div>
      <button
        className="ac-marquee__toggle"
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? 'Resume scrolling' : 'Pause scrolling'}
      >
        <span aria-hidden="true">{paused ? '↗' : 'Ⅱ'}</span>
      </button>
    </div>
  );
}

export default Marquee;
