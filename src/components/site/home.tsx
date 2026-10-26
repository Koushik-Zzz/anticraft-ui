import type { CSSProperties } from 'react';
import Link from 'next/link';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';
import './home.css';

const featuredSlugs = [
  'sticker-field',
  'spine-archive',
  'morphing-stage',
];

export function HomePage() {
  const featured = featuredSlugs.flatMap((slug) => {
    const component = components.find((item) => item.slug === slug);
    return component ? [component] : [];
  });

  return (
    <main className="home-page">
      <section className="ac-home-hero ac-home-container" aria-labelledby="ac-home-title">
        <div className="ac-home-hero-copy">
          <div className="ac-home-eyebrow ac-home-release">
            <span className="ac-home-dot" />
            A LITTLE LESS ORDINARY. A LOT MORE YOU.
          </div>
          <h1 id="ac-home-title">Interfaces<br />with <em>feeling.</em><span className="ac-home-title-star" aria-hidden="true">✳</span></h1>
          <div className="ac-home-hero-bottom">
            <p>Unexpected interactions for a web with character.<br className="ac-home-desktop-break" /> Original experiments. Considered motion. Free source.</p>
            <Link className="ac-home-explore" href="/components">
              Explore components
              <span><Icon name="arrow" size={20} /></span>
            </Link>
          </div>
          <Link className="ac-home-hero-note" href="/docs/installation">
            <Icon name="code" size={14} /> Copy the source. Make it your own.
          </Link>
        </div>
        <aside className="ac-home-hero-art" aria-label="Open by design. Free source, endless possibilities.">
          <div className="ac-home-art-label"><span>OBJECT No. 001</span><span>AN INDEPENDENT SPIRIT</span></div>
          <div className="ac-home-sculpture" aria-hidden="true">
            <div className="ac-home-orbit ac-home-orbit-one" />
            <div className="ac-home-orbit ac-home-orbit-two" />
            <div className="ac-home-sun">
              {Array.from({ length: 16 }, (_, i) => (
                <i key={i} style={{ '--blade': i } as CSSProperties} />
              ))}
              <div className="ac-home-sun-center"><span>OPEN BY<br />DESIGN</span><Icon name="arrow" size={24} /></div>
            </div>
            <span className="ac-home-art-cross ac-home-art-cross-one">+</span>
            <span className="ac-home-art-cross ac-home-art-cross-two">+</span>
          </div>
          <div className="ac-home-art-caption"><span>Craft is a feeling.<br />Build something that has it.</span><span aria-hidden="true">↘</span></div>
        </aside>
      </section>

      <div className="ac-home-principles ac-home-container" aria-label="Library features">
        <span className="ac-home-principles-label">GOOD DESIGN IS FOR EVERYONE.</span>
        <div><span>React + TypeScript</span><i aria-hidden="true" /><span>Free source</span><i aria-hidden="true" /><span>MIT licensed</span></div>
        <a href="https://github.com/Koushik-Zzz/anticraft-ui" target="_blank" rel="noreferrer">Made to be yours <Icon name="arrow" size={12} /></a>
      </div>

      <section className="ac-home-collection ac-home-container" aria-labelledby="ac-home-collection-title">
        <div className="ac-home-section-heading">
          <div><span className="ac-home-eyebrow">THE EXPERIMENTS / 002</span><h2 id="ac-home-collection-title">Objects to move.<br className="ac-home-mobile-break" /> <em>Ideas to play with.</em></h2></div>
          <div className="ac-home-collection-intro"><p>Drag a collage. Browse a physical archive.<br />Let a changing frame tell your story.</p><Link href="/components">View all {components.length} components <Icon name="arrow" size={15} /></Link></div>
        </div>
        <div className="ac-home-grid">
          {featured.map((component, index) => (
            <article key={component.slug} className="ac-home-component">
              <div className="ac-home-preview home-preview"><ComponentDemo slug={component.slug} /></div>
              <div className="ac-home-component-info">
                <div><Link className="ac-home-component-title" href={`/components/${component.slug}`}>{component.title}<Icon name="arrow" size={15} /></Link><p>{component.description}</p></div>
                <span className="ac-home-component-category">{component.category}</span>
              </div>
              <span className="ac-home-component-number" aria-hidden="true">0{index + 1}</span>
            </article>
          ))}
        </div>
        <div className="ac-home-collection-foot"><span>LIVE PREVIEWS. GO AHEAD, PLAY A LITTLE.</span><Link href="/components">The whole collection <Icon name="arrow" size={14} /></Link></div>
      </section>

      <section className="ac-home-how ac-home-container" aria-labelledby="ac-home-how-title">
        <div className="ac-home-how-intro"><span className="ac-home-eyebrow">LESS FRICTION. MORE CREATION.</span><h2 id="ac-home-how-title">From a little spark<br />to <em>your next thing.</em></h2><p>A component is a starting point.<br />What happens next is entirely up to you.</p><Link href="/docs/installation">The getting-started guide <Icon name="arrow" size={16} /></Link></div>
        <div className="ac-home-steps">
          <div className="ac-home-step"><span>01</span><div><h3>Find your ingredient.</h3><p>Explore the collection. Try the interactions. Find something that feels right for your project.</p></div><Icon name="arrow" size={18} /></div>
          <div className="ac-home-step"><span>02</span><div><h3>Take the source.</h3><p>Add with the shadcn CLI or copy the files. The component lives in your project, ready to edit.</p></div><Icon name="code" size={18} /></div>
          <div className="ac-home-step"><span>03</span><div><h3>Make it unmistakably yours.</h3><p>Change the colors, tune the motion, break a few rules. Every line is yours to shape.</p></div><Icon name="check" size={18} /></div>
        </div>
      </section>

      <section className="ac-home-open ac-home-container" aria-labelledby="ac-home-open-title">
        <div className="ac-home-open-symbol" aria-hidden="true">a<span>✳</span></div>
        <div><span className="ac-home-eyebrow">MADE WITH CARE. SHARED WITH EVERYONE.</span><h2 id="ac-home-open-title">Good craft.<br /><em>Wide open.</em></h2></div>
        <div className="ac-home-open-copy"><p>Beautiful components should be a head start for everyone. Anticraft UI is free and MIT licensed, for your side project and your next big launch.</p><a href="https://github.com/Koushik-Zzz/anticraft-ui" target="_blank" rel="noreferrer"><Icon name="github" size={17} /> Explore the source <Icon name="arrow" size={15} /></a></div>
      </section>

      <section className="ac-home-closing ac-home-container" aria-labelledby="ac-home-closing-title"><div><span className="ac-home-eyebrow">YOUR NEXT GREAT IDEA STARTS SOMEWHERE.</span><h2 id="ac-home-closing-title">Make something<br /><em>worth feeling.</em></h2></div><div className="ac-home-closing-side"><p>The details make the difference.<br />Let’s give yours a little character.</p><Link href="/components">Find your first component <Icon name="arrow" size={19} /></Link><span>Free to use. Free to change. Free to make your own.</span></div></section>
    </main>
  );
}

export default HomePage;
