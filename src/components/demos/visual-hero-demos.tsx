'use client'

import { ScrollExpandHero } from '@/components/anticraft/ScrollExpandHero'
import { EditorialHero } from '@/components/anticraft/EditorialHero'
import { DemoStory } from './practical-art'
import './visual-hero-demos.css'

export function ScrollExpandHeroDemo() {
  return (
    <div className="demo hero-demo visual-scroll-demo" tabIndex={0} role="region" aria-label="Scrollable STILL architecture hero preview">
      <DemoStory>
        <div className="visual-scroll-masthead"><b>STILL<span>®</span></b><span>ARCHITECTURE &amp; OTHER WAYS OF LIVING</span><span>EST. 2016 <i aria-hidden="true">↗</i></span></div>
        <ScrollExpandHero
          eyebrow="SPACES FOR THE SENSES"
          title={'Space to\nfeel more.'}
          description="Architecture that makes room for a different way of being. Less noise. More life."
          action={{ label: 'Explore the project', href: '#demo-story-still' }}
          caption={'Casa Forma / Portugal\nA study in living slowly.'}
          chapters={['The approach', 'A wider view', 'Feel at home']}
          media={<img src="/images/demos/forma-house.webp" alt="" decoding="async" />}
        />
        <section className="visual-scroll-continuation" aria-label="About the STILL architecture study">
          <div><span>SELECTED WORK / 2026</span><span>01 — CASA FORMA</span></div>
          <h3>Space is a feeling.<br />We design for it.</h3>
          <div className="visual-scroll-continuation-bottom"><p>A considered relationship between light, material and the everyday. Casa Forma is a fictional architectural study in making a little more room for life.</p><a href="#demo-story-still">Open the architecture case study <span aria-hidden="true">↗</span></a></div>
          <small>Original architecture concept. An Anticraft UI interaction study.</small>
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
