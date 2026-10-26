import type { ComponentDefinition } from './catalog';

export const contentComponents: ComponentDefinition[] = [
  {
    slug: 'service-showcase', title: 'Service Showcase', category: 'Sections', tag: 'New',
    description: 'A clear, considered way to explain what you do. Switch between services, capabilities, and the work behind them.',
    file: 'ServiceShowcase.tsx', cssFile: 'service-showcase.css',
    usage: `import { ServiceShowcase } from '@/components/anticraft/ServiceShowcase';

export function Example() {
  return (
    <ServiceShowcase
      title="Good ideas. Built together."
      defaultValue="strategy"
      items={[
        {
          id: 'strategy', title: 'Strategy',
          description: 'A clear position, a useful story, and a shared direction for your next chapter.',
          capabilities: ['Positioning', 'Audience research', 'Brand narrative'],
          media: <img src="/images/strategy.jpg" alt="" />,
          href: '/services/strategy', linkLabel: 'Explore our strategy practice',
        },
        {
          id: 'design', title: 'Digital design',
          description: 'Distinctive websites and products that feel considered at every step.',
          capabilities: ['Website design', 'User experience', 'Design systems'],
          media: <img src="/images/digital-design.jpg" alt="" />,
          href: '/services/design', linkLabel: 'Explore digital design',
        },
        {
          id: 'development', title: 'Development',
          description: 'Fast, accessible websites that your team can keep growing after launch.',
          capabilities: ['Creative development', 'CMS integration', 'Accessibility'],
          media: <img src="/images/development.jpg" alt="" />,
          href: '/services/development', linkLabel: 'Explore development',
        },
      ]}
    />
  );
}`,
    useCases: ['Agency services', 'Product features', 'Capabilities'],
    props: [
      { name: 'items', type: 'ServiceShowcaseItem[]', default: 'Required', description: 'Service records with unique id, title, description, a capabilities string array, and decorative ReactNode media. Add optional href and linkLabel for a separate call to action. An empty array renders nothing.' },
      { name: 'items[].media', type: 'ReactNode', default: 'Required', description: 'Decorative service imagery, rendered inert and hidden from assistive technology. Keep essential information in the visible description; do not put links or controls inside media. Supply your own image files for the example paths.' },
      { name: 'items[].href', type: 'string', default: 'undefined', description: 'Optional destination for a real service or case study page. Omitting it removes the call to action. Replace example URLs with pages in your project.' },
      { name: 'items[].linkLabel', type: 'string', default: "'Explore ' + title", description: 'The visible and accessible text of the optional call to action.' },
      { name: 'title', type: 'string', default: "'How we can help'", description: 'Visible section heading and accessible name of the service tab list.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The id of the initial service. If the selected id no longer exists, the first current item is shown.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when a visitor selects a different service with a click, tap, or tab-list keyboard shortcut.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-service-surface, --ac-service-ink, --ac-service-muted, --ac-service-accent, --ac-service-line, and --ac-service-font on this element.' },
    ],
    motion: 'Click or tap a service to replace its description, capabilities, artwork, and optional call to action. The vertical tab list uses a single Tab stop; Up/Down, Home, and End select and focus services. Tab then reaches the active panel and its link. Inactive panels remain hidden and cannot receive focus. Content enters once on selection; reduced motion removes the transition. A container query stacks the tabs and content below 500px, so it works inside a narrow column as well as a full-width section.',
    inspiration: { name: 'Whipsaw — Expertise', url: 'https://www.whipsaw.com/expertise', note: 'Whipsaw’s expertise pages group an offering with a description, capabilities, and related work. That useful content structure informed this original, compact services section. The tab interaction and artwork are an independent Anticraft design.' },
  },
  {
    slug: 'article-rail', title: 'Article Rail', category: 'Sections', tag: 'New',
    description: 'Give your journal a place on the homepage. Image-led article cards with useful metadata and a touch-friendly reading rail.',
    file: 'ArticleRail.tsx', cssFile: 'article-rail.css',
    usage: `import { ArticleRail } from '@/components/anticraft/ArticleRail';

export function Example() {
  return (
    <ArticleRail
      title="A little perspective."
      items={[
        {
          id: 'next-chapter', title: 'Designing for the next chapter',
          category: 'Perspective', readTime: '4 min read',
          media: <img src="/images/next-chapter.jpg" alt="" />,
          href: '/journal/next-chapter',
        },
        {
          id: 'clear-story', title: 'A useful website starts with a clear story',
          category: 'Process', readTime: '6 min read',
          media: <img src="/images/clear-story.jpg" alt="" />,
          href: '/journal/clear-story',
        },
        {
          id: 'small-details', title: 'Why small details build trust',
          category: 'Field notes', readTime: '3 min read',
          media: <img src="/images/small-details.jpg" alt="" />,
          href: '/journal/small-details',
        },
      ]}
    />
  );
}`,
    useCases: ['Blog previews', 'Resources', 'Company news'],
    props: [
      { name: 'items', type: 'ArticleRailItem[]', default: 'Required', description: 'Articles with unique id, title, category, a real href, and decorative ReactNode media. Optional readTime and date strings appear in the metadata. An empty array renders nothing.' },
      { name: 'items[].media', type: 'ReactNode', default: 'Required', description: 'Decorative article artwork, rendered inert and hidden from assistive technology. Keep meaningful information in the title and metadata, and do not include nested controls. Supply your own images for the example paths.' },
      { name: 'items[].href', type: 'string', default: 'Required', description: 'The article destination. Cards are ordinary anchors, so visitors can open them in a new tab or use your framework’s link adapter if you customize the source.' },
      { name: 'items[].category', type: 'string', default: 'Required', description: 'A short editorial category, such as Perspective, Process, or News.' },
      { name: 'items[].readTime / date', type: 'string', default: 'undefined', description: 'Optional preformatted metadata. Supply localized strings such as “4 min read” or “25 October 2026”; the component does not infer reading time or parse dates.' },
      { name: 'title', type: 'string', default: "'Ideas worth sharing'", description: 'The visible section heading and accessible section label.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-article-surface, --ac-article-ink, --ac-article-muted, --ac-article-line, and --ac-article-accent on this element to match your website.' },
    ],
    motion: 'Swipe, use a trackpad, or activate Previous/Next to browse one card at a time. CSS scroll snapping settles the rail on a card. Controls disable at their respective edges and update after scrolling or resizing. Each article stays an ordinary focusable link; Tab brings off-screen links into view. There is no autoplay. Reduced motion makes button-driven paging immediate and removes image, arrow, and underline transitions. The demo opens short local sample articles; replace those destinations with your own journal pages.',
    inspiration: { name: 'Whipsaw — Ideas and news', url: 'https://www.whipsaw.com/', note: 'The image-led ideas and news cards on Whipsaw’s homepage informed the hierarchy of category, reading time, and article title. Anticraft’s scroll rail, paging controls, and artwork are an original adaptation for homepage journals and resource sections.' },
  },
];
