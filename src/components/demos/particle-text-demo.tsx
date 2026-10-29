'use client';

import { ParticleText } from '../anticraft/ParticleText';
import './particle-text-demo.css';

const verticalGrid = Array.from({ length: 35 }, (_, index) => {
  const x = index * 40 - 80;
  const bend = (x - 600) * .18;
  return `M${x} -40 C${x} 68 ${x + bend} 130 ${x + bend} 260 S${x} 452 ${x} 560`;
});

const horizontalGrid = Array.from({ length: 17 }, (_, index) => {
  const y = index * 40 - 60;
  const bend = (y - 260) * .22;
  return `M-80 ${y} C160 ${y} 280 ${y + bend} 600 ${y + bend} S1040 ${y} 1280 ${y}`;
});

export function ParticleTextDemo({ paused = false }: { paused?: boolean }) {
  return <div className="demo particle-text-demo">
    <svg className="particle-text-demo__grid" viewBox="0 0 1200 520" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
      <g>{verticalGrid.map((path, index) => <path key={`v-${index}`} d={path}/>)}{horizontalGrid.map((path, index) => <path key={`h-${index}`} d={path}/>)}</g>
    </svg>
    <div className="particle-text-demo__content">
      <p className="particle-text-demo__lead">Build with</p>
      <ParticleText text="Anticraft." as="h2" fontSize={180} duration={4.2} particleCount={3200} paused={paused}/>
      <div className="particle-text-demo__actions">
        <a href="/components">Browse components <span aria-hidden="true">↗</span></a>
        <a href="/docs/installation">Installation <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </div>;
}
