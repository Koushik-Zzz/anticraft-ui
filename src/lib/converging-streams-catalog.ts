import type { ComponentDefinition } from './catalog';

export const convergingStreamsComponents: ComponentDefinition[] = [{
  slug: 'converging-streams', title: 'Converging Streams', category: 'Diagrams', tag: 'New',
  description: 'Curved signal paths and moving packets frame a call to action.',
  file: 'ConvergingStreams.tsx', cssFile: 'converging-streams.css',
  usage: `import { ConvergingStreams } from '@/components/anticraft/ConvergingStreams';

export function Example() {
  return (
    <ConvergingStreams duration={8} interactive>
      <h2>Connect your workflow</h2>
      <a href="/integrations">Explore integrations</a>
    </ConvergingStreams>
  );
}`,
  props: [
    { name: 'children', type: 'ReactNode', default: 'Required', description: 'Your heading, links, or other content in the central space.' },
    { name: 'colors', type: 'string[]', default: 'Four muted signal colors', description: 'CSS colors repeated across the paths. An empty array uses the default palette.' },
    { name: 'duration', type: 'number', default: '8', description: 'Seconds per packet journey, clamped to 2–30.' },
    { name: 'direction', type: "'inward' | 'outward'", default: "'inward'", description: 'Moves packets toward or away from the center.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'External pause override. The built-in motion button is disabled while true.' },
    { name: 'defaultPaused', type: 'boolean', default: 'false', description: 'Initial state of the built-in motion control.' },
    { name: 'tone', type: "'dark' | 'light'", default: "'dark'", description: 'Surface and text palette; override CSS variables for your brand.' },
    { name: 'interactive', type: 'boolean', default: 'true', description: 'Reveals flowing, refracted-light patterns in an ASCII field with a soft pointer wake. Set false to keep only the lines. Touch and reduced motion skip the field.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional classes on the container.' },
  ],
  motion: 'The native pause button freezes packets and clears the pointer field. Reduced motion shows static paths and packets. Animation also pauses when the component is offscreen or the document is hidden. The optional canvas field responds to mouse or pen movement, fades on exit, and ignores touch. Both decorative layers leave links and keyboard focus available.',
  useCases: ['Integration sections', 'Product CTAs', 'Workflow pages'],
  inspiration: { name: 'RouterPlus', url: 'https://routerplus.com/', note: 'The live CTA’s curved paths, traveling signals, and pointer-following ASCII cloud informed this original SVG and Canvas 2D composition. Content, colors, direction, timing, and pointer interaction are configurable.' },
}];
