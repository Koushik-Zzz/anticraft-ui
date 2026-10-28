'use client';

import { ExpandableGallery } from '@/components/anticraft/ExpandableGallery';
import './expandable-gallery-demo.css';

export function ExpandableGalleryDemo() {
  return <div className="demo practical-demo expandable-gallery-demo">
    <ExpandableGallery
      items={[
        { id: 'hearth', title: 'Hearth House', meta: 'Residential architecture · 2026', src: '/images/demos/forma-house.webp', alt: 'A cantilevered concrete house above a sunlit Mediterranean coast', imagePosition: '57% 50%', href: '/images/demos/forma-house.webp', linkLabel: 'Open the Hearth House image' },
        { id: 'headland', title: 'Headland Retreat', meta: 'Coastal hospitality · 2026', src: '/images/demos/atlas-coast.webp', alt: 'A timber retreat on a green headland overlooking the ocean', imagePosition: '72% 50%', href: '/images/demos/atlas-coast.webp', linkLabel: 'Open the Headland Retreat image' },
        { id: 'terrace', title: 'The Living Edge', meta: 'Hearth House · Terrace detail', src: '/images/demos/forma-house.webp', alt: 'The sheltered terrace beneath the glazed living space of Hearth House', imagePosition: '86% 66%', href: '/images/demos/forma-house.webp', linkLabel: 'Open the Living Edge image' },
      ]}
    />
  </div>;
}
