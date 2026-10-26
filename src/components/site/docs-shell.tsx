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
  return <>
    <label className="sidebar-search"><Icon name="search" size={14}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter components…" aria-label="Filter sidebar components"/>{query && <button onClick={() => setQuery('')} aria-label="Clear sidebar filter"><Icon name="close" size={13}/></button>}</label>
    <nav className="catalog-nav" aria-label="Component library"><div className="sidebar-group"><span className="sidebar-label">Getting started</span><Link href="/components/heroes" aria-current={pathname === '/components/heroes' ? 'page' : undefined} onClick={onNavigate}><Icon name="spark" size={15}/>Hero collection<span className="sidebar-count">{components.filter(item => item.category === 'Heroes').length}</span></Link><Link href="/components/buttons" aria-current={pathname === '/components/buttons' ? 'page' : undefined} onClick={onNavigate}><Icon name="code" size={15}/>Button collection<span className="sidebar-count">{components.filter(item => item.category === 'Buttons').length}</span></Link><Link href="/components" aria-current={pathname === '/components' ? 'page' : undefined} onClick={onNavigate}><Icon name="grid" size={15}/>All components<span className="sidebar-count">{components.length}</span></Link><Link href="/docs/installation" aria-current={pathname === '/docs/installation' ? 'page' : undefined} onClick={onNavigate}><Icon name="terminal" size={15}/>Installation</Link></div>
    {categories.map((category) => {
      const items = visible.filter((item) => item.category === category);
      return items.length ? <div className="sidebar-group" key={category}><span className="sidebar-label">{category}</span>{items.map((item) => <Link href={`/components/${item.slug}`} key={item.slug} aria-current={pathname === `/components/${item.slug}` ? 'page' : undefined} onClick={onNavigate}><span className="sidebar-item-dot"/>{item.title}{item.tag && <span className="new-tag">{item.tag}</span>}</Link>)}</div> : null;
    })}
    {visible.length === 0 && <p className="sidebar-empty">Nothing found. Try another name.</p>}</nav>
    <div className="sidebar-note"><span className="sidebar-note-star">✳</span><b>Yours, from the start.</b><p>Free source. Thoughtful details.<br/>A little character for your next idea.</p><a href="https://github.com/Koushik-Zzz/anticraft-ui" target="_blank" rel="noreferrer">Explore the source <Icon name="arrow" size={13}/></a></div>
  </>;
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
  }}><div className="drawer-heading"><span>THE COLLECTION</span><button className="icon-button" aria-label="Close component menu" onClick={onClose}><Icon name="close" size={18}/></button></div><CatalogNavigation onNavigate={onClose}/></dialog>;
}

export function DocsShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = components.find((item) => pathname === `/components/${item.slug}`);
  const hasButtons = pathname === '/components' || pathname === '/components/buttons';
  return <div className={`docs-shell${hasButtons ? ' docs-shell-has-buttons' : ''}`}><aside className="docs-sidebar"><CatalogNavigation/></aside><div className="docs-column"><div className="mobile-catalog-bar"><button onClick={() => setOpen(true)}><Icon name="menu" size={17}/>Browse components</button><span>{current?.title ?? (pathname === '/components/heroes' ? 'Heroes' : pathname === '/components/buttons/playground' ? 'Button playground' : pathname === '/components/buttons' ? 'Buttons' : pathname.startsWith('/docs') ? 'Installation' : 'Overview')}</span></div>{hasButtons && <ButtonRail/>}{children}</div>{open && <MobileCatalog onClose={() => setOpen(false)}/>}</div>;
}
