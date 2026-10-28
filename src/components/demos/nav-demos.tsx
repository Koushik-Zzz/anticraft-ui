"use client";

import { useId, useState } from 'react';
import type { MouseEvent } from 'react';
import { FloatingDock } from '@/components/anticraft/FloatingDock';
import { SlidingNav } from '@/components/anticraft/SlidingNav';
import { ExpandingMenu } from '@/components/anticraft/ExpandingMenu';
import { RadialNav } from '@/components/anticraft/RadialNav';
import { CurtainMenu } from '@/components/anticraft/CurtainMenu';
import { Icon } from '@/components/site/icon';
import './nav-demos.css';

const destinations = [
  { id: 'home', label: 'Home', description: 'A place to begin', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7"/></svg>, eyebrow: 'AN INDEPENDENT STUDIO', first: 'Somewhere', second: 'unexpected.', note: 'Small studio. Expansive ideas.' },
  { id: 'work', label: 'Work', description: 'A few things we’ve made', icon: <Icon name="grid" size={20}/>, eyebrow: 'SELECTED WORK / 2026', first: 'Brands built.', second: 'Ideas in use.', note: 'Identities, digital experiences, and printed matter.' },
  { id: 'about', label: 'About', description: 'The people behind the work', icon: <Icon name="spark" size={20}/>, eyebrow: 'A LITTLE ABOUT US', first: 'Curious minds.', second: 'Open doors.', note: 'Independent by nature. Different by design.' },
  { id: 'notes', label: 'Notes', description: 'Thoughts from the studio', icon: <Icon name="book" size={20}/>, eyebrow: 'FIELD NOTES / 004', first: 'Keep looking.', second: 'Stay curious.', note: 'Observations from the spaces in between.' },
  { id: 'contact', label: 'Hello', description: 'Start a conversation', icon: <Icon name="arrow" size={20}/>, eyebrow: 'BRING US YOUR NEXT PROJECT', first: 'Your next idea.', second: 'Our next hello.', note: 'There’s always room for a new perspective.' },
];

function useNavScene(ids: string[], initial = ids[0]) {
  const instance = useId().replace(/:/g, '');
  const [activeId, setActiveId] = useState(initial);
  const items = destinations.filter(item => ids.includes(item.id)).map(item => ({ ...item, href: `#nav-scene-${instance}-${item.id}` }));
  function onNavigate(id: string, event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActiveId(id);
  }
  return { items, activeId, onNavigate, instance };
}

function Scene({ scene, compact = false }: { scene: ReturnType<typeof useNavScene>; compact?: boolean }) {
  return <div className={`nav-scene-content${compact ? ' nav-scene-compact' : ''}`} aria-live="polite" aria-atomic="true">{scene.items.map(item => <section id={`nav-scene-${scene.instance}-${item.id}`} key={item.id} hidden={item.id !== scene.activeId} aria-label={`${item.label} demo section`}><span className="nav-scene-eyebrow">{item.eyebrow}</span><h3>{item.first}<br/><em>{item.second}</em></h3><p>{item.note}</p></section>)}</div>;
}

export function FloatingDockDemo() {
  const scene = useNavScene(['home', 'work', 'about', 'notes', 'contact']);
  return <div className="demo nav-dock-demo"><div className="nav-demo-corner"><span>another studio.</span><span>EST. 2026</span></div><Scene scene={scene}/><div className="nav-dock-placement"><FloatingDock items={scene.items} activeId={scene.activeId} onNavigate={scene.onNavigate} label="Studio dock"/></div></div>;
}

export function SlidingNavDemo() {
  const scene = useNavScene(['home', 'work', 'about', 'notes']);
  return <div className="demo nav-sliding-demo"><div className="nav-sliding-placement"><SlidingNav items={scene.items} activeId={scene.activeId} onNavigate={scene.onNavigate} label="Studio pages"/></div><Scene scene={scene}/><span className="nav-demo-bottom">FIND YOUR PLACE. FOLLOW YOUR CURIOSITY.</span></div>;
}

export function ExpandingMenuDemo() {
  const scene = useNavScene(['work', 'about', 'contact'], 'work');
  return <div className="demo nav-expand-demo"><Scene scene={scene} compact/><div className="nav-expand-placement"><ExpandingMenu items={scene.items} activeId={scene.activeId} onNavigate={scene.onNavigate} label="Studio index"/></div><span className="nav-demo-bottom">A SMALL MENU. A BIGGER PICTURE.</span></div>;
}

export function RadialNavDemo() {
  const scene = useNavScene(['home', 'work', 'about', 'notes', 'contact']);
  const active = scene.items.find(item => item.id === scene.activeId)!;
  return <div className="demo nav-radial-demo"><div className="nav-demo-corner"><span>A CHANGE OF DIRECTION.</span><span>↗</span></div><div className="nav-radial-placement"><RadialNav items={scene.items} activeId={scene.activeId} onNavigate={scene.onNavigate} label="Explore"/></div><div className="nav-radial-destinations" aria-live="polite">{scene.items.map(item=><section key={item.id} hidden={item.id!==scene.activeId} id={`nav-scene-${scene.instance}-${item.id}`} aria-label={`${item.label} demo section`}><span>{active.label}</span><span>{active.note}</span></section>)}</div></div>;
}

export function CurtainMenuDemo() {
  const scene = useNavScene(['home', 'work', 'about', 'contact']);
  return <div className="demo nav-curtain-demo"><div className="nav-demo-corner"><span>another studio.</span><span>OPEN BY DESIGN</span></div><Scene scene={scene}/><div className="nav-curtain-placement"><CurtainMenu items={scene.items} activeId={scene.activeId} onNavigate={scene.onNavigate} label="Explore menu" title="A change of scenery." footer={<p className="nav-curtain-footer-note">INDEPENDENT BY NATURE. OPEN BY DESIGN.<br/>Choose a destination to change the preview.</p>}/></div></div>;
}
