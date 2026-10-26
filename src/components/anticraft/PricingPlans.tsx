'use client';

import { useId, useState } from 'react';
import type { MouseEvent } from 'react';
import './pricing-plans.css';

export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  href: string;
  ctaLabel?: string;
  featured?: boolean;
}

export interface PricingPlansProps {
  plans: PricingPlan[];
  title?: string;
  currency?: string;
  locale?: string;
  defaultBilling?: BillingPeriod;
  onBillingChange?: (period: BillingPeriod) => void;
  onSelect?: (plan: PricingPlan, period: BillingPeriod, event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

/** Clear, annual-total pricing with ordinary links for the next step. */
export function PricingPlans({
  plans,
  title = 'A plan for your next chapter',
  currency = 'USD',
  locale = 'en-US',
  defaultBilling = 'monthly',
  onBillingChange,
  onSelect,
  className = '',
}: PricingPlansProps) {
  const headingId = useId();
  const [billing, setBilling] = useState<BillingPeriod>(defaultBilling);
  const format = new Intl.NumberFormat(locale, {
    style: 'currency', currency, minimumFractionDigits: 0,
  });
  const precision = 10 ** (format.resolvedOptions().maximumFractionDigits ?? 2);

  function changeBilling(next: BillingPeriod) {
    if (next === billing) return;
    setBilling(next);
    onBillingChange?.(next);
  }

  if (!plans.length) return null;

  return (
    <section className={`ac-pricing-plans ${className}`.trim()} aria-labelledby={headingId}>
      <header className="ac-pricing-header">
        <div>
          <span className="ac-pricing-eyebrow">ROOM TO GROW</span>
          <h2 id={headingId}>{title}</h2>
        </div>
        <div className="ac-pricing-billing" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={billing === 'monthly'} onClick={() => changeBilling('monthly')}>Monthly</button>
          <button type="button" aria-pressed={billing === 'yearly'} onClick={() => changeBilling('yearly')}>Yearly</button>
        </div>
      </header>

      <div className="ac-pricing-grid">
        {plans.map(plan => {
          const amount = billing === 'yearly' ? plan.yearly : plan.monthly;
          const saving = Math.round((plan.monthly * 12 - plan.yearly) * precision) / precision;
          return (
            <article className={`ac-pricing-card${plan.featured ? ' ac-pricing-featured' : ''}`} key={plan.id}>
              <div className="ac-pricing-card-heading">
                <h3>{plan.name}</h3>
                {plan.featured && <span className="ac-pricing-badge">A little more room</span>}
              </div>
              <p className="ac-pricing-description">{plan.description}</p>
              <div className="ac-pricing-price" aria-live="polite" aria-atomic="true">
                <p><strong>{format.format(amount)}</strong><span> / {billing === 'yearly' ? 'year' : 'month'}</span></p>
                <span className="ac-pricing-billing-note">{billing === 'yearly' ? 'Billed annually' : 'Billed monthly'}</span>
                {billing === 'yearly' && saving > 0 && <span className="ac-pricing-saving">Save {format.format(saving)} per year</span>}
              </div>
              <ul className="ac-pricing-features" aria-label={`${plan.name} includes`}>
                {plan.features.map((feature, index) => <li key={`${feature}-${index}`}><span aria-hidden="true">✓</span>{feature}</li>)}
              </ul>
              <a className="ac-pricing-cta" href={plan.href} onClick={event => onSelect?.(plan, billing, event)}>
                {plan.ctaLabel ?? `Choose ${plan.name}`}<span aria-hidden="true">↗</span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
