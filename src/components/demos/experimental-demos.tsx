"use client";

import { useState } from 'react';
import { StickerField } from '@/components/anticraft/StickerField';
import type { StickerFieldItem } from '@/components/anticraft/StickerField';
import { SpineArchive } from '@/components/anticraft/SpineArchive';
import { MorphingStage } from '@/components/anticraft/MorphingStage';
import './experimental-demos.css';

function FlowerSticker() {
  return <svg viewBox="0 0 140 140" aria-hidden="true"><path d="M70 22C89-14 112 8 105 35C141 17 153 50 121 66C160 83 137 112 110 104C124 141 88 151 73 121C57 159 26 137 35 108C-2 126-14 91 20 74C-16 56 7 26 35 35C17 1 52-13 70 22Z" fill="#364af1" stroke="#faf4de" strokeWidth="5"/><circle cx="70" cy="70" r="27" fill="#efeeae"/><path d="M57 68v-7m25 7v-7m-27 19q15 15 30-2" fill="none" stroke="#24251f" strokeWidth="4" strokeLinecap="round"/></svg>;
}

function EyeSticker() {
  return <svg viewBox="0 0 160 114" aria-hidden="true"><path d="M18 44 39 10 67 24 98 9 114 32 146 39 135 68 146 94 106 100 80 90 49 105 30 84 10 69Z" fill="#d9f17d" stroke="#faf4de" strokeWidth="5"/><ellipse cx="63" cy="57" rx="18" ry="25" fill="#faf4de" stroke="#24251f" strokeWidth="2"/><ellipse cx="101" cy="55" rx="18" ry="25" fill="#faf4de" stroke="#24251f" strokeWidth="2"/><ellipse cx="69" cy="60" rx="8" ry="12" fill="#24251f"/><ellipse cx="107" cy="58" rx="8" ry="12" fill="#24251f"/></svg>;
}

const stickers: StickerFieldItem[] = [
  { id: 'happy-flower', label: 'Blue smiley flower', x: .27, y: .35, rotation: -17, width: 128, height: 128, content: <FlowerSticker/> },
  { id: 'curious-eyes', label: 'Curious green eyes', x: .73, y: .35, rotation: 13, width: 145, height: 104, content: <EyeSticker/> },
  { id: 'less-rules', label: 'Less rules, more play note', x: .36, y: .68, rotation: 9, width: 134, height: 91, content: <span className="exp-sticker-note"><small>A NOTE TO SELF ↗</small><b>LESS RULES.<br/>MORE PLAY.</b><span>Anticraft independent press</span></span> },
  { id: 'original', label: 'One hundred percent original stamp', x: .75, y: .71, rotation: -16, width: 104, height: 104, content: <span className="exp-sticker-stamp"><span>INDEPENDENT SPIRIT</span><b>100<sup>%</sup></b><span>ORIGINAL MATERIAL</span></span> },
];

export function StickerFieldDemo() {
  const [reset, setReset] = useState(0);
  return <div className="demo exp-sticker-demo">
    <StickerField items={stickers} resetKey={reset} className="exp-sticker-board">
      <div className="exp-sticker-backdrop" aria-hidden="true"><span className="exp-demo-topline">DESIGN IS A CONTACT SPORT.</span><p>No rules.<br/><em>Just play.</em></p><span className="exp-sticker-cross exp-sticker-cross-a">+</span><span className="exp-sticker-cross exp-sticker-cross-b">+</span></div>
    </StickerField>
    <div className="exp-sticker-footer"><span>Pick one up. Make a little mess.</span><button onClick={() => setReset(value => value + 1)}>Reset collage ↺</button></div>
  </div>;
}

function ArchiveArt({ variant }: { variant: number }) {
  return <svg viewBox="0 0 320 200" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="200" fill={['#283c31', '#44375d', '#4e2924', '#35372b', '#304b72'][variant]}/>
    {variant === 0 && <g stroke="#e7f2b4" strokeWidth="2"><circle cx="160" cy="100" r="66"/><circle cx="160" cy="100" r="47"/><circle cx="160" cy="100" r="28"/>{Array.from({length:16},(_,i)=><path key={i} d="M160 22V68M160 132V178" transform={`rotate(${i*11.25} 160 100)`}/>)}</g>}
    {variant === 1 && <g fill="#d6c1fa">{Array.from({length:6},(_,i)=><ellipse key={i} cx={85+i*30} cy="100" rx="45" ry="77" transform={`rotate(${i*12-30} ${85+i*30} 100)`}/>)}</g>}
    {variant === 2 && <g stroke="#ff8056" strokeWidth="9">{Array.from({length:8},(_,i)=><path key={i} d={`M-15 ${i*26-40} Q70 ${i*26+40} 160 ${i*26} T335 ${i*26+20}`}/>)}</g>}
    {variant === 3 && <g fill="#f1e9d6"><path d="m160 17 22 51 54-20-20 52 50 22-54 14 5 56-47-31-40 37-5-58-56-7 49-29-28-48 53 15Z"/><circle cx="160" cy="108" r="19" fill="currentColor"/></g>}
    {variant === 4 && <g stroke="#cbdcfa" strokeWidth="2">{Array.from({length:10},(_,i)=><ellipse key={i} cx="160" cy={45+i*13} rx={100-i*5} ry="27"/>)}</g>}
    <path d="M14 14h12M14 14v12m292-12h-12m12 0v12M14 186h12m-12 0v-12m292 12h-12m12 0v-12" stroke="#ffffff70"/>
  </svg>;
}

const archiveItems = [
  { id: 'off-hours', title: 'Off Hours', year: '2026', category: 'After-dark experiments', color: '#dbeaa5', foreground: '#283c31', artwork: <ArchiveArt variant={0}/>, description: 'Good ideas rarely keep office hours.' },
  { id: 'soft-signal', title: 'Soft Signal', year: '2025', category: 'Visual identity', color: '#d6c1fa', foreground: '#44375d', artwork: <ArchiveArt variant={1}/>, description: 'A different frequency. A softer kind of noise.' },
  { id: 'future-memory', title: 'Future Memory', year: '2025', category: 'Moving images', color: '#f17c55', foreground: '#4e2924', artwork: <ArchiveArt variant={2}/>, description: 'A little nostalgia from a place we haven’t been.' },
  { id: 'wild-type', title: 'Wild Type', year: '2024', category: 'Type in motion', color: '#eee6d3', foreground: '#35372b', artwork: <ArchiveArt variant={3}/>, description: 'Letters with a mind of their own.' },
  { id: 'slow-radio', title: 'Slow Radio', year: '2024', category: 'Sound & vision', color: '#bfcfee', foreground: '#304b72', artwork: <ArchiveArt variant={4}/>, description: 'Tune out the rush. Tune into something good.' },
  { id: 'open-circuit', title: 'Open Circuit', year: '2023', category: 'Digital playground', color: '#e9b5a2', foreground: '#3f3330', artwork: <ArchiveArt variant={0}/>, description: 'Connect the unexpected. Follow the spark.' },
  { id: 'odd-company', title: 'Odd Company', year: '2023', category: 'Independent culture', color: '#dacdec', foreground: '#433353', artwork: <ArchiveArt variant={3}/>, description: 'A gathering of beautifully different minds.' },
  { id: 'paper-planets', title: 'Paper Planets', year: '2022', category: 'Printed matter', color: '#ddd8b4', foreground: '#3e4930', artwork: <ArchiveArt variant={4}/>, description: 'Small worlds. Endless ways to see them.' },
];

export function SpineArchiveDemo() {
  return <div className="demo exp-archive-demo"><SpineArchive items={archiveItems} defaultValue="off-hours"/></div>;
}

function FormatArtwork({ variant }: { variant: number }) {
  return <div className={`exp-format-art exp-format-art-${variant}`} aria-hidden="true">
    <span className="exp-format-meta">ANTICRAFT EXPERIMENTS<br/>STUDIES IN SHAPE / 0{variant+1}</span>
    <div className="exp-format-symbol">{variant === 0 ? <svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" strokeWidth="1.4">{Array.from({length:10},(_,i)=><ellipse key={i} cx="100" cy="100" rx={20+i*7} ry="87" transform={`rotate(${i*18} 100 100)`}/>)}</g></svg> : variant === 1 ? <div className="exp-format-ribbons">{Array.from({length:8},(_,i)=><i key={i}/>)}</div> : variant === 2 ? <svg viewBox="0 0 200 200"><path fill="currentColor" d="m100 2 12 61 43-44-22 58 62-7-51 36 53 33-62-4 24 57-45-42-10 62-16-60-41 47 18-60-61 12 48-40-55-28 62-2-30-54 49 36Z"/></svg> : <svg viewBox="0 0 200 200"><g fill="none" stroke="currentColor" strokeWidth="2">{Array.from({length:11},(_,i)=><rect key={i} x={24+i*5} y={24+i*5} width={152-i*10} height={152-i*10} rx={76-i*5} transform={`rotate(${i*9} 100 100)`}/>)}</g></svg>}</div>
    <strong>{['TAKE\nSHAPE.', 'THINK\nWIDER.', 'COME\nAROUND.', 'STAY\nOPEN.'][variant].split('\n').map(word=><span key={word}>{word}</span>)}</strong>
    <span className="exp-format-bottom">FORM IS A FEELING. ↗</span>
  </div>;
}

const formatFrames = [
  { id: 'portrait', title: 'A different perspective.', kicker: '01 / PORTRAIT', description: 'Every idea starts with a frame.', format: 'portrait' as const, color: '#e97850', content: <FormatArtwork variant={0}/> },
  { id: 'landscape', title: 'Room to think wider.', kicker: '02 / LANDSCAPE', description: 'Let the boundaries move with the story.', format: 'landscape' as const, color: '#324bdc', content: <FormatArtwork variant={1}/> },
  { id: 'circle', title: 'Come full circle.', kicker: '03 / CIRCLE', description: 'A new shape changes the whole feeling.', format: 'circle' as const, color: '#deed8e', content: <FormatArtwork variant={2}/> },
  { id: 'arch', title: 'Leave something open.', kicker: '04 / ARCH', description: 'The next possibility is yours to imagine.', format: 'arch' as const, color: '#c5b6e4', content: <FormatArtwork variant={3}/> },
];

export function MorphingStageDemo() {
  return <div className="demo exp-morph-demo"><MorphingStage frames={formatFrames}/></div>;
}
