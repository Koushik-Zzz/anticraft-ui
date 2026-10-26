import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from '@/components/site/icon';
import { components } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Buttons',
  description: 'Expressive React buttons with capsule arrows, rolling labels, circle fills, shutters, tracing outlines, and tactile surfaces. Free, editable source from Anticraft UI.',
};

export default function ButtonsPage() {
  const buttons = components.filter((component) => component.category === 'Buttons');

  return (
    <main id="main-content" className="catalog-page button-collection-page">
      <div className="doc-breadcrumb">
        <Icon name="grid" size={14}/>
        <Link href="/components">The collection</Link>
        <span aria-hidden="true">/</span>
        <span>Buttons</span>
      </div>
      <div className="catalog-heading">
        <span className="eyebrow">AN INVITATION TO INTERACT</span>
        <h1>Small buttons.<br/><em>Big character.</em></h1>
        <p>An invitation to click, with a little more personality. Try each interaction, then make it yours.</p>
        <div className="catalog-heading-note">
          <span className="status-dot"/>
          {buttons.length} buttons. Plenty of possibilities.
          <span>FREE SOURCE</span>
        </div>
      </div>
      <div className="catalog-grid button-collection-grid">
        {buttons.map((button) => (
          <article key={button.slug} className="catalog-card">
            <div className="catalog-card-preview">
              <ComponentDemo slug={button.slug}/>
            </div>
            <div className="catalog-card-meta">
              <Link className="catalog-card-title" href={`/components/${button.slug}`}>
                <h2>{button.title}</h2>
                <Icon name="arrow" size={18}/>
              </Link>
              <p>{button.description}</p>
              <div>
                <span>Buttons</span>
                {button.tag && <span className="new-tag">New</span>}
                <Link
                  href={`/components/${button.slug}`}
                  className="catalog-code-link"
                  aria-label={`View ${button.title} code`}
                >
                  <Icon name="code" size={14}/> View code
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="catalog-footnote">
        <span>{String(buttons.length).padStart(2, '0')} BUTTONS / FREE SOURCE</span>
        <Link href="/components">Back to all components <Icon name="arrow" size={10}/></Link>
      </div>
    </main>
  );
}
