'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { PricingPlans } from '@/components/anticraft/PricingPlans';
import type { BillingPeriod, PricingPlan } from '@/components/anticraft/PricingPlans';
import { FeatureBento } from '@/components/anticraft/FeatureBento';
import './marketing-demos.css';

const plans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', description: 'A little structure for your next big idea.', monthly: 12, yearly: 120, features: ['3 active projects', 'Your own workspace', 'Unlimited notes'], href: '#example-plan-starter', ctaLabel: 'Explore Starter' },
  { id: 'studio', name: 'Studio', description: 'More space for the work you do together.', monthly: 29, yearly: 288, features: ['Unlimited projects', '5 team members', 'Shared project timelines'], href: '#example-plan-studio', ctaLabel: 'Explore Studio', featured: true },
  { id: 'scale', name: 'Scale', description: 'A shared home for a growing company.', monthly: 59, yearly: 588, features: ['Unlimited projects', '20 team members', 'Workspace permissions'], href: '#example-plan-scale', ctaLabel: 'Explore Scale' },
];

export function PricingPlansDemo() {
  const [selected, setSelected] = useState<{ plan: PricingPlan; period: BillingPeriod } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLAnchorElement | null>(null);
  const titleId = useId();
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  useEffect(() => {
    if (!selected || !dialog.current) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    return () => {
      if (modal.open) modal.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [selected]);

  function showPlan(plan: PricingPlan, period: BillingPeriod, event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    opener.current = event.currentTarget;
    setSelected({ plan, period });
  }

  return (
    <div className="demo practical-demo pricing-plans-demo">
      <p className="marketing-demo-brand">folio<span>®</span><span>EXAMPLE WORKSPACE</span></p>
      <PricingPlans plans={plans} title="Make room for more." onSelect={showPlan} />
      <p className="marketing-demo-caption">Compare plans and see what’s included.</p>
      <dialog
        ref={dialog}
        className="marketing-plan-dialog"
        aria-labelledby={titleId}
        onCancel={event => { event.preventDefault(); setSelected(null); }}
        onClose={() => { if (!dialog.current?.open) setSelected(null); }}
      >
        <header><span>FOLIO / EXAMPLE PLAN DETAILS</span><button type="button" onClick={() => setSelected(null)}>Close <span aria-hidden="true">×</span></button></header>
        <div className="marketing-plan-dialog-body">
          <p className="marketing-plan-kicker">Example plan details</p>
          <h2 id={titleId}>{selected?.plan.name ?? 'Plan'} workspace</h2>
          {selected && <>
            <p className="marketing-plan-dialog-description">{selected.plan.description}</p>
            <p className="marketing-plan-dialog-price"><strong>{format.format(selected.period === 'yearly' ? selected.plan.yearly : selected.plan.monthly)}</strong> / {selected.period === 'yearly' ? 'year' : 'month'}</p>
            <p className="marketing-plan-billing">{selected.period === 'yearly' ? 'Annual billing' : 'Monthly billing'} · USD</p>
            <h3>What’s included</h3>
            <ul>{selected.plan.features.map(feature => <li key={feature}><span aria-hidden="true">✓</span>{feature}</li>)}</ul>
            <p className="marketing-plan-example-note">Folio is an example workspace. These plan details demonstrate how the pricing section can connect to your own signup flow.</p>
          </>}
        </div>
      </dialog>
    </div>
  );
}

function WorkspacePreview() {
  return <div className="marketing-workspace-art">
    <div className="marketing-workspace-sidebar"><b>f.</b><span className="marketing-art-active">Overview</span><span>Projects</span><span>People</span><span>Calendar</span><i>AS</i></div>
    <div className="marketing-workspace-main"><span>YOUR WORKSPACE / THURSDAY</span><strong>Good morning, Alex.</strong><p>A little clarity goes a long way.</p><div className="marketing-project-mock"><span><i/>Website refresh<small>12 tasks · Design</small></span><b>In progress ↗</b></div><div className="marketing-project-mock"><span><i/>Summer campaign<small>8 tasks · Strategy</small></span><b>Planning ↗</b></div><div className="marketing-workspace-progress"><span>THIS WEEK</span><strong>Small steps.<br/>Good progress.</strong><div><i/><i/><i/><i/><i/><i/><i/></div></div></div>
  </div>;
}

function SharePreview() {
  return <div className="marketing-share-art"><div className="marketing-share-avatars"><i>AL</i><i>JS</i><i>MK</i><i>+2</i></div><strong>Good work takes company.</strong><div className="marketing-share-line"><span>team@your.studio</span><b>Invited ✓</b></div><span className="marketing-share-permission">PROJECT ACCESS <span>Can edit <i>⌄</i></span></span></div>;
}

function CalendarPreview() {
  return <div className="marketing-calendar-art"><div><span>OCTOBER</span><strong>22</strong><small>Thursday, a little more organized.</small></div><span className="marketing-calendar-event"><i/><span>Design review<small>10:30 — 11:00</small></span><b>↗</b></span><span className="marketing-calendar-event"><i/><span>Team catch-up<small>14:00 — 14:30</small></span><b>↗</b></span></div>;
}

function SearchPreview() {
  return <div className="marketing-search-art"><div className="marketing-search-input"><span>⌕</span><b>Brand guidelines</b><i>⌘ K</i></div><div className="marketing-search-result"><i>Aa</i><span>Brand guidelines<small>Design system / Updated yesterday</small></span><b>↗</b></div><div className="marketing-search-result"><i>▤</i><span>Brand workshop notes<small>Research / Updated 3 days ago</small></span><b>↗</b></div></div>;
}

export function FeatureBentoDemo() {
  return (
    <div className="demo practical-demo feature-bento-demo">
      <p className="marketing-demo-brand">folio<span>®</span><span>EXAMPLE WORKSPACE</span></p>
      <FeatureBento
        title="Less scattered. More together."
        items={[
          { id: 'overview', eyebrow: 'ONE SHARED HOME', title: 'See the work, at a glance.', description: 'Bring projects, notes, and next steps into one calm workspace.', span: 'wide', media: <WorkspacePreview/> },
          { id: 'sharing', eyebrow: 'BETTER TOGETHER', title: 'Make room for your team.', description: 'Share a project and keep everyone working from the same page.', media: <SharePreview/> },
          { id: 'calendar', eyebrow: 'A CLEARER WEEK', title: 'Know what’s coming next.', description: 'Keep reviews and milestones close to the work they belong to.', media: <CalendarPreview/> },
          { id: 'search', eyebrow: 'FIND YOUR FLOW', title: 'Less looking. More doing.', description: 'Find the document you need, then get back to the good part.', span: 'wide', media: <SearchPreview/> },
        ]}
      />
      <p className="marketing-demo-caption">Product benefits, with a preview of how they work.</p>
    </div>
  );
}
