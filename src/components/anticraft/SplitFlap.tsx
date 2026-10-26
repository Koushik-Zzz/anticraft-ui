'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import './split-flap.css';

export interface SplitFlapProps {
  text: string;
  className?: string;
  /** An optional description placed before the complete accessible text. */
  label?: string;
  /** The duration of one mechanical flip, in milliseconds. */
  duration?: number;
  /** The delay between tiles, in milliseconds. */
  stagger?: number;
}

/** A departure-board display that flips only when its supplied text changes. */
export function SplitFlap({
  text,
  className = '',
  label,
  duration = 500,
  stagger = 35,
}: SplitFlapProps) {
  const [display, setDisplay] = useState({ text, previous: text, revision: 0 });
  const [settledRevision, setSettledRevision] = useState(0);
  const flipDuration = Number.isFinite(duration) ? Math.min(1500, Math.max(150, duration)) : 500;
  const tileStagger = Number.isFinite(stagger) ? Math.min(150, Math.max(0, stagger)) : 35;

  // Adjusting this component's own render state keeps a new phrase and its old
  // tile faces together, without first painting the new text and then jumping back.
  if (display.text !== text) {
    setDisplay({ text, previous: display.text, revision: display.revision + 1 });
  }

  const characters = Array.from(display.text);
  const previousCharacters = Array.from(display.previous);
  const tileCount = characters.filter((character) => character !== '\n' && character !== '\r').length;
  const lastDelay = Math.min(1500, Math.max(0, tileCount - 1) * tileStagger);
  const isFlipping = display.revision > settledRevision;

  useEffect(() => {
    if (display.revision === 0) return;
    const revision = display.revision;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    const settle = () => {
      if (timer !== undefined) clearTimeout(timer);
      setSettledRevision(revision);
    };
    const handlePreference = () => {
      if (preference.matches) settle();
    };
    if (preference.matches) settle();
    else timer = setTimeout(settle, flipDuration + lastDelay + 50);
    preference.addEventListener('change', handlePreference);
    return () => {
      if (timer !== undefined) clearTimeout(timer);
      preference.removeEventListener('change', handlePreference);
    };
  }, [display.revision, flipDuration, lastDelay]);

  let tileIndex = 0;
  const style = { '--ac-flap-duration': `${flipDuration}ms` } as CSSProperties;

  return (
    <div
      className={`ac-flap ${className}`.trim()}
      role="img"
      aria-label={label ? `${label}: ${text}` : text}
      style={style}
    >
      <div className="ac-flap__tiles" aria-hidden="true">
        {characters.map((character, index) => {
          if (character === '\r') return null;
          if (character === '\n') return <span className="ac-flap__break" key={`break-${index}`} />;
          const previous = previousCharacters[index];
          const oldCharacter = previous && previous !== '\n' && previous !== '\r' ? previous : ' ';
          const changing = isFlipping && oldCharacter !== character;
          const tileStyle = { '--ac-flap-delay': `${Math.min(1500, tileIndex++ * tileStagger)}ms` } as CSSProperties;
          return (
            <span className="ac-flap__tile" key={`${display.revision}-${index}`} style={tileStyle}>
              <span className="ac-flap__letter">{character === ' ' ? '\u00a0' : character}</span>
              {changing && <>
                <span className="ac-flap__half ac-flap__old-bottom"><span>{oldCharacter === ' ' ? '\u00a0' : oldCharacter}</span></span>
                <span className="ac-flap__half ac-flap__old-top"><span>{oldCharacter === ' ' ? '\u00a0' : oldCharacter}</span></span>
                <span className="ac-flap__half ac-flap__new-bottom"><span>{character === ' ' ? '\u00a0' : character}</span></span>
              </>}
              <span className="ac-flap__seam" />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default SplitFlap;
