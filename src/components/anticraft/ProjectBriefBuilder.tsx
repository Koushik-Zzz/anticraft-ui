'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './project-brief-builder.css';

/** One uniquely identified service, budget range, or timeline choice. */
export interface ProjectBriefOption {
  id: string;
  label: string;
  description?: string;
}

/** Serializable enquiry data. Choice values contain the supplied option ids. */
export interface ProjectBrief {
  services: string[];
  description: string;
  budget: string;
  timeline: string;
  name: string;
  email: string;
  company: string;
}

export interface ProjectBriefBuilderProps {
  services: ProjectBriefOption[];
  budgets: ProjectBriefOption[];
  timelines: ProjectBriefOption[];
  /** Connect your own endpoint here. Reject to keep the brief and show a retry message. */
  onSubmit: (brief: ProjectBrief) => void | Promise<void>;
  studioName?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  availability?: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
  className?: string;
}

type BriefField = keyof ProjectBrief;
type BriefErrors = Partial<Record<BriefField, string>>;
const blankBrief = (): ProjectBrief => ({ services: [], description: '', budget: '', timeline: '', name: '', email: '', company: '' });
const steps = [{ label: 'The project', note: 'A little about your idea' }, { label: 'The details', note: 'A few practical things' }, { label: 'The introduction', note: 'Check it, then say hello' }];

/** A three-step enquiry form. Submission runs only through the required callback. */
export function ProjectBriefBuilder({
  services, budgets, timelines, onSubmit, studioName = 'Your studio', eyebrow = 'GOOD THINGS START WITH A CONVERSATION',
  title = 'Something in mind?', description = 'Tell us a little about it. We’ll take it from there.', availability = 'Open for new collaborations',
  submitLabel = 'Send your brief', successTitle = 'A good beginning.', successMessage = 'Your brief has been submitted. Thank you for the introduction.', className = '',
}: ProjectBriefBuilderProps) {
  const uid = useId();
  const [brief, setBrief] = useState<ProjectBrief>(blankBrief);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<BriefErrors>({});
  const [status, setStatus] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const focusTarget = useRef<BriefField | 'heading' | null>(null);
  const locked = useRef(false);
  const mounted = useRef(true);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    const target = focusTarget.current;
    if (!target) return;
    focusTarget.current = null;
    if (target === 'heading') heading.current?.focus();
    else form.current?.querySelector<HTMLElement>(`[name="${target}"]`)?.focus();
  }, [step, errors, status]);

  const labelFor = (options: ProjectBriefOption[], id: string) => options.find(option => option.id === id)?.label ?? 'Selection no longer available';
  const availableServices = brief.services.filter(id => services.some(option => option.id === id));
  const choiceValue = (field: 'budget' | 'timeline') => (field === 'budget' ? budgets : timelines).some(option => option.id === brief[field]) ? brief[field] : '';
  function update<K extends BriefField>(field: K, value: ProjectBrief[K]) {
    setBrief(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    if (status === 'error') setStatus('idle');
  }
  function validate(target: number): BriefErrors {
    const next: BriefErrors = {};
    if (target === 0 || target === 2) {
      if (!availableServices.length) next.services = 'Choose at least one service.';
      if (brief.description.trim().length < 20) next.description = 'Give us a little more context — at least 20 characters.';
    }
    if (target === 1 || target === 2) {
      if (!budgets.some(option => option.id === brief.budget)) next.budget = 'Choose a budget range.';
      if (!timelines.some(option => option.id === brief.timeline)) next.timeline = 'Choose a timeline.';
      if (!brief.name.trim()) next.name = 'Tell us your name.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brief.email.trim())) next.email = 'Enter a valid email address.';
    }
    return next;
  }
  function go(next: number) {
    if (locked.current) return;
    focusTarget.current = 'heading';
    setErrors({});
    setStatus('idle');
    setStep(next);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const nextErrors = validate(step);
    const first = Object.keys(nextErrors)[0] as BriefField | undefined;
    if (first) {
      focusTarget.current = first;
      setErrors(nextErrors);
      if (step === 2) setStep(first === 'services' || first === 'description' ? 0 : 1);
      return;
    }
    if (step < 2) { go(step + 1); return; }
    locked.current = true;
    setStatus('pending');
    const submission: ProjectBrief = { ...brief, services: availableServices, name: brief.name.trim(), email: brief.email.trim(), company: brief.company.trim(), description: brief.description.trim() };
    try {
      await onSubmit(submission);
      if (mounted.current) { setBrief(submission); focusTarget.current = 'heading'; setStatus('success'); }
    } catch {
      if (mounted.current) setStatus('error');
    } finally {
      locked.current = false;
    }
  }
  function reset() {
    if (locked.current) return;
    setBrief(blankBrief());
    setErrors({});
    focusTarget.current = 'heading';
    setStatus('idle');
    setStep(0);
  }
  const fieldHelp = (field: BriefField) => errors[field] ? `${uid}-${field}-error` : undefined;
  const unavailable = !services.length || !budgets.length || !timelines.length;
  const success = status === 'success';

  return <section className={`ac-brief ${className}`.trim()} aria-labelledby={`${uid}-title`}>
    <div className="ac-brief-surface">
      <header className="ac-brief-masthead"><span className="ac-brief-brand">{studioName}<span aria-hidden="true">®</span></span><span className="ac-brief-availability"><i aria-hidden="true" />{availability}</span></header>
      <div className="ac-brief-layout">
        <aside className="ac-brief-intro">
          <p className="ac-brief-eyebrow">{eyebrow}</p>
          <h2 id={`${uid}-title`}>{title}</h2><p className="ac-brief-description">{description}</p>
          <ol className="ac-brief-progress" aria-label="Brief progress">{steps.map((item, index) => <li key={item.label} aria-current={!success && step === index ? 'step' : undefined} data-complete={success || index < step} data-active={!success && index === step}><span className="ac-brief-step-number" aria-hidden="true">{success || index < step ? '✓' : `0${index + 1}`}</span><span><strong>{item.label}</strong><small>{item.note}</small></span><span className="ac-brief-step-arrow" aria-hidden="true">↗</span></li>)}</ol>
          <div className="ac-brief-note"><span aria-hidden="true">✳</span><p>Every worthwhile project<br />starts with a first hello.</p></div>
        </aside>
        <div className="ac-brief-panel">
          {unavailable ? <div className="ac-brief-unavailable"><h3 ref={heading} tabIndex={-1}>Let’s get ready.</h3><p>Add at least one service, budget range, and timeline to open this brief.</p></div> : success ? <div className="ac-brief-success">
            <span className="ac-brief-success-mark" aria-hidden="true">↗</span><p className="ac-brief-eyebrow">INTRODUCTION COMPLETE</p><h3 ref={heading} tabIndex={-1}>{successTitle}</h3><p>{successMessage}</p>
            <dl className="ac-brief-receipt"><div><dt>Project</dt><dd>{availableServices.map(id => labelFor(services, id)).join(' + ')}</dd></div><div><dt>From</dt><dd>{brief.name}<span>{brief.email}</span></dd></div><div><dt>Budget / timing</dt><dd>{labelFor(budgets, brief.budget)}<span>{labelFor(timelines, brief.timeline)}</span></dd></div><div><dt>The idea</dt><dd className="ac-brief-receipt-idea">{brief.description}</dd></div></dl>
            <button className="ac-brief-text-button" type="button" onClick={reset}>Start another brief <span aria-hidden="true">↗</span></button>
          </div> : <form ref={form} noValidate onSubmit={submit} aria-labelledby={`${uid}-step-title`} aria-busy={status === 'pending'}>
            <header className="ac-brief-panel-heading"><p className="ac-brief-eyebrow">0{step + 1} / 03 — {step === 0 ? 'THE POSSIBILITIES' : step === 1 ? 'THE PRACTICALITIES' : 'THE FIRST HELLO'}</p><h3 id={`${uid}-step-title`} ref={heading} tabIndex={-1}>{step === 0 ? 'What are we making?' : step === 1 ? 'Make it a little more real.' : 'Does this feel right?'}</h3><p>{step === 0 ? 'One thing or a few. Choose what you have in mind.' : step === 1 ? 'A rough idea is a perfectly good place to start.' : 'Here’s your brief. A small beginning to something good.'}</p></header>
            <fieldset className="ac-brief-fields" disabled={status === 'pending'}>
              <legend className="ac-brief-sr-only">{steps[step].label}</legend>
              {step === 0 && <>
                <fieldset className="ac-brief-service-group" aria-describedby={fieldHelp('services')}><legend>I’m looking for <span>(choose one or more)</span></legend><div className="ac-brief-services">{services.map(service => <label className="ac-brief-service" key={service.id}><input type="checkbox" name="services" value={service.id} checked={brief.services.includes(service.id)} aria-invalid={!!errors.services} onChange={event => update('services', event.target.checked ? [...brief.services, service.id] : brief.services.filter(id => id !== service.id))} /><span><strong>{service.label}</strong>{service.description && <small>{service.description}</small>}</span><i aria-hidden="true">{brief.services.includes(service.id) ? '✓' : '+'}</i></label>)}</div>{errors.services && <p className="ac-brief-error" id={fieldHelp('services')}>{errors.services}</p>}</fieldset>
                <label className="ac-brief-field" htmlFor={`${uid}-description`}><span>A little about your project <i>Required</i></span><textarea id={`${uid}-description`} name="description" rows={3} maxLength={4000} value={brief.description} onChange={event => update('description', event.target.value)} placeholder="The idea, the ambition, the thing you’d love to change…" aria-required="true" aria-invalid={!!errors.description} aria-describedby={fieldHelp('description')} />{errors.description && <small className="ac-brief-error" id={fieldHelp('description')}>{errors.description}</small>}</label>
              </>}
              {step === 1 && <>
                <div className="ac-brief-field-pair">{([{ key: 'budget', label: 'Your budget', options: budgets, placeholder: 'Select a range' }, { key: 'timeline', label: 'Your timeline', options: timelines, placeholder: 'Select a timeframe' }] as const).map(field => <label key={field.key} className="ac-brief-field" htmlFor={`${uid}-${field.key}`}><span>{field.label} <i>Required</i></span><select id={`${uid}-${field.key}`} name={field.key} value={choiceValue(field.key)} onChange={event => update(field.key, event.target.value)} aria-required="true" aria-invalid={!!errors[field.key]} aria-describedby={fieldHelp(field.key)}><option value="" disabled>{field.placeholder}</option>{field.options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}</select>{errors[field.key] && <small className="ac-brief-error" id={fieldHelp(field.key)}>{errors[field.key]}</small>}</label>)}</div>
                <div className="ac-brief-field-pair">{([{ key: 'name', label: 'Your name', type: 'text', autoComplete: 'name', placeholder: 'Alex Morgan' }, { key: 'email', label: 'Email address', type: 'email', autoComplete: 'email', placeholder: 'alex@yourcompany.com' }] as const).map(field => <label key={field.key} className="ac-brief-field" htmlFor={`${uid}-${field.key}`}><span>{field.label} <i>Required</i></span><input id={`${uid}-${field.key}`} name={field.key} type={field.type} autoComplete={field.autoComplete} maxLength={field.key === 'email' ? 254 : 120} value={brief[field.key]} onChange={event => update(field.key, event.target.value)} placeholder={field.placeholder} aria-required="true" aria-invalid={!!errors[field.key]} aria-describedby={fieldHelp(field.key)} />{errors[field.key] && <small className="ac-brief-error" id={fieldHelp(field.key)}>{errors[field.key]}</small>}</label>)}</div>
                <label className="ac-brief-field" htmlFor={`${uid}-company`}><span>Company or website <i>Optional</i></span><input id={`${uid}-company`} name="company" autoComplete="organization" maxLength={200} value={brief.company} onChange={event => update('company', event.target.value)} placeholder="Where you call home on the internet" /></label>
              </>}
              {step === 2 && <div className="ac-brief-review"><div className="ac-brief-review-group"><div className="ac-brief-review-label"><span>THE PROJECT</span><button type="button" className="ac-brief-text-button" onClick={() => go(0)}>Edit project <span aria-hidden="true">↗</span></button></div><div className="ac-brief-review-chips">{availableServices.length ? availableServices.map(id => <span key={id}>{labelFor(services, id)}</span>) : <span>Choose a service</span>}</div><p className="ac-brief-review-description">{brief.description}</p></div><div className="ac-brief-review-group"><div className="ac-brief-review-label"><span>THE DETAILS</span><button type="button" className="ac-brief-text-button" onClick={() => go(1)}>Edit details <span aria-hidden="true">↗</span></button></div><dl><div><dt>Budget</dt><dd>{labelFor(budgets, brief.budget)}</dd></div><div><dt>Timeline</dt><dd>{labelFor(timelines, brief.timeline)}</dd></div><div><dt>Contact</dt><dd>{brief.name}<span>{brief.email}</span>{brief.company && <span>{brief.company}</span>}</dd></div></dl></div></div>}
            </fieldset>
            {status === 'error' && <p className="ac-brief-submit-error" role="alert">We couldn’t submit your brief. Your details are still here — please try again.</p>}
            <footer className="ac-brief-actions"><span className="ac-brief-action-note">{step === 0 ? 'A few details. About 2 minutes.' : step === 1 ? 'Almost there. Just the introduction left.' : 'Ready when you are.'}</span><div>{step > 0 && <button type="button" className="ac-brief-back" disabled={status === 'pending'} onClick={() => go(step - 1)}><span aria-hidden="true">←</span> Back</button>}<button className="ac-brief-next" type="submit" disabled={status === 'pending'}><span>{status === 'pending' ? 'Submitting…' : step < 2 ? 'Continue' : submitLabel}</span><span aria-hidden="true">↗</span></button></div></footer>
            <span className="ac-brief-sr-only" role="status">{status === 'pending' ? 'Submitting your brief. Please wait.' : ''}</span>
          </form>}
        </div>
      </div><footer className="ac-brief-colophon"><span>A LITTLE CONTEXT. A LOT OF POSSIBILITY.</span><span>{studioName} / LET’S MAKE IT MATTER</span></footer>
    </div>
  </section>;
}
