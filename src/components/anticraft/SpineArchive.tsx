'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import './spine-archive.css'

export interface SpineArchiveItem {
  /** A stable, unique identifier. */
  id: string
  title: string
  year?: string
  category?: string
  color?: string
  foreground?: string
  /** Decorative artwork only. Do not include links, buttons, or form controls. */
  artwork?: ReactNode
  description?: string
  href?: string
}

export interface SpineArchiveProps {
  items: SpineArchiveItem[]
  defaultValue?: string
  className?: string
  /** Called when a visitor commits a selection by clicking, tapping, or pressing Enter/Space. */
  onValueChange?: (value: string) => void
}

/** An expandable shelf of physical-looking project sleeves. */
export function SpineArchive({
  items,
  defaultValue,
  className = '',
  onValueChange,
}: SpineArchiveProps) {
  const instanceId = useId()
  const rackRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const revealFrame = useRef<number | null>(null)
  const [selectedId, setSelectedId] = useState(defaultValue ?? items[0]?.id)
  const [pointerId, setPointerId] = useState<string>()
  const [focusId, setFocusId] = useState<string>()
  const validId = (id: string | undefined) => items.some((item) => item.id === id)
  const committedId = validId(selectedId) ? selectedId : items[0]?.id
  const activeId = validId(pointerId) ? pointerId : validId(focusId) ? focusId : committedId
  const activeIndex = items.findIndex((item) => item.id === activeId)

  // Keep keyboard and touch selections inside this shelf without scrolling the page.
  function reveal(index: number) {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current)
    const startedAt = performance.now()
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500
    function keepVisible(time: number) {
      const rack = rackRef.current
      const sleeve = triggerRefs.current[index]?.parentElement
      if (!rack || !sleeve) {
        revealFrame.current = null
        return
      }
      const shelfBox = rack.getBoundingClientRect()
      const sleeveBox = sleeve.getBoundingClientRect()
      if (sleeveBox.left < shelfBox.left + 12) {
        rack.scrollLeft += sleeveBox.left - shelfBox.left - 12
      } else if (sleeveBox.right > shelfBox.right - 12) {
        rack.scrollLeft += sleeveBox.right - shelfBox.right + 12
      }
      // The sleeve grows after focus. Follow that change until its transition ends.
      revealFrame.current = time - startedAt < duration ? requestAnimationFrame(keepVisible) : null
    }
    revealFrame.current = requestAnimationFrame(keepVisible)
  }

  useEffect(() => () => {
    if (revealFrame.current !== null) cancelAnimationFrame(revealFrame.current)
  }, [])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % items.length
        break
      case 'ArrowLeft':
        nextIndex = (index - 1 + items.length) % items.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = items.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    setPointerId(undefined)
    triggerRefs.current[nextIndex]?.focus({ preventScroll: true })
    reveal(nextIndex)
  }

  return (
    <section
      className={`ac-spine-archive ${className}`.trim()}
      aria-label="Project archive"
      onPointerLeave={() => setPointerId(undefined)}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setFocusId(undefined)
        }
      }}
    >
      <div className="ac-spine-heading" aria-hidden="true">
        <span>Selected archive</span>
        <span>{String(Math.max(activeIndex + 1, 0)).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      </div>
      <div className="ac-spine-rack" ref={rackRef}>
        {items.map((item, index) => {
          const isActive = activeId === item.id
          const isSelected = committedId === item.id
          const triggerId = `${instanceId}-spine-${index}`
          const detailsId = `${instanceId}-details-${index}`
          const style = {
            '--ac-spine-cover-color': item.color ?? '#ddfa6b',
            '--ac-spine-ink': item.foreground ?? '#191a17',
          } as CSSProperties

          return (
            <article
              className="ac-spine-sleeve"
              data-active={isActive}
              data-selected={isSelected}
              key={item.id}
              style={style}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                  const focused = document.activeElement
                  if (focused instanceof HTMLElement && rackRef.current?.contains(focused) && focused.matches(':focus-visible')) return
                  setPointerId(item.id)
                }
              }}
              onFocus={() => {
                setPointerId(undefined)
                setFocusId(item.id)
                reveal(index)
              }}
            >
              <button
                className="ac-spine-trigger"
                type="button"
                id={triggerId}
                ref={(element) => { triggerRefs.current[index] = element }}
                aria-label={`Select ${item.title}${item.year ? `, ${item.year}` : ''}`}
                aria-expanded={isActive}
                aria-controls={detailsId}
                aria-pressed={isSelected}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onClick={() => {
                  setSelectedId(item.id)
                  setPointerId(undefined)
                  setFocusId(item.id)
                  onValueChange?.(item.id)
                  reveal(index)
                }}
              >
                <span className="ac-spine-surface" aria-hidden="true">
                  <span className="ac-spine-artwork">
                    {item.artwork ?? <span className="ac-spine-default-art" />}
                  </span>
                  <span className="ac-spine-case-line" />
                  <span className="ac-spine-title">{item.title}</span>
                  <span className="ac-spine-serial">AC—{String(index + 1).padStart(3, '0')}</span>
                  <span className="ac-spine-year">{item.year ?? String(index + 1).padStart(2, '0')}</span>
                </span>
              </button>
              <div
                className="ac-spine-details"
                id={detailsId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isActive}
              >
                {item.category && <p className="ac-spine-category">{item.category}</p>}
                {item.description && <p className="ac-spine-description">{item.description}</p>}
                {item.href && <a className="ac-spine-link" href={item.href}>Explore project <span aria-hidden="true">↗</span></a>}
              </div>
            </article>
          )
        })}
      </div>
      <div className="ac-spine-footer" aria-hidden="true">
        <span>A collection worth pulling apart.</span>
        <span>← Explore →</span>
      </div>
    </section>
  )
}
