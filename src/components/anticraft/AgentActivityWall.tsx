'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import './agent-activity-wall.css';

export interface AgentActivityItem {
  id: string;
  name: string;
  role: string;
  initial?: string;
  mention?: string;
  request: string;
  response: string;
  color: string;
  mentionColor?: string;
  avatar?: ReactNode;
  tools?: { id:string; label:string; logo:ReactNode }[];
}
export interface AgentActivityWallProps {
  columns: AgentActivityItem[][];
  title?: ReactNode;
  durations?: number[];
  paused?: boolean;
  showControls?: boolean;
  className?: string;
}

/** Opposing vertical streams of requests and completed work, with a static accessible copy. */
export function AgentActivityWall({ columns, title='Put everyday work in motion.', durations=[64,76,70], paused=false, showControls=true, className='' }: AgentActivityWallProps) {
  const uid = useId();
  const root = useRef<HTMLElement>(null);
  const [held,setHeld] = useState(false);
  const [copies,setCopies] = useState<number[]>([]);
  const [environment,setEnvironment] = useState({ visible:false,hidden:false,reduced:false });
  useEffect(()=>{
    const element=root.current;
    if (!element) return;
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    let visible=typeof IntersectionObserver==='undefined';
    const sync=()=>setEnvironment({ visible,hidden:document.hidden,reduced:media.matches });
    const observer=typeof IntersectionObserver==='undefined'?null:new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting;sync(); });
    observer?.observe(element);
    media.addEventListener('change',sync);
    document.addEventListener('visibilitychange',sync);
    sync();
    return ()=>{observer?.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync);};
  },[]);
  useEffect(()=>{
    const element=root.current;
    if (!element) return;
    const measure=()=>{
      const viewport=element.querySelector<HTMLElement>('.ac-agent-wall__window');
      const next=Array.from(element.querySelectorAll<HTMLElement>('.ac-agent-wall__column')).map(column=>{
        const height=column.querySelector<HTMLElement>('.ac-agent-wall__group')?.getBoundingClientRect().height??0;
        return height>0?Math.max(2,Math.min(32,Math.ceil((viewport?.clientHeight??600)/height)+1)):2;
      });
      setCopies(previous=>previous.length===next.length&&previous.every((count,index)=>count===next[index])?previous:next);
    };
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(measure);
    observer?.observe(element);
    element.querySelectorAll('.ac-agent-wall__group').forEach(group=>observer?.observe(group));
    window.addEventListener('resize',measure);
    measure();
    return ()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
  },[columns]);
  const running=environment.visible&&!environment.hidden&&!environment.reduced&&!paused&&!held;
  function card(item:AgentActivityItem,copy:number) {
    return <figure className="ac-agent-wall__card" key={item.id} style={{'--ac-agent-color':item.color,'--ac-agent-mention':item.mentionColor??'#342c47'} as CSSProperties}>
      <figcaption><span className="ac-agent-wall__initial">{item.initial??item.name.slice(0,1)}</span><span className="ac-agent-wall__name">{item.name}</span><span className="ac-agent-wall__role">{item.role}</span></figcaption>
      <blockquote><span className="ac-agent-wall__mention">{item.mention??'@Agent'}</span>{' '}{item.request}</blockquote>
      <div className="ac-agent-wall__result"><span className="ac-agent-wall__avatar" aria-hidden="true">{item.avatar??<svg viewBox="0 0 24 24" fill="none"><path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</span><p>{item.response}</p>{item.tools&&item.tools.length>0&&<span className="ac-agent-wall__tools">{item.tools.map(tool=><span key={tool.id} className="ac-agent-wall__tool" title={tool.label} role={copy===0?'img':undefined} aria-label={copy===0?tool.label:undefined}>{tool.logo}</span>)}</span>}</div>
    </figure>;
  }
  return <section ref={root} className={`ac-agent-wall ${className}`.trim()} aria-labelledby={`${uid}-title`} data-running={running}>
    <div className="ac-agent-wall__header"><h2 id={`${uid}-title`}>{title}</h2></div>
    <div className="ac-agent-wall__window" role="region" aria-label="Agent activity examples" tabIndex={environment.reduced?0:undefined}>
      {columns.filter(column=>column.length>0).slice(0,3).map((column,index)=><div className="ac-agent-wall__column" key={index}>
        <div className="ac-agent-wall__track" data-reverse={index%2===1} style={{'--ac-agent-copies':copies[index]??2,'--ac-agent-duration':`${Number.isFinite(durations[index])?Math.max(20,Math.min(300,durations[index])):64}s`} as CSSProperties}>
          {Array.from({length:copies[index]??2},(_,copy)=>copy).map(copy=><div className="ac-agent-wall__group" key={copy} aria-hidden={copy>0?true:undefined}>{column.map(item=>card(item,copy))}</div>)}
        </div>
      </div>)}
    </div>
    {showControls&&<div className="ac-agent-wall__controls"><button type="button" onClick={()=>setHeld(value=>!value)} disabled={paused||environment.reduced} aria-pressed={held||paused}>{environment.reduced?'Motion reduced':held||paused?'Play motion':'Pause motion'}</button></div>}
  </section>;
}
