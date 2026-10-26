"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { components } from '@/lib/catalog';
import { Icon } from './icon';

/** A small second index for the button collection. */
export function ButtonRail() {
  const pathname = usePathname();
  const buttons = components.filter((component) => component.category === 'Buttons');
  const isCollection = pathname === '/components/buttons';

  return (
    <aside className="button-rail" aria-label="Button collection">
      <Link
        href="/components/buttons"
        className="button-rail-heading"
        aria-current={isCollection ? 'page' : undefined}
      >
        <span>BUTTONS</span>
        <span className="button-rail-count">{String(buttons.length).padStart(2, '0')}</span>
        <Icon name="arrow" size={12}/>
      </Link>
      <p className="button-rail-intro">Small details.<br/>A better click.</p>
      <nav className="button-rail-links" aria-label="Button component shortcuts">
        {buttons.map((button, index) => (
          <Link
            key={button.slug}
            href={`/components/${button.slug}`}
            aria-current={pathname === `/components/${button.slug}` ? 'page' : undefined}
          >
            <span className="button-rail-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{button.title}</span>
          </Link>
        ))}
      </nav>
      <Link href="/components/buttons" className="button-rail-collection-link">
        Explore the collection <Icon name="arrow" size={12}/>
      </Link>
      <p className="button-rail-note">A little personality,<br/>where it counts.</p>
    </aside>
  );
}
