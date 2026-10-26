'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './team-grid.css';

export interface TeamGridItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  portrait: ReactNode;
  links?: { label: string; href: string }[];
}

export interface TeamGridProps {
  items: TeamGridItem[];
  title?: string;
  className?: string;
}

/** Portrait cards with a full, keyboard-accessible profile for each person. */
export function TeamGrid({ items, title = 'Good people. Different perspectives.', className = '' }: TeamGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find(item => item.id === selectedId);
  const isOpen = Boolean(selected);
  const viewer = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const instance = useId();
  const titleId = `ac-team-title-${instance}`;
  const profileId = `ac-team-profile-${instance}`;
  const profileTitleId = `${profileId}-title`;

  useEffect(() => {
    if (!isOpen) return;
    const modal = viewer.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <section className={`ac-team-grid ${className}`.trim()} aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : 'Our team'}>
      {title && <header className="ac-team-grid-heading"><span>THE PEOPLE BEHIND THE WORK</span><h2 id={titleId}>{title}</h2></header>}
      {items.length ? <div className="ac-team-grid-cards">{items.map((person, index) => <article className="ac-team-grid-card" key={person.id}>
        <div className="ac-team-grid-portrait" aria-hidden="true" ref={element => { if (element) element.inert = true; }}>{person.portrait}<span className="ac-team-grid-number">{String(index + 1).padStart(2, '0')}</span></div>
        <div className="ac-team-grid-person"><h3>{person.name}</h3><span>{person.role}</span></div>
        <p className="ac-team-grid-preview">{person.bio}</p>
        <button type="button" className="ac-team-grid-meet" aria-haspopup="dialog" aria-controls={profileId} aria-expanded={selectedId === person.id && isOpen} onClick={event => { opener.current = event.currentTarget; setSelectedId(person.id); }}>Meet {person.name}<span aria-hidden="true">↗</span></button>
      </article>)}</div> : <p className="ac-team-grid-empty">Team profiles will appear here.</p>}
      <dialog ref={viewer} id={profileId} className="ac-team-grid-dialog" aria-labelledby={profileTitleId} onCancel={event => { event.preventDefault(); setSelectedId(null); }} onClose={() => { if (!viewer.current?.open) setSelectedId(null); }}>
        <header><span>MEET THE TEAM</span><button className="ac-team-grid-close" type="button" onClick={() => setSelectedId(null)}>Close <span aria-hidden="true">×</span></button></header>
        {selected && <div className="ac-team-grid-profile"><div className="ac-team-grid-profile-portrait" aria-hidden="true" ref={element => { if (element) element.inert = true; }}>{selected.portrait}</div><div className="ac-team-grid-profile-copy"><span className="ac-team-grid-profile-role">{selected.role}</span><h2 id={profileTitleId}>{selected.name}</h2><p>{selected.bio}</p>{Boolean(selected.links?.length) && <nav aria-label={`${selected.name} links`} className="ac-team-grid-links">{selected.links?.map((link, index) => <a key={`${link.href}-${index}`} href={link.href}>{link.label}<span aria-hidden="true">↗</span></a>)}</nav>}</div></div>}
      </dialog>
    </section>
  );
}
