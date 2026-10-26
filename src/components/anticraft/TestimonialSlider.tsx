'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import './testimonial-slider.css';

export interface TestimonialSliderItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  portrait?: ReactNode;
  metric?: { value: string; label: string };
}

export interface TestimonialSliderProps {
  items: TestimonialSliderItem[];
  title?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
}

/** Client stories that advance only when a visitor asks. Portraits are decorative. */
export function TestimonialSlider({
  items,
  title = 'Good words. Real partnerships.',
  defaultValue,
  onValueChange,
  className = '',
}: TestimonialSliderProps) {
  const instanceId = useId();
  const [selectedId, setSelectedId] = useState(defaultValue ?? items[0]?.id);
  const foundIndex = items.findIndex((item) => item.id === selectedId);
  const index = foundIndex < 0 ? 0 : foundIndex;
  const item = items[index];
  const titleId = `${instanceId}-title`;
  const storyId = `${instanceId}-story`;

  function select(nextIndex: number) {
    const next = items[(nextIndex + items.length) % items.length];
    if (!next || next.id === item?.id) return;
    setSelectedId(next.id);
    onValueChange?.(next.id);
  }

  return (
    <section
      className={`ac-proof ${className}`.trim()}
      aria-roledescription="carousel"
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : 'Client stories'}
    >
      {title && <h3 className="ac-proof-title" id={titleId}>{title}</h3>}
      <div className="ac-proof-stage" id={storyId} aria-live="polite" aria-atomic="true">
        {item ? (
          <figure className="ac-proof-story" key={item.id}>
            <div className="ac-proof-portrait" aria-hidden="true">
              {item.portrait ?? <span className="ac-proof-initial">{Array.from(item.name.trim())[0] ?? '✳'}</span>}
            </div>
            <blockquote className="ac-proof-quote"><p>{item.quote}</p></blockquote>
            <figcaption className="ac-proof-credit">
              <span className="ac-proof-name">{item.name}</span>
              <span className="ac-proof-role">{item.role}{item.company ? `, ${item.company}` : ''}</span>
              {item.metric && <span className="ac-proof-metric"><strong>{item.metric.value}</strong><span>{item.metric.label}</span></span>}
            </figcaption>
          </figure>
        ) : <p className="ac-proof-empty">No client stories yet.</p>}
      </div>
      {item && (
        <div className="ac-proof-controls" role="group" aria-label="Choose a client story">
          <div className="ac-proof-paging">
            <button className="ac-proof-arrow" type="button" aria-label="Previous client story" aria-controls={storyId} disabled={items.length < 2} onClick={() => select(index - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            </button>
            <span className="ac-proof-count" aria-hidden="true">{String(index + 1).padStart(2, '0')}<span>/ {String(items.length).padStart(2, '0')}</span></span>
            <button className="ac-proof-arrow" type="button" aria-label="Next client story" aria-controls={storyId} disabled={items.length < 2} onClick={() => select(index + 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
          <div className="ac-proof-dots">
            {items.map((entry, entryIndex) => (
              <button
                key={entry.id}
                type="button"
                className="ac-proof-dot"
                aria-label={`Show story ${entryIndex + 1} of ${items.length}: ${entry.name}${entry.company ? ` from ${entry.company}` : ''}`}
                aria-pressed={entryIndex === index}
                aria-controls={storyId}
                onClick={() => select(entryIndex)}
              ><span aria-hidden="true" /></button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
