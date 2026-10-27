"use client";

import Link from 'next/link';
import { useState } from 'react';
import { components, categories } from '@/lib/catalog';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from './icon';
import { HeroThumbnail } from './hero-thumbnail';

export function ComponentCatalog() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const results = components.filter((item) => (category === 'All' || item.category === category) && `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <>
    <div className="catalog-tools"><div className="category-tabs" aria-label="Filter components by category">{['All', ...categories].map((name) => <button key={name} aria-pressed={name === category} onClick={() => setCategory(name)}>{name}{name === 'All' && <span>{components.length}</span>}</button>)}</div><label className="catalog-search"><Icon name="search" size={16}/><input placeholder="Search the collection…" aria-label="Search this collection" value={query} onChange={(event) => setQuery(event.target.value)}/>{query && <button aria-label="Clear collection search" onClick={() => setQuery('')}><Icon name="close" size={14}/></button>}</label></div>
    <div className="catalog-grid">{results.map((item) => <article key={item.slug} className="catalog-card"><div className="catalog-card-preview">{item.category === 'Heroes' ? <HeroThumbnail slug={item.slug} title={item.title}/> : <ComponentDemo slug={item.slug}/>}</div><div className="catalog-card-meta"><Link className="catalog-card-title" href={`/components/${item.slug}`}><h2>{item.title}</h2><Icon name="arrow" size={18}/></Link><p>{item.description}</p><div><span>{item.category}</span>{item.tag && <span className="new-tag">New</span>}<Link href={`/components/${item.slug}`} className="catalog-code-link" aria-label={`View ${item.title} code`}><Icon name="code" size={14}/> View code</Link></div></div></article>)}</div>
    {!results.length && <div className="catalog-empty"><Icon name="search" size={30}/><h2>No ingredients found.</h2><p>Try a different phrase or explore the whole collection.</p><button className="secondary-button" onClick={() => { setQuery(''); setCategory('All'); }}>Show all components <Icon name="arrow" size={15}/></button></div>}
    <div className="catalog-footnote" aria-live="polite"><span>{String(results.length).padStart(2, '0')} OF {String(components.length).padStart(2, '0')} COMPONENTS</span><span>AN OPEN COLLECTION. A WORK IN PROGRESS.</span></div>
  </>;
}
