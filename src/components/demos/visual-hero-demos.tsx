'use client'

import { ScrollExpandHero } from '@/components/anticraft/ScrollExpandHero'
import { EditorialHero } from '@/components/anticraft/EditorialHero'
import { DemoStory } from './practical-art'
import './visual-hero-demos.css'

export function ScrollExpandHeroDemo() {
  return (
    <div className="demo hero-demo visual-scroll-demo" tabIndex={0} role="region" aria-label="Scrollable Atlas hero preview">
      <DemoStory>
        <div className="visual-hero-demo-masthead"><b>atlas<span>®</span></b><span>SCROLL TO OPEN THE VIEW ↓</span></div>
        <ScrollExpandHero
          eyebrow="A DIFFERENT WAY OUT"
          title={'A little further.\nA little closer.'}
          description="Thoughtful journeys for people who like to take the long way."
          action={{ label: 'Explore the Atlas story', href: '#demo-story-atlas' }}
          caption="MORE TIME OUT THERE. LESS TIME PLANNING."
          media={<img src="/images/demos/atlas-coast.webp" alt="" decoding="async" />}
        />
        <section className="visual-scroll-continuation" aria-label="Atlas introduction">
          <span>THE GOOD KIND OF GETTING LOST</span>
          <h3>Make room for<br /><em>the unexpected.</em></h3>
          <p>A quiet coast. A new favorite place. A day with a little less on the itinerary. Start with a direction and leave room for the rest.</p>
          <a href="#demo-story-atlas">Read the example case study <span aria-hidden="true">↗</span></a>
          <small>The hero ends here. Your page keeps going.</small>
        </section>
      </DemoStory>
    </div>
  )
}

export function EditorialHeroDemo() {
  return (
    <div className="demo hero-demo visual-editorial-demo" tabIndex={0} role="region" aria-label="Scrollable Field journal hero preview">
      <DemoStory>
        <div className="visual-hero-demo-masthead"><b>FIELD<span> /</span></b><span>AN INDEPENDENT DESIGN JOURNAL</span></div>
        <EditorialHero
          eyebrow="OBSERVATIONS FROM OUT THERE"
          title={'A different\npoint of view.'}
          description="On spaces that make us pause, the people who shape them, and the details we carry home."
          image={{ src: '/images/demos/atlas-coast.webp', alt: 'A winding road to a coastal retreat above green cliffs at sunset.' }}
          action={{ label: 'Explore the Mono story', href: '#demo-story-mono' }}
          meta="ISSUE 008 / OPEN HORIZONS"
        />
        <section className="visual-editorial-continuation" aria-label="About Field journal">
          <span>FIELD NOTES / NO. 008</span>
          <div><h3>Good places change<br />how we see.</h3><p>A journal about considered spaces and useful ideas. Open the example architecture story to see how a quiet first impression leads into a fuller project.</p></div>
          <a href="#demo-story-mono">Read the architecture case study <span aria-hidden="true">↗</span></a>
        </section>
      </DemoStory>
    </div>
  )
}
