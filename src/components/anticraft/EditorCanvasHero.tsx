'use client'

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import './editor-canvas-hero.css'

export type EditorCanvasItem = {
  label: string
  detail: string
  meta?: string
}

export type EditorCanvasSection = {
  id: string
  label: string
  title: string
  description: string
  layout?: 'roadmap' | 'scope' | 'findings'
  items: EditorCanvasItem[]
}

export type EditorCanvasDocument = {
  id: string
  label: string
  title: string
  caption: string
  accent?: string
  sections: EditorCanvasSection[]
}

export type EditorCanvasHeroProps = {
  brand?: string
  eyebrow?: string
  title?: string
  description?: string
  action?: { label: string; href: string }
  documents?: EditorCanvasDocument[]
  defaultDocumentId?: string
  className?: string
}

const sampleDocuments: EditorCanvasDocument[] = [
  {
    id: 'plan', label: 'Project plan', title: 'Website launch', caption: 'Northstar / Brand & digital', accent: '#3157dc',
    sections: [
      { id: 'overview', label: 'Overview', title: 'A clear path\nto launch.', description: 'An eight-week website plan. Three phases, one shared direction.', layout: 'roadmap', items: [
        { label: 'Discover', detail: 'Audience, positioning & content', meta: 'WEEKS 01–02' },
        { label: 'Design', detail: 'Structure, identity & interface', meta: 'WEEKS 03–05' },
        { label: 'Deliver', detail: 'Build, review & launch', meta: 'WEEKS 06–08' },
      ] },
      { id: 'milestones', label: 'Milestones', title: 'The dates that\nmove us forward.', description: 'Each phase ends with a review before the next begins.', layout: 'roadmap', items: [
        { label: 'Direction approved', detail: 'Research and sitemap reviewed', meta: '12 NOV' },
        { label: 'Design signed off', detail: 'Core screens and content ready', meta: '03 DEC' },
        { label: 'Website goes live', detail: 'Accessibility and launch checks', meta: '22 DEC' },
      ] },
      { id: 'handoff', label: 'Deliverables', title: 'Ready for the\nnext chapter.', description: 'A practical handoff for the team that runs the website.', layout: 'scope', items: [
        { label: 'Design system', detail: 'Tokens, patterns and component states', meta: '01' },
        { label: 'Website', detail: 'Responsive templates and edited content', meta: '02' },
        { label: 'Team guide', detail: 'Publishing notes and maintenance checklist', meta: '03' },
      ] },
    ],
  },
  {
    id: 'proposal', label: 'Proposal', title: 'Aster studio partnership', caption: 'Aster / Partnership proposal', accent: '#8b4930',
    sections: [
      { id: 'approach', label: 'Approach', title: 'A closer working\nrelationship.', description: 'A focused design partnership for a growing product team.', layout: 'scope', items: [
        { label: 'One shared brief', detail: 'Align the problem, audience and success criteria', meta: '01' },
        { label: 'Weekly design reviews', detail: 'Review progress with the people building it', meta: '02' },
        { label: 'A usable handoff', detail: 'Deliver complete flows and component states', meta: '03' },
      ] },
      { id: 'scope', label: 'Scope', title: 'A focused scope.\nRoom to iterate.', description: 'The first engagement covers the product onboarding journey.', layout: 'roadmap', items: [
        { label: 'Map the journey', detail: 'Audit the current sign-up and activation flow', meta: 'WEEK 01' },
        { label: 'Design the experience', detail: 'Prototype and review the core screens', meta: 'WEEKS 02–03' },
        { label: 'Prepare the release', detail: 'Document edge cases with engineering', meta: 'WEEK 04' },
      ] },
      { id: 'terms', label: 'Engagement', title: 'Clear terms,\nfrom the start.', description: 'A four-week engagement with a single point of contact.', layout: 'scope', items: [
        { label: 'Duration', detail: 'Four weeks, starting 09 November', meta: '04 WEEKS' },
        { label: 'Project fee', detail: '50% to start; 50% on final delivery', meta: '$8,000' },
        { label: 'Review cadence', detail: 'Tuesday and Thursday, with async notes', meta: '2 / WEEK' },
      ] },
    ],
  },
  {
    id: 'research', label: 'Research', title: 'Onboarding research', caption: 'Customer experience / Research brief', accent: '#427554',
    sections: [
      { id: 'findings', label: 'Findings', title: 'The first five\nminutes matter.', description: 'What six interviews revealed about getting started.', layout: 'findings', items: [
        { label: 'Start with a real task', detail: 'People wanted to try their own work before setup.', meta: '5 OF 6' },
        { label: 'Make the next step clear', detail: 'The empty workspace offered too many choices.', meta: '4 OF 6' },
        { label: 'Explain team permissions', detail: 'Inviting colleagues raised access questions.', meta: '3 OF 6' },
      ] },
      { id: 'method', label: 'Method', title: 'Listen first.\nThen look closer.', description: 'A small qualitative study of the first-use experience.', layout: 'scope', items: [
        { label: 'Six participants', detail: 'New workspace owners at small product teams', meta: 'WHO' },
        { label: 'Guided walkthroughs', detail: 'Thirty-minute sessions with the current product', meta: 'HOW' },
        { label: 'Directional findings', detail: 'Qualitative themes, rather than population estimates', meta: 'SCOPE' },
      ] },
      { id: 'next', label: 'Next steps', title: 'Turn a finding\ninto a decision.', description: 'Three changes to prototype and test in the next round.', layout: 'roadmap', items: [
        { label: 'Introduce a starter task', detail: 'Help a new user create their first real document', meta: 'PRIORITY 01' },
        { label: 'Simplify the empty state', detail: 'Offer one primary action with optional examples', meta: 'PRIORITY 02' },
        { label: 'Clarify invite access', detail: 'Show roles before an invitation is sent', meta: 'PRIORITY 03' },
      ] },
    ],
  },
]

function RelayMark({ small = false }: { small?: boolean }) {
  return <span className={`ac-editor-canvas-mark${small ? ' ac-editor-canvas-mark-small' : ''}`} aria-hidden="true"><i /><i /><i /></span>
}

function Arrow() {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function selectWithKeyboard(event: KeyboardEvent<HTMLButtonElement>, index: number, count: number, vertical: boolean, select: (index: number) => void) {
  let next: number | undefined
  if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % count
  if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + count) % count
  if (event.key === 'Home') next = 0
  if (event.key === 'End') next = count - 1
  if (next === undefined) return
  event.preventDefault()
  select(next)
  const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
  buttons?.[next]?.focus()
}

export function EditorCanvasHero({
  brand = 'Relay',
  eyebrow = 'THE PROJECT WORKSPACE',
  title = 'Put your next\nproject in motion.',
  description = 'Plans, proposals, and research. One place to move work forward.',
  action,
  documents = sampleDocuments,
  defaultDocumentId,
  className = '',
}: EditorCanvasHeroProps) {
  const uid = useId()
  const containerRef = useRef<HTMLElement>(null)
  const [compactOutline, setCompactOutline] = useState(false)
  const [selectedDocumentId, setSelectedDocumentId] = useState(defaultDocumentId)
  const [selectedSections, setSelectedSections] = useState<Record<string, string>>({})
  const document = documents.find(item => item.id === selectedDocumentId) ?? documents[0]
  const activeDocumentIndex = document ? documents.indexOf(document) : -1
  const selectedSection = document?.sections.find(section => section.id === selectedSections[document.id]) ?? document?.sections[0]
  const previewRef = useRef<HTMLDivElement>(null)
  const exampleRefs = useRef<(HTMLButtonElement | null)[]>([])
  const focusPreview = () => previewRef.current?.focus()
  const focusExamples = () => exampleRefs.current[activeDocumentIndex]?.focus()

  useEffect(() => {
    const element = containerRef.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      if (entry) setCompactOutline(entry.contentRect.width <= 540)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={containerRef} className={`ac-editor-canvas ${className}`} aria-labelledby={`${uid}-title`}>
      <div className="ac-editor-canvas-inner">
        <header className="ac-editor-canvas-header">
          <span className="ac-editor-canvas-brand"><RelayMark />{brand}</span>
          {document && <nav aria-label={`${brand} preview`} className="ac-editor-canvas-navigation">
            <button type="button" onClick={focusPreview}>Product demo</button>
            <button type="button" onClick={focusExamples}>Examples <span aria-hidden="true">↗</span></button>
          </nav>}
        </header>

        <div className="ac-editor-canvas-main">
          <div className="ac-editor-canvas-copy">
            {eyebrow && <p className="ac-editor-canvas-eyebrow"><span aria-hidden="true" />{eyebrow}</p>}
            <h2 id={`${uid}-title`}>{title}</h2>
            {description && <p className="ac-editor-canvas-description">{description}</p>}
            {action ? <a className="ac-editor-canvas-action" href={action.href}>{action.label}<Arrow /></a> : document ? <button className="ac-editor-canvas-action" type="button" onClick={focusPreview}>Explore the demo<Arrow /></button> : null}
          </div>

          <div className="ac-editor-canvas-product">
            <div className="ac-editor-canvas-window">
              <div className="ac-editor-canvas-windowbar">
                <span className="ac-editor-canvas-windowbrand"><RelayMark small /><span>{brand}</span><span className="ac-editor-canvas-path" aria-hidden="true">/</span><span className="ac-editor-canvas-current">{document?.title ?? 'Documents'}</span></span>
                <span className="ac-editor-canvas-preview-label">Sample workspace</span>
              </div>
              {documents.map((item, documentIndex) => {
                const isActive = item.id === document?.id
                const section = item.sections.find(candidate => candidate.id === selectedSections[item.id]) ?? item.sections[0]
                const sectionIndex = section ? item.sections.indexOf(section) : -1
                return (
                  <div key={item.id} role="tabpanel" id={`${uid}-document-${documentIndex}`} aria-labelledby={`${uid}-example-${documentIndex}`} hidden={!isActive} className="ac-editor-canvas-document" style={{ '--ac-editor-canvas-document-accent': item.accent ?? 'var(--ac-editor-canvas-accent)' } as CSSProperties}>
                    <aside className="ac-editor-canvas-sidebar">
                      <div className="ac-editor-canvas-file"><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4.5 2.5h6l3 3v10h-9v-13Z" stroke="currentColor" /><path d="M10.5 2.5v3h3M7 9h4M7 12h4" stroke="currentColor" /></svg><span>{item.title}</span></div>
                      <p>Outline</p>
                      <div role="tablist" aria-label={`${item.label} sections`} aria-orientation={compactOutline ? 'horizontal' : 'vertical'} className="ac-editor-canvas-outline">
                        {item.sections.map((entry, index) => (
                          <button key={entry.id} id={`${uid}-outline-${documentIndex}-${index}`} role="tab" aria-selected={index === sectionIndex} aria-controls={`${uid}-section-${documentIndex}-${index}`} tabIndex={index === sectionIndex ? 0 : -1} type="button" onClick={() => setSelectedSections(current => ({ ...current, [item.id]: entry.id }))} onKeyDown={event => selectWithKeyboard(event, index, item.sections.length, !compactOutline, next => setSelectedSections(current => ({ ...current, [item.id]: item.sections[next].id })))}>
                            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{entry.label}
                          </button>
                        ))}
                      </div>
                      <div className="ac-editor-canvas-sidebar-bottom"><span aria-hidden="true">◈</span><span>{item.sections.length} sections</span></div>
                    </aside>
                    <div className="ac-editor-canvas-stage">
                      <div className="ac-editor-canvas-stagebar"><span>{item.caption}</span><span>{sectionIndex >= 0 ? `${String(sectionIndex + 1).padStart(2, '0')} / ${String(item.sections.length).padStart(2, '0')}` : '—'}</span></div>
                      {item.sections.map((entry, index) => (
                        <div key={entry.id} role="tabpanel" id={`${uid}-section-${documentIndex}-${index}`} aria-labelledby={`${uid}-outline-${documentIndex}-${index}`} hidden={index !== sectionIndex} tabIndex={0} ref={isActive && index === sectionIndex ? previewRef : undefined} className={`ac-editor-canvas-sheet ac-editor-canvas-sheet-${entry.layout ?? 'scope'}`}>
                          <div className="ac-editor-canvas-sheet-top"><span>{entry.label}</span><span aria-hidden="true">↗</span></div>
                          <h3>{entry.title}</h3>
                          <p className="ac-editor-canvas-sheet-description">{entry.description}</p>
                          <ol className="ac-editor-canvas-items" aria-label={`${entry.label} details`}>
                            {entry.items.map((card, cardIndex) => <li key={`${card.label}-${cardIndex}`}>
                              <div className="ac-editor-canvas-item-top"><span className="ac-editor-canvas-item-number" aria-hidden="true">{String(cardIndex + 1).padStart(2, '0')}</span>{card.meta && <span className="ac-editor-canvas-item-meta">{card.meta}</span>}</div>
                              <h4>{card.label}</h4><p>{card.detail}</p>
                              <span className="ac-editor-canvas-item-line" aria-hidden="true"><i /></span>
                            </li>)}
                          </ol>
                          <div className="ac-editor-canvas-sheet-bottom"><span>{item.title}</span><RelayMark small /></div>
                        </div>
                      ))}
                      {!item.sections.length && <div className="ac-editor-canvas-empty" ref={isActive ? previewRef : undefined} tabIndex={0}>This document has no sections.</div>}
                    </div>
                  </div>
                )
              })}
              {!documents.length && <div className="ac-editor-canvas-empty">No sample documents to display.</div>}
            </div>
            {!!documents.length && <div className="ac-editor-canvas-examples" role="tablist" aria-label="Sample documents">
              {documents.map((item, index) => <button key={item.id} ref={element => { exampleRefs.current[index] = element }} type="button" role="tab" id={`${uid}-example-${index}`} aria-controls={`${uid}-document-${index}`} aria-selected={item.id === document?.id} tabIndex={item.id === document?.id ? 0 : -1} onClick={() => setSelectedDocumentId(item.id)} onKeyDown={event => selectWithKeyboard(event, index, documents.length, false, next => setSelectedDocumentId(documents[next].id))}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item.label}<Arrow /></button>)}
            </div>}
            {selectedSection && <p className="ac-editor-canvas-announcement" role="status">{document?.label}: {selectedSection.label}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
