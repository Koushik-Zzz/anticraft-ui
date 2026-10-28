import type { ComponentDefinition } from './catalog';

export const peopleProductComponents: ComponentDefinition[] = [
  {
    slug: 'product-gallery', title: 'Product Gallery', category: 'Cards', tag: 'New',
    description: 'Show the product from every useful angle. Thumbnail navigation and an expanded image viewer, built for detail pages and collections.',
    file: 'ProductGallery.tsx', cssFile: 'product-gallery.css',
    usage: `import { ProductGallery } from '@/components/anticraft/ProductGallery';

export function Example() {
  return (
    <ProductGallery
      title="The Everyday Tote"
      defaultValue="front"
      items={[
        { id: 'front', src: '/images/tote-front.jpg', alt: 'Natural canvas tote exterior', caption: 'The Everyday Tote in natural canvas.' },
        { id: 'inside', src: '/images/tote-interior.jpg', alt: 'Tote interior with two pockets', caption: 'Two inside pockets keep small essentials close.' },
        { id: 'detail', src: '/images/tote-detail.jpg', alt: 'Close view of the reinforced canvas stitching', caption: 'Reinforced stitching at the handles.' },
        { id: 'side', src: '/images/tote-side.jpg', alt: 'Side profile showing the tote depth and shoulder strap' },
      ]}
    />
  );
}`,
    useCases: ['Product detail pages', 'Design object collections', 'Material and finish previews'],
    props: [
      { name: 'items', type: 'ProductGalleryItem[]', default: 'Required', description: 'Images with unique id, src, and meaningful alt text. Optional caption adds visible context; optional thumbnail supplies a smaller thumbnail source. Supply your own files for the example image paths. An empty array displays a placeholder without controls.' },
      { name: 'items[].src / alt', type: 'string', default: 'Required', description: 'The original image URL and its accessible description. The same original appears in the main stage and the expanded viewer. Images use object-fit: contain so details are not cropped.' },
      { name: 'items[].caption', type: 'string', default: 'undefined', description: 'Optional visible caption beneath both views. Keep essential visual information in alt text, too.' },
      { name: 'items[].thumbnail', type: 'string', default: 'items[].src', description: 'Optional smaller image for the thumbnail rail. Thumbnail artwork is decorative because each button already describes the image it selects.' },
      { name: 'title', type: 'string', default: "'A closer look'", description: 'A visible heading that also labels the expanded image viewer. An empty string hides the gallery heading; both views retain accessible fallback labels.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The selected image id on the initial render. An unknown or removed id falls back to the first available image.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when a visitor selects a different image, including selection inside the expanded viewer. Supply callbacks from a Client Component in Next.js.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-product-surface, --ac-product-stage, --ac-product-ink, --ac-product-muted, --ac-product-line, and --ac-product-accent on the root.' },
    ],
    motion: 'Choose a thumbnail, or use the previous and next buttons to wrap through the images. Left/Right, Home, and End also select images when a thumbnail has keyboard focus; page-wide shortcuts are not captured. A polite count announces the current position. Expand image opens a native modal with a larger contained image, caption, and its own previous and next controls. The viewer traps focus, closes with Escape or its visible Close button, restores the opener, and temporarily locks background scrolling. Selection in the viewer updates the main gallery. Removing the selected image safely falls back to the first image; removing every image closes an open viewer. A short image entrance is removed for reduced motion. There is no automatic cycling or required swipe gesture. The KIN product artwork in the live demo is original example artwork.',
  },
  {
    slug: 'team-grid', title: 'Team Grid', category: 'Sections', tag: 'New',
    description: 'Introduce the people behind the work. Portrait cards with useful roles, short introductions, and a full profile a visitor can open.',
    file: 'TeamGrid.tsx', cssFile: 'team-grid.css',
    usage: `import { TeamGrid } from '@/components/anticraft/TeamGrid';

export function Example() {
  return (
    <TeamGrid
      title="One studio. Three disciplines."
      items={[
        {
          id: 'mira', name: 'Mira Patel', role: 'Strategy & direction',
          bio: 'Mira helps teams find the clearest version of their story. She brings audience research, thoughtful questions, and a practical plan to every new project.',
          portrait: <img src="/images/mira.jpg" alt="" />,
          links: [{ label: 'Read Mira’s journal', href: '/journal/mira' }],
        },
        {
          id: 'daniel', name: 'Daniel Park', role: 'Product & design',
          bio: 'Daniel turns complex ideas into calm, useful experiences. His work moves between visual systems, product details, and the everyday paths people take through a website.',
          portrait: <img src="/images/daniel.jpg" alt="" />,
        },
        {
          id: 'sofia', name: 'Sofia Reed', role: 'Creative engineering',
          bio: 'Sofia brings ideas to life through accessible, resilient interfaces. She builds the details that make a site feel responsive and works closely with design from the first sketch.',
          portrait: <img src="/images/sofia.jpg" alt="" />,
        },
      ]}
    />
  );
}`,
    useCases: ['Agency about pages', 'Company teams', 'Conference speaker introductions'],
    props: [
      { name: 'items', type: 'TeamGridItem[]', default: 'Required', description: 'People with a unique id, name, role, full bio string, and decorative ReactNode portrait. Optional links are ordinary labeled destinations in the full profile. An empty list displays a quiet placeholder.' },
      { name: 'items[].portrait', type: 'ReactNode', default: 'Required', description: 'A decorative portrait or illustration, rendered inert and hidden from assistive technology because the adjacent heading identifies the person. Keep links and controls out of portraits. Supply your own image files for the example paths.' },
      { name: 'items[].bio', type: 'string', default: 'Required', description: 'The complete introduction. Cards show a preview of up to three lines; the profile shows the whole text and preserves paragraph breaks.' },
      { name: 'items[].links', type: '{ label: string; href: string }[]', default: 'undefined', description: 'Optional ordinary profile links with descriptive visible labels. Links appear outside the decorative portrait. Replace example paths with real destinations in your site; omit links when no destination exists.' },
      { name: 'title', type: 'string', default: "'Meet our team.'", description: 'Visible heading and accessible section name. An empty string hides the heading while retaining an Our team accessible label.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-team-surface, --ac-team-ink, --ac-team-muted, --ac-team-line, and --ac-team-accent on this element.' },
    ],
    motion: 'Every card keeps its name, role, introduction, and Meet button visible on pointer and touch screens. A gentle portrait scale on hover is decorative and removed for reduced motion. Meet opens a native modal with the complete bio and optional profile links. Normal Tab navigation stays inside the open modal; Escape and the visible Close button dismiss it and return focus to the opener. Background scrolling is restored on close or unmount. Removing an open person from items closes their profile safely. The grid responds to its own container, moving from three to two to one column; the compact live demo uses a horizontal rail to keep the full controls visible. All example people and biographies are fictional.',
  },
];
