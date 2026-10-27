'use client';

import { ProductQuickView } from '@/components/anticraft/ProductQuickView';
import './commerce-demos.css';

export function ProductQuickViewDemo() {
  return <div className="demo website-demo commerce-demo">
    <div className="commerce-demo-page">
      <header className="commerce-demo-brand"><strong>FORM<span> / OBJECTS</span></strong><span>A SMALL COLLECTION. A CONSIDERED LIFE.</span></header>
      <div className="commerce-demo-intro"><p>THE EVERYDAY, RECONSIDERED / 01—02</p><div><h2>Objects to<br />come back to.</h2><p>For the things you listen to.<br />For the places you go.<br />A little less. A little better.</p></div></div>
      <div className="commerce-demo-products">
        <ProductQuickView
          title="MONO 01"
          eyebrow="01 / SOUND OBJECTS"
          subtitle="A quieter kind of presence."
          price="$390"
          description="One considered object for the spaces where life happens. A sculpted body, a continuous acoustic grille, and a single tactile volume dial. Nothing you don’t need."
          images={[{ id: 'object', src: '/images/demos/mono-graphite.webp', alt: 'MONO 01 speaker in Graphite, with a sculpted aluminum body and circular top dial' }]}
          variants={[
            { id: 'graphite', label: 'Graphite', color: '#343936', images: [{ id: 'object', src: '/images/demos/mono-graphite.webp', alt: 'MONO 01 speaker in Graphite, shown from the front and side' }, { id: 'detail', src: '/images/demos/mono-detail.webp', alt: 'Close view of the graphite speaker’s tactile top dial and acoustic mesh' }] },
            { id: 'chalk', label: 'Chalk', color: '#e8e5dd', images: [{ id: 'object', src: '/images/demos/mono-chalk.webp', alt: 'MONO 01 speaker in soft Chalk with a matching acoustic front grille' }] },
            { id: 'copper', label: 'Copper', color: '#ad7153', images: [{ id: 'object', src: '/images/demos/mono-copper.webp', alt: 'MONO 01 speaker in warm Copper with a brushed metal body' }] },
          ]}
          specifications={[{ label: 'Dimensions', value: '270 × 140 × 130 mm' }, { label: 'Material study', value: 'Aluminum / acoustic mesh' }, { label: 'Collection', value: 'MONO / 01' }]}
          action={{ label: 'Read the design story', href: '#form-mono-story' }}
        />
        <ProductQuickView
          title="Everyday Tote"
          eyebrow="02 / CARRY OBJECTS"
          subtitle="Room for a little more everyday."
          price="$64"
          description="A generous canvas shape, two inner pockets, and a handle made to sit comfortably on your shoulder. Designed around the simple pleasure of having everything in its place."
          images={[
            { id: 'front', src: '/images/demos/tote-front.svg', alt: 'KIN Everyday Tote in natural canvas, with a generous front pocket and olive woven label' },
            { id: 'side', src: '/images/demos/tote-side.svg', alt: 'Side profile of the canvas tote showing its depth and shoulder straps' },
            { id: 'detail', src: '/images/demos/tote-detail.svg', alt: 'Close view of the tote’s reinforced canvas stitching and woven KIN label' },
            { id: 'interior', src: '/images/demos/tote-interior.svg', alt: 'Inside the tote, with two separate pockets for small everyday essentials' },
          ]}
          specifications={[{ label: 'Dimensions', value: '380 × 420 × 120 mm' }, { label: 'Material study', value: 'Natural woven canvas' }, { label: 'Collection', value: 'KIN / 01' }]}
          action={{ label: 'Read the design story', href: '#form-tote-story' }}
          className="commerce-demo-tote"
        />
      </div>
      <p className="commerce-demo-note"><span>ORIGINAL, FICTIONAL PRODUCT STUDIES</span><span>OPEN AN OBJECT. EXPLORE THE DETAILS. ↗</span></p>
      <div className="commerce-demo-stories">
        <section id="form-mono-story" tabIndex={-1}><span>DESIGN NOTES / 01</span><h3>A sound object.<br />A softer presence.</h3><p>MONO studies how a speaker can belong to a room without becoming its focal point. The restrained body and one precise dial make listening feel simple. Graphite, Chalk, and Copper explore three different material moods.</p><p className="commerce-demo-story-note">A fictional design study. Specifications and prices are example content.</p></section>
        <section id="form-tote-story" tabIndex={-1}><span>DESIGN NOTES / 02</span><h3>Everything<br />in its place.</h3><p>The KIN Everyday Tote starts with a familiar shape. A wider base creates room, an outer pocket keeps the essentials close, and two inside compartments bring a little order to a full day.</p><p className="commerce-demo-story-note">Original illustrated product concept. Specifications and prices are example content.</p></section>
      </div>
      <footer className="commerce-demo-footer"><strong>FORM / OBJECTS</strong><span>GOOD THINGS. GIVEN A CLOSER LOOK.</span></footer>
    </div>
  </div>;
}
