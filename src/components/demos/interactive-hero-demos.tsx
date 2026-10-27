'use client';

import { ShowreelHero } from '@/components/anticraft/ShowreelHero';
import { useState } from 'react';
import { ProductSpotlightHero, type ProductSpotlightSelection } from '@/components/anticraft/ProductSpotlightHero';
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
  const [selection, setSelection] = useState<ProductSpotlightSelection | null>(null);
  return <DemoStory><div className="demo hero-demo product-spotlight-hero-demo">
    <ProductSpotlightHero
      productName="MONO"
      productNumber="01"
      kicker="DESIGNED TO FEEL DIFFERENT"
      note="FORM. FUNCTION. NOTHING EXTRA."
      eyebrow="SOUND OBJECTS / COLLECTION 01"
      title={'Sound.\nIn its purest form.'}
      description="One considered object. A quieter presence. Made for the spaces where life happens."
      image={{ src: '/images/demos/mono-graphite.webp', alt: 'MONO 01, a graphite speaker with a sculpted aluminum body, acoustic front grille, and a circular volume control' }}
      variants={[
        { id: 'graphite', label: 'Graphite', color: '#343936', image: { src: '/images/demos/mono-graphite.webp', alt: 'MONO 01 speaker in Graphite, shown in a three-quarter view' }, views: [{ id: 'detail', label: 'Detail', image: { src: '/images/demos/mono-detail.webp', alt: 'A closer look at the Graphite speaker’s top volume control and fine acoustic mesh' } }] },
        { id: 'chalk', label: 'Chalk', color: '#e8e5dd', image: { src: '/images/demos/mono-chalk.webp', alt: 'MONO 01 speaker in Chalk, shown in a three-quarter view' } },
        { id: 'copper', label: 'Copper', color: '#ad7153', image: { src: '/images/demos/mono-copper.webp', alt: 'MONO 01 speaker in Copper, shown in a three-quarter view' } },
      ]}
      sizes={[
        { id: 'mono-01', label: 'MONO 01', dimensions: '270 × 140 × 130 mm', price: '$390' },
        { id: 'mono-01-plus', label: '01 PLUS', dimensions: '340 × 170 × 150 mm', price: '$540' },
      ]}
      features={[
        { id: 'control', label: 'A tactile point of contact.', detail: 'A single top dial keeps volume within easy reach.', x: .80, y: .20 },
        { id: 'mesh', label: 'Quietly precise.', detail: 'An acoustic grille wraps the front in a continuous, considered surface.', x: .42, y: .55 },
      ]}
      onSelectionChange={setSelection}
      action={{ label: 'Explore the object', href: '#demo-story-sound' }}
    />
    <p className="interactive-hero-footnote"><span>MONO / A FICTIONAL PRODUCT DESIGN STUDY</span><span aria-label="Current configuration">{selection?.size?.label ?? 'MONO 01'} / {selection?.variant?.label ?? 'Graphite'} / {selection?.size?.price ?? '$390'}</span></p>
  </div></DemoStory>;
}
