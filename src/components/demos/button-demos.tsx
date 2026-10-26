'use client';

import { useState } from 'react';
import { ArrowCapsuleButton } from '@/components/anticraft/ArrowCapsuleButton';
import { RollingTextButton } from '@/components/anticraft/RollingTextButton';
import { CircleFillButton } from '@/components/anticraft/CircleFillButton';
import { ShutterButton } from '@/components/anticraft/ShutterButton';
import { OutlineTraceButton } from '@/components/anticraft/OutlineTraceButton';
import { TactileButton } from '@/components/anticraft/TactileButton';
import './button-demos.css';

export const buttonDemoSlugs = [
  'arrow-capsule-button', 'rolling-text-button', 'circle-fill-button',
  'shutter-button', 'outline-trace-button', 'tactile-button',
] as const;

type ButtonDemoSlug = typeof buttonDemoSlugs[number];

const details: Record<ButtonDemoSlug, { number: string; eyebrow: string; title: string; label: string; hint: string }> = {
  'arrow-capsule-button': { number: '01', eyebrow: 'A LITTLE FORWARD MOMENTUM', title: 'Good things ahead.', label: 'Let’s work together', hint: 'One label. A new direction.' },
  'rolling-text-button': { number: '02', eyebrow: 'TYPE, WITH A LITTLE PERSONALITY', title: 'Words worth moving.', label: 'Make your move', hint: 'A small shift in perspective.' },
  'circle-fill-button': { number: '03', eyebrow: 'LET THE COLOR IN', title: 'Room for a little more.', label: 'Open possibilities', hint: 'A tiny point. A full invitation.' },
  'shutter-button': { number: '04', eyebrow: 'AN OPENING FOR GOOD IDEAS', title: 'Make an entrance.', label: 'Start something', hint: 'Two panels. One clear action.' },
  'outline-trace-button': { number: '05', eyebrow: 'ATTENTION TO THE FINER DETAILS', title: 'Follow the feeling.', label: 'Explore the details', hint: 'A line that finishes the thought.' },
  'tactile-button': { number: '06', eyebrow: 'A LITTLE MORE HANDS ON', title: 'Made to be pressed.', label: 'Give it a push', hint: 'Press it. Feel the difference.' },
};

export function ButtonDemo({ slug }: { slug: ButtonDemoSlug }) {
  const [activations, setActivations] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const detail = details[slug];
  const native = { disabled, onClick: () => setActivations(value => value + 1) };
  let button;
  switch (slug) {
    case 'arrow-capsule-button': button = <ArrowCapsuleButton {...native}>{detail.label}</ArrowCapsuleButton>; break;
    case 'rolling-text-button': button = <RollingTextButton {...native}>{detail.label}</RollingTextButton>; break;
    case 'circle-fill-button': button = <CircleFillButton {...native}>{detail.label}</CircleFillButton>; break;
    case 'shutter-button': button = <ShutterButton {...native}>{detail.label}</ShutterButton>; break;
    case 'outline-trace-button': button = <OutlineTraceButton {...native}>{detail.label}</OutlineTraceButton>; break;
    case 'tactile-button': button = <TactileButton {...native}>{detail.label}</TactileButton>; break;
  }

  return (
    <div className={`demo button-demo button-demo--${slug}`} role="group" aria-label={`${slug.replace(/-/g, ' ')} demo`}>
      <div className="button-demo-top"><span>{detail.eyebrow}</span><span>{detail.number} / BUTTON STUDIES</span></div>
      <div className="button-demo-center">
        <p className="button-demo-title">{detail.title}</p>
        <div className="button-demo-action">{button}</div>
        <p className="button-demo-feedback" role="status" aria-atomic="true">
          {activations ? `Demo action activated ${activations} ${activations === 1 ? 'time' : 'times'}.` : detail.hint}
        </p>
      </div>
      <div className="button-demo-bottom">
        <span>HOVER · FOCUS · PRESS</span>
        <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} />Disabled state</label>
      </div>
    </div>
  );
}

export function isButtonDemoSlug(slug: string): slug is ButtonDemoSlug {
  return buttonDemoSlugs.some(item => item === slug);
}
