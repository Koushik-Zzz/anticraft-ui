import type { ComponentDefinition } from './catalog'

export const orbitNetworkComponents: ComponentDefinition[] = [{
  slug: 'orbit-network', title: 'Orbit Network', category: 'Diagrams', tag: 'New',
  description: 'A rotating integration map with an ASCII particle field and packets moving toward a central hub.',
  file: 'OrbitNetwork.tsx', cssFile: 'orbit-network.css',
  usage: `import { OrbitNetwork } from '@/components/anticraft/OrbitNetwork';

export function Example() {
  return (
    <OrbitNetwork
      centerLabel="Workspace"
      nodes={[
        { id: 'database', label: 'Database', symbol: <span>◫</span> },
        { id: 'storage', label: 'Storage', symbol: <span>▧</span> },
        { id: 'queue', label: 'Queue', symbol: <span>»</span> },
        { id: 'search', label: 'Search', symbol: <span>⌕</span> },
        { id: 'analytics', label: 'Analytics', symbol: <span>▥</span> },
        { id: 'events', label: 'Events', symbol: <span>✳</span> },
      ]}
    />
  );
}`,
  props: [
    { name: 'nodes', type: 'OrbitNetworkNode[]', default: 'Eight sample integrations', description: 'Connections with unique nonempty id, label, and optional decorative ReactNode symbol. Up to twelve unique items are shown. Invalid and duplicate ids are omitted. An empty array keeps the hub and shows an empty caption.' },
    { name: 'center', type: 'ReactNode', default: 'Geometric hub symbol', description: 'Decorative artwork in the central square. Keep it free of controls; centerLabel supplies the accessible name.' },
    { name: 'centerLabel', type: 'string', default: "'Workspace'", description: 'Accessible hub name and visible connection destination in the caption.' },
    { name: 'defaultSelectedId', type: 'string', default: 'First node', description: 'Initial selected connection. If that id is missing or removed, the first available node is displayed.' },
    { name: 'onNodeChange', type: '(id: string) => void', default: 'undefined', description: 'Receives the connection id when its button is activated. Supply this callback from a client component.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'Externally stops all animation. The built-in pause control can also pause locally when this is false.' },
    { name: 'speed', type: 'number', default: '1', description: 'Animation multiplier, clamped from 0.2 to 2. The default completes one network rotation in 144 seconds; nonfinite values fall back to 1.' },
    { name: 'color', type: 'string', default: "'#5d43ee'", description: 'CSS color for particles, selected connections, packets, and focus indicators.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Customize --ac-orbit-paper, --ac-orbit-ink, --ac-orbit-muted, and --ac-orbit-line. The square diagram scales to its container with a maximum width of 640px.' },
  ],
  motion: 'The ring rotates slowly while symbols stay upright, the ASCII field shifts, and square packets move inward. Hovering or focusing a connection holds the diagram still for selection. Tab reaches every connection and the pause control; Enter or Space selects a node and updates its caption. Pause motion freezes all animation. Reduced motion renders a still diagram and disables the pause control. Animation stops offscreen and while the document is hidden; observers, media listeners, and animation frames are removed on unmount. Canvas particles are decorative; connections and their selected state remain native HTML buttons.',
  useCases: ['Integration directories', 'Infrastructure feature sections', 'API platform diagrams'],
  inspiration: { name: 'RouterPlus', url: 'https://routerplus.com/', note: 'RouterPlus’s rotating provider network informed the annular ASCII texture, thin connector geometry, and inbound square packets. Anticraft uses original integration symbols, configurable content, native connection controls, and an independent React, canvas, and SVG implementation.' },
}]
