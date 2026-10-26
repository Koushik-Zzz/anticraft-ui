'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import './process-timeline.css'

export interface ProcessTimelineStep {
  id: string
  title: string
  description: string
  duration?: string
  deliverables?: string[]
  /** Decorative artwork. Put essential information in the text fields. */
  media: ReactNode
}

export interface ProcessTimelineProps {
  steps: ProcessTimelineStep[]
  title?: string
  className?: string
}

function decorativeMedia(element: HTMLDivElement | null) {
  element?.setAttribute('inert', '')
}

function scrollParent(element: HTMLElement) {
  let parent = element.parentElement
  while (parent) {
    if (/(auto|scroll|overlay)/.test(window.getComputedStyle(parent).overflowY)) return parent
    parent = parent.parentElement
  }
  return null
}

/** A readable project process with a scroll-following decorative preview. */
export function ProcessTimeline({ steps, title = 'From first thought to launch', className = '' }: ProcessTimelineProps) {
  const headingId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const stepRefs = useRef<(HTMLLIElement | null)[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeIndex = Math.max(0, steps.findIndex((step) => step.id === activeId))
  const activeStep = steps[activeIndex]

  useEffect(() => {
    const element = rootRef.current
    if (!element || !steps.length) return
    const viewport = scrollParent(element)
    const scrollTarget = viewport ?? window
    let frame = 0

    function readPosition() {
      frame = 0
      const bounds = viewport?.getBoundingClientRect()
      const top = Math.max(0, bounds?.top ?? 0)
      const bottom = Math.min(window.innerHeight, bounds?.bottom ?? window.innerHeight)
      if (bottom <= top) return
      const componentBounds = element!.getBoundingClientRect()
      if (componentBounds.bottom < top || componentBounds.top > bottom) return
      const target = top + Math.min(80, (bottom - top) * 0.22)
      let next = 0
      for (let index = 0; index < steps.length; index += 1) {
        const step = stepRefs.current[index]
        if (step && step.getBoundingClientRect().top <= target) next = index
      }
      // A short final stage may never reach the top threshold before the scroll ends.
      const lastBounds = stepRefs.current[steps.length - 1]?.getBoundingClientRect()
      if (lastBounds && lastBounds.top < bottom && lastBounds.bottom <= bottom + 1) next = steps.length - 1
      setActiveId((current) => current === steps[next].id ? current : steps[next].id)
    }

    function scheduleRead() {
      if (!frame) frame = window.requestAnimationFrame(readPosition)
    }

    readPosition()
    scrollTarget.addEventListener('scroll', scheduleRead, { passive: true })
    // Page scrolling can move a nested viewport into or out of view.
    if (viewport) window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', scheduleRead)
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleRead)
    resize?.observe(element)
    if (viewport) resize?.observe(viewport)
    return () => {
      scrollTarget.removeEventListener('scroll', scheduleRead)
      if (viewport) window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
      resize?.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [steps])

  return (
    <section ref={rootRef} className={`ac-process ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-process-heading">
        <div><span className="ac-process-eyebrow">THE PROCESS</span><h2 id={headingId}>{title}</h2></div>
        <span className="ac-process-total">{steps.length.toString().padStart(2, '0')} stages</span>
      </header>
      {activeStep ? <div className="ac-process-layout">
        <ol className="ac-process-steps">
          {steps.map((step, index) => <li
            key={step.id}
            ref={(element) => { stepRefs.current[index] = element }}
            className="ac-process-step"
            aria-current={activeIndex === index ? 'step' : undefined}
          >
            <div className="ac-process-step-meta"><span className="ac-process-number" aria-hidden="true">{(index + 1).toString().padStart(2, '0')}</span>{step.duration && <span>{step.duration}</span>}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {!!step.deliverables?.length && <ul className="ac-process-deliverables" aria-label={`${step.title} deliverables`}>{step.deliverables.map((deliverable, itemIndex) => <li key={`${itemIndex}-${deliverable}`}>{deliverable}</li>)}</ul>}
            <div ref={decorativeMedia} className="ac-process-inline-art" aria-hidden="true">{step.media}</div>
          </li>)}
        </ol>
        <div ref={decorativeMedia} className="ac-process-preview" aria-hidden="true">
          <div key={activeStep.id} className="ac-process-preview-art">{activeStep.media}</div>
          <div className="ac-process-preview-caption"><span>{activeStep.title}</span><span>{(activeIndex + 1).toString().padStart(2, '0')} / {steps.length.toString().padStart(2, '0')}</span></div>
          <div className="ac-process-progress"><span style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }} /></div>
        </div>
      </div> : <p className="ac-process-empty">The next chapter is taking shape. Process details are coming soon.</p>}
    </section>
  )
}
