import type { ComponentDefinition } from './catalog';

export const commerceComponents: ComponentDefinition[] = [
  {
    slug: 'product-quick-view', title: 'Product Quick View', category: 'Cards', tag: 'New',
    description: 'A considered object, a closer look. Product cards open a detailed image gallery, real finish choices, and useful specifications without losing your place.',
    file: 'ProductQuickView.tsx', cssFile: 'product-quick-view.css',
    usage: `import { ProductQuickView } from '@/components/anticraft/ProductQuickView';

export function Example() {
  return (
    <ProductQuickView
      title="MONO 01"
      eyebrow="SOUND OBJECTS / 01"
      subtitle="A quieter kind of presence."
      price="$390"
      description="One considered object for the spaces where life happens. A sculpted body, an acoustic grille, and one tactile volume dial."
      images={[{ id: 'front', src: '/images/speaker-graphite.jpg', alt: 'Graphite speaker shown from the front and side' }]}
      variants={[
        { id: 'graphite', label: 'Graphite', color: '#343936', images: [
          { id: 'front', src: '/images/speaker-graphite.jpg', alt: 'Graphite speaker shown from the front and side' },
          { id: 'detail', src: '/images/speaker-detail.jpg', alt: 'Close view of the top dial and acoustic mesh' },
        ] },
        { id: 'chalk', label: 'Chalk', color: '#e8e5dd', images: [
          { id: 'front', src: '/images/speaker-chalk.jpg', alt: 'Speaker in a pale Chalk finish' },
        ] },
      ]}
      specifications={[
        { label: 'Dimensions', value: '270 × 140 × 130 mm' },
        { label: 'Materials', value: 'Aluminum / acoustic mesh' },
      ]}
      action={{ label: 'View the product', href: '/products/mono-01' }}
    />
  );
}`,
    useCases: ['Curated product collections', 'Furniture and design stores', 'Merchandise and material previews'],
    props: [
      { name: 'title / description / price', type: 'string', default: 'Required', description: 'Product name, full description, and a preformatted price such as $390 or €240. The name labels the card and native modal. Descriptions preserve paragraph breaks. The component does not process purchases.' },
      { name: 'images', type: 'ProductQuickViewImage[]', default: 'Required', description: 'Images with unique id, src, and meaningful alt text. Used when variants are omitted or the selected variant has an empty image list. Supply your own files for example image paths. Empty lists show an Image coming soon placeholder.' },
      { name: 'eyebrow / subtitle', type: 'string', default: 'undefined', description: 'Optional collection label above the card image and secondary text beneath the product name. The collection label also appears in the modal header.' },
      { name: 'variants', type: 'ProductQuickViewVariant[]', default: '[]', description: 'Optional finishes with unique id, label, images, and optional CSS color and preformatted price. Selecting a finish actually replaces its image list, resets to its first image, and updates an optional variant price. An empty image list uses the base images.' },
      { name: 'specifications', type: 'ProductQuickViewSpecification[]', default: '[]', description: 'Optional label/value strings rendered as a semantic definition list, such as dimensions, material, and collection.' },
      { name: 'defaultVariant / defaultImage', type: 'string', default: 'First available item', description: 'Initial variant and image ids. Unknown or removed ids safely fall back to the first available variant or image. Defaults are read on initial render; data changes do not call user callbacks.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary product-page link, separate from the quick-view opener. Activating it closes the modal before following its supplied destination. Replace example destinations with real pages on your site. The live demo links to visible local design stories.' },
      { name: 'onSelectionChange', type: '(selection: ProductQuickViewSelection) => void', default: 'undefined', description: 'Called once when a visitor changes the image or finish. Receives the current variant and image objects, either optional when unavailable. Selecting the active item and fallback after data changes do not notify. Pass callbacks from a Client Component in Next.js.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Called when a visitor opens or closes the quick view. Closing with Escape, Close, an ordinary product action, or a completed outside-backdrop click reports false. Unmount cleanup does not notify.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-quick-view-surface, --ac-quick-view-stage, --ac-quick-view-ink, --ac-quick-view-muted, --ac-quick-view-line, and --ac-quick-view-accent. --ac-quick-view-card-ratio changes the card image-stage aspect ratio. Dialog width is bounded to 1120px and available viewport space.' },
    ],
    motion: 'The always-visible Quick view button opens a native modal with a contained product image, manually selected thumbnail gallery, finish controls, specifications, and an optional ordinary product link. The native dialog traps focus, closes with Escape, restores the opener, and locks background page scrolling while open. A visible Close control stays at the top of the internally scrolling dialog on short screens. A backdrop press must begin and end outside the dialog to close it. Thumbnail Left/Right, Home, and End keys select and focus images; page-wide arrow shortcuts are not captured. Desktop details sit beside the image; the modal stacks below 720px. A small entrance and image change maintain visual continuity; reduced motion removes both and disables the decorative hover lift. Every product has independent, unique dialog ids. The MONO renders and KIN illustrations in the demo are original fictional product studies.',
    inspiration: { name: 'Motion-Primitives / Shadcnblocks', url: 'https://motion-primitives.com/docs/morphing-dialog', note: 'The continuity of Motion-Primitives’ morphing dialog and the practical product-detail anatomy of Shadcnblocks’ quick views inspired this independent, dependency-free implementation. Anticraft uses an explicit card opener and a native modal, with original product studies, actual finish image swaps, keyboard gallery controls, and an ordinary product-page action. See also https://www.shadcnblocks.com/blocks/product-quick-view.' },
  },
];
