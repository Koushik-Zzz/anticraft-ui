"use client";

import { useState } from 'react';
import { CursorTrail } from '@/components/anticraft/CursorTrail';
import { ThrowStack } from '@/components/anticraft/ThrowStack';
import { ElasticType } from '@/components/anticraft/ElasticType';
import './play-demos.css';

function PlayPrint({ variant }: { variant: number }) {
  const paper = ['#c3afe2', '#d5e491', '#ec9666', '#b7cce1', '#eadfae'][variant];
  const ink = ['#44315c', '#34462c', '#4f3226', '#2d4264', '#4e4530'][variant];
  const words = [['BIG', 'IDEAS.'], ['SMALL', 'WONDERS.'], ['WILD', 'THOUGHTS.'], ['TIDAL', 'RHYTHMS.'], ['ODD', 'DELIGHTS.']][variant];
  return <svg viewBox="0 0 220 280" aria-hidden="true" preserveAspectRatio="xMidYMid meet" style={{background:paper}}>
    <rect width="220" height="280" fill={paper}/>
    <g fill={ink} fontFamily="Arial, sans-serif"><text x="16" y="22" fontSize="6" letterSpacing=".7">ANTICRAFT / INDEPENDENT EDITIONS</text><text x="16" y="264" fontSize="6" letterSpacing="1">NO SMALL IDEAS. JUST NEW ONES. ↗</text></g>
    <g stroke={ink} fill="none" strokeWidth="1.5">
      {variant === 0 && Array.from({length:12},(_,i)=><ellipse key={i} cx="110" cy="117" rx="68" ry={12+i*4.8} transform={`rotate(${i*15} 110 117)`}/>)}
      {variant === 1 && Array.from({length:10},(_,i)=><rect key={i} x={44+i*5.5} y={49+i*5.5} width={132-i*11} height={132-i*11} rx={66-i*5.5} transform={`rotate(${i*11} 110 115)`}/>)}
      {variant === 2 && <>{Array.from({length:14},(_,i)=><path key={i} d="M110 45v44m0 52v44" transform={`rotate(${i*12.85} 110 115)`}/>)}<circle cx="110" cy="115" r="23"/></>}
      {variant === 3 && Array.from({length:10},(_,i)=><path key={i} d={`M20 ${i*12+55}Q64 ${i*12+9} 110 ${i*12+55}T200 ${i*12+55}`}/>)}
      {variant === 4 && Array.from({length:8},(_,i)=><ellipse key={i} cx={67+i*12} cy="115" rx="25" ry="67" transform={`rotate(${i*12-42} ${67+i*12} 115)`}/>)}
    </g>
    <g fill={ink} fontFamily="Arial, sans-serif" fontSize="29" letterSpacing="-1.6" fontWeight="800"><text x="16" y="218">{words[0]}</text><text x="16" y="245">{words[1]}</text></g>
  </svg>;
}

const prints = [
  { id: 'big-ideas', title: 'Big Ideas', subtitle: 'Independent editions / 01', color: '#c3afe2', content: <PlayPrint variant={0}/> },
  { id: 'small-wonders', title: 'Small Wonders', subtitle: 'Independent editions / 02', color: '#d5e491', content: <PlayPrint variant={1}/> },
  { id: 'wild-thoughts', title: 'Wild Thoughts', subtitle: 'Independent editions / 03', color: '#ec9666', content: <PlayPrint variant={2}/> },
  { id: 'tidal-rhythms', title: 'Tidal Rhythms', subtitle: 'Independent editions / 04', color: '#b7cce1', content: <PlayPrint variant={3}/> },
  { id: 'odd-delights', title: 'Odd Delights', subtitle: 'Independent editions / 05', color: '#eadfae', content: <PlayPrint variant={4}/> },
];

export function CursorTrailDemo() {
  return <div className="demo play-trail-demo"><CursorTrail items={prints.map(({id,title,content})=>({id,label:title,content}))} lifetime={1800} spacing={55}><div className="play-trail-backdrop"><span>LEAVE THE ORDINARY BEHIND.</span><p>Make a<br/><em>little scene.</em></p><div className="play-trail-coordinate play-trail-coordinate-a">+<small>01 / X</small></div><div className="play-trail-coordinate play-trail-coordinate-b">+<small>02 / Y</small></div><span className="play-trail-note">MOVE TO SCATTER THE PRINT COLLECTION.</span></div></CursorTrail></div>;
}

export function ThrowStackDemo() {
  return <div className="demo play-stack-demo"><ThrowStack items={prints}/></div>;
}

export function ElasticTypeDemo() {
  const [strength, setStrength] = useState(1);
  return <div className="demo play-type-demo"><span className="play-type-eyebrow">A LITTLE GIVE. A LOT OF CHARACTER.</span><div className="play-type-words"><ElasticType text="MAKE" className="play-type-word" strength={strength}/><ElasticType text="WAVES." className="play-type-word play-type-outline" strength={strength}/></div><div className="play-type-footer"><span>Move close. Feel the stretch.</span><div role="group" aria-label="Typography intensity">{['Calm','Playful','Wild'].map((name,index)=><button key={name} aria-pressed={strength===index} onClick={()=>setStrength(index)}>{name}</button>)}</div></div></div>;
}
