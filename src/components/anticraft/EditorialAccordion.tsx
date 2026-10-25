'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import './editorial-accordion.css'

export interface EditorialAccordionItem {
  /** A unique, stable identifier within this accordion. */
  id: string
  title: string
  content: ReactNode
}

export interface EditorialAccordionProps {
  items: EditorialAccordionItem[]
  defaultValue?: string
  className?: string
}

export function EditorialAccordion({
  items,
  defaultValue,
  className = '',
}: EditorialAccordionProps) {
  const [openId, setOpenId] = useState<string | undefined>(defaultValue)
  const instanceId = useId()

  return (
    <div className={`ac-editorial-accordion ${className}`.trim()}>
      {items.map((item, index) => {
        const isOpen = item.id === openId
        const buttonId = `${instanceId}-trigger-${index}`
        const panelId = `${instanceId}-panel-${index}`

        return (
          <section className="ac-editorial-accordion-item" data-open={isOpen} key={item.id}>
            <h3 className="ac-editorial-accordion-heading">
              <button
                id={buttonId}
                className="ac-editorial-accordion-trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? undefined : item.id)}
              >
                <span className="ac-editorial-accordion-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="ac-editorial-accordion-title">{item.title}</span>
                <span className="ac-editorial-accordion-icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              className="ac-editorial-accordion-panel"
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
            >
              <div className="ac-editorial-accordion-content">{item.content}</div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
