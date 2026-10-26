'use client';

import { ServiceShowcase } from '@/components/anticraft/ServiceShowcase';
import { ArticleRail } from '@/components/anticraft/ArticleRail';
import { DemoStory, ProjectArt } from './practical-art';
import './content-demos.css';

export function ServiceShowcaseDemo() {
  return <DemoStory><div className="demo practical-demo service-showcase-demo"><ServiceShowcase title="Good ideas. Built together." defaultValue="strategy" items={[
    { id: 'strategy', title: 'Strategy', description: 'Find the clearest expression of who you are, what you do, and why it matters to the people you want to reach.', capabilities: ['Positioning', 'Audience insight', 'Brand narrative'], media: <ProjectArt variant="kin"/>, href: '#demo-story-kin', linkLabel: 'See the Kin story' },
    { id: 'design', title: 'Digital design', description: 'Turn a clear story into a useful experience. Distinctive websites and products that feel considered at every step.', capabilities: ['Website design', 'User experience', 'Design systems'], media: <ProjectArt variant="folio"/>, href: '#demo-story-folio', linkLabel: 'Explore Folio' },
    { id: 'development', title: 'Development', description: 'Bring the details to life with fast, accessible websites that your team can keep growing long after launch.', capabilities: ['Creative development', 'CMS integration', 'Accessibility'], media: <ProjectArt variant="forma"/>, href: '#demo-story-forma', linkLabel: 'Meet Forma' },
  ]}/><p className="content-demo-caption">Choose a service to see what’s included.</p></div></DemoStory>;
}

export function ArticleRailDemo() {
  return <DemoStory><div className="demo practical-demo article-rail-demo"><ArticleRail title="A little perspective." items={[
    { id: 'next-chapter', title: 'Designing for the next chapter', category: 'Perspective', readTime: '4 min read', media: <ProjectArt variant="kin"/>, href: '#demo-story-article-1' },
    { id: 'clear-story', title: 'A useful website starts with a clear story', category: 'Process', readTime: '6 min read', media: <ProjectArt variant="folio"/>, href: '#demo-story-article-2' },
    { id: 'small-details', title: 'Why small details build trust', category: 'Field notes', readTime: '3 min read', media: <ProjectArt variant="forma"/>, href: '#demo-story-article-3' },
  ]}/><p className="content-demo-caption">Browse the journal. Open an article.</p></div></DemoStory>;
}
