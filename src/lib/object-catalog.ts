import type { ComponentDefinition } from './catalog';

export const objectComponents: ComponentDefinition[] = [
  {
    slug: 'peel-reveal', title: 'Peel Reveal', category: 'Experiments', tag: 'New',
    description: 'A little curiosity goes a long way. Peel back a paper corner to discover what’s underneath.',
    file: 'PeelReveal.tsx', cssFile: 'peel-reveal.css',
    usage: `import { PeelReveal } from '@/components/anticraft/PeelReveal';

export function Example() {
  return (
    <PeelReveal
      label="Discover the other side"
      front={<span style={{ display: 'grid', placeItems: 'center', height: '100%', background: '#ea7852', fontSize: 48 }}>Stay curious. ↗</span>}
    >
      <div style={{ padding: 32, background: '#dce9b5', height: '100%' }}>
        <h2>There’s more to the story.</h2>
        <p>A hidden message, project detail, or next idea.</p>
      </div>
    </PeelReveal>
  );
}`,
    props: [
      { name: 'front', type: 'ReactNode', default: 'Required', description: 'Decorative artwork on the paper surface. Keep links and other controls in the revealed content.' },
      { name: 'children', type: 'ReactNode', default: 'Required', description: 'The content underneath. Links and buttons become available when the paper is open.' },
      { name: 'label', type: 'string', default: "'Peel to reveal'", description: 'An accessible label for the reveal control.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Whether the paper starts peeled away.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Called when the open state changes.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-peel-height to size the card.' },
    ],
    motion: 'Drag the corner, or click, tap, or press Enter on the front to reveal the content. A dedicated corner handle preserves ordinary touch scrolling on the rest of the surface. Close restores the paper. Hidden content stays out of the focus order. Reduced motion removes the animated snap.',
  },
  {
    slug: 'orbit-gallery', title: 'Orbit Gallery', category: 'Experiments', tag: 'New',
    description: 'Put your work into orbit. Spin a dimensional wheel of posters, projects, or ideas.',
    file: 'OrbitGallery.tsx', cssFile: 'orbit-gallery.css',
    usage: `import { OrbitGallery } from '@/components/anticraft/OrbitGallery';

export function Example() {
  return (
    <OrbitGallery
      defaultValue="solar"
      items={[
        { id: 'solar', title: 'Solar Studies', subtitle: 'Art direction / 2026', color: '#e98055', content: <span style={{ fontSize: 100 }}>☀</span> },
        { id: 'parallel', title: 'Parallel Play', subtitle: 'Visual identity / 2025', color: '#c8dca4', content: <span style={{ fontSize: 100 }}>✳</span> },
        { id: 'blue', title: 'Blue Hour', subtitle: 'Printed matter / 2025', color: '#b9c9ee', content: <span style={{ fontSize: 100 }}>◒</span> },
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'OrbitGalleryItem[]', default: 'Required', description: 'Items with unique id, title, decorative ReactNode content, and optional subtitle, CSS color, and href.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The id of the item initially placed at the front.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when the selected item changes.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-orbit-height to size the gallery.' },
    ],
    motion: 'Drag horizontally to spin the wheel. Previous and next controls, arrow keys, Home, and End provide direct navigation. Touch gestures preserve vertical page scrolling. Only the selected item is exposed as the current project; an optional href becomes a separate link. Nothing plays automatically. Reduced motion switches selection without animated rotation.',
  },
  {
    slug: 'lenticular-panel', title: 'Lenticular Panel', category: 'Experiments', tag: 'New',
    description: 'Two artworks. One surface. A ribbed print that changes its mind as you move across it.',
    file: 'LenticularPanel.tsx', cssFile: 'lenticular-panel.css',
    usage: `import { LenticularPanel } from '@/components/anticraft/LenticularPanel';

export function Example() {
  const face = { display: 'grid', placeItems: 'center', width: '100%', height: '100%', fontSize: 72 } as const;
  return (
    <LenticularPanel
      front={<span style={{ ...face, background: '#f08056', color: '#342b26' }}>DAY ☀</span>}
      back={<span style={{ ...face, background: '#303c9d', color: '#f5e9c8' }}>NIGHT ☾</span>}
      frontLabel="Day artwork"
      backLabel="Night artwork"
      segments={12}
    />
  );
}`,
    props: [
      { name: 'front', type: 'ReactNode', default: 'Required', description: 'The first decorative artwork. Fill the available width and height; avoid controls or non-unique SVG ids in either artwork.' },
      { name: 'back', type: 'ReactNode', default: 'Required', description: 'The second decorative artwork. Both faces are repeated as hidden visual slices.' },
      { name: 'frontLabel', type: 'string', default: "'First artwork'", description: 'A meaningful name for the first artwork.' },
      { name: 'backLabel', type: 'string', default: "'Second artwork'", description: 'A meaningful name for the second artwork.' },
      { name: 'segments', type: 'number', default: '12', description: 'The number of vertical slats, clamped from 4 to 24.' },
      { name: 'defaultValue', type: 'number', default: '0', description: 'The initial viewing angle from 0 (front) to 1 (back).' },
      { name: 'onValueChange', type: '(value: number) => void', default: 'undefined', description: 'Receives the viewing angle as it changes.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-lenticular-height to size the panel.' },
    ],
    motion: 'A fine pointer changes the viewing angle across the artwork. A native range control and endpoint controls support touch and keyboard use. Repeated visual slices stay hidden from assistive technology. Reduced motion disables pointer tracking and switches directly between the two faces when the angle crosses the midpoint.',
  },
];
