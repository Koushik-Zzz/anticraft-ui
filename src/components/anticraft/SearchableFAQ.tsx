'use client';

import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import './searchable-faq.css';

export interface SearchableFAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  keywords?: string[];
}

export interface SearchableFAQProps {
  items: SearchableFAQItem[];
  title?: string;
  searchPlaceholder?: string;
  defaultOpenId?: string;
  onOpenChange?: (id: string | null) => void;
  className?: string;
}

/** Searchable, categorized answers. Filtering closes the currently open answer. */
export function SearchableFAQ({ items, title = 'Questions & answers', searchPlaceholder = 'Search questions…', defaultOpenId, onOpenChange, className = '' }: SearchableFAQProps) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const search = useRef<HTMLInputElement>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const groups = Array.from(new Set(items.flatMap(item => item.category ? [item.category] : [])));
  const activeCategory = category && groups.includes(category) ? category : null;
  const term = query.trim().toLocaleLowerCase();
  const visible = items.filter(item => (!activeCategory || item.category === activeCategory) && `${item.question} ${item.answer} ${(item.keywords ?? []).join(' ')}`.toLocaleLowerCase().includes(term));
  const activeOpenId = visible.some(item => item.id === openId) ? openId : null;

  function closeAnswer() {
    setOpenId(null);
    if (activeOpenId !== null) onOpenChange?.(null);
  }

  function reset() {
    setQuery('');
    setCategory(null);
    closeAnswer();
    search.current?.focus();
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowDown') next = (index + 1) % visible.length;
    else if (event.key === 'ArrowUp') next = (index - 1 + visible.length) % visible.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = visible.length - 1;
    else return;
    event.preventDefault();
    triggers.current.get(visible[next].id)?.focus();
  }

  return <section className={`ac-faq ${className}`} aria-labelledby={title ? `${uid}-title` : undefined} aria-label={title ? undefined : 'Questions and answers'}>
    <div className="ac-faq-layout">
      <div className="ac-faq-tools">
        {title && <h2 id={`${uid}-title`} className="ac-faq-title">{title}</h2>}
        <label className="ac-faq-search" htmlFor={`${uid}-search`}>
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg>
          <span className="ac-faq-sr-only">Search questions and answers</span>
          <input ref={search} id={`${uid}-search`} type="search" placeholder={searchPlaceholder} value={query} onChange={event => { setQuery(event.target.value); closeAnswer(); }}/>
        </label>
        {groups.length > 0 && <div className="ac-faq-categories" role="group" aria-label="Question categories">
          <button type="button" aria-pressed={activeCategory === null} onClick={() => { setCategory(null); closeAnswer(); }}>All</button>
          {groups.map(group => <button key={group} type="button" aria-pressed={activeCategory === group} onClick={() => { setCategory(group); closeAnswer(); }}>{group}</button>)}
        </div>}
        <p className="ac-faq-count" role="status">{visible.length} {visible.length === 1 ? 'question' : 'questions'}{term || activeCategory ? ` of ${items.length}` : ''}</p>
      </div>
      <div className="ac-faq-results">
        {visible.map((item, index) => {
          const expanded = activeOpenId === item.id;
          const position = items.indexOf(item);
          return <div key={item.id} className="ac-faq-item" data-open={expanded}>
            <h3 className="ac-faq-question"><button type="button" id={`${uid}-question-${position}`} ref={element => { if (element) triggers.current.set(item.id, element); else triggers.current.delete(item.id); }} aria-expanded={expanded} aria-controls={`${uid}-answer-${position}`} onKeyDown={event => navigate(event, index)} onClick={() => { const next = expanded ? null : item.id; setOpenId(next); onOpenChange?.(next); }}>
              <span className="ac-faq-number" aria-hidden="true">{String(position + 1).padStart(2, '0')}</span>
              <span>{item.question}</span>
              <span className="ac-faq-toggle" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12"/><path className="ac-faq-plus" d="M10 4v12"/></svg></span>
            </button></h3>
            <div className="ac-faq-answer" id={`${uid}-answer-${position}`} role="region" aria-labelledby={`${uid}-question-${position}`} hidden={!expanded}><p>{item.answer}</p></div>
          </div>;
        })}
        {visible.length === 0 && <div className="ac-faq-empty"><p>{items.length ? 'No matching questions.' : 'No questions yet.'}</p>{items.length > 0 && <button type="button" onClick={reset}>Clear filters <span aria-hidden="true">↗</span></button>}</div>}
      </div>
    </div>
  </section>;
}
