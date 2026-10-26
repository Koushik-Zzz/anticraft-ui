import type { ComponentDefinition } from './catalog'

export const processComponents: ComponentDefinition[] = [
  {
    slug: 'process-timeline',
    title: 'Process Timeline',
    category: 'Sections',
    tag: 'New',
    description: 'Make your process easy to understand: readable stages, clear deliverables, and a visual that follows each phase as visitors scroll.',
    file: 'ProcessTimeline.tsx',
    cssFile: 'process-timeline.css',
    usage: `import { ProcessTimeline } from '@/components/anticraft/ProcessTimeline';

export function Example() {
  return (
    <ProcessTimeline
      title="From first thought to launch"
      steps={[
        {
          id: 'discover', title: 'Discover', duration: '1 week',
          description: 'Understand the audience, define the brief, and agree on what success looks like.',
          deliverables: ['Workshop', 'Project brief'],
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#bfcca5', color: '#39482e', fontFamily: 'Georgia, serif', fontSize: 46 }}>Ask better questions.</div>,
        },
        {
          id: 'design', title: 'Design', duration: '2 weeks',
          description: 'Explore the visual direction and make a prototype your team can click through.',
          deliverables: ['Art direction', 'Clickable prototype'],
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#d47b5c', color: '#573829', fontFamily: 'Georgia, serif', fontSize: 46 }}>Room for better.</div>,
        },
        {
          id: 'build', title: 'Build', duration: '2 weeks',
          description: 'Build a responsive website, connect your content, and test on real screens.',
          deliverables: ['Development', 'Device testing'],
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#343d34', color: '#c8d79f', fontFamily: 'monospace', fontSize: 38 }}>&lt;MadeReal /&gt;</div>,
        },
        {
          id: 'launch', title: 'Launch', duration: '1 week',
          description: 'Make the final checks, train your team, and get your site into the world.',
          deliverables: ['Quality assurance', 'Team training'],
          media: <div style={{ display: 'grid', placeItems: 'center', background: '#cecee0', color: '#44415e', fontFamily: 'Georgia, serif', fontSize: 46 }}>Ready for what’s next.</div>,
        },
      ]}
    />
  );
}`,
    useCases: ['Agency processes', 'Project roadmaps', 'Onboarding journeys'],
    props: [
      { name: 'steps', type: 'ProcessTimelineStep[]', default: 'Required', description: 'Ordered stages with a unique id, title, description and decorative ReactNode media. Every stage’s description stays in the document. Optional duration and deliverables add useful scope. Empty lists show a short empty state; replaced lists fall back to their first available stage until the next scroll measurement.' },
      { name: 'title', type: 'string', default: "'From first thought to launch'", description: 'The section heading and accessible name.' },
      { name: 'step.duration', type: 'string', default: 'undefined', description: 'A short time estimate such as 1 week or Weeks 2–3, displayed beside the stage number.' },
      { name: 'step.deliverables', type: 'string[]', default: 'undefined', description: 'Concrete outputs for a stage, presented as a labeled list. All deliverables remain readable; they are never replaced by the decorative scroll preview.' },
      { name: 'step.media', type: 'ReactNode', default: 'Required', description: 'Decorative imagery or artwork with no links or controls. Both desktop and inline copies are hidden from assistive technology and made inert. Images should use alt="". Put essential details in title, description and deliverables. The desktop artwork fills a 4:5 surface; compact inline artwork is 220px high (190px below 300px component width).' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-process-ink, --ac-process-muted, --ac-process-line, --ac-process-accent, --ac-process-surface and --ac-process-radius. At a component width of 560px or narrower, artwork appears inside every stage and the side preview disappears.' },
    ],
    motion: 'Scrolling marks the current stage and updates a decorative side preview. It follows the nearest vertically scrollable ancestor, or the page when there is none, using passive events and one scheduled measurement per frame rather than a continuous animation loop. The right panel sticks 16px from the scroll viewport’s top and stops at the end of this section, so the following footer remains reachable; allow enough viewport height for the preview. All stage descriptions and deliverables remain visible in a semantic ordered list. Compact layouts show each illustration inline. There is no automatic advance, scroll capture, or required hover. The brief artwork entrance and progress transition are removed for reduced motion. The demo has its own keyboard-focusable scroll region.',
  },
]
