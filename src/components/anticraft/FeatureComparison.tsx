'use client';

import { useId, useState, type ReactNode } from 'react';
import './feature-comparison.css';

export type FeatureComparisonProduct = {
  id: string;
  name: string;
  description?: string;
  price?: string;
  priceNote?: string;
  badge?: string;
  href?: string;
  actionLabel?: string;
};

export type FeatureComparisonRow = {
  id: string;
  label: string;
  description?: string;
  group?: string;
  values: Record<string, string | boolean | null>;
};

export type FeatureComparisonSelection = {
  first: FeatureComparisonProduct;
  second: FeatureComparisonProduct;
};

export type FeatureComparisonProps = {
  products: FeatureComparisonProduct[];
  features: FeatureComparisonRow[];
  title?: string;
  description?: string;
  eyebrow?: string;
  defaultProductIds?: readonly [string, string];
  onSelectionChange?: (selection: FeatureComparisonSelection) => void;
  className?: string;
};

/** Compare two distinct options, with readable values and an optional differences filter. */
export function FeatureComparison({ products, features, title = 'Find your fit.', description, eyebrow = 'A CLOSER LOOK', defaultProductIds, onSelectionChange, className = '' }: FeatureComparisonProps) {
  const uid = useId();
  const [selection, setSelection] = useState<readonly [string, string]>(() => defaultProductIds ?? [products[0]?.id ?? '', products[1]?.id ?? '']);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const first = products.find(product => product.id === selection[0]) ?? products[0];
  const second = products.find(product => product.id === selection[1] && product.id !== first?.id) ?? products.find(product => product.id !== first?.id);
  if (!first || !second) return null;

  const differingRows = features.filter(row => (row.values[first.id] ?? null) !== (row.values[second.id] ?? null));
  const rows = differencesOnly ? differingRows : features;
  const groups = [...new Set(rows.map(row => row.group ?? 'Details'))];

  function selectProduct(position: 0 | 1, id: string) {
    const next = products.find(product => product.id === id);
    if (!next || !first || !second) return;
    const nextFirst = position === 0 ? next : first;
    const nextSecond = position === 1 ? next : second;
    if (nextFirst.id === nextSecond.id) return;
    setSelection([nextFirst.id, nextSecond.id]);
    onSelectionChange?.({ first: nextFirst, second: nextSecond });
  }

  function valueContent(value: string | boolean | null | undefined) {
    if (typeof value === 'boolean') return <span className="ac-compare-boolean" data-included={value}><span aria-hidden="true">{value ? '✓' : '—'}</span><span>{value ? 'Included' : 'Not included'}</span></span>;
    return value ?? <><span aria-hidden="true">—</span><span className="ac-compare-sr">Not specified</span></>;
  }

  return <section className={`ac-feature-comparison ${className}`.trim()} aria-labelledby={`${uid}-title`}>
    <header className="ac-compare-intro"><div><p className="ac-compare-eyebrow"><span aria-hidden="true"/>{eyebrow}</p><h2 id={`${uid}-title`}>{title}</h2></div><div className="ac-compare-intro-note">{description && <p>{description}</p>}<span className="ac-compare-count"><b>{String(products.length).padStart(2, '0')}</b> options. One that feels right.</span></div></header>
    <div className="ac-compare-controls"><p>Put the details side by side.<span aria-hidden="true">↘</span></p><label className="ac-compare-filter"><input type="checkbox" checked={differencesOnly} onChange={event => setDifferencesOnly(event.target.checked)}/><span>Show differences only</span><b>{differingRows.length}</b></label></div>
    <div className="ac-compare-selectors"><span className="ac-compare-side-label">THE LINEUP <span aria-hidden="true">↗</span></span>{([first, second] as const).map((product, index) => <label key={index}><span>{index === 0 ? 'First option' : 'Second option'}</span><select aria-label={index === 0 ? 'First comparison option' : 'Second comparison option'} value={product.id} onChange={event => selectProduct(index as 0 | 1, event.target.value)}>{products.map(option => <option key={option.id} value={option.id} disabled={option.id === (index === 0 ? second.id : first.id)}>{option.name}</option>)}</select></label>)}</div>
    <table className="ac-compare-table" role="table"><caption className="ac-compare-sr">{first.name} compared with {second.name}</caption><colgroup><col/><col/><col/></colgroup><thead><tr><th scope="col"><span className="ac-compare-sr">Feature</span><span aria-hidden="true" className="ac-compare-table-label">A LITTLE CLARITY<br/>GOES A LONG WAY.</span></th>{[first, second].map((product, index) => <th key={product.id} scope="col" data-option={index}><div className="ac-compare-product-heading"><span className="ac-compare-product-index" aria-hidden="true">0{products.indexOf(product) + 1}</span>{product.badge && <span className="ac-compare-badge">{product.badge}</span>}<h3>{product.name}</h3>{product.description && <p>{product.description}</p>}{product.price && <div className="ac-compare-price">{product.price}{product.priceNote && <small>{product.priceNote}</small>}</div>}</div></th>)}</tr></thead>{groups.map(group => <CompareGroup key={group} group={group} rows={rows.filter(row => (row.group ?? 'Details') === group)} products={[first, second]} renderValue={valueContent}/>)}{rows.length === 0 && <tbody><tr><td colSpan={3} className="ac-compare-empty">{differencesOnly ? 'These options match on every listed feature.' : 'No features have been added yet.'}</td></tr></tbody>}{[first, second].some(product => product.href) && <tfoot><tr><td/><td>{first.href && <a href={first.href}>{first.actionLabel ?? `Explore ${first.name}`}<span aria-hidden="true">↗</span></a>}</td><td>{second.href && <a href={second.href}>{second.actionLabel ?? `Explore ${second.name}`}<span aria-hidden="true">↗</span></a>}</td></tr></tfoot>}</table>
    <p className="ac-compare-result" aria-live="polite" aria-atomic="true">{rows.length} of {features.length} features shown <span aria-hidden="true">/</span> Comparing {first.name} and {second.name}</p>
  </section>;
}

function CompareGroup({ group, rows, products, renderValue }: { group: string; rows: FeatureComparisonRow[]; products: readonly [FeatureComparisonProduct, FeatureComparisonProduct]; renderValue: (value: string | boolean | null | undefined) => ReactNode }) {
  return <tbody><tr className="ac-compare-group"><th colSpan={3} scope="rowgroup">{group}</th></tr>{rows.map(row => <tr key={row.id} className="ac-compare-feature" data-different={(row.values[products[0].id] ?? null) !== (row.values[products[1].id] ?? null)}><th scope="row"><span>{row.label}</span>{row.description && <small>{row.description}</small>}</th>{products.map((product, index) => <td key={product.id} data-option={index}>{renderValue(row.values[product.id])}</td>)}</tr>)}</tbody>;
}
