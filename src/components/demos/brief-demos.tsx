'use client';

import { ProjectBriefBuilder } from '@/components/anticraft/ProjectBriefBuilder';
import './brief-demos.css';

/** This local example resolves in memory. It never sends or stores a visitor’s details. */
export function ProjectBriefBuilderDemo() {
  return <div className="demo website-demo project-brief-builder-demo">
    <ProjectBriefBuilder
      studioName="goodform"
      title="Something good in mind?"
      description="Ambitious ideas. Thoughtful execution. Tell us what you’re imagining."
      availability="Taking on good projects"
      services={[
        { id: 'brand', label: 'Brand identity', description: 'A clear point of view' },
        { id: 'website', label: 'Digital experience', description: 'A place that feels like you' },
        { id: 'strategy', label: 'Creative strategy', description: 'The thinking before the making' },
        { id: 'something-else', label: 'Something else', description: 'We like a good surprise' },
      ]}
      budgets={[
        { id: '5-10k', label: '$5,000 – $10,000' },
        { id: '10-25k', label: '$10,000 – $25,000' },
        { id: '25-50k', label: '$25,000 – $50,000' },
        { id: '50k-plus', label: '$50,000+' },
        { id: 'discuss', label: 'Let’s figure it out together' },
      ]}
      timelines={[
        { id: 'soon', label: 'As soon as we can' },
        { id: '1-3-months', label: 'In the next 1–3 months' },
        { id: '3-6-months', label: 'In the next 3–6 months' },
        { id: 'exploring', label: 'Just exploring for now' },
      ]}
      submitLabel="Preview your brief"
      successTitle="That’s a good start."
      successMessage="Here’s your completed brief. This is a local preview: nothing was sent or saved."
      onSubmit={async () => { await new Promise<void>(resolve => window.setTimeout(resolve, 500)); }}
    />
    <p className="brief-demo-caption"><span>GOODFORM IS A FICTIONAL INDEPENDENT STUDIO.</span><span>INTERACTIVE PREVIEW · NOTHING IS SENT OR SAVED.</span></p>
  </div>;
}
