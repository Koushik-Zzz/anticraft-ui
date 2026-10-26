'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import './curtain-menu.css'

export interface CurtainMenuItem {
  id: string
  label: string
  href: string
  description?: string
}

export interface CurtainMenuProps {
  items: CurtainMenuItem[]
  activeId?: string
  className?: string
  label?: string
  title?: string
  footer?: ReactNode
  onNavigate?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void
  onOpenChange?: (open: boolean) => void
}

/** A full-screen editorial navigation sheet with native modal behavior. */
export function CurtainMenu({
  items,
  activeId,
  className = '',
  label = 'Explore menu',
  title = 'Where next?',
  footer,
  onNavigate,
  onOpenChange,
}: CurtainMenuProps) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const id = useId()
  const dialogId = `ac-curtain-${id}`
  const titleId = `${dialogId}-title`

  function changeOpen(next: boolean) {
    if (openRef.current === next) return
    openRef.current = next
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()

    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <div className={`ac-curtain-menu ${className}`.trim()}>
      <button
        ref={triggerRef}
        className="ac-curtain-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={open}
        onClick={() => changeOpen(true)}
      >
        <span>{label}</span>
        <span className="ac-curtain-trigger-icon" aria-hidden="true"><i /><i /></span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        className="ac-curtain-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault()
          changeOpen(false)
        }}
        onClose={() => {
          // An effect cleanup may close and immediately reopen in Strict Mode.
          if (!dialogRef.current?.open) changeOpen(false)
        }}
      >
        <div className="ac-curtain-panels" aria-hidden="true"><span /><span /><span /></div>

        <header className="ac-curtain-header">
          <span className="ac-curtain-index"><span aria-hidden="true">✳</span> Navigation index</span>
          <button type="button" className="ac-curtain-close" onClick={() => changeOpen(false)}>
            <span>Close</span>
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </header>

        <div className="ac-curtain-body">
          <div className="ac-curtain-heading">
            <h2 id={titleId}>{title}</h2>
            <span aria-hidden="true">{String(items.length).padStart(2, '0')} destinations</span>
          </div>

          <nav aria-label={title}>
            <ol className="ac-curtain-links">
              {items.map((item, index) => (
                <li className="ac-curtain-row" key={item.id}>
                  <a
                    className="ac-curtain-link"
                    href={item.href}
                    aria-current={activeId === item.id ? 'page' : undefined}
                    onClick={(event) => {
                      onNavigate?.(item.id, event)
                      changeOpen(false)
                    }}
                  >
                    <span className="ac-curtain-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className="ac-curtain-label">{item.label}</span>
                    {item.description && <span className="ac-curtain-description">{item.description}</span>}
                    <span className="ac-curtain-arrow" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {footer && <footer className="ac-curtain-footer">{footer}</footer>}
        </div>
      </dialog>
    </div>
  )
}
