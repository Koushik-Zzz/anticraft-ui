import type { ComponentDefinition } from './catalog';

export const proofComponents: ComponentDefinition[] = [
  {
    slug: 'testimonial-slider', title: 'Testimonial Slider', category: 'Sections', tag: 'New',
    description: 'Give client stories room to speak. A portrait-led testimonial section with clear controls and no automatic cycling.',
    file: 'TestimonialSlider.tsx', cssFile: 'testimonial-slider.css',
    usage: `import { TestimonialSlider } from '@/components/anticraft/TestimonialSlider';

export function Example() {
  return (
    <TestimonialSlider
      title="In our clients’ words."
      defaultValue="mira"
      items={[
        { id: 'mira', quote: 'Our story finally feels like us. The new website makes it easy for people to find their space.', name: 'Mira Patel', role: 'Founder', company: 'KIN', portrait: <div style={{ display: 'grid', placeItems: 'center', height: '100%', background: '#becbb0', fontSize: 80 }}>M</div> },
        { id: 'daniel', quote: 'A complicated product became a clear first impression. Every feature now has a purpose.', name: 'Daniel Park', role: 'Product lead', company: 'Folio' },
        { id: 'sofia', quote: 'The work is considered from the first page to the smallest detail. Each project has room to shine.', name: 'Sofia Reed', role: 'Creative director', company: 'Forma' },
      ]}
    />
  );
}`,
    useCases: ['Client reviews', 'Customer stories', 'Homepage proof'],
    props: [
      { name: 'items', type: 'TestimonialSliderItem[]', default: 'Required', description: 'Client stories with a unique id, quote, name, and role. Optional company, decorative portrait, and metric fields add context. An empty list shows a quiet placeholder without controls.' },
      { name: 'items[].portrait', type: 'ReactNode', default: 'Name initial', description: 'Decorative image or artwork. It is hidden from assistive technology because the adjacent caption identifies the speaker. Keep this content free of links or controls.' },
      { name: 'items[].metric', type: '{ value: string; label: string }', default: 'undefined', description: 'An optional supporting result displayed below the speaker details. Use a substantiated value and a clear label for real client work.' },
      { name: 'title', type: 'string', default: "'In our clients’ words.'", description: 'A visible heading that labels the section. Set an empty string to omit the heading; the section keeps its Client stories accessible label.' },
      { name: 'defaultValue', type: 'string', default: 'First item', description: 'The id selected on the initial render. An unknown or removed id falls back to the first available story.' },
      { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called after a visitor chooses a different story. Supply this callback from a Client Component in Next.js.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-proof-surface, --ac-proof-ink, --ac-proof-muted, --ac-proof-accent, and --ac-proof-portrait on this element.' },
    ],
    motion: 'Previous and next buttons wrap through the stories, and labeled selector dots jump directly to a speaker. Each control works with normal Tab navigation and Enter or Space. Only the selected quote is rendered, and a polite live region announces the newly chosen story. A short entrance fade runs on a visitor’s selection; reduced motion removes it. There is no automatic advance, swipe requirement, or global keyboard interception. The component reflows to a compact portrait and caption below the quote when its container is narrow. Example client names, companies, and quotes are fictional.',
    inspiration: { name: 'Whipsaw — client stories', url: 'https://www.whipsaw.com/', note: 'Whipsaw’s client-proof section pairs quotations with portraits and professional roles. Anticraft adapts that useful content structure with original artwork, fictional example stories, and independently designed previous, next, and direct-selection controls.' },
  },
];
