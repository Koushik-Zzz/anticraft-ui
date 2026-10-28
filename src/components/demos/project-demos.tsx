'use client'

import { ProjectGrid } from '@/components/anticraft/ProjectGrid'
import { ProjectPreviewList } from '@/components/anticraft/ProjectPreviewList'
import { DemoStory, ProjectArt } from './practical-art'
import './project-demos.css'

const demoProjects = [
  { id: 'kin', title: 'KIN', category: 'Web', href: '#demo-story-kin', year: '2026', description: 'Everyday objects. A better shopping experience.', media: <ProjectArt variant="kin" /> },
  { id: 'forma', title: 'FORMA', category: 'Brand', href: '#demo-story-forma', year: '2026', description: 'A new identity for the way we work.', media: <ProjectArt variant="forma" /> },
  { id: 'folio', title: 'FOLIO', category: 'Product', href: '#demo-story-folio', year: '2025', description: 'Making personal finance feel personal.', media: <ProjectArt variant="folio" /> },
  { id: 'mono', title: 'MONO', category: 'Web', href: '#demo-story-mono', year: '2025', description: 'Architecture with room for possibility.', media: <ProjectArt variant="mono" /> },
]

export function ProjectGridDemo() {
  return (
    <div className="demo practical-demo project-grid-demo">
      <DemoStory>
        <p className="project-demo-eyebrow">INDEPENDENT DESIGN PARTNERS · EST. 2020</p>
        <ProjectGrid items={demoProjects} title="Selected partnerships" />
        <p className="project-demo-hint">Filter by discipline. Open a case study. ↗</p>
      </DemoStory>
    </div>
  )
}

export function ProjectPreviewListDemo() {
  return (
    <div className="demo practical-demo project-preview-demo">
      <DemoStory>
        <p className="project-demo-eyebrow">A FEW THINGS WE HAVE PUT INTO THE WORLD</p>
        <ProjectPreviewList items={demoProjects} title="Brands, products & places." />
        <p className="project-demo-hint">Explore the work. Open a case study. ↗</p>
      </DemoStory>
    </div>
  )
}
