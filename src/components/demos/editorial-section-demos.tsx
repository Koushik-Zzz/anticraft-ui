'use client'

import { useId } from 'react'
import { RevealFooter } from '@/components/anticraft/RevealFooter'
import { CaseStudyStory } from '@/components/anticraft/CaseStudyStory'
import './editorial-section-demos.css'

export function RevealFooterDemo() {
  const id = useId()
  return <div className="demo website-demo reveal-footer-demo" tabIndex={0} role="region" aria-label="Afterhours studio preview. Scroll down to uncover the footer.">
    <RevealFooter
      title={'What’s next\nstarts here.'}
      brand="AFTERHOURS"
      contact={{ label: 'Let’s talk about your project', href: 'mailto:hello@example.com' }}
      availability="Open for the right project"
      links={[{ label: 'Our approach', href: `#${id}-about` }, { label: 'Project notes', href: `#${id}-notes` }]}
      note="Independent minds. Shared ambition. A small studio for brands going somewhere."
      legal="AFTERHOURS © 2026 / AN ANTICRAFT DESIGN STUDY"
    >
      <div className="reveal-demo-work">
        <header className="reveal-demo-masthead"><strong>AFTERHOURS<span>®</span></strong><span>INDEPENDENT DESIGN STUDIO</span><span>01 / SELECTED WORK</span></header>
        <div className="reveal-demo-intro" id={`${id}-about`}><span>BRAND STRATEGY. DIGITAL EXPRESSION.</span><p>We turn a different point of view<br />into something worth looking at.</p></div>
        <section className="reveal-demo-project" id={`${id}-notes`} aria-labelledby={`${id}-project`}>
          <div className="reveal-demo-project-image"><img src="/images/demos/atlas-coast.webp" alt="A sunlit coastline with pale cliffs and turquoise water" /><div className="reveal-demo-travel-stamp" aria-hidden="true"><span>A DIFFERENT WAY OUT</span><strong>out of<br /><em>office.</em></strong><span>GO SOMEWHERE YOU FEEL SOMETHING. ↗</span></div><span className="reveal-demo-image-note">ATLAS / A NEW PERSPECTIVE ON TRAVEL</span></div>
          <div className="reveal-demo-project-caption"><div><span>BRAND STRATEGY / DIGITAL EXPERIENCE</span><h2 id={`${id}-project`}>A little further from ordinary.</h2></div><p>A fresh identity for a slower kind of travel.<br />Fictional project. Very real wanderlust.</p></div>
        </section>
        <div className="reveal-demo-scroll-note"><span>THAT’S THE WORK. NOW, WHAT’S NEXT?</span><span>Keep scrolling ↓</span></div>
      </div>
    </RevealFooter>
  </div>
}

export function CaseStudyStoryDemo() {
  const id = useId()
  return <div className="demo website-demo case-study-story-demo" tabIndex={0} role="region" aria-label="Still architecture case study preview. Scroll to read the complete project.">
    <div className="case-demo-masthead"><span>STILL<span className="case-demo-wordmark-dot">.</span></span><span>ARCHITECTURE FOR LIVING</span><span>PROJECT / 006</span></div>
    <CaseStudyStory
      eyebrow="RESIDENTIAL / CONCEPT STUDY 2026"
      title={'A home,\nin its element.'}
      intro="A house that asks less of its surroundings. Open to the light, grounded in its materials, and made for the small rituals of everyday life."
      facts={[
        { label: 'Project', value: 'Hearth House' },
        { label: 'Location', value: 'Coastal New South Wales' },
        { label: 'Scope', value: 'Architecture & interiors' },
        { label: 'Status', value: 'Residential concept / 2026' },
      ]}
      hero={{ src: '/images/demos/forma-house.webp', alt: 'A low modern house with warm timber, pale concrete, and open glazing in a coastal landscape', caption: '01 / HEARTH HOUSE — AN ORIGINAL ANTICRAFT ARCHITECTURAL VISUAL STUDY' }}
      chapters={[
        { id: 'challenge', title: 'Less building. More belonging.', paragraphs: ['The brief began with a feeling, rather than a floor plan: a place to slow down, where the landscape remains the main event. The challenge was to create privacy and shelter without closing the house off from the world around it.', 'A low roofline, a simple footprint, and a generous connection to the garden gave the concept its starting point. Every room looks outward. Every threshold makes space to pause.'] },
        { id: 'approach', title: 'Let the site do the talking.', paragraphs: ['We brought the living spaces to the light and tucked the quieter rooms behind a sheltered edge. Deep eaves temper the afternoon sun; opposing openings invite a breeze through the plan.', 'The palette stays deliberately small: tactile timber, soft mineral surfaces, and planting allowed to grow into the edges. Fewer gestures, considered more carefully.'], image: { src: '/images/demos/forma-house.webp', alt: 'A closer crop of the house showing the meeting of the shaded terrace, warm timber, and glazed living spaces', caption: '02 / THE LIVING EDGE — SHELTER, LIGHT, AND A CONNECTION TO THE GARDEN' } },
      ]}
      outcomesTitle={'A quieter kind\nof impact.'}
      outcomes={[
        { value: '186', label: 'm² considered footprint' },
        { value: '03', label: 'core material families' },
        { value: '01', label: 'clear connection to place' },
      ]}
      outcomeNote="Illustrative design-study specifications. This fictional project demonstrates the component; it is not a completed building or a performance claim."
      nextProject={{ title: 'Headland Retreat', label: 'CONTINUE EXPLORING / NEXT STUDY', href: `#${id}-next`, image: { src: '/images/demos/atlas-coast.webp', alt: 'An open coastal landscape above a turquoise sea' } }}
    />
    <section id={`${id}-next`} className="case-demo-next-story" aria-labelledby={`${id}-next-title`}><span>STILL / THE NEXT CHAPTER</span><h2 id={`${id}-next-title`}>Headland Retreat</h2><p>A place to look out, switch off, and feel the weather move through the day. Our next concept explores a small coastal retreat with a light footprint and a generous horizon.</p><span>COASTAL HOSPITALITY / CONCEPT IN PROGRESS</span></section>
  </div>
}
