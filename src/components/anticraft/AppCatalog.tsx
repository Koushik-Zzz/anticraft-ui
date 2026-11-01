'use client';

import { useId, type CSSProperties, type ReactNode } from 'react';
import './app-catalog.css';

export interface AppCatalogItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  iconColor?: string;
  href?: string;
}
export interface AppCatalogProps {
  items: AppCatalogItem[];
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  onItemSelect?: (id: string) => void;
  className?: string;
}

/** A ruled app directory. Supply icons as ordinary SVG, images, or React nodes. */
export function AppCatalog({ items, eyebrow = 'App Store', title = 'The tools to run your business.', description, onItemSelect, className = '' }: AppCatalogProps) {
  const uid = useId();
  return <section className={`ac-app-catalog ${className}`.trim()} aria-labelledby={`${uid}-title`}>
    <div className="ac-app-catalog__layout">
      <header className="ac-app-catalog__intro">
        {eyebrow && <p className="ac-app-catalog__eyebrow">{eyebrow}</p>}
        <h2 id={`${uid}-title`}>{title}</h2>
        {description && <p className="ac-app-catalog__description">{description}</p>}
      </header>
      <ul className="ac-app-catalog__grid">
        {items.map(item => {
          const content = <><span className="ac-app-catalog__icon" style={{ background: item.color, color: item.iconColor ?? '#24251f' } as CSSProperties} aria-hidden="true">{item.icon}</span><span className="ac-app-catalog__copy"><span className="ac-app-catalog__name">{item.title}</span><span className="ac-app-catalog__detail">{item.description}</span></span></>;
          return <li key={item.id}>{item.href ? <a className="ac-app-catalog__item" href={item.href} onClick={() => onItemSelect?.(item.id)}>{content}</a> : onItemSelect ? <button type="button" className="ac-app-catalog__item" onClick={() => onItemSelect(item.id)}>{content}</button> : <div className="ac-app-catalog__item">{content}</div>}</li>;
        })}
      </ul>
    </div>
  </section>;
}
