'use client';

import { ImageHotspots } from '@/components/anticraft/ImageHotspots';
import './image-hotspots-demo.css';

const materials = [
  { id: 'concrete', label: 'Concrete shell', x: 0.51, y: 0.38, description: 'Board-formed concrete preserves the grain and joins of its timber mould.' },
  { id: 'glazing', label: 'Recessed glazing', x: 0.72, y: 0.47, description: 'The deep reveal shades the interior while keeping an uninterrupted view of the coast.' },
  { id: 'stone', label: 'Local stone', x: 0.9, y: 0.67, description: 'Dry-stacked stone ties the terrace to the colour and texture of the surrounding hillside.' },
];

export function ImageHotspotsDemo() {
  return <div className="demo practical-demo image-hotspots-demo">
    <div className="image-hotspots-demo-content">
      <header className="image-hotspots-demo-heading"><h2>Material study</h2><span>Select a point to inspect</span></header>
      <ImageHotspots
        image="/images/demos/forma-house.webp"
        alt="Coastal house with a rectangular concrete upper floor, recessed panoramic glazing, and a stone terrace"
        items={materials}
        defaultActiveId="concrete"
      />
    </div>
  </div>;
}
