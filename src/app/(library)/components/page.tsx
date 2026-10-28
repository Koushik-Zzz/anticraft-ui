import type { Metadata } from 'next';
import { ComponentCatalog } from '@/components/site/component-catalog';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = { title: 'Components', description: `Browse ${components.length} React components and sections with live previews, editable source, and installation instructions.` };

export default function ComponentsPage() {
  return <main id="main-content" className="catalog-page"><div className="doc-breadcrumb"><Icon name="grid" size={14}/><span>The collection</span></div><div className="catalog-heading"><span className="eyebrow">UNEXPECTED INTERACTIONS. INDEPENDENT SPIRIT.</span><h1>A little less <em>ordinary.</em></h1><p>A growing collection of {components.length} expressive components.<br/>Start with an experiment. Take the source. Make it yours.</p><div className="catalog-heading-note"><span className="status-dot"/>Free for your next great idea.<span>MIT licensed</span></div></div><ComponentCatalog/></main>;
}
