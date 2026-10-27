import type { ComponentDefinition } from './catalog';

export const briefComponents: ComponentDefinition[] = [
  {
    slug: 'project-brief-builder',
    title: 'Project Brief Builder',
    category: 'Sections',
    tag: 'New',
    description: 'Turn a first hello into a useful enquiry. An editorial, three-step project brief with service choices, budget, contact details, and a final review.',
    file: 'ProjectBriefBuilder.tsx',
    cssFile: 'project-brief-builder.css',
    usage: `'use client';

import { useState } from 'react';
import { ProjectBriefBuilder } from '@/components/anticraft/ProjectBriefBuilder';
import type { ProjectBrief } from '@/components/anticraft/ProjectBriefBuilder';

export function Example() {
  const [, setPreview] = useState<ProjectBrief | null>(null);
  // This runnable example stays in memory. For a live site, replace this
  // callback with your endpoint and reject when its response is unsuccessful.
  async function previewBrief(brief: ProjectBrief) {
    setPreview(brief);
  }

  return (
    <ProjectBriefBuilder
      studioName="Goodform"
      title="Something good in mind?"
      description="Tell us about the idea you would love to make real."
      availability="Open for new collaborations"
      services={[
        { id: 'brand', label: 'Brand identity', description: 'A clear point of view' },
        { id: 'website', label: 'Digital experience', description: 'A place that feels like you' },
        { id: 'strategy', label: 'Creative strategy', description: 'The thinking before the making' },
        { id: 'other', label: 'Something else', description: 'Let’s find out together' },
      ]}
      budgets={[
        { id: '5-10k', label: '$5,000 – $10,000' },
        { id: '10-25k', label: '$10,000 – $25,000' },
        { id: '25k-plus', label: '$25,000+' },
        { id: 'discuss', label: 'Let’s discuss' },
      ]}
      timelines={[
        { id: 'soon', label: 'As soon as possible' },
        { id: '1-3-months', label: 'In the next 1–3 months' },
        { id: 'exploring', label: 'Just exploring' },
      ]}
      submitLabel="Preview the brief"
      successMessage="Your preview is ready. This example does not send or save your details."
      onSubmit={previewBrief}
    />
  );
}`,
    useCases: ['Agency enquiries', 'Freelance project briefs', 'Studio contact pages'],
    props: [
      { name: 'services', type: 'ProjectBriefOption[]', default: 'Required', description: 'Service choices with unique nonempty id and label values. Optional description appears below a service name. Visitors must choose at least one. Keep the options stable throughout a brief when possible. Removed selections are excluded from the review and delivery; if none remain, submission returns to the service choices.' },
      { name: 'budgets / timelines', type: 'ProjectBriefOption[]', default: 'Required', description: 'Native select choices with unique nonempty id and label values. Both selections are required. Description is unused for select choices. If a selected option is removed, its select shows the placeholder and validation requires a new choice. An empty services, budgets, or timelines list displays a setup message instead of an unusable form.' },
      { name: 'onSubmit', type: '(brief: ProjectBrief) => void | Promise<void>', default: 'Required', description: 'Receives services ids, description, budget id, timeline id, name, email, and optional company text. Strings are trimmed for delivery. Resolve only after your own submission succeeds; throw or reject to show an error and retain every field for retry. The component has no endpoint or storage. A synchronous ref prevents rapid duplicate submissions; controls stay disabled while the promise is pending. Callbacks must be supplied from a client component in Next.js.' },
      { name: 'studioName', type: 'string', default: "'Your studio'", description: 'The studio wordmark in the masthead and colophon.' },
      { name: 'eyebrow / title / description', type: 'string', default: 'Built-in introductory copy', description: 'The introduction beside the form. Title names the section; keep it concise for an editorial composition.' },
      { name: 'availability', type: 'string', default: "'Open for new collaborations'", description: 'A brief availability statement in the masthead.' },
      { name: 'submitLabel', type: 'string', default: "'Send your brief'", description: 'The final submit button. Earlier steps use Continue; the pending state reads Submitting… .' },
      { name: 'successTitle / successMessage', type: 'string', default: 'Built-in confirmation copy', description: 'The confirmation shown only after onSubmit resolves. A visible receipt repeats the project, contact details, budget, timeline, and description. Start another brief clears the in-memory state and returns to the first step. The library demo explicitly labels its local preview: nothing is sent or saved.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional root classes. Customize --ac-brief-paper, --ac-brief-ink, --ac-brief-muted, --ac-brief-line, --ac-brief-accent and --ac-brief-radius. Container queries adapt the two-column layout to a stacked phone form below 580px. Content uses natural page scrolling on short desktops; no viewport-fixed stage or clipped fields.' },
    ],
    motion: 'Three steps retain the entered brief when going back or editing the review. Continue validates required choices and a project description of at least 20 characters; the next step validates budget, timeline, name and email. Errors focus the first invalid field. Step changes and successful submission focus the new heading. Enter advances or submits from single-line fields; a textarea keeps normal newline behavior. Native checkboxes and selects support keyboard and touch. Choice and button color transitions respect reduced motion. No automatic advance, scroll capture, storage, email sending, or external dependency is included.',
    inspiration: { name: 'Cult UI — Onboarding', url: 'https://www.cult-ui.com/docs/components/onboarding', note: 'Guided, manageable steps inspired this practical enquiry flow. Anticraft’s original studio composition uses warm paper, restrained typography, real validation, an editable review, and an application-owned submission callback.' },
  },
];
