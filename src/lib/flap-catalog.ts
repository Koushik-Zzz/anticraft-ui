import type { ComponentDefinition } from './catalog';

export const flapComponents: ComponentDefinition[] = [
  {
    slug: 'split-flap', title: 'Split Flap', category: 'Typography', tag: 'New',
    description: 'A departure-board display with hinged letters and a cascading flip.',
    file: 'SplitFlap.tsx', cssFile: 'split-flap.css',
    usage: `'use client';

import { useState } from 'react';
import { SplitFlap } from '@/components/anticraft/SplitFlap';

export function Example() {
  const [text, setText] = useState('STAY\\nCURIOUS');
  return (
    <div style={{ maxWidth: 360, padding: 24, background: '#e8dc9c' }}>
      <SplitFlap text={text} label="Next departure" duration={500} stagger={35} />
      <button type="button" onClick={() => setText(text === 'STAY\\nCURIOUS' ? 'MAKE\\nWAVES' : 'STAY\\nCURIOUS')}>
        Change departure
      </button>
    </div>
  );
}`,
    props: [
      { name: 'text', type: 'string', default: 'Required', description: 'The complete phrase. Spaces, punctuation, Unicode code points, and newline characters are preserved. Long phrases wrap instead of being truncated.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'An optional description placed before the complete phrase in the accessible image name. Decorative tile faces are hidden from assistive technology.' },
      { name: 'duration', type: 'number', default: '500', description: 'The duration of an individual flip in milliseconds, clamped from 150 to 1500.' },
      { name: 'stagger', type: 'number', default: '35', description: 'The delay between tiles in milliseconds, clamped from 0 to 150. Cascading delays stop growing after 1500ms so long phrases finish promptly.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-flap-surface, --ac-flap-color, --ac-flap-font, --ac-flap-tile-width, --ac-flap-tile-height, and --ac-flap-gap.' },
    ],
    motion: 'The first render contains the actual text. Changed letters flip in a short mechanical cascade, and another change safely replaces the current animation. There is no automatic cycling. Reduced motion shows each new phrase immediately. Supply changing text from a Client Component; the example includes that boundary. The component exposes one complete accessible phrase without an automatic live announcement; add a separate status message when the surrounding interaction needs one.',
  },
];
