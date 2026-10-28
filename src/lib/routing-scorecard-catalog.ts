import type { ComponentDefinition } from './catalog';

export const routingScorecardComponents: ComponentDefinition[] = [{
  slug: 'routing-scorecard',
  title: 'Routing Scorecard',
  category: 'Diagrams',
  tag: 'New',
  description: 'An animated request diagram with evaluation scores and an adjustable quality threshold.',
  file: 'RoutingScorecard.tsx',
  cssFile: 'routing-scorecard.css',
  usage: `import { RoutingScorecard } from '@/components/anticraft/RoutingScorecard';

export function Example() {
  return <RoutingScorecard
    inputLabel="Incoming requests"
    defaultThreshold={0.85}
    models={[
      { id: 'atlas', name: 'Atlas', score: 0.96, task: 'Support triage', symbol: '◇', color: '#c4d5ff' },
      { id: 'cedar', name: 'Cedar', score: 0.78, task: 'Classification', symbol: '⌁', color: '#d6d1bf' },
      { id: 'prism', name: 'Prism', score: 0.92, task: 'Extraction', symbol: '✳', color: '#cabaff' },
      { id: 'cinder', name: 'Cinder', score: 0.89, task: 'Code review', symbol: '⌘', color: '#f1d88f' },
    ]}
  />;
}`,
  props: [
    { name: 'models', type: 'RoutingScorecardModel[]', default: 'Six fictional example models', description: 'Unique id, name, score (0–1), task, optional CSS color and short decorative symbol. Scores are supplied data, never fetched or presented as real benchmarks. Nonfinite scores and blank/repeated ids are ignored; finite scores are clamped to 0–1. Empty data shows an empty state.' },
    { name: 'defaultThreshold', type: 'number', default: '0.85', description: 'Initial minimum score, clamped to 0–1. A native range input adjusts it in 0.01 steps. Models meeting or exceeding the threshold remain active; output labels and stream connections use the same condition.' },
    { name: 'inputLabel', type: 'string', default: "'Incoming requests'", description: 'Label over the incoming ASCII request field.' },
    { name: 'title', type: 'string', default: "'Route by measured fit'", description: 'Visible scorecard heading and accessible section name.' },
    { name: 'paused', type: 'boolean', default: 'false', description: 'Externally stops animation and disables the built-in motion button. Local pause state is preserved when external pause is removed. The quality threshold stays usable.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-routing-background, --ac-routing-foreground and --ac-routing-accent. Below 800px component width, input, scorecard and output labels stack.' },
  ],
  motion: 'Canvas characters flow into the scorecard and along curves toward passing routes. A Pause control freezes the field; reduced motion draws a static frame and removes score entrance animation. Rendering stops while offscreen or in a hidden tab. The native quality slider stays usable in every motion mode, and a live status reports the active route count. All frames, observers and listeners are cleaned up on unmount.',
  useCases: ['AI routing product pages', 'Evaluation pipelines', 'Decision and scoring diagrams'],
  inspiration: { name: 'RouterPlus', url: 'https://routerplus.com/', note: 'The live evaluation diagram inspired the incoming ASCII plume, scorecard and branching output streams. Anticraft uses original marks, fictional data and an independent canvas implementation, with a working threshold control.' },
}];
