import type { ComponentDefinition } from './catalog'

export const visualHeroComponents: ComponentDefinition[] = [
  {
    slug: 'scroll-expand-hero',
    title: 'Scroll Expand Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'A considered first impression: expressive type, a real next step, and an image that opens into the page as you scroll.',
    file: 'ScrollExpandHero.tsx',
    cssFile: 'scroll-expand-hero.css',
    usage: `import { ScrollExpandHero } from '@/components/anticraft/ScrollExpandHero';

export function Example() {
  return (
    <ScrollExpandHero
      eyebrow="A DIFFERENT WAY OUT"
      title={'A little further.\\nA little closer.'}
      description="Thoughtful journeys for people who like to take the long way."
      media={<img src="/images/coast.jpg" alt="" />}
      action={{ label: 'Explore our journeys', href: '/journeys' }}
      caption="MORE TIME OUT THERE. LESS TIME PLANNING."
    />
  );
}`,
    useCases: ['Travel landing pages', 'Hospitality websites', 'Brand introductions', 'Campaign openings'],
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible h2 and section name. Newline characters create intentional line breaks; keep the title concise. Place your page’s h1 elsewhere or adjust the copied source to match your heading hierarchy.' },
      { name: 'media', type: 'ReactNode', default: 'Required', description: 'Decorative artwork or an image with alt="". The media wrapper is aria-hidden and inert, so keep all links, controls and meaningful information outside it. Images and videos fill the frame with object-fit: cover. Supply your own local image; /images/coast.jpg is an example path.' },
      { name: 'eyebrow', type: 'string', default: 'undefined', description: 'A short category or brand introduction above the title.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Supporting text, kept visible throughout the scene.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary anchor with a visible label and a real destination. It supports keyboard activation, modified clicks and opening in a new tab. Replace the sample /journeys URL with a route on your site.' },
      { name: 'caption', type: 'string', default: 'undefined', description: 'A short visible line at the foot of the scene. It begins below the framed artwork and overlays the image once it fills the scene. Put essential image information here or in the description.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-scroll-expand-paper, --ac-scroll-expand-ink, --ac-scroll-expand-muted and --ac-scroll-expand-heading-font. The bounded scene uses roughly 1.8 viewport heights; allow native vertical scrolling and avoid clipping its ancestors. Keep enough viewport height for the title and image.' },
    ],
    motion: 'Native vertical scrolling grows the decorative image from a 68%-wide frame beneath the copy into the entire sticky scene, expanding both its width and height. Its corners move from 28px to 0 and the text rises by at most 14px. Light text stays above a dark green background and a dark image gradient throughout the transition. The scene follows the nearest actual vertical scroll container or the page, measuring at most once per animation frame, and its sticky content stops at the end of the section. Resizing the copy, caption or viewport recalculates the initial image frame. No wheel or touch events are intercepted. All text and the CTA remain visible and operable. Reduced motion shows a complete static image behind readable copy without a sticky scroll scene. The demo is a keyboard-focusable scroll region, and its links open a complete local case study.',
  },
  {
    slug: 'editorial-hero',
    title: 'Editorial Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'Oversized typography, an asymmetric image, and a clear invitation to read on. A quiet opening for studios and independent publications.',
    file: 'EditorialHero.tsx',
    cssFile: 'editorial-hero.css',
    usage: `import { EditorialHero } from '@/components/anticraft/EditorialHero';

export function Example() {
  return (
    <EditorialHero
      eyebrow="OBSERVATIONS FROM OUT THERE"
      title={'A different\\npoint of view.'}
      description="On places that make us pause, the people who shape them, and the details we carry home."
      image={{ src: '/images/coast.jpg', alt: 'A winding path above a quiet coastal bay.' }}
      action={{ label: 'Read the journal', href: '/journal' }}
      meta="ISSUE 008 / OPEN HORIZONS"
    />
  );
}`,
    useCases: ['Design journals', 'Architecture practices', 'Studio portfolios', 'Editorial landing pages'],
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible h2 and section name. Newlines create line breaks. The layout handles longer words with wrapping; concise titles work best. Adjust the copied heading level if this is your page’s primary h1.' },
      { name: 'image', type: '{ src: string; alt: string }', default: 'Required', description: 'The editorial image source and meaningful alternative text. This image remains available to assistive technology. Supply your own image at the example /images/coast.jpg path or change the URL.' },
      { name: 'eyebrow', type: 'string', default: 'undefined', description: 'A short category or publication label in the top rule.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'A concise introduction beside the image on wide layouts and below it on compact layouts.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary anchor to your journal, project, or other real route. Keyboard, touch, modified clicks and open-in-new-tab behavior remain native.' },
      { name: 'meta', type: 'string', default: 'undefined', description: 'Optional issue, location or project metadata, aligned to the right of the top rule.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-editorial-paper, --ac-editorial-ink, --ac-editorial-muted and --ac-editorial-heading-font. At 600px component width and below, the image sits above the supporting text in one column.' },
    ],
    motion: 'A passive scroll listener moves only the image, bounded to 24px in either direction. Its overscan keeps the image window filled. Text and links stay in the normal document flow. Compact layouts and reduced-motion preferences use a static image; reduced motion also removes the link-arrow transition. There is no automatic animation or scroll capture. The demo’s links open the complete local Mono architecture case study.',
  },
]
