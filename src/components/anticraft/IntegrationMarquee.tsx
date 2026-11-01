'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './integration-marquee.css';

export interface IntegrationMarqueeItem { id: string; label: string; logo: ReactNode; }
export interface IntegrationConnection { id: string; name: string; detail: string; logo: ReactNode; }
export interface IntegrationMarqueeProps {
  rows: IntegrationMarqueeItem[][];
  connections?: IntegrationConnection[];
  title?: ReactNode;
  durations?: number[];
  paused?: boolean;
  cycleConnections?: boolean;
  showControls?: boolean;
  className?: string;
}

/** Three seamless logo ribbons and an illustrative connection-status sequence. */
export function IntegrationMarquee({ rows, connections = [], title = 'Works with the tools you already use.', durations = [120,140,130], paused = false, cycleConnections = true, showControls = true, className = '' }: IntegrationMarqueeProps) {
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const [held, setHeld] = useState(false);
  const [environment, setEnvironment] = useState({ visible:false, hidden:false, reduced:false });
  const [copies,setCopies] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'connecting'|'syncing'|'connected'>('connected');
  const running = environment.visible && !environment.hidden && !environment.reduced && !paused && !held;
  const connection = connections.length ? connections[index % connections.length] : undefined;
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = typeof IntersectionObserver === 'undefined';
    const sync = () => setEnvironment({ visible, hidden:document.hidden, reduced:media.matches });
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; sync(); });
    observer?.observe(element);
    media.addEventListener('change',sync);
    document.addEventListener('visibilitychange',sync);
    sync();
    return () => { observer?.disconnect(); media.removeEventListener('change',sync); document.removeEventListener('visibilitychange',sync); };
  },[]);
  useEffect(() => {
    const element=root.current;
    if (!element) return;
    const measure=()=>{
      const next=Array.from(element.querySelectorAll<HTMLElement>('.ac-integration-marquee__row')).map(row=>{
        const group=row.querySelector<HTMLElement>('.ac-integration-marquee__group');
        const width=group?.getBoundingClientRect().width??0;
        return width>0?Math.max(2,Math.min(128,Math.ceil(row.clientWidth/width)+1)):3;
      });
      setCopies(previous=>previous.length===next.length&&previous.every((count,index)=>count===next[index])?previous:next);
    };
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener('resize',measure);
    measure();
    return ()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
  },[rows]);
  useEffect(() => {
    if (!running || !cycleConnections || connections.length < 2) return;
    const timer = window.setTimeout(() => {
      if (phase==='connected') { setIndex(value=>value+1); setPhase('connecting'); }
      else setPhase(phase==='connecting'?'syncing':'connected');
    },phase==='connected'?5000:1300);
    return () => window.clearTimeout(timer);
  },[running,cycleConnections,connections.length,index,phase]);
  const displayedPhase = environment.reduced || !cycleConnections ? 'connected' : phase;
  return <section ref={root} className={`ac-integration-marquee ${className}`.trim()} aria-labelledby={`${uid}-title`} data-running={running}>
    <div className="ac-integration-marquee__header">
      <h2 id={`${uid}-title`}>{title}</h2>
      {connection && <div className="ac-integration-marquee__connection" aria-label={`${connection.name}: ${displayedPhase}`}>
        <span className="ac-integration-marquee__connection-logo" key={connection.id} aria-hidden="true">{connection.logo}</span>
        <span className="ac-integration-marquee__connection-copy"><strong>{connection.name}</strong><span title={connection.detail}>{displayedPhase==='connecting'?'Signing in…':displayedPhase==='syncing'?'Syncing your workspace…':connection.detail}</span></span>
        <span className="ac-integration-marquee__status" data-connected={displayedPhase==='connected'}><svg viewBox="0 0 16 16" fill="none" aria-hidden="true">{displayedPhase==='connected'?<path d="m3 8 3 3 7-7"/>:<path className="ac-integration-marquee__spinner" d="M13 8a5 5 0 1 1-3-4.58"/>}</svg>{displayedPhase==='connected'?'Connected':displayedPhase==='syncing'?'Syncing':'Connecting'}</span>
      </div>}
    </div>
    <div className="ac-integration-marquee__rows">
      {rows.filter(row=>row.length>0).map((row,rowIndex)=><div className="ac-integration-marquee__row" key={rowIndex}>
        <div className="ac-integration-marquee__track" style={{'--ac-integration-copies':copies[rowIndex]??3,'--ac-integration-duration':`${Number.isFinite(durations[rowIndex])?Math.max(20,Math.min(300,durations[rowIndex])):120}s` } as CSSProperties} data-reverse={rowIndex%2===1}>
          {Array.from({length:copies[rowIndex]??3},(_,copy)=>copy).map(copy=><div className="ac-integration-marquee__group" key={copy} aria-hidden={copy>0?true:undefined} role={copy===0?'list':undefined} aria-label={copy===0?`Integration row ${rowIndex+1}`:undefined}>
            {row.map(item=><span className="ac-integration-marquee__tile" key={item.id} title={item.label} role={copy===0?'listitem':undefined}><span role={copy===0?'img':undefined} aria-label={copy===0?item.label:undefined}>{item.logo}</span></span>)}
          </div>)}
        </div>
      </div>)}
    </div>
    {showControls && <div className="ac-integration-marquee__controls"><button type="button" onClick={()=>setHeld(value=>!value)} disabled={paused||environment.reduced} aria-pressed={held||paused}>{environment.reduced?'Motion reduced':held||paused?'Play motion':'Pause motion'}</button></div>}
  </section>;
}
