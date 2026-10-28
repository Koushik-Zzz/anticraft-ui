import type { ComponentDefinition } from './catalog';

export const signalFunnelComponents: ComponentDefinition[] = [{
  slug: 'signal-funnel', title: 'Signal Funnel', category: 'Diagrams', tag: 'New',
  description: 'An animated particle stream with switchable processing stages.',
  file: 'SignalFunnel.tsx', cssFile: 'signal-funnel.css',
  usage: `import { SignalFunnel } from '@/components/anticraft/SignalFunnel';

export function Example() {
  return <SignalFunnel
    gates={[
      { id: 'redact', label: 'Redact' },
      { id: 'validate', label: 'Validate' },
      { id: 'encrypt', label: 'Encrypt' },
    ]}
    inputLabel="Incoming events"
    outputLabel="Processed events"
  />;
}`,
  props: [
    { name: 'gates', type: 'readonly SignalFunnelGate[]', default: 'Redact, Validate, Encrypt', description: 'Up to five stages with unique nonempty ids and labels. Duplicate or empty ids are ignored. An empty array removes the stage switches.' },
    { name: 'enabledGateIds', type: 'readonly string[]', default: 'undefined', description: 'Controlled selection. Omit for internal state. Unknown ids are ignored.' },
    { name: 'defaultEnabledGateIds', type: 'readonly string[]', default: 'All initial stages', description: 'Initial internal selection. Stages added after mount start bypassed.' },
    { name: 'onGatesChange', type: '(enabledIds: string[]) => void', default: 'undefined', description: 'Called after a stage button is activated. The array follows stage order. Supply from a Client Component in Next.js.' },
    { name: 'inputLabel / outputLabel', type: 'string', default: "'Incoming events' / 'Processed events'", description: 'Short labels at the entrance and exit of the particle stream.' },
    { name: 'accent', type: 'string', default: "'#7950f2'", description: 'CSS color for canvas particles and controls. Customize --ac-signal-ink, --ac-signal-muted, --ac-signal-line and --ac-signal-surface through className.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'Externally stops animation and disables the built-in play control. Visitors can also pause through the built-in control when false.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional section classes. The diagram changes to a vertical flow below a 600px container width.' },
  ],
  motion: 'Particles flow through a narrowing field at up to 30 frames per second. Stage buttons narrow or bypass portions of the stream and announce the selection. The pause control freezes the current frame. Reduced motion shows a static frame; hidden documents and offscreen diagrams suspend the animation. This is an illustrative diagram and does not process, redact or encrypt data.',
  useCases: ['Event pipelines', 'Data processing diagrams', 'Product feature sections'],
  inspiration: { name: 'RouterPlus', url: 'https://routerplus.com/', note: 'Inspired by its moving particle funnels and thin processing gates. Original canvas rendering and stage controls.' },
}];
