import type { ComponentDefinition } from './catalog'

export const visualHeroComponents: ComponentDefinition[] = [
  {
    slug: 'scroll-expand-hero',
    title: 'Frame Morph Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'One composition, three perspectives. A portrait window becomes a panorama, then the whole scene, while type, crop and project details move with it.',
    file: 'ScrollExpandHero.tsx',
    cssFile: 'scroll-expand-hero.css',
    usage: `import { ScrollExpandHero } from '@/components/anticraft/ScrollExpandHero';

export function Example() {
  return (
    <ScrollExpandHero
      eyebrow="SPACES FOR THE SENSES"
      title={'Space to\\nfeel more.'}
      description="Architecture that makes room for a different way of being."
      media={<img src="/images/architecture.jpg" alt="" />}
      action={{ label: 'Explore the project', href: '/projects/casa-forma' }}
      caption={'Casa Forma / Portugal\\nA study in living slowly.'}
      chapters={['The approach', 'A wider view', 'Feel at home']}
    />
  );
}`,
    useCases: ['Architecture portfolios', 'Hotel and destination launches', 'Real estate project pages', 'Editorial brand introductions'],
    inspiration: { name: 'FORMAT by Obys', url: 'https://format.obys.agency/', note: 'FORMAT’s changing canvases informed the coordinated treatment of frame, crop, typography, and annotations. The STILL architecture composition, imagery, and component implementation are original Anticraft work.' },
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible h2 and section name. Newline characters create intentional line breaks; keep the title concise. Place your page’s h1 elsewhere or adjust the copied source to match your heading hierarchy.' },
      { name: 'media', type: 'ReactNode', default: 'Required', description: 'Decorative artwork or an image with alt="". The media wrapper is aria-hidden and inert, so keep all links, controls and meaningful information outside it. Images and videos fill the frame with object-fit: cover. Supply your own local image; /images/architecture.jpg is an example path. Wide artwork with a strong subject near the center-right works well across all three crops.' },
      { name: 'eyebrow', type: 'string', default: 'undefined', description: 'A short category or brand introduction above the title.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Supporting introduction at the start of the scene. It translates and fades as the image enters the panorama chapter; it stays in the accessible document throughout.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary anchor with a visible label and a real destination. It supports keyboard activation, modified clicks and opening in a new tab. Replace the sample project URL with a route on your site. The link stays above the imagery and operable throughout the transition.' },
      { name: 'caption', type: 'string', default: 'undefined', description: 'Project name and context in the lower rail. Newlines create a second line. Its type gently grows in the full-scene chapter; it stays visible throughout.' },
      { name: 'chapters', type: 'readonly [string, string, string]', default: "['Approach', 'Perspective', 'Place']", description: 'Three short chapter labels in the persistent lower rail. The active list item uses aria-current=step. A native progress element reports scene progress without live announcements.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-scroll-expand-paper, --ac-scroll-expand-ink, --ac-scroll-expand-muted, --ac-scroll-expand-accent, --ac-scroll-expand-font and --ac-scroll-expand-heading-font. The scene uses roughly 2.3 viewport heights; allow native vertical scrolling and avoid clipping its ancestors. Long text increases the scene height to preserve legibility. At 600px component width, the initial portrait moves beneath the title.' },
    ],
    motion: 'Native scrolling coordinates a right-side portrait window, a wide central panorama and a full-bleed final scene. The title moves and scales behind the opening frame, the image crop moves with it, the introduction fades, and the project caption grows. Frame annotations and a persistent three-chapter progress rail track the composition. Smoothstep interpolation follows actual scroll position; no wheel or touch events are intercepted and no autonomous animation runs. Measurements are batched to one animation frame and follow the nearest real vertical scroll container. The CTA and caption remain above the image throughout. Reduced motion presents a static full scene with readable title, introduction and CTA, without sticky scrolling. The demo region supports keyboard scrolling and the project action opens a complete local architecture case study.',
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
