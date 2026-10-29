import type { ComponentDefinition } from './catalog';

export const particleTextComponents: ComponentDefinition[] = [{
  slug: 'particle-text', title: 'Particle Text', category: 'Typography', tag: 'New',
  description: 'Scattered dots gather into a headline, then resolve into solid text.',
  file: 'ParticleText.tsx', cssFile: 'particle-text.css',
  usage: `import { ParticleText } from '@/components/anticraft/ParticleText';

export function Example() {
  return (
    <div style={{ background: '#1e1e1e', color: '#eee', padding: 32 }}>
      <ParticleText text="Anticraft." as="h2" duration={4.2} />
    </div>
  );
}`,
  props: [
    { name: 'text', type: 'string', default: 'Required', description: 'The headline. Explicit newline characters create multiple lines. Short phrases work best. The text remains in the HTML for accessibility and the no-canvas fallback.' },
    { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p'", default: "'h2'", description: 'Semantic element for the real text. The decorative canvas is hidden from assistive technology.' },
    { name: 'duration', type: 'number', default: '4.2', description: 'Seconds for scatter, gathering, and the final solid-text dissolve. Clamped to 1–12; nonfinite values use the default.' },
    { name: 'fontSize', type: 'number', default: '180', description: 'Maximum font size in pixels, clamped to 24–320. Every line scales down to fit the container. Font family, weight, and color can be customized through CSS.' },
    { name: 'particleCount', type: 'number', default: '3200', description: 'Maximum sampled dots, clamped to 300–6000. Smaller text may use fewer particles.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'External pause override. Preserves the reveal position and disables the internal motion toggle.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Shows native Replay animation and Pause/Play motion controls. Replay restarts the reveal and respects the current pause state.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional root classes. The component uses the available width and inherits its font family and color.' },
  ],
  motion: 'The reveal plays once when it enters the viewport. A cloud of dots gathers into the letter shapes, then dissolves into selectable HTML text. Replay starts it again. Pausing, hiding the document, or scrolling it offscreen stops its animation frame without skipping ahead. Reduced motion shows solid text immediately. Resizing preserves progress and rebuilds the sampled letters; an unavailable canvas falls back to naturally wrapping HTML text.',
  inspiration: { name: 'Orgo', url: 'https://www.orgo.ai/', note: 'A live study of the closing call to action: scattered particles form letters before resolving into solid text. Original implementation.' },
  useCases: ['Product headlines', 'Closing calls to action', 'Launch announcements'],
}];
