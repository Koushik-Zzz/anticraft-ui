import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Heroes',
  description: 'Four considered React hero sections: expanding scroll imagery, a native video showreel, product feature hotspots, and editorial typography. Free source from Anticraft UI.',
};

export default function HeroesPage() {
  const heroes = components.filter(item => item.category === 'Heroes');
  return (
    <main id="main-content" className="catalog-page hero-collection-page">
      <div className="doc-breadcrumb"><Link href="/components">The collection</Link><Icon name="chevron" size={12}/><span>Heroes</span></div>
      <header className="catalog-heading">
        <span className="eyebrow">FIRST IMPRESSIONS, WITH FEELING</span>
        <h1>A strong start.<br/><em>A lasting feeling.</em></h1>
        <p>Four ways to open a story. Considered layouts, original imagery, and interactions that give people a reason to stay.</p>
        <div className="catalog-heading-note"><span className="status-dot"/>{heroes.length} hero sections. Your next beginning.<span>FREE SOURCE</span></div>
        <div className="hero-collection-heading-links"><Link href="/components/buttons">Find the right button <Icon name="arrow" size={13}/></Link><Link href="/components/buttons/playground">Make it yours <Icon name="arrow" size={13}/></Link></div>
      </header>
      <div className="catalog-grid hero-collection-grid">
        {heroes.map(item => (
          <article className="catalog-card" key={item.slug}>
            <div className="catalog-card-preview"><ComponentDemo slug={item.slug}/></div>
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
