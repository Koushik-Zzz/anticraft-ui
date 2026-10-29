"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { components, categories } from '@/lib/catalog';
import { Icon } from './icon';
import { ButtonRail } from './button-rail';
import './button-collection.css';

function CatalogNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const visible = components.filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <div className="catalog-navigation">
    <label className="sidebar-search"><Icon name="search" size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter components…" aria-label="Filter sidebar components"/>{query && <button onClick={() => setQuery('')} aria-label="Clear sidebar filter"><Icon name="close" size={13}/></button>}</label>
    <div className="sidebar-scroll"><nav className="catalog-nav" aria-label="Component library"><div className="sidebar-group"><p className="sidebar-label">Getting started</p><ul className="sidebar-links" aria-label="Getting started">
      <li><Link href="/components/diagrams" aria-current={pathname === '/components/diagrams' ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-link-label">Diagram collection</span><span className="sidebar-count">{components.filter(item => item.category === 'Diagrams').length}</span></Link></li>
      <li><Link href="/components/heroes" aria-current={pathname === '/components/heroes' ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-link-label">Hero collection</span><span className="sidebar-count">{components.filter(item => item.category === 'Heroes').length}</span></Link></li>
      <li><Link href="/components/buttons" aria-current={pathname === '/components/buttons' ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-link-label">Button collection</span><span className="sidebar-count">{components.filter(item => item.category === 'Buttons').length}</span></Link></li>
      <li><Link href="/components" aria-current={pathname === '/components' ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-link-label">All components</span><span className="sidebar-count">{components.length}</span></Link></li>
      <li><Link href="/docs/installation" aria-current={pathname === '/docs/installation' ? 'page' : undefined} onClick={onNavigate}>Installation</Link></li>
    </ul></div>
    {categories.map((category) => {
      const items = visible.filter((item) => item.category === category);
      return items.length ? <div className="sidebar-group" key={category}><p className="sidebar-label">{category}</p><ul className="sidebar-links" aria-label={category}>{items.map((item) => <li key={item.slug}><Link href={`/components/${item.slug}`} aria-current={pathname === `/components/${item.slug}` ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-link-label">{item.title}</span></Link></li>)}</ul></div> : null;
    })}
    {visible.length === 0 && <p className="sidebar-empty">Nothing found. Try another name.</p>}</nav></div>
    <nav className="sidebar-resources" aria-label="Library resources"><a href="https://github.com/Koushik-Zzz/anticraft-ui" target="_blank" rel="noreferrer">GitHub source <Icon name="arrow" size={13}/></a><a href="https://github.com/Koushik-Zzz/anticraft-ui/issues" target="_blank" rel="noreferrer">Report an issue <Icon name="arrow" size={13}/></a></nav>
  </div>;
}

function MobileCatalog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = prior; opener?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="sidebar-drawer" aria-label="Browse components" onCancel={onClose} onClick={(event) => {
    if (event.target === event.currentTarget && event.clientX > event.currentTarget.getBoundingClientRect().right) onClose();
  }}><div className="drawer-heading"><span>Components</span><button className="icon-button" aria-label="Close component menu" onClick={onClose}><Icon name="close" size={18}/></button></div><CatalogNavigation onNavigate={onClose}/></dialog>;
}

export function DocsShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = components.find((item) => pathname === `/components/${item.slug}`);
  const hasButtons = pathname === '/components' || pathname === '/components/buttons';
  return <div className={`docs-shell${hasButtons ? ' docs-shell-has-buttons' : ''}`}><aside className="docs-sidebar"><CatalogNavigation/></aside><div className="docs-column"><div className="mobile-catalog-bar"><button onClick={() => setOpen(true)}><Icon name="menu" size={17}/>Browse components</button><span>{current?.title ?? (pathname === '/components/diagrams' ? 'Diagrams' : pathname === '/components/heroes' ? 'Heroes' : pathname === '/components/buttons/playground' ? 'Button playground' : pathname === '/components/buttons' ? 'Buttons' : pathname.startsWith('/docs') ? 'Installation' : 'Overview')}</span></div>{hasButtons && <ButtonRail/>}{children}</div>{open && <MobileCatalog onClose={() => setOpen(false)}/>}</div>;
}
