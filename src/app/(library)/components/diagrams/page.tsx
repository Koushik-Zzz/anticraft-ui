import type { Metadata } from 'next';
import Link from 'next/link';
import { DiagramThumbnail } from '@/components/site/diagram-thumbnail';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = { title: 'Diagrams', description: 'Animated React diagrams for integrations, processing pipelines, routing, and product CTAs. Free source and live previews.' };

export default function DiagramsPage() {
  const diagrams = components.filter(item => item.category === 'Diagrams');
  return <main id="main-content" className="catalog-page diagram-collection-page">
    <div className="doc-breadcrumb"><Link href="/components">Components</Link><Icon name="chevron" size={12}/><span>Diagrams</span></div>
    <header className="catalog-heading"><h1>Diagrams</h1><p>Animated networks, processing pipelines, and signal flows.</p><div className="catalog-heading-note"><span className="status-dot"/>{diagrams.length} components · React + CSS<span>FREE SOURCE</span></div></header>
    <div className="catalog-grid diagram-collection-grid">{diagrams.map(item => <article className="catalog-card" key={item.slug}>
      <div className="catalog-card-preview"><DiagramThumbnail slug={item.slug} title={item.title}/></div>
      <div className="catalog-card-meta"><Link href={`/components/${item.slug}`} className="catalog-card-title"><h2>{item.title}</h2><Icon name="arrow" size={18}/></Link><p>{item.description}</p><div><span>Diagrams</span><span className="new-tag">New</span><Link href={`/components/${item.slug}`} className="catalog-code-link" aria-label={`View ${item.title} code`}><Icon name="code" size={14}/> View code</Link></div></div>
    </article>)}</div>
  </main>;
}
