'use client';

import { ParticleText, ParticleTextGrid } from '../anticraft/ParticleText';
import './particle-text-demo.css';

export function ParticleTextDemo({ paused = false }: { paused?: boolean }) {
  return <ParticleTextGrid className="demo particle-text-demo" paused={paused}>
    <div className="particle-text-demo__content">
      <p className="particle-text-demo__lead">Build with</p>
      <ParticleText text="Anticraft." as="h2" fontSize={180} duration={4.2} particleCount={3200} paused={paused}/>
      <div className="particle-text-demo__actions">
        <a href="/components">Browse components <span aria-hidden="true">↗</span></a>
        <a href="/docs/installation">Installation <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </ParticleTextGrid>;
}
