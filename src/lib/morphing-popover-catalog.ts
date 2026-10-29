import type { ComponentDefinition } from './catalog';

export const morphingPopoverComponents: ComponentDefinition[] = [{
  slug: 'morphing-popover', title: 'Morphing Popover', category: 'Layout', tag: 'New',
  description: 'A pill expands into a card with a shared surface and a soft blur transition.',
  file: 'MorphingPopover.tsx', cssFile: 'morphing-popover.css',
  usage: `'use client';

import { useState } from 'react';
import { MorphingPopover } from '@/components/anticraft/MorphingPopover';

export function Example() {
  const [open, setOpen] = useState(false);
  const [approved, setApproved] = useState(false);

  return (
    <MorphingPopover
      label="Release approval"
      trigger={approved ? 'Release approved' : 'Review release'}
      open={open}
      onOpenChange={setOpen}
    >
      <h3>Approve the release notes?</h3>
      <p>Version 2.4 is ready for your sign-off.</p>
      <button type="button" onClick={() => { setApproved(true); setOpen(false); }}>
        Approve release
      </button>
    </MorphingPopover>
  );
}`,
  props: [
    { name: 'trigger', type: 'ReactNode', default: 'Required', description: 'Content for the native pill button. Text, icons, and decorative avatars work here; do not nest links or buttons.' },
    { name: 'label', type: 'string', default: 'Required', description: 'Accessible name for the nonmodal dialog and its Open/Close controls.' },
    { name: 'children', type: 'ReactNode', default: 'Required', description: 'Card content and native actions. Children remain mounted when closed, preserving local state. The component supplies the Close control.' },
    { name: 'open', type: 'boolean', default: 'undefined', description: 'Controlled open state. Pair with onOpenChange; child actions can close the card by updating this value.' },
    { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when open is not supplied.' },
    { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Requests a change after native trigger/Close activation, Escape, or an outside pointer press. Controlled callers apply the new value.' },
    { name: 'collapsedWidth', type: 'number', default: '240', description: 'Pill width in pixels, clamped to 160–360 and no wider than the expanded card.' },
    { name: 'expandedWidth', type: 'number', default: '350', description: 'Card width in pixels, clamped to 240–560 and fitted to its available container width.' },
    { name: 'duration', type: 'number', default: '420', description: 'Shape transition in milliseconds, clamped to 160–900. Outgoing copy fades first; incoming copy sharpens during the latter part of the morph. Nonfinite numeric props use their defaults.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Customize --ac-morph-surface, --ac-morph-text, --ac-morph-muted, and --ac-morph-border. A centered parent with a stable height keeps the morph anchored like the demos.' },
  ],
  motion: 'One rounded surface changes its actual width, measured height, and corner radius around a shared center. Separate content layers fade and blur in sequence so typography stays unscaled. Native controls, Escape, outside dismissal, linked dialog semantics, and focus return support keyboard use. Inactive layers are inert and hidden from assistive technology; the card is nonmodal and does not trap focus. Content and container changes remeasure the height. Reduced motion removes shape, blur, and mote animations. Motion runs only after state changes, with no idle animation loop.',
  useCases: ['Notification summaries', 'Task assistants', 'Inline confirmations'],
}];
