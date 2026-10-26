'use client'

import { useId, useState, type ReactNode } from 'react'
import './project-preview-list.css'

export interface ProjectPreviewListItem {
  id: string
  title: string
  category: string
  href: string
  year?: string
  /** Decorative artwork. The title and category provide the accessible description. */
  media: ReactNode
}

export interface ProjectPreviewListProps {
  items: ProjectPreviewListItem[]
  title?: string
  className?: string
}

function decorativeMedia(element: HTMLDivElement | null) {
  element?.setAttribute('inert', '')
}

export function ProjectPreviewList({ items, title = 'Project index', className = '' }: ProjectPreviewListProps) {
  const headingId = useId()
  const [previewId, setPreviewId] = useState<string | null>(null)
  const preview = items.find((item) => item.id === previewId) ?? items[0]

  return (
    <section className={`ac-project-preview-list ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-project-preview-heading"><h2 id={headingId}>{title}</h2><span>{items.length.toString().padStart(2, '0')} projects</span></header>
      {items.length > 0 ? (
        <div className="ac-project-preview-layout">
          <ol className="ac-project-preview-rows">
            {items.map((item, index) => (
              <li key={item.id}>
                <a
                  className="ac-project-preview-link"
                  href={item.href}
                  data-previewing={preview?.id === item.id ? 'true' : undefined}
                  onPointerEnter={(event) => { if (event.pointerType !== 'touch') setPreviewId(item.id) }}
                  onFocus={() => setPreviewId(item.id)}
                >
                  <span className="ac-project-preview-number" aria-hidden="true">{(index + 1).toString().padStart(2, '0')}</span>
                  <div ref={decorativeMedia} className="ac-project-preview-thumbnail" aria-hidden="true">{item.media}</div>
                  <div className="ac-project-preview-copy"><h3>{item.title}</h3><span>{item.category}{item.year && <> · {item.year}</>}</span></div>
                  <span className="ac-project-preview-arrow" aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
          <div ref={decorativeMedia} className="ac-project-preview-art" aria-hidden="true">
            <div key={preview.id} className="ac-project-preview-image">{preview.media}</div>
            <div className="ac-project-preview-caption"><span>{preview.title}</span><span>{preview.category}</span></div>
          </div>
        </div>
      ) : <p className="ac-project-preview-empty">Projects are on the way. Check back soon.</p>}
    </section>
  )
}
