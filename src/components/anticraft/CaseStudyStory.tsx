'use client'

import { useId } from 'react'
import './case-study-story.css'

export interface CaseStudyImage {
  src: string
  alt: string
  caption?: string
}

export interface CaseStudyFact {
  label: string
  value: string
}

export interface CaseStudyChapter {
  id: string
  title: string
  paragraphs: string[]
  image?: CaseStudyImage
}

export interface CaseStudyOutcome {
  value: string
  label: string
}

export interface CaseStudyNextProject {
  title: string
  href: string
  label?: string
  image?: CaseStudyImage
}

export interface CaseStudyStoryProps {
  title: string
  intro: string
  hero: CaseStudyImage
  chapters: CaseStudyChapter[]
  eyebrow?: string
  facts?: CaseStudyFact[]
  outcomes?: CaseStudyOutcome[]
  outcomesTitle?: string
  outcomeNote?: string
  nextProject?: CaseStudyNextProject
  showChapterLinks?: boolean
  className?: string
}

function StoryImage({ image, className = '' }: { image: CaseStudyImage; className?: string }) {
  return <figure className={`ac-case-image ${className}`.trim()}><img src={image.src} alt={image.alt} loading="lazy" />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>
}

/** An editorial project story with readable chapters, project facts, and outcomes. */
export function CaseStudyStory({ title, intro, hero, chapters, eyebrow = 'SELECTED WORK', facts = [], outcomes = [], outcomesTitle = 'The outcome.', outcomeNote, nextProject, showChapterLinks = true, className = '' }: CaseStudyStoryProps) {
  const id = useId()
  return <article className={`ac-case-study ${className}`.trim()} aria-labelledby={`${id}-title`}>
    <header className="ac-case-header">
      <div className="ac-case-topline"><span>{eyebrow}</span><span aria-hidden="true">A CLOSER LOOK / ↘</span></div>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="ac-case-intro"><p>{intro}</p>{facts.length > 0 && <dl className="ac-case-facts">{facts.map((fact, index) => <div key={`${fact.label}-${index}`}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>}</div>
    </header>
    <StoryImage image={hero} className="ac-case-hero" />
    {showChapterLinks && chapters.length > 0 && <nav className="ac-case-chapter-links" aria-label={`${title} chapters`}><span>IN THIS STORY</span><ol>{chapters.map((chapter, index) => <li key={chapter.id}><a href={`#${id}-${chapter.id}`}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{chapter.title}</a></li>)}</ol></nav>}
    <div className="ac-case-chapters">{chapters.map((chapter, index) => <section key={chapter.id} id={`${id}-${chapter.id}`} className="ac-case-chapter" aria-labelledby={`${id}-${chapter.id}-title`}>
      <div className="ac-case-chapter-text"><header><span className="ac-case-index" aria-hidden="true">/{String(index + 1).padStart(2, '0')}</span><h3 id={`${id}-${chapter.id}-title`}>{chapter.title}</h3></header><div className="ac-case-prose">{chapter.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</div></div>
      {chapter.image && <StoryImage image={chapter.image} className="ac-case-chapter-image" />}
    </section>)}</div>
    {outcomes.length > 0 && <section className="ac-case-outcomes" aria-label="Project outcomes"><header><span>IN THE DETAILS</span><h3>{outcomesTitle}</h3>{outcomeNote && <p>{outcomeNote}</p>}</header><dl>{outcomes.map((outcome, index) => <div key={`${outcome.label}-${index}`}><dt>{outcome.label}</dt><dd>{outcome.value}</dd></div>)}</dl></section>}
    {nextProject && <a className="ac-case-next" href={nextProject.href}>{nextProject.image && <img src={nextProject.image.src} alt={nextProject.image.alt} loading="lazy" />}<div><span>{nextProject.label ?? 'NEXT PROJECT'}</span><h3>{nextProject.title}</h3></div><span className="ac-case-next-arrow" aria-hidden="true">↗</span></a>}
  </article>
}
