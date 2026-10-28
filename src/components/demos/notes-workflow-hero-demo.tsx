'use client'

import { NotesWorkflowHero, type NotesWorkflowSample } from '@/components/anticraft/NotesWorkflowHero'
import './notes-workflow-hero-demo.css'

const meetingExamples: NotesWorkflowSample[] = [
  {
    id: 'product-review',
    revision: 1,
    title: 'Product review',
    context: 'Design + Engineering · Tuesday, 10:00',
    notes: [
      { id: 'review-1', speaker: 'Leah', text: 'Keep the launch to one workspace. Multi-workspace can wait until the next release.' },
      { id: 'review-2', speaker: 'Omar', text: 'The invite flow needs a clearer empty state. I’ll have a prototype ready on Thursday.' },
      { id: 'review-3', speaker: 'Leah', text: 'Use email invitations for launch. We can add shareable invite links later.' },
      { id: 'review-4', speaker: 'Mina', text: 'I’ll test the invitation prototype with five customers on Friday.' },
    ],
    summary: 'Launch one workspace with email invitations. Validate the new invite flow before release.',
    decisions: [
      { id: 'scope', text: 'Launch with a single workspace.', sourceId: 'review-1' },
      { id: 'invites', text: 'Use email invitations for launch.', sourceId: 'review-3' },
    ],
    tasks: [
      { id: 'prototype', text: 'Prototype invite empty state by Thursday.', owner: 'Omar', sourceId: 'review-2' },
      { id: 'test', text: 'Test with five customers on Friday.', owner: 'Mina', sourceId: 'review-4' },
    ],
  },
  {
    id: 'customer-interview',
    revision: 1,
    title: 'Customer interview',
    context: 'Research + Customer success · Wednesday, 14:00',
    notes: [
      { id: 'customer-1', speaker: 'Priya', text: 'Weekly CSV exports are the priority. The team does not need a live integration yet.' },
      { id: 'customer-2', speaker: 'Nico', text: 'Let’s keep the current column order. Their finance spreadsheet already depends on it.' },
      { id: 'customer-3', speaker: 'Ada', text: 'I’ll send an example export with the existing columns by tomorrow.' },
      { id: 'customer-4', speaker: 'Nico', text: 'I’ll confirm the export format with their finance team on Monday.' },
    ],
    summary: 'Prioritize weekly CSV exports and preserve the column order used by the customer’s finance team.',
    decisions: [
      { id: 'weekly', text: 'Prioritize weekly CSV exports.', sourceId: 'customer-1' },
      { id: 'columns', text: 'Keep the existing column order.', sourceId: 'customer-2' },
    ],
    tasks: [
      { id: 'export', text: 'Send an example export tomorrow.', owner: 'Ada', sourceId: 'customer-3' },
      { id: 'confirm', text: 'Confirm the format on Monday.', owner: 'Nico', sourceId: 'customer-4' },
    ],
  },
  {
    id: 'sprint-planning',
    revision: 1,
    title: 'Sprint planning',
    context: 'Engineering · Monday, 09:30',
    notes: [
      { id: 'sprint-1', speaker: 'Jules', text: 'Put the search fix ahead of new filters. Failed searches affect the whole support team.' },
      { id: 'sprint-2', speaker: 'Rae', text: 'Keep the rollout behind a feature flag until the regression checks pass.' },
      { id: 'sprint-3', speaker: 'Jules', text: 'I’ll ship the query timeout fix to staging by Wednesday.' },
      { id: 'sprint-4', speaker: 'Eli', text: 'I’ll run the search regression checks on Thursday and share the results.' },
    ],
    summary: 'Fix search reliability first. Release behind a feature flag after regression checks pass.',
    decisions: [
      { id: 'priority', text: 'Prioritize the search reliability fix.', sourceId: 'sprint-1' },
      { id: 'flag', text: 'Use a feature flag for the rollout.', sourceId: 'sprint-2' },
    ],
    tasks: [
      { id: 'staging', text: 'Ship the fix to staging by Wednesday.', owner: 'Jules', sourceId: 'sprint-3' },
      { id: 'regression', text: 'Run regression checks on Thursday.', owner: 'Eli', sourceId: 'sprint-4' },
    ],
  },
]

export function NotesWorkflowHeroDemo() {
  return <div className="demo hero-demo notes-workflow-hero-demo" tabIndex={0} role="region" aria-label="Scrollable Minute meeting workflow preview">
    <NotesWorkflowHero
      brand="Minute"
      title={'Meeting notes.\nNext steps, sorted.'}
      description="Turn meeting notes into decisions and assigned tasks, with the context attached."
      samples={meetingExamples}
    />
  </div>
}
