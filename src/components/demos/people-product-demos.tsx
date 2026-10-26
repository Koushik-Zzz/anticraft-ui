'use client';

import { ProductGallery } from '@/components/anticraft/ProductGallery';
import { TeamGrid } from '@/components/anticraft/TeamGrid';
import { PortraitArt } from './practical-art';
import './people-product-demos.css';

export function ProductGalleryDemo() {
  return <div className="demo practical-demo product-gallery-demo"><p className="people-product-kicker">KIN / EDITION 01 · NATURAL CANVAS</p><ProductGallery title="The Everyday Tote" items={[
    { id: 'front', src: '/images/demos/tote-front.svg', alt: 'Natural canvas Everyday Tote exterior', caption: '01 — A little less to carry. A little more to keep.' },
    { id: 'interior', src: '/images/demos/tote-interior.svg', alt: 'Interior with two pockets', caption: '02 — Two inside pockets. Everything in its place.' },
    { id: 'detail', src: '/images/demos/tote-detail.svg', alt: 'Canvas stitch and label detail', caption: '03 — Natural canvas. Considered down to the stitch.' },
    { id: 'side', src: '/images/demos/tote-side.svg', alt: 'Side profile and strap', caption: '04 — A generous shape. Ready for the everyday.' },
  ]}/></div>;
}

export function TeamGridDemo() {
  return <div className="demo practical-demo team-grid-demo"><p className="people-product-kicker">EXAMPLE STUDIO TEAM</p><TeamGrid title="A few good people." items={[
    { id: 'mira', name: 'Mira Patel', role: 'Strategy & direction', portrait: <PortraitArt variant={0}/>, bio: 'Mira helps teams find the clearest version of their story. She brings audience research, thoughtful questions, and a practical plan to every new project.\n\nBefore a design takes shape, she works with clients to understand the people it needs to serve. Her work connects a brand’s ambition to the decisions a visitor makes on a real website.' },
    { id: 'daniel', name: 'Daniel Park', role: 'Product & design', portrait: <PortraitArt variant={1}/>, bio: 'Daniel turns complex ideas into calm, useful experiences. His work moves between visual systems, product details, and the everyday paths people take through a website.\n\nHe cares about clear hierarchy, strong typography, and giving the content room to do its job. He works closely with engineers so that the finished product feels as considered as the first design.' },
    { id: 'sofia', name: 'Sofia Reed', role: 'Creative engineering', portrait: <PortraitArt variant={2}/>, bio: 'Sofia brings ideas to life through accessible, resilient interfaces. She builds the details that make a site feel responsive, from image galleries to well-labeled forms.\n\nHer approach starts with a useful foundation, then adds motion where it helps someone understand a change. She makes sure the experience works just as well with a keyboard, on a phone, and at a slower connection.' },
  ]}/></div>;
}
