import type { ComponentDefinition } from './catalog'

export const editorCanvasHeroComponents: ComponentDefinition[] = [
  {
    slug: 'editor-canvas-hero',
    title: 'Editor Canvas Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'A split SaaS hero with a document workspace, selectable examples, and a working section outline.',
    file: 'EditorCanvasHero.tsx',
    cssFile: 'editor-canvas-hero.css',
    usage: `import { EditorCanvasHero } from '@/components/anticraft/EditorCanvasHero';

export function Example() {
  return (
    <EditorCanvasHero
      brand="Relay"
      title={'Put your next\\nproject in motion.'}
      description="Plans, proposals, and research. One place to move work forward."
      action={{ label: 'Create a workspace', href: '/signup' }}
      documents={[
        {
          id: 'launch', label: 'Project plan', title: 'Website launch',
          caption: 'Northstar / Brand & digital', accent: '#3157dc',
          sections: [
            {
              id: 'overview', label: 'Overview', title: 'A clear path\\nto launch.',
              description: 'An eight-week plan with three review milestones.',
              layout: 'roadmap',
              items: [
                { label: 'Discover', detail: 'Research and content', meta: 'WEEKS 01–02' },
                { label: 'Design', detail: 'Structure and interface', meta: 'WEEKS 03–05' },
                { label: 'Deliver', detail: 'Build, review and launch', meta: 'WEEKS 06–08' },
              ],
            },
          ],
        },
      ]}
    />
  );
}`,
    props: [
      { name: 'brand', type: 'string', default: "'Relay'", description: 'Name in the landing header and editor toolbar. The three-bar mark is decorative.' },
      { name: 'eyebrow', type: 'string', default: "'THE PROJECT WORKSPACE'", description: 'Optional short product category. An empty string removes it.' },
      { name: 'title', type: 'string', default: "'Put your next\\nproject in motion.'", description: 'The hero h2 and accessible section label. Newlines create intentional line breaks. Keep it concise; adapt the copied heading level to your page.' },
      { name: 'description', type: 'string', default: "'Plans, proposals, and research. One place to move work forward.'", description: 'A short product explanation below the heading. An empty string removes it.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary anchor to a real route on your site. Without it, Explore the demo focuses the active document section. Replace the usage example’s /signup with your destination.' },
      { name: 'documents', type: 'EditorCanvasDocument[]', default: 'Three sample documents', description: 'Documents with unique id, label, title, caption, optional CSS accent color, and sections. Each section has a unique id within its document, label, title, description, optional layout (roadmap, scope, findings), and items (label, detail, optional meta). Use about three short items for the intended composition. An empty collection shows an empty state.' },
      { name: 'defaultDocumentId', type: 'string', default: 'First document', description: 'Initial document id. Scenario selection is local. If the selected document or section is removed from props, the first available item is displayed; section choices are remembered per document.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Customize --ac-editor-canvas-paper, --ac-editor-canvas-ink, --ac-editor-canvas-muted, --ac-editor-canvas-line, and --ac-editor-canvas-accent. Container queries adapt to embedded layouts; the outline becomes a horizontal strip on phones.' },
    ],
    motion: 'Selecting a sample changes its document and outline. Left/Right, Home, and End select sample tabs. Up/Down select the vertical outline on desktop; Left/Right select its horizontal phone layout. Home and End select the first and last section. Tab reaches the active section, which can also be focused from Product demo or Explore the demo. Examples focuses the selected sample tab. A short opacity and 3px translation transition accompanies section changes; reduced motion removes it. There is no autoplay, remote editing, account creation, or backend request in the default preview.',
    useCases: ['Document and collaboration tools', 'Project planning software', 'Presentation and proposal products'],
    inspiration: { name: 'Chronicle', url: 'https://chroniclehq.com/', note: 'Chronicle’s compact product statement, large front-facing editor, and selectable example row informed the hierarchy. Relay branding, sample documents, outline interaction, artwork, and source code are original Anticraft work.' },
  },
]
