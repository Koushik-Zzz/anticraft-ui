import type { ComponentDefinition } from './catalog';

const inspiration={name:'Plyxl',url:'https://plyxl.com/',note:'The ruled app grid, logo ribbons and opposing activity columns take their visual structure from this reference. Demo copy is independent; artwork credits are in the repository.'};
export const plyxlComponents:ComponentDefinition[]=[
  {slug:'app-catalog',title:'App Catalog',category:'Sections',tag:'New',file:'AppCatalog.tsx',cssFile:'app-catalog.css',
   description:'A rounded, ruled app grid with pastel icons and a large editorial introduction.',
   usage:`import { AppCatalog } from '@/components/anticraft/AppCatalog';

export function Example() {
  return <AppCatalog
    title="The tools to run your business."
    description="Manage jobs, customers, invoices and more in one place."
    items={[
      { id: 'jobs', title: 'Jobs', description: 'Plan the week and track the work.', color: '#87b376', iconColor: '#081f00', icon: <span>▥</span>, href: '/apps/jobs' },
      { id: 'customers', title: 'Customers', description: 'Keep customer details in one place.', color: '#f4a594', iconColor: '#4c1b11', icon: <span>▣</span>, href: '/apps/customers' },
      { id: 'quotes', title: 'Quotes', description: 'Prepare and share a quote.', color: '#e7d39e', iconColor: '#4e3c00', icon: <span>▤</span>, href: '/apps/quotes' },
    ]}
  />;
}`,
   props:[
    {name:'items',type:'AppCatalogItem[]',default:'Required',description:'Unique id, title, description, ReactNode icon and background color; optional iconColor and href. Supply your own icon assets.'},
    {name:'eyebrow',type:'string',default:"'App Store'",description:'Small label above the introduction. Empty text hides it.'},
    {name:'title',type:'ReactNode',default:'The tools to run your business.',description:'Large heading beside the grid; wraps naturally with balanced text.'},
    {name:'description',type:'ReactNode',default:'undefined',description:'Supporting copy below the heading.'},
    {name:'onItemSelect',type:'(id: string) => void',default:'undefined',description:'Adds native buttons to items without href. Items with href remain normal links and also call the callback.'},
    {name:'className',type:'string',default:"''",description:'Additional classes. Customize --ac-app-surface, --ac-app-ink, --ac-app-muted, --ac-app-line, --ac-app-hover and --ac-app-font.'},
   ],motion:'Hover gently lifts the icon and changes the cell background. Optional actions use native links or buttons. The introduction stacks below a 980px component width; the grid uses two columns below 600px. Reduced motion removes transitions. Neutral surfaces follow the page theme; icon colors stay fixed.',
   useCases:['App directories','Product ecosystems','Feature collections'],inspiration},
  {slug:'integration-marquee',title:'Integration Marquee',category:'Sections',tag:'New',file:'IntegrationMarquee.tsx',cssFile:'integration-marquee.css',
   description:'Three alternating logo ribbons with a cycling connection-status card.',
   usage:`import { IntegrationMarquee } from '@/components/anticraft/IntegrationMarquee';

export function Example() {
  const mail = <img src="/logos/mail.svg" alt="" />;
  const chat = <img src="/logos/chat.svg" alt="" />;
  return <IntegrationMarquee
    rows={[
      [{ id: 'mail', label: 'Mail', logo: mail }, { id: 'chat', label: 'Chat', logo: chat }],
      [{ id: 'files', label: 'Files', logo: <span>▧</span> }],
      [{ id: 'calendar', label: 'Calendar', logo: <span>▦</span> }],
    ]}
    connections={[
      { id: 'mail', name: 'Mail', detail: 'Team inbox connected', logo: mail },
      { id: 'chat', name: 'Chat', detail: 'Workspace connected', logo: chat },
    ]}
  />;
}`,
   props:[
    {name:'rows',type:'IntegrationMarqueeItem[][]',default:'Required',description:'Logo rows with unique item ids, accessible labels and ReactNode logo artwork. Each row repeats decoratively to fill the available width and loop seamlessly.'},
    {name:'connections',type:'IntegrationConnection[]',default:'[]',description:'Optional illustrative status cards with id, name, detail and logo. This visual sequence does not connect real accounts.'},
    {name:'title',type:'ReactNode',default:'Bring your everyday tools together.',description:'Large heading above the logo rows.'},
    {name:'durations',type:'number[]',default:'[120, 140, 130]',description:'Seconds per row cycle, clamped to 20–300. The middle row moves in the opposite direction.'},
    {name:'cycleConnections',type:'boolean',default:'true',description:'Cycles connection examples through signing in, syncing and connected states. False keeps the current card connected.'},
    {name:'paused / showControls',type:'boolean',default:'false / true',description:'External pause override and native pause-control visibility. Reduced motion and hidden/offscreen state stop the sequence.'},
    {name:'className',type:'string',default:"''",description:'Additional classes. Customize --ac-integration-surface, --ac-integration-ink, --ac-integration-muted, --ac-integration-line, --ac-integration-tile and --ac-integration-font.'},
   ],motion:'Logo rows translate continuously at three different speeds. A stationary overlay fades the edges without masking the moving tracks. Duplicate artwork is hidden from assistive technology. Pause and reduced motion stop both ribbons and the illustrative status sequence. Offscreen and hidden-document state suspend motion; resuming keeps ribbon position. The connected status is shown for reduced motion.',
   useCases:['Integration sections','Partner logos','Connected tools'],inspiration},
  {slug:'agent-activity-wall',title:'Agent Activity Wall',category:'Sections',tag:'New',file:'AgentActivityWall.tsx',cssFile:'agent-activity-wall.css',
   description:'Opposing columns of agent requests and results with tinted mentions and tool badges.',
   usage:`import { AgentActivityWall } from '@/components/anticraft/AgentActivityWall';

export function Example() {
  return <AgentActivityWall columns={[
    [{ id: 'invoice', name: 'Priya', role: 'Office', mention: '@Agent', request: 'Find the overdue invoices.', response: 'Three invoices are ready to review.', color: '#89c2f9', mentionColor: '#032f53' }],
    [{ id: 'calendar', name: 'Jordan', role: 'Owner', request: 'Check the team’s availability.', response: 'Two appointments are available on Friday.', color: '#d5b970', mentionColor: '#3a2b00' }],
    [{ id: 'email', name: 'Finn', role: 'Sales', request: 'Draft a customer follow-up.', response: 'The draft is ready for approval.', color: '#c0a0df', mentionColor: '#2a133d' }],
  ]} />;
}`,
   props:[
    {name:'columns',type:'AgentActivityItem[][]',default:'Required',description:'Up to three columns. Each card has unique id, name, role, request, response and color; optional initial, mention, mentionColor, ReactNode avatar and tool logos. Columns repeat decoratively to fill the activity window.'},
    {name:'title',type:'ReactNode',default:'Put everyday work in motion.',description:'Heading above the activity columns.'},
    {name:'durations',type:'number[]',default:'[64, 76, 70]',description:'Seconds per column cycle, clamped to 20–300; the middle column moves down while the others move up.'},
    {name:'paused / showControls',type:'boolean',default:'false / true',description:'External pause override and native pause-control visibility.'},
    {name:'className',type:'string',default:"''",description:'Additional classes. Customize --ac-agent-surface, --ac-agent-ink, --ac-agent-muted, --ac-agent-line, --ac-agent-avatar and --ac-agent-font.'},
   ],motion:'Three independently moving streams with top/bottom fades and decorative duplicate cards. Pause, hidden documents and offscreen state stop motion. Reduced motion removes loops and exposes a scrollable static window. The reference composition shows two columns below 980px and one below 600px; secondary columns are hidden at those widths. Illustrative cards contain no nested interactive elements.',
   useCases:['AI product sections','Automation examples','Activity showcases'],inspiration},
];
