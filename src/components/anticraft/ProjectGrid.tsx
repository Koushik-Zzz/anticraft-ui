'use client'

import { useId, useState, type ReactNode } from 'react'
import './project-grid.css'

export interface ProjectGridItem {
  id: string
  title: string
  category: string
  href: string
  description?: string
  year?: string
  /** Decorative artwork. Put information needed to understand the project in its text fields. */
  media: ReactNode
}

export interface ProjectGridProps {
  items: ProjectGridItem[]
  title?: string
  label?: string
  className?: string
  onFilterChange?: (category: string) => void
}

function decorativeMedia(element: HTMLDivElement | null) {
  element?.setAttribute('inert', '')
}

export function ProjectGrid({
  items,
  title = 'Selected work',
  label = 'Project categories',
  className = '',
  onFilterChange,
}: ProjectGridProps) {
  const headingId = useId()
  const [filter, setFilter] = useState<string | null>(null)
  const categories = [...new Set(items.map((item) => item.category))]
  const activeFilter = filter !== null && categories.includes(filter) ? filter : null
  const visibleItems = activeFilter === null ? items : items.filter((item) => item.category === activeFilter)

  function chooseCategory(category: string | null) {
    setFilter(category)
    onFilterChange?.(category ?? 'All')
  }

  return (
    <section className={`ac-project-grid ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-project-grid-heading">
        <h2 id={headingId}>{title}</h2>
        <p className="ac-project-grid-count" role="status" aria-live="polite" aria-atomic="true">
          {visibleItems.length} {visibleItems.length === 1 ? 'project' : 'projects'}
          {activeFilter !== null && <span className="ac-project-grid-sr-only"> in {activeFilter}</span>}
        </p>
      </header>
      {items.length > 0 && (
        <div className="ac-project-grid-filters" role="group" aria-label={label}>
          <button type="button" aria-pressed={activeFilter === null} onClick={() => chooseCategory(null)}>
            All <span aria-hidden="true">{items.length.toString().padStart(2, '0')}</span>
          </button>
          {categories.map((category) => (
            <button key={category} type="button" aria-pressed={activeFilter === category} onClick={() => chooseCategory(category)}>
              {category} <span aria-hidden="true">{items.filter((item) => item.category === category).length.toString().padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      )}
      {visibleItems.length > 0 ? (
        <ul className="ac-project-grid-list">
          {visibleItems.map((item) => (
            <li key={`${activeFilter ?? '*'}-${item.id}`}>
              <article className="ac-project-grid-card">
                <a href={item.href}>
                  <div ref={decorativeMedia} className="ac-project-grid-media" aria-hidden="true">{item.media}</div>
                  <div className="ac-project-grid-details">
                    <div className="ac-project-grid-meta"><span>{item.category}</span>{item.year && <span>{item.year}</span>}</div>
                    <div className="ac-project-grid-title"><h3>{item.title}</h3><span className="ac-project-grid-arrow" aria-hidden="true">↗</span></div>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </a>
              </article>
            </li>
          ))}
        </ul>
      ) : <p className="ac-project-grid-empty">Projects are on the way. Check back soon.</p>}
    </section>
  )
}
