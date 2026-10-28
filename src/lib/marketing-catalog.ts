import type { ComponentDefinition } from './catalog';

export const marketingComponents: ComponentDefinition[] = [
  {
    slug: 'pricing-plans', title: 'Pricing Plans', category: 'Sections', tag: 'New',
    description: 'A considered pricing section with monthly and annual billing, honest savings, and a clear next step for every plan.',
    file: 'PricingPlans.tsx', cssFile: 'pricing-plans.css',
    useCases: ['SaaS pricing', 'Memberships', 'Service packages'],
    usage: `import { PricingPlans } from '@/components/anticraft/PricingPlans';

export function Example() {
  return (
    <PricingPlans
      title="Make room for more."
      currency="USD"
      locale="en-US"
      plans={[
        {
          id: 'starter', name: 'Starter',
          description: 'A little structure for your next big idea.',
          monthly: 12, yearly: 120,
          features: ['3 active projects', 'Your own workspace', 'Unlimited notes'],
          href: '/signup?plan=starter', ctaLabel: 'Choose Starter',
        },
        {
          id: 'studio', name: 'Studio',
          description: 'More space for the work you do together.',
          monthly: 29, yearly: 288, featured: true,
          features: ['Unlimited projects', '5 team members', 'Shared project timelines'],
          href: '/signup?plan=studio', ctaLabel: 'Choose Studio',
        },
        {
          id: 'scale', name: 'Scale',
          description: 'A shared home for a growing company.',
          monthly: 59, yearly: 588,
          features: ['Unlimited projects', '20 team members', 'Workspace permissions'],
          href: '/signup?plan=scale', ctaLabel: 'Choose Scale',
        },
      ]}
    />
  );
}`,
    props: [
      { name: 'plans', type: 'PricingPlan[]', default: 'Required', description: 'Plan records with unique id, name, description, monthly and yearly amounts, a features string array, and a real href. An empty array renders nothing. Supply finite, nonnegative amounts in the currency’s main unit, for example 12 for twelve dollars.' },
      { name: 'plans[].monthly / yearly', type: 'number', default: 'Required', description: 'The actual monthly charge and the actual total annual charge. Yearly pricing displays the annual total with “/ year”, never an implied monthly equivalent. A positive annual saving is calculated from monthly × 12 minus yearly and rounded to the currency precision.' },
      { name: 'plans[].features', type: 'string[]', default: 'Required', description: 'Visible features included in that plan, rendered as a semantic list. Checkmarks are decorative; write clear feature descriptions.' },
      { name: 'plans[].href / ctaLabel', type: 'string', default: "Required / 'Choose ' + name", description: 'A real signup, enquiry, or plan-detail destination and an optional visible link label. These remain ordinary anchors. Use onSelect in a Client Component if the destination needs the currently selected billing period.' },
      { name: 'plans[].featured', type: 'boolean', default: 'false', description: 'Highlights a plan with a tinted background and a “A little more room” label. It does not change the order or select a plan for the visitor.' },
      { name: 'title', type: 'string', default: "'A plan for your next chapter'", description: 'The visible section heading and accessible section name.' },
      { name: 'currency / locale', type: 'string', default: "'USD' / 'en-US'", description: 'An ISO currency code and a locale accepted by Intl.NumberFormat. Explicit defaults keep formatting consistent between server and browser; the component does not detect a visitor’s location or convert currencies.' },
      { name: 'defaultBilling', type: "'monthly' | 'yearly'", default: "'monthly'", description: 'Initial billing period. Native pressed buttons switch the displayed prices and billing notes.' },
      { name: 'onBillingChange', type: '(period: BillingPeriod) => void', default: 'undefined', description: 'Called when the visitor changes billing period. Pass callbacks from a Client Component when using a framework with a server/client boundary.' },
      { name: 'onSelect', type: '(plan: PricingPlan, period: BillingPeriod, event: MouseEvent<HTMLAnchorElement>) => void', default: 'undefined', description: 'Receives the selected plan, current billing period, and native React anchor event. Navigation continues unless your handler prevents it. Connect this to your own signup or checkout flow; the component does not collect payments.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-pricing-surface, --ac-pricing-card, --ac-pricing-ink, --ac-pricing-muted, --ac-pricing-accent, --ac-pricing-featured, --ac-pricing-line, and --ac-pricing-font.' },
    ],
    motion: 'Monthly and Yearly are ordinary buttons with pressed states. Prices update in polite live regions; annual savings appear only when the annual total costs less than twelve monthly payments. Plan links remain keyboard and browser friendly. Below a 760px component width, cards become a touch-scrollable rail with scroll snapping; Tab brings each link into view. The rail keeps cards readable inside narrow sections. Reduced motion removes button and link transitions. The demo opens example plan details in a native dialog with Escape, focus containment, and focus restoration.',
  },
  {
    slug: 'feature-bento', title: 'Feature Bento', category: 'Sections', tag: 'New',
    description: 'Show what your product makes possible. A flexible feature grid that pairs concrete benefits with useful visual previews.',
    file: 'FeatureBento.tsx', cssFile: 'feature-bento.css',
    useCases: ['Product landing pages', 'Feature overviews', 'SaaS homepages'],
    usage: `import { FeatureBento } from '@/components/anticraft/FeatureBento';

export function Example() {
  return (
    <FeatureBento
      title="Less scattered. More together."
      items={[
        {
          id: 'overview', eyebrow: 'ONE SHARED HOME',
          title: 'See the work, at a glance.',
          description: 'Bring projects, notes, and next steps into one calm workspace.',
          span: 'wide',
          media: <img src="/images/workspace-overview.jpg" alt="" />,
          href: '/features/workspace', linkLabel: 'Explore the workspace',
        },
        {
          id: 'sharing', eyebrow: 'BETTER TOGETHER',
          title: 'Make room for your team.',
          description: 'Share a project and keep everyone working from the same page.',
          media: <img src="/images/team-sharing.jpg" alt="" />,
        },
        {
          id: 'calendar', eyebrow: 'A CLEARER WEEK',
          title: 'Know what’s coming next.',
          description: 'Keep reviews and milestones close to the work they belong to.',
          media: <img src="/images/project-calendar.jpg" alt="" />,
        },
        {
          id: 'search', eyebrow: 'FIND YOUR FLOW',
          title: 'Less looking. More doing.',
          description: 'Search across project notes, briefs, and shared documents.',
          span: 'wide',
          media: <img src="/images/workspace-search.jpg" alt="" />,
          href: '/features/search', linkLabel: 'Explore search',
        },
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'FeatureBentoItem[]', default: 'Required', description: 'Features with unique id, title, and description. Optional fields are eyebrow, decorative ReactNode media, span, href, and linkLabel. An empty array renders nothing. DOM reading order always follows your item order.' },
      { name: 'items[].media', type: 'ReactNode', default: 'undefined', description: 'Optional decorative product preview or artwork. Media is hidden from assistive technology and rendered inert; keep meaningful information in the title and description, and keep links or controls out of artwork. Supply your own images for the example paths.' },
      { name: 'items[].eyebrow', type: 'string', default: 'undefined', description: 'A short visible label above a feature title, such as ONE SHARED HOME.' },
      { name: 'items[].span', type: "'default' | 'wide' | 'tall'", default: "'default'", description: 'Default fills one grid cell, wide spans two columns, and tall spans two rows on the large layout. Tall resets in the two-column layout; all spans reset in the single-column layout.' },
      { name: 'items[].href / linkLabel', type: 'string', default: "undefined / 'Explore ' + title", description: 'An optional real destination and its link text. Omitting href removes the link; the article itself remains a readable feature card rather than a pretend button.' },
      { name: 'title', type: 'string', default: "'Small details. A better day.'", description: 'The visible section heading and accessible name of the feature section.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme with --ac-bento-surface, --ac-bento-card, --ac-bento-media, --ac-bento-ink, --ac-bento-muted, --ac-bento-accent, --ac-bento-line, and --ac-bento-font.' },
    ],
    motion: 'The layout adapts to its own width: three columns by default, two below 740px, and one below 480px. Cards lift slightly on a fine pointer and show a stronger border when a contained link receives focus. Optional feature links are ordinary anchors; cards without links contain no extra keyboard stops. Reduced motion removes the hover lift and arrow movement. The demo’s small workspace views are decorative illustrations, with all essential benefits repeated in the card copy.',
  },
];
