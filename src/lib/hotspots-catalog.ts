import type { ComponentDefinition } from './catalog';

export const hotspotsComponents: ComponentDefinition[] = [
  {
    slug: 'image-hotspots', title: 'Image Hotspots', category: 'Sections', tag: 'New',
    description: 'Clickable image annotations with detail cards that stay inside the image and move below it on small screens.',
    file: 'ImageHotspots.tsx', cssFile: 'image-hotspots.css',
    usage: `import { ImageHotspots } from '@/components/anticraft/ImageHotspots';

export function Example() {
  return (
    <ImageHotspots
      image="/images/room.jpg"
      alt="Reading corner with an oak chair and a floor lamp"
      items={[
        {
          id: 'chair', label: 'Oak lounge chair', x: 0.35, y: 0.6,
          description: 'Solid oak frame with a woven linen seat.',
          price: '$480',
          action: { label: 'View chair', href: '/products/oak-lounge-chair' },
        },
        {
          id: 'lamp', label: 'Arc floor lamp', x: 0.76, y: 0.22,
          description: 'A brushed steel arm with an adjustable shade.',
        },
      ]}
    />
  );
}`,
    useCases: ['Shoppable room photographs', 'Architectural material annotations', 'Product feature diagrams'],
    props: [
      { name: 'image / alt', type: 'string', default: 'Required', description: 'Image source and meaningful alternative text. The image preserves its intrinsic proportions without cropping, so marker positions stay aligned. Supply your own file for the example image path.' },
      { name: 'items', type: 'ImageHotspotItem[]', default: 'Required', description: 'Annotations with unique id, accessible label, and normalized x/y coordinates from 0 to 1. Optional title replaces the visible label in the detail card. Optional description, preformatted price, and action { label, href } add information. Coordinates are clamped to the image edges; invalid numbers fall back to the centre.' },
      { name: 'defaultActiveId', type: 'string', default: 'undefined', description: 'Initially expanded annotation id. An unknown or removed id displays no card. Current content is derived from the supplied items, so edits do not leave stale detail text.' },
      { name: 'caption', type: 'string', default: 'undefined', description: 'Optional image caption beneath the annotation area.' },
      { name: 'onActiveChange', type: '(item: ImageHotspotItem | null) => void', default: 'undefined', description: 'Receives the selected annotation after a visitor opens it, or null when they close it. Data changes do not notify. Pass callbacks from a Client Component in Next.js.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-hotspots-surface, --ac-hotspots-ink, --ac-hotspots-muted, --ac-hotspots-accent, and --ac-hotspots-line. The component uses its container width, independent of the page viewport.' },
    ],
    motion: 'Click or activate a marker with Enter or Space to toggle its detail. One annotation is open at a time. Escape and the card’s Close button close it and return focus to its marker; clicking or focusing outside closes it without moving focus. The card is a nonmodal labelled region with ordinary links. At widths below 560px it sits beneath the image; larger containers clamp the measured card inside the image. Reduced motion removes the short entrance and marker transition. Use unique item ids and uncropped source images. The demo uses Anticraft’s existing fictional architectural study.',
  },
];
