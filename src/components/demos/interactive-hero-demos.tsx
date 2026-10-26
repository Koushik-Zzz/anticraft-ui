'use client';

import { ShowreelHero } from '@/components/anticraft/ShowreelHero';
import { ProductSpotlightHero } from '@/components/anticraft/ProductSpotlightHero';
import { DemoStory } from './practical-art';
import './interactive-hero-demos.css';

export function ShowreelHeroDemo() {
  return <div className="demo hero-demo showreel-hero-demo">
    <header className="interactive-hero-brand"><strong>FRAME<span> / STUDIO</span></strong><span>FILM. FEELING. A DIFFERENT PERSPECTIVE.</span></header>
    <ShowreelHero
      eyebrow="INDEPENDENT STORIES / FIELD NOTES 01"
      title={'Stories worth\nstaying for.'}
      description="A moving image can hold a whole world. We make room for the stories that deserve a little more time."
      poster="/images/demos/atlas-coast.webp"
      posterAlt="An atmospheric coastal landscape beneath an open sky"
      videoSrc="/videos/demos/field-study.mp4"
      videoLabel="Watch Field Study"
      transcript="A silent coastal study. The camera moves slowly across a rugged green coastline and the sea. No dialogue or sound."
    />
    <p className="interactive-hero-footnote"><span>FIELD STUDY / AN ORIGINAL SILENT MOTION PIECE</span><span>OPEN. PLAY. TAKE A MOMENT.</span></p>
  </div>;
}

export function ProductSpotlightHeroDemo() {
  return <DemoStory><div className="demo hero-demo product-spotlight-hero-demo">
    <header className="interactive-hero-brand"><strong>FORMA<span> / SOUND</span></strong><span>A LITTLE MORE LISTENING.</span></header>
    <ProductSpotlightHero
      eyebrow="THE EVERYDAY SPEAKER / FORM 01"
      title={'Sound, with\na softer side.'}
      description="Warm, room-filling sound. Natural textures. The kind of object that feels at home before the first note."
      image={{ src: '/images/demos/forma-speaker.svg', alt: 'A compact olive green speaker with tactile top controls, a woven front grille, and low wooden feet' }}
      features={[
        { id: 'controls', label: 'A satisfying little turn.', detail: 'Tactile top controls keep volume and playback close to hand.', x: .63, y: .25 },
        { id: 'grille', label: 'Soft on the eyes. Full of sound.', detail: 'A woven front grille gives the room a softer focal point.', x: .50, y: .52 },
        { id: 'feet', label: 'Grounded in the details.', detail: 'Low wooden feet lift the form and leave a little breathing room.', x: .37, y: .83 },
      ]}
      action={{ label: 'A study in simplicity', href: '#demo-story-sound' }}
    />
    <p className="interactive-hero-footnote"><span>FORMA 01 / A PRODUCT DESIGN STUDY</span><span>TOUCH A POINT. GET CLOSER.</span></p>
  </div></DemoStory>;
}
