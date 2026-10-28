import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroThumbnail } from '@/components/site/hero-thumbnail';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Heroes',
  description: 'Interactive React heroes for SaaS, editorial, and product websites. Explore live previews, installation instructions, and free source.',
};

export default function HeroesPage() {
  const heroOrder = ['editor-canvas-hero', 'notes-workflow-hero', 'revenue-dashboard-hero', 'product-spotlight-hero', 'scroll-expand-hero', 'showreel-hero', 'editorial-hero'];
  const order = new Map(heroOrder.map((slug, index) => [slug, index]));
  const heroes = components.filter(item => item.category === 'Heroes').sort((a, b) => (order.get(a.slug) ?? Infinity) - (order.get(b.slug) ?? Infinity));
  return (
    <main id="main-content" className="catalog-page hero-collection-page">
      <div className="doc-breadcrumb"><Link href="/components">The collection</Link><Icon name="chevron" size={12}/><span>Heroes</span></div>
      <header className="catalog-heading">
        <h1>Heroes</h1>
        <p>Interactive hero sections for SaaS, editorial, and product websites.</p>
        <div className="catalog-heading-note"><span className="status-dot"/>{heroes.length} components · React + CSS<span>FREE SOURCE</span></div>
      </header>
      <div className="catalog-grid hero-collection-grid">
        {heroes.map(item => (
          <article className={`catalog-card ${heroOrder.slice(0, 3).includes(item.slug) ? 'hero-featured-card' : ''}`} key={item.slug}>
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
