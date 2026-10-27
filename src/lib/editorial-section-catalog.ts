import type { ComponentDefinition } from './catalog'

export const editorialSectionComponents: ComponentDefinition[] = [
  {
    slug: 'reveal-footer',
    title: 'Reveal Footer',
    category: 'Sections',
    tag: 'New',
    description: 'End with an invitation. Page content scrolls away to uncover a generous contact footer, oversized wordmark, and useful links.',
    file: 'RevealFooter.tsx',
    cssFile: 'reveal-footer.css',
    usage: `import { RevealFooter } from '@/components/anticraft/RevealFooter';

export function Example() {
  return (
    <RevealFooter
      title={'What’s next\\nstarts here.'}
      brand="AFTERHOURS"
      contact={{ label: 'Start a conversation', href: 'mailto:hello@example.com' }}
      availability="Open for the right project"
      links={[
        { label: 'Our work', href: '/work' },
        { label: 'Our approach', href: '/about' },
      ]}
      note="Independent minds. Shared ambition. A small studio for brands going somewhere."
      legal="AFTERHOURS © 2026"
    >
      <section style={{ minHeight: 720, padding: '64px 32px', color: '#30282d' }}>
        <p>SELECTED WORK / 2026</p>
        <h2 style={{ maxWidth: '12ch', fontSize: 'clamp(44px, 8vw, 100px)', fontWeight: 400, lineHeight: 1 }}>A different point of view.</h2>
        <p>Place the page content that precedes your footer here.</p>
      </section>
    </RevealFooter>
  );
}`,
    useCases: ['Agency contact sections', 'Portfolio footers', 'Brand websites', 'Editorial landing pages'],
    inspiration: { name: 'Aceternity — Footer with Big Text', url: 'https://ui.aceternity.com/blocks/footers/footer-with-big-text', note: 'The generous invitation and large brand signature are a starting point. Anticraft adds its own original composition, native scroll uncover, nearest-scrollport measurement, and a normal-flow keyboard fallback.' },
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The contact section heading. A newline preserves an intentional line break; longer text wraps naturally.' },
      { name: 'brand', type: 'string', default: 'Required', description: 'A large text wordmark at the foot of the composition. Short studio or product names work best. It wraps rather than painting outside the component.' },
      { name: 'contact', type: 'RevealFooterLink', default: 'Required', description: 'The main ordinary link: {label,href}. Use your real email, contact page, or booking destination. The demo uses a sample mailto address; it does not submit a form or book an appointment.' },
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'The page content immediately before the footer. Its wrapper has an opaque --ac-footer-content background and sits above the sticky panel, so native scrolling uncovers the footer. Without preceding content the footer stays in normal flow. Keep all content in this component’s natural document order.' },
      { name: 'availability', type: 'string', default: 'undefined', description: 'An optional availability line with a small decorative status dot. The text conveys the status independently of color.' },
      { name: 'links', type: 'RevealFooterLink[]', default: '[]', description: 'Secondary native links with {label,href}. Every link stays in the document and supports keyboard activation. The demo links return to real project and approach anchors in the preceding content.' },
      { name: 'note / legal', type: 'string', default: 'undefined', description: 'Optional studio introduction and small copyright or attribution line. Long content increases the natural footer height; the component automatically falls back to ordinary scrolling if it no longer fits.' },
      { name: 'reveal', type: 'boolean', default: 'true', description: 'Enable native scroll uncover when the panel fits the nearest scrollable ancestor or window with 24px spare. Containers 600px wide or narrower, reduced-motion preferences, and short scrollports use a static footer. Set false for a normal footer at every size.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme --ac-footer-surface, --ac-footer-ink, --ac-footer-muted, --ac-footer-line, --ac-footer-accent, and --ac-footer-content. The reveal uses a bottom-sticky panel inside this wrapper. Avoid an additional overflow ancestor between the component and your intended scrollport, and avoid transforms that change normal sticky positioning.' },
    ],
    motion: 'Native scrolling moves the preceding opaque content over a bottom-sticky footer; there is no scroll capture, global fixed layer, animation loop, or document-style mutation. A ResizeObserver rechecks the panel and nearest scrollport after sizing or content changes. The effect is enabled only when the complete footer fits with 24px spare and the component is wider than 600px. Reduced motion and short windows use the same complete composition in normal flow. Focusing any footer link immediately removes the overlap and scrolls that target into view, so keyboard users never have to activate an obscured control. All links are real native anchors. The demo uses original travel art direction, existing Anticraft coastal imagery, and a fictional studio.',
  },
  {
    slug: 'case-study-story',
    title: 'Case Study Story',
    category: 'Sections',
    tag: 'New',
    description: 'Give the work a complete story: a cinematic image, useful project facts, readable chapters, clear outcomes, and the next project.',
    file: 'CaseStudyStory.tsx',
    cssFile: 'case-study-story.css',
    usage: `import { CaseStudyStory } from '@/components/anticraft/CaseStudyStory';

export function Example() {
  return (
    <CaseStudyStory
      eyebrow="RESIDENTIAL / CONCEPT STUDY"
      title={'A home,\\nin its element.'}
      intro="A house open to the light, grounded in its materials, and made for the small rituals of everyday life."
      facts={[
        { label: 'Project', value: 'Hearth House' },
        { label: 'Location', value: 'Coastal New South Wales' },
        { label: 'Scope', value: 'Architecture & interiors' },
        { label: 'Status', value: 'Concept / 2026' },
      ]}
      hero={{ src: '/images/house.jpg', alt: 'A low timber house opening onto a coastal garden', caption: '01 / HEARTH HOUSE' }}
      chapters={[
        { id: 'challenge', title: 'More room for living.', paragraphs: ['The brief began with a feeling: a place to slow down while keeping the landscape as the main event.'] },
        { id: 'approach', title: 'Let the site lead.', paragraphs: ['We brought the living spaces to the light, with deep eaves and a simple material palette.'], image: { src: '/images/terrace.jpg', alt: 'A shaded terrace between the living room and garden', caption: '02 / THE LIVING EDGE' } },
      ]}
      outcomesTitle="The project in numbers."
      outcomes={[
        { value: '186', label: 'm² considered footprint' },
        { value: '03', label: 'core material families' },
      ]}
      outcomeNote="Illustrative concept specifications. Replace with your verified project outcomes."
      nextProject={{ title: 'Headland Retreat', href: '/work/headland-retreat', label: 'NEXT PROJECT', image: { src: '/images/headland.jpg', alt: 'A retreat above the sea' } }}
    />
  );
}`,
    useCases: ['Architecture portfolios', 'Agency case studies', 'Product design stories', 'Project detail pages'],
    inspiration: { name: 'Shadcnblocks — Case Study', url: 'https://www.shadcnblocks.com/blocks/case-study', note: 'The complete project-story structure informed the content model. Anticraft’s original ivory-and-olive layout pairs large editorial typography with a cinematic image, asymmetric chapters, project specifications, and a native next-project link.' },
    props: [
      { name: 'title / intro', type: 'string', default: 'Required', description: 'The visible project heading and introductory paragraph. Title newlines are preserved, with additional natural wrapping when needed.' },
      { name: 'hero', type: 'CaseStudyImage', default: 'Required', description: 'A large project image with {src,alt,caption?}. Provide your own local or permitted image and meaningful alt text. Desktop uses a broad cover crop; narrow components use a taller crop. Keep essential project facts in the adjacent text.' },
      { name: 'chapters', type: 'CaseStudyChapter[]', default: 'Required', description: 'Ordered story chapters with unique id, title, paragraphs: string[], and optional image: CaseStudyImage. Every chapter stays readable in the document. Optional images are visible semantic figures, with their own alt and caption.' },
      { name: 'eyebrow', type: 'string', default: "'SELECTED WORK'", description: 'A short project category, series, or date above the display title.' },
      { name: 'facts', type: 'CaseStudyFact[]', default: '[]', description: 'Useful project facts with {label,value}, rendered as a semantic description list. The two-column fact grid follows the introduction on smaller containers.' },
      { name: 'outcomes', type: 'CaseStudyOutcome[]', default: '[]', description: 'Project numbers or results with {value,label}, rendered as a description list. Supply verified claims and units appropriate to your project. An empty array omits the entire outcomes panel.' },
      { name: 'outcomesTitle / outcomeNote', type: 'string', default: "'The outcome.' / undefined", description: 'The outcomes heading and optional qualification or explanation. Heading newlines are preserved. Use outcomeNote for scope, measurement period, or the fact that sample data is illustrative.' },
      { name: 'nextProject', type: 'CaseStudyNextProject', default: 'undefined', description: 'A native project link with {title,href,label?,image?}. Optional image uses CaseStudyImage. The whole surface is one link, without nested buttons. The demo jumps to an actual short next-project introduction; your site should use its real project URL.' },
      { name: 'showChapterLinks', type: 'boolean', default: 'true', description: 'Show native anchor links to the supplied chapters. IDs include a React-generated instance prefix so multiple stories can coexist. Anchor scrolling follows the browser and nearest scrollable ancestor; no JavaScript scroll capture is used.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme --ac-case-surface, --ac-case-ink, --ac-case-muted, --ac-case-line and --ac-case-accent. Layout adapts to its own container, with a single-column story below 650px and a centered maximum width of 1920px. No section uses a fixed viewport height.' },
    ],
    motion: 'The story is a normal, fully readable document with native chapter anchors and a real next-project link. Images stay still; the only decorative motion is a small arrow movement on the next-project hover, removed for reduced motion. Facts and outcomes are semantic description lists. No content is hidden behind scroll progress, hover, or an animation. The demo is an original fictional architectural concept using Anticraft’s local generated imagery; its dimensions and material counts are illustrative design-study specifications, not performance claims. Replace the example image paths, project text, outcome data, and next-project destination with your own.',
  },
]
