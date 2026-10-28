"use client";

import { ScratchReveal } from '@/components/anticraft/ScratchReveal';
import { PixelSwap } from '@/components/anticraft/PixelSwap';
import { RippleField } from '@/components/anticraft/RippleField';
import { BeforeAfter } from '@/components/anticraft/BeforeAfter';
import { BagArt } from './practical-art';
import './sensory-demos.css';

function Flower({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 200 200" fill="currentColor" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="100" cy="56" rx="19" ry="47" transform={`rotate(${i * 30} 100 100)`}/>)}<circle cx="100" cy="100" r="29" fill="#3b3b2d"/><path d="M88 100q12 15 24 0" stroke="#f3f0b8" strokeWidth="3" fill="none"/><circle cx="90" cy="91" r="2" fill="#f3f0b8"/><circle cx="110" cy="91" r="2" fill="#f3f0b8"/></svg>;
}

export function ScratchRevealDemo() {
  return <div className="demo sense-scratch-demo"><ScratchReveal label="Scratch the studio lucky card" coverColor="#90aaa0" coverText="GO ON. MAKE A LITTLE MARK."><div className="sense-scratch-prize"><div className="sense-print-top"><span>ANTICRAFT LUCKY CLUB</span><span>NO. 028</span></div><Flower className="sense-lucky-flower"/><h3>Lucky<br/><em>you.</em></h3><p>A LITTLE LUCK, UNCOVERED.</p><span className="sense-print-edition">NO PRIZE NECESSARY. JUST A LITTLE CURIOSITY.</span></div></ScratchReveal></div>;
}

function PixelPrint({ back = false }: { back?: boolean }) {
  return <div className={`sense-product-view${back ? ' sense-product-view-inside' : ''}`}><div className="sense-print-top"><span>KIN. EVERYDAY ESSENTIALS</span><span>{back ? '02 / INTERIOR' : '01 / EXTERIOR'}</span></div><div className="sense-product-bag"><BagArt inside={back}/></div><div className="sense-product-caption"><h3>The Everyday Tote</h3><p>{back ? 'Everything in its own place.' : 'A little room for the everyday.'}</p><span>{back ? 'TWO INNER POCKETS · COTTON LINING' : 'NATURAL CANVAS · BUILT TO STAY'}</span></div></div>;
}

export function PixelSwapDemo() {
  return <div className="demo sense-pixel-demo"><PixelSwap front={<PixelPrint/>} back={<PixelPrint back/>} frontLabel="Exterior view" backLabel="Inside the bag" buttonLabel="Change product view" columns={8} rows={6}/></div>;
}

export function RippleFieldDemo() {
  return <div className="demo sense-ripple-demo"><RippleField color="#8ec9df" label="Blue hour ripple field"><div className="sense-ripple-copy"><div className="sense-print-top"><span>BLUE HOUR / FIELD STUDY 006</span><span>≈</span></div><span className="sense-ripple-coordinate">38° 42′ N<br/>A MOMENT OF STILLNESS</span><h3>Go with<br/><em>the flow.</em></h3><p>A small movement can change everything.</p></div></RippleField></div>;
}

function PerspectivePrint({ sketch = false }: { sketch?: boolean }) {
  const ink = sketch ? '#626956' : '#e7f197';
  return <svg viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="sense-perspective-print"><rect width="600" height="450" fill={sketch ? '#e4e3d5' : '#3945ab'}/><g stroke={sketch ? '#b7bcab' : '#5a65be'} strokeWidth=".7">{Array.from({length:14},(_,i)=><path key={i} d={`M${i*50-50} 0v450M0 ${i*40}h600`}/>)}</g><g stroke={ink} strokeWidth={sketch ? '1.5' : '0'} fill={sketch ? 'none' : '#c5ccea'}><path d="m300 67 134 77-134 77-134-77Z"/><path d="m166 144 134 77v125l-134-77Z" fill={sketch ? 'none' : '#a4b8dd'}/><path d="m300 221 134-77v125l-134 77Z" fill={sketch ? 'none' : '#e7f197'}/></g><g fill="none" stroke={sketch ? '#a6ac99' : '#8a97d1'} strokeWidth="1"><path d="M132 131 300 34l168 97M132 131v159l168 97 168-97V131M300 34v353" strokeDasharray="4 5"/><circle cx="300" cy="202" r="175"/></g><g fill={ink} fontFamily="Arial, sans-serif"><text x="28" y="31" fontSize="9" letterSpacing="1.5">ANTICRAFT / A CHANGE OF PERSPECTIVE</text><text x="28" y="398" fontSize="42" fontWeight="700" letterSpacing="-2">VOLUME FROM A LINE.</text><text x="30" y="426" fontSize="8" letterSpacing="1.5">{sketch ? '01 / THE FIRST THOUGHT' : '02 / THE BRIGHTER PICTURE'}</text></g></svg>;
}

export function BeforeAfterDemo() {
  return <div className="demo sense-compare-demo"><BeforeAfter before={<PerspectivePrint sketch/>} after={<PerspectivePrint/>} beforeLabel="The sketch" afterLabel="In full color" defaultValue={50}/></div>;
}
