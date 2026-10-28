import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ComponentDemo } from '@/components/demos/component-demo';
import { components, getComponent, hasFullPreview } from '@/lib/catalog';
import { Icon } from '@/components/site/icon';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return components.filter(hasFullPreview).map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getComponent((await params).slug);
  return { title: `${item?.title ?? 'Component'} — Live preview` };
}

export default async function ComponentPreviewPage({ params }: Props) {
  const item = getComponent((await params).slug);
  if (!item || !hasFullPreview(item)) notFound();
  return <main id="main-content" className="hero-standalone-preview">
    <h1 className="sr-only">{item.title} live preview</h1>
    <nav className="hero-preview-bar" aria-label="Preview navigation"><Link href={item.category === 'Diagrams' ? '/components/diagrams' : item.category === 'Heroes' ? '/components/heroes' : '/components'}>{item.category === 'Diagrams' ? '← All diagrams' : item.category === 'Heroes' ? '← All heroes' : '← All components'}</Link><span>{item.title}<span> / LIVE PREVIEW</span></span><Link href={`/components/${item.slug}`}>Get the component <Icon name="arrow" size={12}/></Link></nav>
    <ComponentDemo slug={item.slug}/>
  </main>;
}
