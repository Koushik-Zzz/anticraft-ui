import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroThumbnail } from '@/components/site/hero-thumbnail';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Heroes',
  description: 'Expressive React hero sections: a product configurator, coordinated frame morphing, a video showreel, and editorial typography. Explore full-width previews and free source.',
};

export default function HeroesPage() {
  const heroOrder = ['product-spotlight-hero', 'scroll-expand-hero', 'showreel-hero', 'editorial-hero'];
  const heroes = components.filter(item => item.category === 'Heroes').sort((a, b) => heroOrder.indexOf(a.slug) - heroOrder.indexOf(b.slug));
  return (
    <main id="main-content" className="catalog-page hero-collection-page">
      <div className="doc-breadcrumb"><Link href="/components">The collection</Link><Icon name="chevron" size={12}/><span>Heroes</span></div>
      <header className="catalog-heading">
        <span className="eyebrow">FIRST IMPRESSIONS, WITH FEELING</span>
        <h1>A strong start.<br/><em>A lasting feeling.</em></h1>
        <p>Make a first impression with something to explore. Configure an object, move through a space, or step into a story.</p>
        <div className="catalog-heading-note"><span className="status-dot"/>{heroes.length} hero sections. Your next beginning.<span>FREE SOURCE</span></div>
        <div className="hero-collection-heading-links"><Link href="/components/buttons">Find the right button <Icon name="arrow" size={13}/></Link><Link href="/components/buttons/playground">Make it yours <Icon name="arrow" size={13}/></Link></div>
      </header>
      <div className="catalog-grid hero-collection-grid">
        {heroes.map(item => (
          <article className={`catalog-card ${['product-spotlight-hero', 'scroll-expand-hero'].includes(item.slug) ? 'hero-featured-card' : ''}`} key={item.slug}>
            <div className="catalog-card-preview"><HeroThumbnail slug={item.slug} title={item.title}/></div>
            <div className="catalog-card-meta">
              <Link href={`/components/${item.slug}`} className="catalog-card-title"><h2>{item.title}</h2><Icon name="arrow" size={18}/></Link>
              <p>{item.description}</p>
              <div><span>Heroes</span><span className="new-tag">New</span><Link href={`/components/${item.slug}`} className="catalog-code-link" aria-label={`View ${item.title} code`}><Icon name="code" size={14}/> View code</Link></div>
            </div>
          </article>
        ))}
      </div>
      <div className="catalog-footnote"><span>{String(heroes.length).padStart(2, '0')} HEROES / FREE SOURCE</span><Link href="/components">Explore all {components.length} components ↗</Link></div>
    </main>
  );
}
