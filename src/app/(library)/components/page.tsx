import type { Metadata } from 'next';
import { ComponentCatalog } from '@/components/site/component-catalog';
import { Icon } from '@/components/site/icon';

export const metadata: Metadata = { title: 'Components', description: 'Explore the Anticraft UI collection. Interactive backgrounds, tactile buttons, animated typography, and expressive cards, with editable React source.' };

export default function ComponentsPage() {
  return <main id="main-content" className="catalog-page"><div className="doc-breadcrumb"><Icon name="grid" size={14}/><span>The collection</span></div><div className="catalog-heading"><span className="eyebrow">SMALL DETAILS. INDEPENDENT SPIRIT.</span><h1>A little less <em>ordinary.</em></h1><p>Expressive components for a web with character.<br/>Find your ingredient. Take the source. Make it yours.</p><div className="catalog-heading-note"><span className="status-dot"/>Free for your next great idea.<span>MIT licensed</span></div></div><ComponentCatalog/></main>;
}
