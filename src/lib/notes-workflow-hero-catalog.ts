import type { ComponentDefinition } from './catalog'

export const notesWorkflowHeroComponents: ComponentDefinition[] = [
  {
    slug: 'notes-workflow-hero',
    title: 'Notes Workflow Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'A meeting-notes hero with linked source notes, decisions, editable task owners, and a working copy action.',
    file: 'NotesWorkflowHero.tsx',
    cssFile: 'notes-workflow-hero.css',
    usage: `import { NotesWorkflowHero } from '@/components/anticraft/NotesWorkflowHero';

export function Example() {
  return (
    <NotesWorkflowHero
      brand="Minute"
      title={'Meeting notes.\\nNext steps, sorted.'}
      description="Turn meeting notes into decisions and assigned tasks, with the context attached."
      action={{ label: 'Explore the product', href: '/product' }}
      samples={[
        {
          id: 'review', revision: 1, title: 'Product review',
          context: 'Design + Engineering · Tuesday, 10:00',
          notes: [
            { id: 'scope', speaker: 'Leah', text: 'Launch one workspace. Multi-workspace can wait.' },
            { id: 'prototype', speaker: 'Omar', text: 'I’ll prototype the invite empty state by Thursday.' },
          ],
          summary: 'Launch one workspace and improve the invite empty state.',
          decisions: [
            { id: 'launch', text: 'Launch with a single workspace.', sourceId: 'scope' },
          ],
          tasks: [
            { id: 'invite', text: 'Prototype invite empty state by Thursday.', owner: 'Omar', sourceId: 'prototype' },
          ],
        },
      ]}
    />
  );
}`,
    useCases: ['Meeting assistants', 'Notes and knowledge tools', 'Team collaboration products', 'Workflow software'],
    inspiration: {
      name: 'Granola',
      url: 'https://www.granola.ai/',
      note: 'Granola’s live SaaS landing page informed the warm surface, serif headline, and notes-to-result product demonstration. Minute uses an original composition, meeting data, and local interaction model. It does not use Granola artwork or connect to an AI service.',
    },
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible h2. Newlines preserve intentional breaks while the text can wrap naturally. Keep it short so the product remains visible on short desktops.' },
      { name: 'samples', type: 'readonly NotesWorkflowSample[]', default: 'Required', description: 'Original examples with unique id, optional revision, title, optional context, notes, summary, decisions, and tasks. Supply the structured result yourself: this component does not infer results or call AI. An empty array displays a safe empty state and disables Run. The first example initially displays its prepared result; changing examples requires pressing Run example.' },
      { name: 'samples[].notes', type: 'readonly NotesWorkflowSourceNote[]', default: 'Required', description: 'Read-only source notes, each with unique id, text, and optional speaker. Do not include private meeting data in a public landing page. Source references focus the corresponding note without changing the meeting selection.' },
      { name: 'samples[].decisions', type: 'readonly NotesWorkflowDecision[]', default: 'Required', description: 'Decisions with unique id, text, and sourceId matching a note in the same sample. The numbered source button is omitted for unmatched IDs. Empty decisions and tasks are supported.' },
      { name: 'samples[].tasks', type: 'readonly NotesWorkflowTask[]', default: 'Required', description: 'Tasks with unique id, text, owner, and sourceId matching an original note. Native inputs edit each owner locally; empty owner text is copied as Unassigned. Running the example again restores the supplied owners. Edits are not persisted or submitted.' },
      { name: 'samples[].revision', type: 'string | number', default: 'undefined', description: 'Change this value when replacing an example’s content. Selection is stored by ID and derived from current props. Generated state and copy feedback are scoped to the current sample content and revision, so removing or updating a sample cannot display a stale result.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Optional single-sentence product explanation below the title.' },
      { name: 'brand', type: 'string', default: "'Minute'", description: 'The text wordmark. Replace it with your own product name; the simple inline mark is part of the component source.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'Optional ordinary product link beside the example action. Run the example performs a deterministic local preparation and focuses the result region; it does not open a sign-up flow or imply a connected service.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme --ac-notes-workflow-paper, --ac-notes-workflow-ink, --ac-notes-workflow-accent, --ac-notes-workflow-line, --ac-notes-workflow-muted, and --ac-notes-workflow-heading-font. The serif font falls back to Georgia; no remote fonts are fetched by this component.' },
    ],
    motion: 'The first sample includes its prepared result. Selecting another meeting clears the old result; Run example reveals that meeting’s supplied summary, decisions, and tasks immediately. No delayed simulation, recording, upload, or AI request occurs. Owner changes appear in the actual copied summary. Clipboard success is announced only after writeText resolves. Unavailable or rejected clipboard access reveals a read-only summary and a native selection button for manual copying. Outstanding clipboard results are ignored after selection, rerun, or owner changes. Source-reference buttons focus and highlight the matching original note. Every instance has unique useId relationships. Desktop places copy beside two readable note sheets; narrow containers stack the product below the introduction, and phones stack source notes before the result. All content flows naturally and remains scrollable. Only subtle hover and source-highlight transitions are used, and reduced motion removes them.',
  },
]
