import type { ComponentDefinition } from './catalog';

export const playComponents: ComponentDefinition[] = [
  {
    slug: 'cursor-trail', title: 'Cursor Trail', category: 'Experiments', tag: 'New',
    description: 'Leave a little art wherever curiosity goes. A trail of prints that follows your next move.',
    file: 'CursorTrail.tsx', cssFile: 'cursor-trail.css',
    usage: `import { CursorTrail } from '@/components/anticraft/CursorTrail';

export function Example() {
  return (
    <CursorTrail items={[
      { id: 'sun', label: 'Orange sun print', content: <span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#e88355', fontSize: 60 }}>☀</span> },
      { id: 'flower', label: 'Purple flower print', content: <span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#c9b7e3', fontSize: 60 }}>✳</span> },
    ]} spacing={60} lifetime={1400}>
      <p style={{ textAlign: 'center', padding: 48 }}>Make a little scene.</p>
    </CursorTrail>
  );
}`,
    props: [
      { name: 'items', type: 'CursorTrailItem[]', default: 'Required', description: 'Prints with a unique id, accessible label, and decorative ReactNode content. Artwork fills each print.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'The content behind the prints. Its links and controls remain interactive.' },
      { name: 'spacing', type: 'number', default: '60', description: 'The distance in pixels between pointer stamps.' },
      { name: 'lifetime', type: 'number', default: '1400', description: 'How long a moving print stays visible, in milliseconds.' },
      { name: 'maxVisible', type: 'number', default: '8', description: 'The maximum number of prints kept on the field.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-trail-height and --ac-trail-stamp-width to size the field and prints.' },
    ],
    motion: 'A fine pointer leaves prints after a distance threshold. Tap the field or use Stamp artwork for a keyboard alternative; Clear trail removes all prints. Decorative prints do not intercept controls. Reduced motion disables pointer tracking and animation; manual stamps remain still.',
  },
  {
    slug: 'throw-stack', title: 'Throw Stack', category: 'Experiments', tag: 'New',
    description: 'Ideas worth throwing around. Grab the top print, flick it aside, and see what’s next.',
    file: 'ThrowStack.tsx', cssFile: 'throw-stack.css',
    usage: `import { ThrowStack } from '@/components/anticraft/ThrowStack';

export function Example() {
  return <ThrowStack items={[
    { id: 'big', title: 'Big Ideas', subtitle: 'Poster study / 01', color: '#c8b2e2', content: <span style={{ fontSize: 72 }}>✳</span> },
    { id: 'small', title: 'Small Wonders', subtitle: 'Poster study / 02', color: '#dce8a9', content: <span style={{ fontSize: 72 }}>◒</span> },
    { id: 'wild', title: 'Wild Thoughts', subtitle: 'Poster study / 03', color: '#ee9a72', content: <span style={{ fontSize: 72 }}>↗</span> },
  ]} />;
}`,
    props: [
      { name: 'items', type: 'ThrowStackItem[]', default: 'Required', description: 'Prints with unique id, title, decorative ReactNode content, and optional subtitle, CSS color, and href.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The id of the print initially on top.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when a throw or navigation action changes the selected print.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-throw-height to size the stack.' },
    ],
    motion: 'Drag the top print horizontally and release to throw it; a short drag returns it to the stack. Previous and next controls, arrow keys, Home, and End offer direct navigation. Prints cycle without being removed from the collection. Touch preserves vertical scrolling. Reduced motion changes the selection immediately without a fly-out.',
  },
  {
    slug: 'elastic-type', title: 'Elastic Type', category: 'Experiments', tag: 'New',
    description: 'Give your words a little give. Letterforms stretch, lean, and spring back around the pointer.',
    file: 'ElasticType.tsx', cssFile: 'elastic-type.css',
    usage: `import { ElasticType } from '@/components/anticraft/ElasticType';

export function Example() {
  return (
    <div style={{ padding: 32, background: '#cadd8d', fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 800 }}>
      <ElasticType as="h2" text="MAKE WAVES" strength={1} radius={150} />
    </div>
  );
}`,
    props: [
      { name: 'text', type: 'string', default: 'Required', description: 'The complete phrase. Screen readers receive one uninterrupted copy.' },
      { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p'", default: "'p'", description: 'The semantic element for the phrase.' },
      { name: 'strength', type: 'number', default: '1', description: 'The deformation strength, clamped from 0 to 2.' },
      { name: 'radius', type: 'number', default: '150', description: 'How far the pointer affects nearby letters, in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. The component inherits font, size, weight, and color.' },
    ],
    motion: 'Letterforms respond to a fine pointer and settle back when it leaves. The phrase wraps naturally and remains readable without JavaScript. Coarse pointers and reduced motion receive static typography. The decorative split letters are hidden from assistive technology.',
  },
];
