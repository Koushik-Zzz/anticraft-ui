import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { components, getComponent } from '@/lib/catalog';
import { getComponentSources } from '@/lib/source';
import { ComponentWorkbench, InstallPanel, CodeBlock } from '@/components/site/component-workbench';
import { Icon } from '@/components/site/icon';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return components.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getComponent((await params).slug);
  return { title: item?.title ?? 'Component not found', description: item?.description };
}

export default async function ComponentPage({ params }: Props) {
  const item = getComponent((await params).slug);
  if (!item) notFound();
  const { source, css } = await getComponentSources(item.slug);
  const index = components.findIndex((entry) => entry.slug === item.slug);
  const previous = components[index - 1];
  const next = components[index + 1];
  return <main id="main-content" className="doc-page component-page"><div className="doc-breadcrumb"><Link href="/components">Components</Link><Icon name="chevron" size={12}/><span>{item.title}</span></div><div className="doc-layout"><article className="doc-article"><header className="doc-heading"><div className="doc-title-meta"><span className="eyebrow">{item.category}</span>{item.tag && <span className="new-tag">New</span>}</div><h1>{item.title}</h1><p className="doc-lead">{item.description}</p></header><section id="preview" className="doc-section preview-section" aria-label={`${item.title} interactive preview`}><ComponentWorkbench item={item} source={source} css={css}/></section><section id="installation" className="doc-section"><div className="section-title"><span>01</span><h2>Installation</h2></div><InstallPanel item={item} source={source} css={css}/></section><section id="usage" className="doc-section"><div className="section-title"><span>02</span><h2>Usage</h2></div><p>Import the component and make the details your own.</p><CodeBlock code={item.usage}/></section><section id="props" className="doc-section"><div className="section-title"><span>03</span><h2>Props</h2></div><div className="props-table-wrap"><table className="props-table"><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>{item.props.map((prop) => <tr key={prop.name}><td><code>{prop.name}</code></td><td><code>{prop.type}</code></td><td><code>{prop.default}</code></td><td>{prop.description}</td></tr>)}</tbody></table></div></section><section id="motion" className="doc-section"><div className="section-title"><span>04</span><h2>Motion & accessibility</h2></div><div className="note-box"><Icon name="spark" size={19}/><div><b>Considered by default.</b><p>{item.motion}</p></div></div><p className="code-note">Use semantic content and meaningful labels in your composition. Check contrast and keyboard behavior with your own styles and content.</p></section>{item.inspiration && <section id="inspiration" className="doc-section"><div className="section-title"><span>05</span><h2>Inspiration</h2></div><p>{item.inspiration.note}</p><a className="text-link" href={item.inspiration.url} target="_blank" rel="noreferrer">Visit {item.inspiration.name} <Icon name="arrow" size={13}/></a><p className="code-note">The component source and demo artwork are original to Anticraft UI. The linked site is the interaction reference.</p></section>}<div className="component-pagination">{previous ? <Link href={`/components/${previous.slug}`}><small>← PREVIOUS</small><span>{previous.title}</span></Link> : <span/>}{next && <Link href={`/components/${next.slug}`}><small>NEXT →</small><span>{next.title}</span></Link>}</div></article><aside className="page-toc" aria-label="On this page"><span>ON THIS PAGE</span><a href="#preview">Preview</a><a href="#installation">Installation</a><a href="#usage">Usage</a><a href="#props">Props</a><a href="#motion">Motion & accessibility</a>{item.inspiration && <a href="#inspiration">Inspiration</a>}<div><Icon name="github" size={15}/><a href={`https://github.com/Koushik-Zzz/anticraft-ui/blob/main/src/components/anticraft/${item.file}`} target="_blank" rel="noreferrer">View source <Icon name="arrow" size={12}/></a></div></aside></div></main>;
}
