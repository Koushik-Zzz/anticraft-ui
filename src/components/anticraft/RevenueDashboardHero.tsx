'use client';

import { useId, useRef, useState } from 'react';
import './revenue-dashboard-hero.css';

export type RevenueDashboardTransaction = {
  id: string;
  customer: string;
  /** UTC calendar date in YYYY-MM-DD format. */
  date: string;
  /** A nonnegative payment in major currency units; for example, 129.50. */
  amount: number;
  channel: string;
};

export type RevenueDashboardHeroProps = {
  transactions: RevenueDashboardTransaction[];
  brand?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  currency?: string;
  /** Inclusive range end. Defaults to the latest valid transaction date. */
  endDate?: string;
  defaultRange?: 7 | 30;
  className?: string;
};

type Payment = RevenueDashboardTransaction & { day: number };
const DAY = 86_400_000;

function calendarDay(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, date] = value.split('-').map(Number);
  const day = Date.UTC(year, month - 1, date);
  return Number.isFinite(day) && new Date(day).toISOString().slice(0, 10) === value ? day : null;
}

function shortDate(day: number) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(day);
}

function LedgerMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 5h7v18H5V5Zm11 0h7v7h-7V5Zm0 11h7v7h-7v-7Z" fill="currentColor"/></svg>;
}

/** A SaaS hero with one filtered source of truth for its metrics, chart and payments. */
export function RevenueDashboardHero({
  transactions,
  brand = 'Ledger',
  title = 'Know where revenue comes from.',
  description = 'Track collected payments, compare channels, and follow every number back to a transaction.',
  actionLabel = 'Explore the dashboard',
  actionHref,
  currency = 'USD',
  endDate,
  defaultRange = 30,
  className = '',
}: RevenueDashboardHeroProps) {
  const uid = useId();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<7 | 30>(defaultRange === 7 ? 7 : 30);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const seenIds = new Set<string>();
  const payments: Payment[] = [];
  for (const transaction of transactions) {
    const day = calendarDay(transaction.date);
    if (day === null || !Number.isFinite(transaction.amount) || transaction.amount < 0 || !transaction.id || seenIds.has(transaction.id)) continue;
    seenIds.add(transaction.id);
    payments.push({ ...transaction, amount: Math.round(transaction.amount * 100) / 100, channel: transaction.channel.trim() || 'Other', day });
  }
  const channels = [...new Set(payments.map(payment => payment.channel))].sort();
  const channel = selectedChannel !== null && channels.includes(selectedChannel) ? selectedChannel : null;
  const latestDay = payments.reduce<number | null>((latest, payment) => latest === null ? payment.day : Math.max(latest, payment.day), null);
  const rangeEnd = (endDate ? calendarDay(endDate) : null) ?? latestDay;
  const rangeStart = rangeEnd === null ? null : rangeEnd - (range - 1) * DAY;
  const filtered = payments.filter(payment => rangeStart !== null && rangeEnd !== null && payment.day >= rangeStart && payment.day <= rangeEnd && (channel === null || payment.channel === channel)).sort((a, b) => b.day - a.day || a.id.localeCompare(b.id));
  const total = filtered.reduce((sum, payment) => sum + Math.round(payment.amount * 100), 0) / 100;
  const average = filtered.length ? total / filtered.length : 0;
  const daily = rangeStart === null ? [] : Array.from({ length: range }, (_, index) => {
    const day = rangeStart + index * DAY;
    return { day, amount: filtered.filter(payment => payment.day === day).reduce((sum, payment) => sum + Math.round(payment.amount * 100), 0) / 100 };
  });
  let currencyCode = currency;
  try { new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }); } catch { currencyCode = 'USD'; }
  const money = (value: number, precise = false) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, minimumFractionDigits: precise ? 2 : 0, maximumFractionDigits: 2 }).format(value);
  const compactMoney = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode, notation: 'compact', maximumFractionDigits: 1 }).format(value);
  const chartMax = Math.max(1, ...daily.map(day => day.amount));
  const chartWidth = 600;
  const chartHeight = 130;
  const slotWidth = chartWidth / Math.max(daily.length, 1);
  const dateRange = rangeStart !== null && rangeEnd !== null ? `${shortDate(rangeStart)} – ${shortDate(rangeEnd)}, ${new Date(rangeEnd).getUTCFullYear()}` : 'No transaction dates';

  function exploreDashboard() {
    dashboardRef.current?.focus({ preventScroll: true });
    dashboardRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }

  return <section className={`ac-revenue-hero ${className}`.trim()} aria-labelledby={`${uid}-title`}>
    <div className="ac-revenue-hero-shell">
      <header className="ac-revenue-masthead"><span className="ac-revenue-brand"><LedgerMark/>{brand}</span><span className="ac-revenue-masthead-label">Revenue analytics</span></header>
      <div className="ac-revenue-layout">
        <div className="ac-revenue-introduction">
          <p className="ac-revenue-eyebrow"><span aria-hidden="true"/>Payment analytics</p>
          <h2 id={`${uid}-title`}>{title}</h2>
          {description && <p className="ac-revenue-description">{description}</p>}
          {actionHref ? <a className="ac-revenue-action" href={actionHref}>{actionLabel}<span aria-hidden="true">↗</span></a> : <button type="button" className="ac-revenue-action" onClick={exploreDashboard}>{actionLabel}<span aria-hidden="true">↗</span></button>}
        </div>
        <div className="ac-revenue-product-field">
          <div className="ac-revenue-field-label"><span>Revenue workspace</span><span aria-hidden="true">↙</span></div>
          <div className="ac-revenue-dashboard" ref={dashboardRef} tabIndex={-1} role="region" aria-label={`${brand} interactive revenue dashboard`}>
            <div className="ac-revenue-app-bar"><span><LedgerMark/>{brand}<b> / </b>Overview</span><span className="ac-revenue-preview-label">Product preview</span></div>
            <div className="ac-revenue-app-content">
              <div className="ac-revenue-app-heading"><div><p>Reporting</p><h3>Revenue overview</h3></div><span className="ac-revenue-currency">{currencyCode}</span></div>
              <div className="ac-revenue-controls">
                <div className="ac-revenue-range" role="group" aria-label="Revenue date range">{([7, 30] as const).map(days => <button key={days} type="button" aria-pressed={range === days} onClick={() => setRange(days)}>{days} days</button>)}</div>
                <label className="ac-revenue-channel"><span className="ac-revenue-sr">Payment channel</span><select value={channel ?? ''} onChange={event => setSelectedChannel(event.target.value || null)}><option value="">All channels</option>{channels.map(value => <option key={value} value={value}>{value}</option>)}</select><svg aria-hidden="true" viewBox="0 0 12 12" fill="none"><path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.3"/></svg></label>
              </div>
              <div className="ac-revenue-metrics" aria-live="polite" aria-atomic="true"><div className="ac-revenue-total"><span>Collected revenue</span><strong>{money(total)}</strong></div><div><span>Payments</span><strong>{filtered.length}</strong></div><div><span>Average payment</span><strong>{money(average)}</strong></div></div>
              <div className="ac-revenue-chart-heading"><h4>Daily collections</h4><span>{dateRange}</span></div>
              <div className="ac-revenue-chart-wrap">
                <div className="ac-revenue-y-axis" aria-hidden="true"><span>{compactMoney(chartMax)}</span><span>{compactMoney(chartMax / 2)}</span><span>{money(0)}</span></div>
                <div className="ac-revenue-chart"><svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" role="img" aria-labelledby={`${uid}-chart-title ${uid}-chart-description`}>
                  <title id={`${uid}-chart-title`}>{`Daily collected revenue in ${currencyCode}`}</title><desc id={`${uid}-chart-description`}>{`${money(total)} from ${filtered.length} payments. ${dateRange}. ${channel ?? 'All channels'}. Daily values follow in a table.`}</desc>
                  {[0, 0.5, 1].map(position => <line key={position} x1="0" x2={chartWidth} y1={position * (chartHeight - 4) + 2} y2={position * (chartHeight - 4) + 2} className="ac-revenue-grid-line"/>)}
                  {daily.map((day, index) => <rect key={day.day} x={index * slotWidth + slotWidth * .17} y={chartHeight - 2 - day.amount / chartMax * (chartHeight - 4)} width={slotWidth * .66} height={day.amount / chartMax * (chartHeight - 4)} rx={Math.min(3, slotWidth * .13)} className="ac-revenue-chart-bar"><title>{`${shortDate(day.day)}: ${money(day.amount, true)}`}</title></rect>)}
                </svg><div className="ac-revenue-x-axis" aria-hidden="true">{daily.length ? <><span>{shortDate(daily[0].day)}</span><span>{shortDate(daily[Math.floor((daily.length - 1) / 2)].day)}</span><span>{shortDate(daily[daily.length - 1].day)}</span></> : <span>No dates available</span>}</div></div>
              </div>
              <div className="ac-revenue-sr"><table><caption>Daily collected revenue: {dateRange}, {channel ?? 'all channels'}</caption><thead><tr><th scope="col">Date</th><th scope="col">Revenue ({currencyCode})</th></tr></thead><tbody>{daily.map(day => <tr key={day.day}><th scope="row">{new Date(day.day).toISOString().slice(0, 10)}</th><td>{money(day.amount, true)}</td></tr>)}</tbody></table></div>
              <div className="ac-revenue-transactions-heading"><h4>Transactions</h4><span>{filtered.length} {filtered.length === 1 ? 'payment' : 'payments'}</span></div>
              <div className="ac-revenue-transaction-scroll" tabIndex={filtered.length > 3 ? 0 : undefined} role="region" aria-label="Filtered payments, scroll for all transactions">
                <table className="ac-revenue-transactions"><caption className="ac-revenue-sr">Payments included in the revenue total</caption><thead><tr><th scope="col">Customer</th><th scope="col">Date</th><th scope="col">Amount</th></tr></thead><tbody>{filtered.map(payment => <tr key={payment.id}><th scope="row"><span className="ac-revenue-customer-avatar" aria-hidden="true">{payment.customer.trim().slice(0, 1) || '·'}</span><span>{payment.customer || 'Unnamed customer'}<small>{payment.channel}</small></span></th><td><time dateTime={payment.date}>{shortDate(payment.day)}</time></td><td>{money(payment.amount, true)}</td></tr>)}</tbody></table>
                {filtered.length === 0 && <p className="ac-revenue-empty">No payments in this date range{channel ? ` for ${channel}` : ''}.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
