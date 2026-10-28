"use client";

import { PeelReveal } from '@/components/anticraft/PeelReveal';
import { OrbitGallery } from '@/components/anticraft/OrbitGallery';
import { LenticularPanel } from '@/components/anticraft/LenticularPanel';
import './object-demos.css';

function PeelFront() {
  return <span className="obj-peel-front"><span className="obj-peel-top"><span>ANTICRAFT INDEPENDENT PRESS</span><span>NO. 003</span></span><span className="obj-peel-asterisk" aria-hidden="true">✳</span><strong>PAPER<br/>WITH<br/><em>a secret.</em></strong><span className="obj-peel-foot">THERE’S ALWAYS ANOTHER SIDE. ↘</span></span>;
}

export function PeelRevealDemo() {
  return <div className="demo obj-peel-demo"><PeelReveal front={<PeelFront/>} label="Peel to discover the other side"><div className="obj-peel-secret"><span>A LITTLE CURIOSITY PAYS OFF.</span><svg viewBox="0 0 200 125" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.5">{Array.from({length:9},(_,i)=><ellipse key={i} cx="100" cy="63" rx={18+i*7} ry="48" transform={`rotate(${i*20} 100 63)`}/>)}</g></svg><h3>There’s more<br/><em>to the story.</em></h3><p>An alternate print, revealed one corner at a time.</p><a href="https://github.com/Koushik-Zzz/anticraft-ui" target="_blank" rel="noreferrer">Keep exploring ↗</a></div></PeelReveal></div>;
}

function OrbitPoster({ variant }: { variant: number }) {
  const colors = ['#ed8957', '#cbdc90', '#b5c7ea', '#d4b0de', '#e4d9bc'];
  const ink = ['#3d3223', '#34432a', '#253d69', '#4b315c', '#514431'][variant];
  return <svg viewBox="0 0 240 300" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
    <rect width="240" height="300" fill={colors[variant]}/>
    <g fill={ink} fontFamily="Arial, sans-serif"><text x="18" y="24" fontSize="6" letterSpacing="1">ANTICRAFT / OBJECT STUDIES</text><text x="222" y="24" textAnchor="end" fontSize="6">0{variant+1}</text></g>
    <g stroke={ink} fill="none" strokeWidth="1.4">
      {variant === 0 && Array.from({length:12},(_,i)=><ellipse key={i} cx="120" cy="127" rx="75" ry={12+i*5.8} transform={`rotate(${i*15} 120 127)`}/>)}
      {variant === 1 && Array.from({length:7},(_,i)=><rect key={i} x={39+i*9} y={49+i*9} width={162-i*18} height={162-i*18} rx="9" transform={`rotate(${i*7} 120 130)`}/>)}
      {variant === 2 && Array.from({length:12},(_,i)=><path key={i} d={`M32 ${i*12+54}Q92 ${i*12+4} 133 ${i*12+54}T237 ${i*12+54}`}/>)}
      {variant === 3 && Array.from({length:10},(_,i)=><ellipse key={i} cx={76+i*10} cy="126" rx="25" ry="80" transform={`rotate(${i*9-40} ${76+i*10} 126)`}/>)}
      {variant === 4 && Array.from({length:10},(_,i)=><circle key={i} cx="120" cy="129" r={10+i*8}/>)}
    </g>
    <g fill={ink} fontFamily="Arial, sans-serif" fontWeight="800" fontSize="31" letterSpacing="-1.8"><text x="18" y="245">{['SOLAR', 'PARALLEL', 'BLUE', 'DAYDREAM', 'AFTER'][variant]}</text><text x="18" y="272">{['STUDIES', 'PLAY', 'HOUR', 'FM', 'IMAGE'][variant]}</text></g>
    <path d="M18 285h204" stroke={ink} strokeWidth=".5"/>
  </svg>;
}

const orbitItems = [
  { id: 'solar', title: 'Solar Studies', subtitle: 'Art direction / 2026', color: '#ed8957', content: <OrbitPoster variant={0}/> },
  { id: 'parallel', title: 'Parallel Play', subtitle: 'Visual identity / 2026', color: '#cbdc90', content: <OrbitPoster variant={1}/> },
  { id: 'blue', title: 'Blue Hour', subtitle: 'Printed matter / 2025', color: '#b5c7ea', content: <OrbitPoster variant={2}/> },
  { id: 'daydream', title: 'Daydream FM', subtitle: 'Sound & vision / 2025', color: '#d4b0de', content: <OrbitPoster variant={3}/> },
  { id: 'after-image', title: 'After Image', subtitle: 'Moving images / 2024', color: '#e4d9bc', content: <OrbitPoster variant={4}/> },
];

export function OrbitGalleryDemo() {
  return <div className="demo obj-orbit-demo"><OrbitGallery items={orbitItems} defaultValue="solar"/></div>;
}

function LightPrint({ night = false }: { night?: boolean }) {
  return <svg viewBox="0 0 600 400" aria-hidden="true" preserveAspectRatio="xMidYMid meet" style={{ background: night ? '#28377f' : '#ef8b58' }}>
    <rect width="600" height="400" fill={night ? '#28377f' : '#ef8b58'}/>
    <g fill="none" stroke={night ? '#7085ba' : '#c1603c'} strokeWidth="1">{Array.from({length:14},(_,i)=><path key={i} d={`M${i*70-300} 400 600 ${i*45-100}`}/>)}</g>
    {night ? <><circle cx="361" cy="162" r="109" fill="#eee2b3"/><circle cx="404" cy="131" r="100" fill="#28377f"/><g fill="#eee2b3">{[[89,103],[172,186],[466,268],[527,85],[112,287],[240,62]].map(([x,y],i)=><path key={i} d={`M${x} ${y-6}v12m-6-6h12`} stroke="#eee2b3" strokeWidth="1.5"/>)}</g></> : <><circle cx="324" cy="160" r="97" fill="#f4d87e"/><g stroke="#f4d87e" strokeWidth="3">{Array.from({length:18},(_,i)=><path key={i} d="M324 33V14M324 287v19" transform={`rotate(${i*10} 324 160)`}/>)}</g></>}
    <g fill={night ? '#eee2b3' : '#52382a'} fontFamily="Arial, sans-serif"><text x="28" y="33" fontSize="10" letterSpacing="2">ANTICRAFT EDITIONS / {night ? 'AFTER DARK' : 'DAYLIGHT STUDY'}</text><text x="28" y="344" fontSize={night ? '92' : '114'} fontWeight="800" letterSpacing="-7">{night ? 'NIGHT SHIFT.' : 'SUNRISE.'}</text><text x="31" y="374" fontSize="9" letterSpacing="2">A CHANGE OF ANGLE. A WHOLE NEW FEELING.</text></g>
  </svg>;
}

export function LenticularPanelDemo() {
  return <div className="demo obj-lenticular-demo"><LenticularPanel front={<LightPrint/>} back={<LightPrint night/>} frontLabel="Sunrise" backLabel="Night Shift" segments={12}/></div>;
}
