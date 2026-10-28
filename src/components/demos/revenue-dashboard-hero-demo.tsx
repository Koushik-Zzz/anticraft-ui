'use client';

import { RevenueDashboardHero, type RevenueDashboardTransaction } from '@/components/anticraft/RevenueDashboardHero';
import './revenue-dashboard-hero-demo.css';

const transactions: RevenueDashboardTransaction[] = [
  { id: 'pay-01', customer: 'Forma Studio', date: '2026-10-01', amount: 680, channel: 'Subscriptions' },
  { id: 'pay-02', customer: 'Orbit Labs', date: '2026-10-03', amount: 1240, channel: 'Invoices' },
  { id: 'pay-03', customer: 'Wayfinder', date: '2026-10-05', amount: 420, channel: 'Subscriptions' },
  { id: 'pay-04', customer: 'Fieldwork', date: '2026-10-07', amount: 1860, channel: 'Invoices' },
  { id: 'pay-05', customer: 'Forma Studio', date: '2026-10-08', amount: 320, channel: 'One-time' },
  { id: 'pay-06', customer: 'Loom House', date: '2026-10-09', amount: 960, channel: 'Subscriptions' },
  { id: 'pay-07', customer: 'Parallel', date: '2026-10-11', amount: 1580, channel: 'Invoices' },
  { id: 'pay-08', customer: 'Orbit Labs', date: '2026-10-12', amount: 740, channel: 'One-time' },
  { id: 'pay-09', customer: 'Wayfinder', date: '2026-10-14', amount: 420, channel: 'Subscriptions' },
  { id: 'pay-10', customer: 'Fieldwork', date: '2026-10-15', amount: 2190, channel: 'Invoices' },
  { id: 'pay-11', customer: 'Common Ground', date: '2026-10-16', amount: 1150, channel: 'Subscriptions' },
  { id: 'pay-12', customer: 'Parallel', date: '2026-10-18', amount: 880, channel: 'One-time' },
  { id: 'pay-13', customer: 'Northstar', date: '2026-10-19', amount: 1740, channel: 'Subscriptions' },
  { id: 'pay-14', customer: 'Loom House', date: '2026-10-20', amount: 960, channel: 'Subscriptions' },
  { id: 'pay-15', customer: 'Common Ground', date: '2026-10-21', amount: 1450, channel: 'Invoices' },
  { id: 'pay-16', customer: 'Forma Studio', date: '2026-10-22', amount: 680, channel: 'Subscriptions' },
  { id: 'pay-17', customer: 'Northstar', date: '2026-10-23', amount: 2480, channel: 'Invoices' },
  { id: 'pay-18', customer: 'Wayfinder', date: '2026-10-24', amount: 560, channel: 'One-time' },
  { id: 'pay-19', customer: 'Orbit Labs', date: '2026-10-25', amount: 1240, channel: 'Subscriptions' },
  { id: 'pay-20', customer: 'Fieldwork', date: '2026-10-26', amount: 2950, channel: 'Invoices' },
  { id: 'pay-21', customer: 'Parallel', date: '2026-10-27', amount: 860, channel: 'Subscriptions' },
  { id: 'pay-22', customer: 'Loom House', date: '2026-10-27', amount: 1840, channel: 'Invoices' },
];

export function RevenueDashboardHeroDemo() {
  return <div className="demo hero-demo revenue-dashboard-hero-demo"><RevenueDashboardHero transactions={transactions}/><p className="revenue-dashboard-demo-note">Fictional product and sample transactions.</p></div>;
}
