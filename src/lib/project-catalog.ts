import type { ComponentDefinition } from './catalog'

export const projectComponents: ComponentDefinition[] = [
  {
    slug: 'project-grid',
    title: 'Project Grid',
    category: 'Sections',
    tag: 'New',
    description: 'A portfolio section that earns its space: filter by discipline, scan the work, and open the full case study.',
    file: 'ProjectGrid.tsx',
    cssFile: 'project-grid.css',
    usage: `import { ProjectGrid } from '@/components/anticraft/ProjectGrid';

export function Example() {
  return (
    <ProjectGrid
      title="Selected partnerships"
      items={[
        {
          id: 'kin', title: 'KIN', category: 'Web', href: '/work/kin', year: '2026',
          description: 'Everyday objects. A better shopping experience.',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#b9c396', color: '#2e3b28', fontSize: 64, fontWeight: 600 }}>KIN</div>,
        },
        {
          id: 'forma', title: 'FORMA', category: 'Brand', href: '/work/forma', year: '2026',
          description: 'A new identity for the way we work.',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#c85332', color: '#f9e7c6', fontSize: 48, fontFamily: 'Georgia, serif' }}>Forma.</div>,
        },
        {
          id: 'folio', title: 'FOLIO', category: 'Product', href: '/work/folio', year: '2025',
          description: 'Making personal finance feel personal.',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#c9b9dc', color: '#44315b', fontSize: 48 }}>folio↗</div>,
        },
      ]}
    />
  );
}`,
    useCases: ['Agency portfolios', 'Case study galleries', 'Project collections'],
    props: [
      { name: 'items', type: 'ProjectGridItem[]', default: 'Required', description: 'Project cards. Every item needs a unique id, title, category, href and decorative ReactNode media; description and year are optional. Replace the example /work/… URLs with your actual case-study routes. An empty list shows a short empty state.' },
      { name: 'title', type: 'string', default: "'Selected work'", description: 'The section heading. It also supplies the section’s accessible name.' },
      { name: 'label', type: 'string', default: "'Project categories'", description: 'An accessible name for the category button group.' },
      { name: 'onFilterChange', type: '(category: string) => void', default: 'undefined', description: 'Receives the selected category, or All for the full collection. Use a client component when passing a callback. Filtering keeps keyboard focus on the button and announces the number of matching projects.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-project-ink, --ac-project-muted, --ac-project-line, --ac-project-accent, --ac-project-radius and --ac-project-selected-ink. Two columns become one when the component itself is 420px wide or narrower.' },
      { name: 'item.media', type: 'ReactNode', default: 'Required', description: 'Decorative artwork or an image with alt="". It fills a 4:3 surface, or 5:3 in the compact layout. Media is hidden from assistive technology and made inert; keep it free of links, buttons and other controls. Put essential information in title and description.' },
    ],
    motion: 'Category buttons filter the visible linked cards immediately. Matching cards enter with a short 9px rise; pointer hover adds a subtle artwork zoom and turns the arrow. Touch users get every project through ordinary links without hover. Reduced motion removes the entrance, zoom transition and arrow transition. The demo opens small local case studies; installed cards follow your supplied href URLs.',
    inspiration: { name: 'Instrument — Work', url: 'https://www.instrument.com/work/', note: 'Instrument’s recent-work categories and linked case cards informed this practical portfolio structure. Anticraft’s artwork, filtering implementation, responsive layout and motion are original.' },
  },
  {
    slug: 'project-preview-list',
    title: 'Project Preview List',
    category: 'Sections',
    tag: 'New',
    description: 'An editorial project index with real case-study links, artwork on focus, and useful thumbnails on small screens.',
    file: 'ProjectPreviewList.tsx',
    cssFile: 'project-preview-list.css',
    usage: `import { ProjectPreviewList } from '@/components/anticraft/ProjectPreviewList';

export function Example() {
  return (
    <ProjectPreviewList
      title="Good work. Good people."
      items={[
        {
          id: 'kin', title: 'KIN', category: 'Ecommerce website', year: '2026', href: '/work/kin',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#b9c396', color: '#2e3b28', fontSize: 64, fontWeight: 600 }}>KIN</div>,
        },
        {
          id: 'forma', title: 'FORMA', category: 'Brand identity', year: '2026', href: '/work/forma',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#c85332', color: '#f9e7c6', fontSize: 48, fontFamily: 'Georgia, serif' }}>Forma.</div>,
        },
        {
          id: 'folio', title: 'FOLIO', category: 'Product design', year: '2025', href: '/work/folio',
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#c9b9dc', color: '#44315b', fontSize: 48 }}>folio↗</div>,
        },
      ]}
    />
  );
}`,
    useCases: ['Studio portfolios', 'Architecture archives', 'Selected work'],
    props: [
      { name: 'items', type: 'ProjectPreviewListItem[]', default: 'Required', description: 'Projects with a unique id, title, category, href and decorative ReactNode media, plus an optional year. Replace the sample /work/… paths with real case-study routes. Empty collections show a short empty state.' },
      { name: 'title', type: 'string', default: "'Project index'", description: 'The section heading and accessible name.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-preview-ink, --ac-preview-muted, --ac-preview-line, --ac-preview-accent, --ac-preview-radius and --ac-preview-caption-background. Below a component width of 500px the side preview becomes a thumbnail beside every row.' },
      { name: 'item.media', type: 'ReactNode', default: 'Required', description: 'Decorative artwork or an image with alt="". It fills a 4:5 desktop preview and square compact thumbnails. Both versions are hidden from assistive technology and made inert. Avoid nested controls and place essential information in the text fields.' },
      { name: 'item.href', type: 'string', default: 'Required', description: 'A real destination followed by the native anchor, preserving modified clicks and open-in-new-tab behavior. Hover and keyboard focus only change the decorative artwork.' },
    ],
    motion: 'The first project’s artwork is visible initially. Hover or keyboard focus changes the side preview with a brief opacity and scale entrance; the last preview stays visible when the pointer leaves. The compact layout shows every thumbnail directly, so no content depends on hover. Normal Tab and Enter navigate links. Reduced motion removes artwork and arrow transitions. Demo links open local case studies.',
    inspiration: { name: 'Emotion Agency', url: 'https://emotion-agency.com/', note: 'Emotion’s numbered project index and visible project categories informed this editorial list structure. Anticraft’s preview behavior, artwork, responsive thumbnails and React implementation are original.' },
  },
]
