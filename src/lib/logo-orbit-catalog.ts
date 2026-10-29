import type { ComponentDefinition } from './catalog';

export const logoOrbitComponents: ComponentDefinition[] = [{
  slug: 'logo-orbit', title: 'Logo Orbit', category: 'Diagrams', tag: 'New',
  description: 'Upright logo badges orbit a fixed center on two circular paths.',
  file: 'LogoOrbit.tsx', cssFile: 'logo-orbit.css',
  usage: `import { LogoOrbit } from '@/components/anticraft/LogoOrbit';

export function Example() {
  return (
    <LogoOrbit
      center={<span>A</span>}
      centerLabel="Acme"
      duration={60}
      items={[
        { id: 'files', label: 'Files', logo: <span>◈</span>, size: 72 },
        { id: 'chat', label: 'Chat', logo: <span>✳</span>, size: 64 },
        { id: 'calendar', label: 'Calendar', logo: <span>▦</span>, size: 76 },
        { id: 'tasks', label: 'Tasks', logo: <span>✓</span>, orbit: 'inner', size: 52 },
      ]}
    />
  );
}`,
  props: [
    { name: 'items', type: 'LogoOrbitItem[]', default: 'Required', description: 'Logos with unique id, label, ReactNode logo, optional inner/outer orbit, badge size and href. Empty ids/labels and duplicate ids are ignored. Up to twelve items are shown; a maximum of six use the inner path, with additional inner requests moved to the outer path.' },
    { name: 'center', type: 'ReactNode', default: 'Geometric A mark', description: 'Decorative artwork in the fixed central disk. Use an inline SVG or an image with an empty alt attribute.' },
    { name: 'centerLabel', type: 'string', default: "'Workspace'", description: 'Accessible name of the center and destination shown in the selection caption.' },
    { name: 'duration', type: 'number', default: '60', description: 'Seconds per outer revolution, clamped to 20–180. The inner path takes 70% of this duration. Nonfinite values fall back to 60.' },
    { name: 'reverse', type: 'boolean', default: 'false', description: 'Reverses both paths while keeping the logos upright.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'External pause override. The built-in pause button is disabled while true.' },
    { name: 'defaultSelectedId', type: 'string', default: 'First item', description: 'Initial selection. Falls back to the first item if that id is absent or removed.' },
    { name: 'onItemSelect', type: '(id: string) => void', default: 'undefined', description: 'Called when a badge is activated. A supplied href also navigates through a native link.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional classes. Style the surface, hub and ring CSS variables to match your brand. Badge sizes are specified at a 560px stage and scale with it, with a 36px minimum target; valid sizes are 44–80 outer and 44–64 inner.' },
  ],
  motion: 'The center remains fixed while the two paths rotate at different speeds. Each badge counter-rotates to keep its artwork upright. Hover or focus a badge to hold the paths still, then click, Enter or Space to select it. Native links retain their normal behavior. Pause, reduced motion, offscreen state and hidden documents stop the orbit without resetting its phase. Logo artwork and the center should contain no nested controls.',
  useCases: ['Integration sections', 'Partner ecosystems', 'Connected apps'],
}];
