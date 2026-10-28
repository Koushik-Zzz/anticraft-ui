import type { ComponentDefinition } from './catalog';

export const expandableGalleryComponents: ComponentDefinition[] = [
  {
    slug: 'expandable-gallery',
    title: 'Expandable Gallery',
    category: 'Sections',
    tag: 'New',
    description: 'Image panels that expand on selection, with stacked cards on small screens.',
    file: 'ExpandableGallery.tsx',
    cssFile: 'expandable-gallery.css',
    usage: `import { ExpandableGallery } from '@/components/anticraft/ExpandableGallery';

export function Example() {
  return (
    <ExpandableGallery
      title="Selected projects"
      items={[
        { id: 'hearth', title: 'Hearth House', meta: 'Residential architecture', src: '/images/hearth.jpg', alt: 'A concrete house above the coast', href: '/projects/hearth' },
        { id: 'headland', title: 'Headland Retreat', meta: 'Coastal hospitality', src: '/images/headland.jpg', alt: 'A timber retreat overlooking the ocean', imagePosition: '70% 50%', href: '/projects/headland' },
        { id: 'terrace', title: 'The Living Edge', meta: 'Interiors', src: '/images/terrace.jpg', alt: 'A shaded terrace beside an open living space', href: '/projects/terrace' },
      ]}
    />
  );
}`,
    useCases: ['Architecture portfolios', 'Destination galleries', 'Selected project collections'],
    props: [
      { name: 'items', type: 'ExpandableGalleryItem[]', default: 'Required', description: 'Images with a unique id, title, src and alt. Optional meta, imagePosition, href and linkLabel fields add supporting details and a separate destination link. Supply your own image files and real destination URLs. An empty list shows an empty state.' },
      { name: 'title', type: 'string', default: "'Selected projects'", description: 'Heading above the panels. Pass an empty string to omit it; the section keeps an accessible name.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The initially selected image id. Missing or removed selections fall back to the first available item.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when a visitor selects a different image. Pass callbacks from a client component.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-expandable-ink, --ac-expandable-muted, --ac-expandable-line, --ac-expandable-radius and --ac-expandable-height. Panels stack below a component width of 580px.' },
      { name: 'item.href', type: 'string', default: 'undefined', description: 'Optional native link shown in the selected panel. It is separate from the selection button. The demo opens the original image file; installed galleries follow your supplied destination.' },
    ],
    motion: 'Click, tap, Enter or Space to expand a panel. Arrow keys move and select adjacent panels; Home and End select the first or last. Every selection button remains in the Tab order. Narrow containers stack all panels without hiding their images or names. Reduced motion removes panel, image and link transitions.',
  },
];
