"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { components } from '@/lib/catalog';
import { Icon } from './icon';

export const repositoryUrl = 'https://github.com/Koushik-Zzz/anticraft-ui';

export function Wordmark() {
  return <Link className="wordmark" href="/" aria-label="Anticraft UI home"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M6 25 14 7h5l7 18h-6l-4-11-2 6h4l2 5Z" fill="currentColor"/></svg></span><span>anticraft<span className="wordmark-ui">ui</span></span></Link>;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const router = useRouter();
  const results = components.filter((item) => `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    const prior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = prior; opener?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="command-dialog" aria-label="Search components" onCancel={onClose} onClick={(event) => {
    const r = event.currentTarget.getBoundingClientRect();
    if (event.target === event.currentTarget && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) onClose();
  }}>
    <div className="command-input"><Icon name="search" size={20}/><input aria-label="Search the component library" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="search-results" aria-activedescendant={results[active] ? `search-result-${results[active].slug}` : undefined} autoComplete="off" placeholder="Find your next ingredient…" value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={(event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : results.length - 1)) % Math.max(1, results.length)); }
      if (event.key === 'Enter' && results[active]) { event.preventDefault(); router.push(`/components/${results[active].slug}`); onClose(); }
    }}/><button className="icon-button" aria-label="Close search" onClick={onClose}><Icon name="close" size={18}/></button></div>
    <div className="command-results" id="search-results" role="listbox" aria-label="Matching components"><span className="command-label" role="presentation">{query ? `${results.length} RESULTS` : 'THE COLLECTION'}</span>{results.map((item, index) => <Link href={`/components/${item.slug}`} key={item.slug} role="option" aria-selected={index === active} id={`search-result-${item.slug}`} className={`command-result ${index === active ? 'is-selected' : ''}`} onClick={onClose}><span className="command-result-icon"><Icon name="spark" size={17}/></span><span><b>{item.title}</b><small>{item.category}</small></span><Icon name="chevron" size={15}/></Link>)}{!results.length && <p className="command-empty" role="status">No components found. Try “text”, “card”, or “background”.</p>}</div>
    <div className="command-footer"><span>↑ ↓ to navigate <span>↵ to open</span></span><span>esc to close</span></div>
  </dialog>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark'); }, []);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) return;
      if (document.querySelector('dialog[open]')) return;
      if ((event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || event.key === '/') { event.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? 'dark' : 'light';
    try { localStorage.setItem('anticraft-theme', nextDark ? 'dark' : 'light'); } catch { /* The current theme still works without storage. */ }
  }
  return <>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <header className="site-header"><div className="header-inner"><Wordmark/><nav className="header-nav" aria-label="Main navigation"><Link href="/components" aria-current={pathname.startsWith('/components') ? 'page' : undefined}>Components <span className="nav-count">{String(components.length).padStart(2, '0')}</span></Link><Link href="/docs/installation" aria-current={pathname.startsWith('/docs') ? 'page' : undefined}>Documentation</Link></nav><div className="header-actions"><button className="header-search" onClick={() => setSearchOpen(true)} aria-label="Search components"><Icon name="search" size={15}/><span>Search components…</span><kbd>⌘ K</kbd></button><a className="icon-button header-github" href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="Anticraft UI on GitHub"><Icon name="github" size={19}/></a><button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}><Icon name={dark ? 'sun' : 'moon'} size={18}/></button></div></div></header>
    {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)}/>}
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer"><Wordmark/><span>Independent components. Shared freely.</span><div><a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT licensed <Icon name="arrow" size={12}/></a><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub <Icon name="arrow" size={12}/></a><span>© 2026 Anticraft UI</span></div></footer>;
}
