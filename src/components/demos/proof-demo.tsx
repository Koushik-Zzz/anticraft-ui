'use client';

import { TestimonialSlider } from '@/components/anticraft/TestimonialSlider';
import { PortraitArt } from './practical-art';
import './proof-demo.css';

export function TestimonialSliderDemo() {
  return (
    <div className="demo practical-demo proof-demo">
      <span className="proof-demo-kicker">EXAMPLE CLIENT STORIES</span>
      <TestimonialSlider
        title="Real words. Better work."
        items={[
          { id: 'kin', name: 'Mira Patel', role: 'Founder', company: 'KIN', portrait: <PortraitArt variant={0} />, quote: 'Customers can find the right bag and see the details that matter. The storefront finally feels as considered as the products.' },
          { id: 'folio', name: 'Daniel Park', role: 'Product lead', company: 'Folio', portrait: <PortraitArt variant={1} />, quote: 'A complicated product became a clear first impression. Every feature has a purpose, and our team can tell the story.' },
          { id: 'forma', name: 'Sofia Reed', role: 'Creative director', company: 'Forma', portrait: <PortraitArt variant={2} />, quote: 'People can compare our spaces and book a visit without getting lost. The site tells our story with much more confidence.' },
        ]}
      />
      <p className="proof-demo-note">Browse three example client stories.</p>
    </div>
  );
}
