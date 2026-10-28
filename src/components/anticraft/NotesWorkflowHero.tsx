'use client'

import { useEffect, useId, useRef, useState } from 'react'
import './notes-workflow-hero.css'

export interface NotesWorkflowSourceNote {
  id: string
  text: string
  speaker?: string
}

export interface NotesWorkflowDecision {
  id: string
  text: string
  sourceId: string
}

export interface NotesWorkflowTask {
  id: string
  text: string
  owner: string
  sourceId: string
}

export interface NotesWorkflowSample {
  id: string
  /** Change the revision when replacing an example's content. */
  revision?: string | number
  title: string
  context?: string
  notes: readonly NotesWorkflowSourceNote[]
  summary: string
  decisions: readonly NotesWorkflowDecision[]
  tasks: readonly NotesWorkflowTask[]
}

export interface NotesWorkflowHeroProps {
  title: string
  samples: readonly NotesWorkflowSample[]
  description?: string
  brand?: string
  action?: { label: string; href: string }
  className?: string
}

type PreparedResult = { key: string; owners: Record<string, string> }
type CopyFeedback = { key: string; message: string; manual: boolean }

function sampleKey(sample: NotesWorkflowSample) {
  // Include content as well as the public revision so changed props never show an old result.
  return JSON.stringify([sample.id, sample.revision, sample.title, sample.notes, sample.summary, sample.decisions, sample.tasks])
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 15 15 5M5 5h10v10' : 'M4 10h12m-5-5 5 5-5 5'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/** A local, deterministic notes-to-actions preview. No AI or upload service is called. */
export function NotesWorkflowHero({
  title,
  samples,
  description,
  brand = 'Minute',
  action,
  className = '',
}: NotesWorkflowHeroProps) {
  const instanceId = useId()
  const [selectedId, setSelectedId] = useState(samples[0]?.id ?? '')
  const sample = samples.find((item) => item.id === selectedId) ?? samples[0]
  const key = sample ? sampleKey(sample) : ''
  const [prepared, setPrepared] = useState<PreparedResult | null>(() => sample ? { key: sampleKey(sample), owners: {} } : null)
  const [feedback, setFeedback] = useState<CopyFeedback | null>(null)
  const [notice, setNotice] = useState<{ key: string; message: string } | null>(null)
  const [highlightedSource, setHighlightedSource] = useState<{ key: string; id: string } | null>(null)
  const resultRef = useRef<HTMLElement>(null)
  const sourceRefs = useRef(new Map<string, HTMLLIElement>())
  const manualRef = useRef<HTMLTextAreaElement>(null)
  const copyAttempt = useRef(0)
  const currentKey = useRef(key)
  currentKey.current = key
  useEffect(() => () => { copyAttempt.current += 1 }, [])
  const result = prepared?.key === key ? prepared : null
  const copyFeedback = feedback?.key === key ? feedback : null
  const status = notice?.key === key ? notice.message : ''
  const headingId = `${instanceId}-heading`
  const resultId = `${instanceId}-result`

  function prepare(focusResult = false) {
    if (!sample) return
    copyAttempt.current += 1
    setPrepared({ key, owners: {} })
    setFeedback(null)
    setNotice({ key, message: `Example prepared: ${sample.decisions.length} decisions and ${sample.tasks.length} tasks.` })
    if (focusResult) resultRef.current?.focus()
  }

  function showSource(sourceId: string) {
    setHighlightedSource({ key, id: sourceId })
    sourceRefs.current.get(sourceId)?.focus()
  }

  const summaryText = sample && result ? [
    sample.title,
    '',
    sample.summary,
    '',
    'Decisions',
    ...sample.decisions.map((decision) => `- ${decision.text}`),
    '',
    'Tasks',
    ...sample.tasks.map((task) => `- ${task.text} — ${(result.owners[task.id] ?? task.owner).trim() || 'Unassigned'}`),
  ].join('\n') : ''

  async function copySummary() {
    if (!result || !sample) return
    const attempt = ++copyAttempt.current
    const copiedKey = key
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(summaryText)
      if (attempt !== copyAttempt.current || currentKey.current !== copiedKey) return
      setFeedback({ key: copiedKey, message: 'Summary copied.', manual: false })
    } catch {
      if (attempt !== copyAttempt.current || currentKey.current !== copiedKey) return
      setFeedback({ key: copiedKey, message: 'Clipboard unavailable. Select and copy the summary below.', manual: true })
    }
  }

  function sourceReference(sourceId: string) {
    if (!sample) return null
    const index = sample.notes.findIndex((note) => note.id === sourceId)
    if (index === -1) return null
    return <button className="ac-notes-workflow-reference" type="button" onClick={() => showSource(sourceId)} aria-label={`View source note ${index + 1}`} title={`View source note ${index + 1}`}>{String(index + 1).padStart(2, '0')}<Arrow diagonal /></button>
  }

  return (
    <section className={`ac-notes-workflow ${className}`.trim()} aria-labelledby={headingId}>
      <div className="ac-notes-workflow-inner">
        <header className="ac-notes-workflow-masthead">
          <span className="ac-notes-workflow-brand"><svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 21V8a3 3 0 0 1 6 0v13m0-10a3 3 0 0 1 6 0v10m0-7a3 3 0 0 1 6 0v7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>{brand}<span className="ac-notes-workflow-brand-dot" aria-hidden="true">•</span></span>
          <span className="ac-notes-workflow-masthead-label">Meeting notes &amp; action plans</span>
          <span className="ac-notes-workflow-example-label"><span aria-hidden="true" />Interactive example</span>
        </header>

        <div className="ac-notes-workflow-layout">
          <div className="ac-notes-workflow-copy">
            <span className="ac-notes-workflow-eyebrow"><span aria-hidden="true">↳</span> FROM NOTES TO NEXT STEPS</span>
            <h2 id={headingId}>{title}</h2>
            {description && <p>{description}</p>}
            <div className="ac-notes-workflow-actions">
              <button type="button" className="ac-notes-workflow-primary" onClick={() => prepare(true)} disabled={!sample} aria-controls={resultId}>Run the example<Arrow /></button>
              {action && <a className="ac-notes-workflow-secondary" href={action.href}>{action.label}<Arrow diagonal /></a>}
            </div>
            <div className="ac-notes-workflow-process" aria-label="Example workflow"><span>01 <b>Notes</b></span><i aria-hidden="true">→</i><span>02 <b>Decisions</b></span><i aria-hidden="true">→</i><span>03 <b>Tasks</b></span></div>
          </div>

          <div className="ac-notes-workflow-stage">
            <div className="ac-notes-workflow-stage-caption"><span><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="2" width="10" height="12" rx="2" stroke="currentColor" /><path d="M6 6h4M6 9h4" stroke="currentColor" strokeLinecap="round" /></svg>Your meeting workspace</span><span>LOCAL PREVIEW</span></div>
            <div className="ac-notes-workflow-app">
              <div className="ac-notes-workflow-toolbar">
                <div className="ac-notes-workflow-sample-field"><label htmlFor={`${instanceId}-sample`}>Meeting</label><select id={`${instanceId}-sample`} value={sample?.id ?? ''} disabled={!sample} onChange={(event) => {
                  copyAttempt.current += 1
                  setSelectedId(event.target.value)
                  setPrepared(null)
                  setFeedback(null)
                  setNotice(null)
                  setHighlightedSource(null)
                }}>{samples.length ? samples.map((item) => <option key={item.id} value={item.id}>{item.title}</option>) : <option value="">No examples</option>}</select></div>
                <button type="button" className="ac-notes-workflow-run" onClick={() => prepare()} disabled={!sample} aria-controls={resultId}><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="m9 2 1.7 5.3L16 9l-5.3 1.7L9 16l-1.7-5.3L2 9l5.3-1.7L9 2Z" stroke="currentColor" strokeWidth="1.2" /></svg>Run example</button>
              </div>

              <div className="ac-notes-workflow-papers">
                <section className="ac-notes-workflow-source" aria-labelledby={`${instanceId}-source-heading`}>
                  <div className="ac-notes-workflow-paper-label"><span id={`${instanceId}-source-heading`}>SOURCE NOTES</span><span>01</span></div>
                  <h3>{sample?.title ?? 'No meeting selected'}</h3>
                  {sample?.context && <p className="ac-notes-workflow-context">{sample.context}</p>}
                  {sample ? <ol className="ac-notes-workflow-source-list">{sample.notes.map((note, index) => <li key={note.id} ref={(element) => { if (element) sourceRefs.current.set(note.id, element); else sourceRefs.current.delete(note.id) }} tabIndex={-1} className={highlightedSource?.key === key && highlightedSource.id === note.id ? 'is-highlighted' : ''}>
                    <span className="ac-notes-workflow-note-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div>{note.speaker && <span className="ac-notes-workflow-speaker">{note.speaker}</span>}<p>{note.text}</p></div>
                  </li>)}</ol> : <p className="ac-notes-workflow-empty">Add a meeting example to preview its notes and tasks.</p>}
                  <div className="ac-notes-workflow-source-foot"><span aria-hidden="true">↗</span>Read-only meeting example</div>
                </section>

                <section id={resultId} ref={resultRef} tabIndex={-1} className={`ac-notes-workflow-result${result ? ' is-prepared' : ''}`} aria-labelledby={`${instanceId}-result-heading`}>
                  <div className="ac-notes-workflow-paper-label"><span id={`${instanceId}-result-heading`}>ACTION PLAN</span><span>02</span></div>
                  {sample && result ? <>
                    <div className="ac-notes-workflow-result-title"><h3>The next steps.</h3><span aria-label="Example prepared"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Prepared</span></div>
                    <p className="ac-notes-workflow-summary">{sample.summary}</p>
                    <h4>Decisions <span>{sample.decisions.length}</span></h4>
                    <ul className="ac-notes-workflow-decisions">{sample.decisions.map((decision) => <li key={decision.id}><span className="ac-notes-workflow-check" aria-hidden="true">✓</span><p>{decision.text}</p>{sourceReference(decision.sourceId)}</li>)}</ul>
                    <h4>Assigned tasks <span>{sample.tasks.length}</span></h4>
                    <ul className="ac-notes-workflow-tasks">{sample.tasks.map((task) => <li key={task.id}><span className="ac-notes-workflow-task-box" aria-hidden="true" /><p>{task.text}</p><label className="ac-notes-workflow-owner"><span className="ac-notes-workflow-sr-only">Owner for {task.text}</span><input aria-label={`Owner for ${task.text}`} value={result.owners[task.id] ?? task.owner} maxLength={40} placeholder="Unassigned" onChange={(event) => {
                      const owner = event.target.value
                      copyAttempt.current += 1
                      setPrepared((current) => current?.key === key ? { ...current, owners: { ...current.owners, [task.id]: owner } } : current)
                      setFeedback(null)
                    }} /></label>{sourceReference(task.sourceId)}</li>)}</ul>
                    <div className="ac-notes-workflow-result-foot"><span>Edit an owner. Keep the context.</span><button type="button" onClick={copySummary} className="ac-notes-workflow-copy-button"><svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="6" y="6" width="9" height="10" rx="1.5" stroke="currentColor" /><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v7A1.5 1.5 0 0 0 3.5 12H5" stroke="currentColor" /></svg>{copyFeedback && !copyFeedback.manual ? 'Copied' : 'Copy summary'}</button></div>
                  </> : <div className="ac-notes-workflow-awaiting"><svg viewBox="0 0 60 60" fill="none" aria-hidden="true"><rect x="15" y="8" width="31" height="43" rx="4" stroke="currentColor" strokeWidth="1.5" /><path d="M23 20h15m-15 7h15m-15 7h8m3 11 5 5 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg><h3>Your action plan starts here.</h3><p>{sample ? 'Run this meeting example to see its decisions and assigned tasks.' : 'Add an example to continue.'}</p>{sample && <button type="button" onClick={() => prepare()}>Run example<Arrow /></button>}</div>}
                  {copyFeedback?.manual && <div className="ac-notes-workflow-manual"><label htmlFor={`${instanceId}-manual-copy`}>Summary for manual copying</label><textarea ref={manualRef} id={`${instanceId}-manual-copy`} readOnly value={summaryText} rows={7} onFocus={(event) => event.currentTarget.select()} /><button type="button" onClick={() => { manualRef.current?.focus(); manualRef.current?.select() }}>Select summary</button></div>}
                </section>
              </div>
              <div className="ac-notes-workflow-app-foot"><span className="ac-notes-workflow-status" role="status" aria-live="polite">{copyFeedback?.message ?? status}</span><span>Sample data · no recording or AI service</span></div>
            </div>
            <div className="ac-notes-workflow-under-note" aria-hidden="true"><svg viewBox="0 0 46 28" fill="none"><path d="M2 2c10 20 25 21 40 11m-11 0 12-1-4 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>Every task links to its source.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
