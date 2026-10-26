import type { ComponentDefinition } from './catalog';

export const surfaceComponents: ComponentDefinition[] = [
  {
    slug: 'ripple-field', title: 'Ripple Field', category: 'Backgrounds', tag: 'New',
    description: 'A quiet pool for your next idea. Move across the surface and leave a passing ripple.',
    file: 'RippleField.tsx', cssFile: 'ripple-field.css',
    usage: `import { RippleField } from '@/components/anticraft/RippleField';

export function Example() {
  return (
    <RippleField color="#a7c6dd" maxRipples={12} label="A pool of ideas">
      <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', padding: 32, textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 400 }}>Make a little change.</h2>
      </div>
    </RippleField>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'The content above the still water texture. Links and buttons remain interactive.' },
      { name: 'label', type: 'string', default: "'Ripple field'", description: 'An accessible name for the field.' },
      { name: 'color', type: 'string', default: "'#a7c6dd'", description: 'The base CSS color beneath the layered water texture.' },
      { name: 'maxRipples', type: 'number', default: '12', description: 'The maximum number of active ripples, clamped from 1 to 24. Each ripple contains three concentric rings.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-ripple-height to change the default 300px height and --ac-ripple-ink to change the foreground.' },
    ],
    motion: 'Fine pointer movement creates rings after distance and time thresholds. Click, tap, or use Make a ripple to create one directly. Rings finish within 1.2 seconds, with a bounded pool and no ambient animation. Touch preserves vertical scrolling. Reduced motion disables pointer tracking and uses a brief, still outline for manual actions. The button announces each action without announcing pointer movement.',
  },
  {
    slug: 'before-after', title: 'Before / After', category: 'Cards', tag: 'New',
    description: 'Two points of view, one surface. Pull a fine line between what was and what could be.',
    file: 'BeforeAfter.tsx', cssFile: 'before-after.css',
    usage: `import { BeforeAfter } from '@/components/anticraft/BeforeAfter';

export function Example() {
  return (
    <BeforeAfter
      beforeLabel="First thought"
      afterLabel="Fresh perspective"
      defaultValue={50}
      before={<div style={{ display: 'grid', placeItems: 'center', background: '#c6c5b9', color: '#363a33', fontSize: 58 }}>Aa</div>}
      after={<div style={{ display: 'grid', placeItems: 'center', background: '#e9a577', color: '#59352a', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 72 }}>Aa</div>}
    />
  );
}`,
    props: [
      { name: 'before', type: 'ReactNode', default: 'Required', description: 'Decorative artwork for the left reveal layer. Images fill the surface using object-fit: cover. Keep faces free of controls and provide meaningful descriptions in the labels or surrounding text.' },
      { name: 'after', type: 'ReactNode', default: 'Required', description: 'Decorative artwork beneath the reveal. Both faces stay full size as the dividing line moves; their content is hidden from assistive technology and made inert.' },
      { name: 'beforeLabel', type: 'string', default: "'Before'", description: 'The visible label for the left layer. It is also used in the slider’s accessible name and value.' },
      { name: 'afterLabel', type: 'string', default: "'After'", description: 'The visible label for the right layer. It is also used in the slider’s accessible name and value.' },
      { name: 'defaultValue', type: 'number', default: '50', description: 'The initial percentage of the before layer revealed, rounded and clamped from 0 to 100. Non-finite values fall back to 50.' },
      { name: 'onValueChange', type: '(value: number) => void', default: 'undefined', description: 'Called when the native slider changes the reveal percentage. Use a client component when providing this callback.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-compare-height to change the default 300px height; paper, ink, and focus tokens customize the frame.' },
    ],
    motion: 'Drag the handle along the middle of the artwork or focus the native range and use arrow keys, Home, or End. The 44px horizontal interaction strip preserves vertical touch scrolling. The divider follows the value directly, with no automatic animation or easing. The slider exposes both labels and the current percentage; the visual output does not announce every drag movement.',
  },
];
