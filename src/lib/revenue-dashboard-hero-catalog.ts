import type { ComponentDefinition } from './catalog';

export const revenueDashboardHeroComponents: ComponentDefinition[] = [{
  slug: 'revenue-dashboard-hero',
  title: 'Revenue Dashboard Hero',
  category: 'Heroes',
  tag: 'New',
  description: 'A SaaS hero with date and channel filters that update revenue, chart and transactions together.',
  file: 'RevenueDashboardHero.tsx',
  cssFile: 'revenue-dashboard-hero.css',
  usage: `import { RevenueDashboardHero } from '@/components/anticraft/RevenueDashboardHero';

export function Example() {
  return <RevenueDashboardHero
    brand="Ledger"
    title="Know where revenue comes from."
    description="Track collected payments, compare channels, and follow every number back to a transaction."
    transactions={[
      { id: 'pay-1', customer: 'Forma Studio', date: '2026-10-22', amount: 680, channel: 'Subscriptions' },
      { id: 'pay-2', customer: 'Orbit Labs', date: '2026-10-25', amount: 1240, channel: 'Invoices' },
      { id: 'pay-3', customer: 'Fieldwork', date: '2026-10-27', amount: 2950, channel: 'Invoices' },
    ]}
  />;
}`,
  props: [
    { name: 'transactions', type: 'RevenueDashboardTransaction[]', default: 'Required', description: 'Payments with a unique id, customer, date (YYYY-MM-DD), nonnegative amount in major currency units, and channel. All metrics, daily bars and table rows use this same data. Invalid dates, negative/nonfinite amounts and repeated ids are ignored; blank channels become Other. Amounts are rounded to cents. Empty data shows zero totals and a clear empty state.' },
    { name: 'brand', type: 'string', default: "'Ledger'", description: 'Brand label in the masthead and interactive product preview.' },
    { name: 'title', type: 'string', default: "'Know where revenue comes from.'", description: 'Visible h2 and section label. Keep it short; adjust the copied heading level if it is the page’s main h1.' },
    { name: 'description', type: 'string', default: "'Track collected payments, compare channels, and follow every number back to a transaction.'", description: 'Supporting sentence. An empty string hides it.' },
    { name: 'actionLabel', type: 'string', default: "'Explore the dashboard'", description: 'Primary action text. The default action moves keyboard focus to the dashboard and scrolls it into view when needed.' },
    { name: 'actionHref', type: 'string', default: 'undefined', description: 'Supply a real destination to render the primary action as an ordinary link. Without a destination it is a button that focuses the preview.' },
    { name: 'currency', type: 'string', default: "'USD'", description: 'ISO currency code used for every amount; all transactions must use the same currency. Invalid codes fall back to USD. Formatting uses en-US for stable server/client output.' },
    { name: 'endDate', type: 'string', default: 'Latest valid transaction date', description: 'Inclusive UTC calendar date in YYYY-MM-DD format. Both ranges end here; no browser clock is used. Invalid values fall back to the newest transaction. Seven days includes the end date and the preceding six days.' },
    { name: 'defaultRange', type: '7 | 30', default: '30', description: 'Initial date range. Native pressed buttons switch the range. A removed channel selection falls back to All channels when transaction props change.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-revenue-ink, --ac-revenue-text, --ac-revenue-muted, --ac-revenue-accent, --ac-revenue-chart and --ac-revenue-field. Container queries stack the introduction above the dashboard below 1000px component width.' },
  ],
  motion: 'Range buttons and the native channel select update the total, payment count, average, daily chart and transaction table in one render. A live region reports the three totals. The chart includes a daily-value table for assistive technology; the transaction list is keyboard scrollable. No automatic animation runs. Reduced motion removes action and filter transitions.',
  useCases: ['Payment analytics products', 'Subscription reporting tools', 'Financial operations landing pages'],
  inspiration: { name: 'SpendHub by Excited on Dribbble', url: 'https://dribbble.com/shots/27537988-Fintech-SaaS-Website-Hero-Section-Animation', note: 'SpendHub’s clear introduction and substantial product window informed the composition. Ledger uses original branding, copy, interface and sample data, with working linked filters rather than a screenshot.' },
}];
