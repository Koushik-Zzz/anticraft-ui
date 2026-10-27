import type { ComponentDefinition } from './catalog';

export const comparisonComponents: ComponentDefinition[] = [{
  slug:'feature-comparison', title:'Feature Comparison', category:'Sections', tag:'New',
  description:'Choose two options, put their details side by side, and focus on what makes them different.',
  file:'FeatureComparison.tsx', cssFile:'feature-comparison.css',
  useCases:['Product specifications','Plan comparison','Service packages'],
  usage:`import { FeatureComparison } from '@/components/anticraft/FeatureComparison';

export function Example() {
  return <FeatureComparison
    title="Find your fit."
    description="Compare the details that matter to your team."
    products={[
      { id: 'solo', name: 'Solo', price: '$12', priceNote: '/ month', href: '/plans/solo' },
      { id: 'team', name: 'Team', price: '$24', priceNote: '/ month', badge: 'More room', href: '/plans/team' },
      { id: 'scale', name: 'Scale', price: '$40', priceNote: '/ month', href: '/plans/scale' },
    ]}
    features={[
      { id: 'projects', group: 'Workspace', label: 'Active projects', values: { solo: '10', team: 'Unlimited', scale: 'Unlimited' } },
      { id: 'export', group: 'Workspace', label: 'Export your work', values: { solo: true, team: true, scale: true } },
      { id: 'reviews', group: 'Collaboration', label: 'Client reviews', values: { solo: false, team: true, scale: true } },
    ]}
  />;
}`,
  props:[
    {name:'products',type:'FeatureComparisonProduct[]',default:'Required',description:'At least two options with unique id and name. Optional description, badge, price, priceNote, href, and actionLabel appear in each header. Prices are preformatted display data; this component does not calculate charges. With fewer than two options, it renders nothing.'},
    {name:'features',type:'FeatureComparisonRow[]',default:'Required',description:'Rows with unique id, label, optional description and group, and a values record keyed by product id. Values are strings, booleans or null. Booleans display Included / Not included, and null or a missing value displays Not specified. Keep values concise. Groups retain their first appearance order.'},
    {name:'defaultProductIds',type:'readonly [string, string]',default:'First two products',description:'Initial first and second option IDs. Options stay distinct. If props remove a selection, it safely falls back to available products without invoking a callback.'},
    {name:'onSelectionChange',type:'(selection: FeatureComparisonSelection) => void',default:'undefined',description:'Called only when a visitor selects another option. Receives {first,second}, the complete current product objects. Use a Client Component when passing a callback in Next.js. The initial mount, filter changes, and prop fallbacks do not invoke it.'},
    {name:'title / description / eyebrow',type:'string',default:"'Find your fit.' / undefined / 'A CLOSER LOOK'",description:'Heading, optional supporting introduction, and compact label. Newlines in the heading are preserved.'},
    {name:'products[].href / actionLabel',type:'string',default:"undefined / 'Explore ' + name",description:'Optional real product, plan, or service destination. Links preserve native navigation, including modified clicks. Replace example routes with your own. Omitting href removes that option’s action.'},
    {name:'className',type:'string',default:"''",description:'Additional classes. Customize --ac-compare-paper, --ac-compare-ink, --ac-compare-muted, --ac-compare-line, --ac-compare-accent, and --ac-compare-focus on the root. The second option receives the accent surface. Maximum composition width is 1600px.'},
  ],
  motion:'Native select controls choose two distinct options. The checkbox filters rows whose values differ (missing and null are equivalent); use consistent value types and formatting across products. All comparison information stays in a semantic table with named row and column headers; phone layouts put each feature label on its own line above two readable values. The result count is politely announced. Ordinary anchors open your supplied destinations. Reduced motion removes link transitions. The demo’s plan links lead to local explanatory sections; its example prices do not charge or collect anything.',
  inspiration:{name:'Shadcnblocks comparisons',url:'https://www.shadcnblocks.com/blocks/compare',note:'Dedicated comparison sections informed the useful side-by-side structure. Anticraft’s original composition adds distinct option selectors, grouped specifications, a differences filter, and compact container styling.'},
}];
