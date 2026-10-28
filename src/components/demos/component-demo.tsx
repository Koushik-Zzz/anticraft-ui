"use client";

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { MagneticButton, SplitText, SpotlightCard, TiltCard, Marquee, EditorialAccordion } from '@/components/anticraft';
import { AuroraBackground } from '@/components/anticraft/AuroraBackground';
import { GradientText } from '@/components/anticraft/GradientText';
import { BorderBeam } from '@/components/anticraft/BorderBeam';
import { Icon } from '@/components/site/icon';
import { StickerFieldDemo, SpineArchiveDemo, MorphingStageDemo } from './experimental-demos';
import { PeelRevealDemo, OrbitGalleryDemo, LenticularPanelDemo } from './object-demos';
import { CursorTrailDemo, ThrowStackDemo, ElasticTypeDemo } from './play-demos';
import { FloatingDockDemo, SlidingNavDemo, ExpandingMenuDemo, RadialNavDemo, CurtainMenuDemo } from './nav-demos';
import { ScratchRevealDemo, PixelSwapDemo, RippleFieldDemo, BeforeAfterDemo } from './sensory-demos';
import { SplitFlapDemo } from './flap-demo';
import { ProjectGridDemo, ProjectPreviewListDemo } from './project-demos';
import { ServiceShowcaseDemo, ArticleRailDemo } from './content-demos';
import { TestimonialSliderDemo } from './proof-demo';
import { PricingPlansDemo, FeatureBentoDemo } from './marketing-demos';
import { ProductGalleryDemo, TeamGridDemo } from './people-product-demos';
import { ScrollExpandHeroDemo, EditorialHeroDemo } from './visual-hero-demos';
import { ShowreelHeroDemo, ProductSpotlightHeroDemo } from './interactive-hero-demos';
import './hero-demos.css';
import { ButtonDemo, isButtonDemoSlug } from './button-demos';
import { ProcessTimelineDemo } from './process-demo';
import { ProjectBriefBuilderDemo } from './brief-demos';
import { RevealFooterDemo, CaseStudyStoryDemo } from './editorial-section-demos';
import { ProductQuickViewDemo } from './commerce-demos';
import { FeatureComparisonDemo } from './comparison-demos';
import { ImageHotspotsDemo } from './image-hotspots-demo';
import { ExpandableGalleryDemo } from './expandable-gallery-demo';
import { FileDropzoneDemo } from './file-dropzone-demo';
import { SearchableFAQDemo } from './searchable-faq-demo';
import { EditorCanvasHeroDemo } from './editor-canvas-hero-demo';
import { NotesWorkflowHeroDemo } from './notes-workflow-hero-demo';
import { RevenueDashboardHeroDemo } from './revenue-dashboard-hero-demo';
import './website-demos.css';
import { OrbitNetworkDemo } from './orbit-network-demo';
import { SignalFunnelDemo } from './signal-funnel-demo';
import { RoutingScorecardDemo } from './routing-scorecard-demo';
import { ConvergingStreamsDemo } from './converging-streams-demo';
import './diagram-demos.css';

export interface DemoOptions { accent?: string; intensity?: number; paused?: boolean; }

const accordionItems = [
  { id: 'yours', title: 'Built to be yours', content: 'Copy the source. Change every detail. Make something only you could make.' },
  { id: 'motion', title: 'Motion with intention', content: 'Considered interactions, with respect for your visitors’ motion preferences.' },
  { id: 'world', title: 'Ready for your ideas', content: 'Typed React components, ordinary CSS, and no animation dependencies.' },
];

export function ComponentDemo({ slug, options = {} }: { slug: string; options?: DemoOptions }) {
  const id = slug;
  const [replay, setReplay] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [ambientPaused, setAmbientPaused] = useState(false);
  const isPaused = options.paused ?? ambientPaused;
  const pauseControl = <button className="replay-button ambient-pause" onClick={() => setAmbientPaused(!ambientPaused)} aria-pressed={isPaused}>{isPaused ? 'Play motion' : 'Pause motion'}</button>;
  if (id === 'orbit-network') return <OrbitNetworkDemo paused={options.paused}/>;
  if (id === 'signal-funnel') return <SignalFunnelDemo paused={options.paused}/>;
  if (id === 'routing-scorecard') return <RoutingScorecardDemo paused={options.paused}/>;
  if (id === 'converging-streams') return <ConvergingStreamsDemo paused={options.paused}/>;
  if (id === 'editor-canvas-hero') return <EditorCanvasHeroDemo/>;
  if (id === 'notes-workflow-hero') return <NotesWorkflowHeroDemo/>;
  if (id === 'revenue-dashboard-hero') return <RevenueDashboardHeroDemo/>;
  if (id === 'image-hotspots') return <ImageHotspotsDemo/>;
  if (id === 'expandable-gallery') return <ExpandableGalleryDemo/>;
  if (id === 'file-dropzone') return <FileDropzoneDemo/>;
  if (id === 'searchable-faq') return <SearchableFAQDemo/>;
  if (id === 'project-brief-builder') return <ProjectBriefBuilderDemo/>;
  if (id === 'reveal-footer') return <RevealFooterDemo/>;
  if (id === 'product-quick-view') return <ProductQuickViewDemo/>;
  if (id === 'feature-comparison') return <FeatureComparisonDemo/>;
  if (id === 'case-study-story') return <CaseStudyStoryDemo/>;
  if (id === 'scroll-expand-hero') return <ScrollExpandHeroDemo/>;
  if (id === 'editorial-hero') return <EditorialHeroDemo/>;
  if (id === 'showreel-hero') return <ShowreelHeroDemo/>;
  if (id === 'product-spotlight-hero') return <ProductSpotlightHeroDemo/>;
  if (isButtonDemoSlug(id)) return <ButtonDemo slug={id}/>;
  if (id === 'sticker-field') return <StickerFieldDemo/>;
  if (id === 'pricing-plans') return <PricingPlansDemo/>;
  if (id === 'feature-bento') return <FeatureBentoDemo/>;
  if (id === 'product-gallery') return <ProductGalleryDemo/>;
  if (id === 'team-grid') return <TeamGridDemo/>;
  if (id === 'process-timeline') return <ProcessTimelineDemo/>;
  if (id === 'project-grid') return <ProjectGridDemo/>;
  if (id === 'project-preview-list') return <ProjectPreviewListDemo/>;
  if (id === 'service-showcase') return <ServiceShowcaseDemo/>;
  if (id === 'article-rail') return <ArticleRailDemo/>;
  if (id === 'testimonial-slider') return <TestimonialSliderDemo/>;
  if (id === 'scratch-reveal') return <ScratchRevealDemo/>;
  if (id === 'pixel-swap') return <PixelSwapDemo/>;
  if (id === 'ripple-field') return <RippleFieldDemo/>;
  if (id === 'before-after') return <BeforeAfterDemo/>;
  if (id === 'split-flap') return <SplitFlapDemo/>;
  if (id === 'floating-dock') return <FloatingDockDemo/>;
  if (id === 'sliding-nav') return <SlidingNavDemo/>;
  if (id === 'expanding-menu') return <ExpandingMenuDemo/>;
  if (id === 'radial-nav') return <RadialNavDemo/>;
  if (id === 'curtain-menu') return <CurtainMenuDemo/>;
  if (id === 'cursor-trail') return <CursorTrailDemo/>;
  if (id === 'throw-stack') return <ThrowStackDemo/>;
  if (id === 'elastic-type') return <ElasticTypeDemo/>;
  if (id === 'peel-reveal') return <PeelRevealDemo/>;
  if (id === 'orbit-gallery') return <OrbitGalleryDemo/>;
  if (id === 'lenticular-panel') return <LenticularPanelDemo/>;
  if (id === 'spine-archive') return <SpineArchiveDemo/>;
  if (id === 'morphing-stage') return <MorphingStageDemo/>;
  if (id === 'aurora-background') return <AuroraBackground className="demo demo-aurora" paused={isPaused} color1={options.accent ?? '#e89c62'}><span className="demo-eyebrow">A LITTLE ATMOSPHERE GOES A LONG WAY</span><div className="aurora-demo-center"><span className="ambient-mini-star" aria-hidden="true">✳</span><p>A space<br/>to <em>dream.</em></p></div><div className="demo-baseline"><span className="demo-hint">Light, with a life of its own.</span>{pauseControl}</div></AuroraBackground>;
  if (id === 'gradient-text') return <div className="demo demo-gradient"><span className="demo-eyebrow">COLOR OUTSIDE THE ORDINARY</span><p><GradientText paused={isPaused} colors={options.accent ? [options.accent, '#fff1dc', '#b5a2fa', options.accent] : undefined}>Stay a little<br/><em>different.</em></GradientText></p><div className="demo-baseline"><span className="demo-hint">A brighter turn of phrase.</span>{pauseControl}</div></div>;
  if (id === 'border-beam') return <div className="demo demo-beam"><span className="demo-eyebrow">A MOVING EDGE. A FOCUSED FRAME.</span><BorderBeam className="beam-demo-object" color={options.accent ?? '#f19451'} paused={isPaused}><span className="beam-demo-icon"><Icon name="spark" size={26}/></span><p>Made to<br/><em>stand out.</em></p><span className="beam-demo-note">A little glow. A lot of character.</span></BorderBeam><div className="demo-baseline"><span className="demo-hint">Follow the finer details.</span>{pauseControl}</div></div>;
  if (id === 'magnetic-button') return <div className="demo demo-magnetic">
    <span className="demo-eyebrow">AN INVITATION TO INTERACT</span>
    <div className="magnetic-zone"><div className="orbit orbit-one" /><div className="orbit orbit-two" />
      <MagneticButton strength={options.intensity ?? 0.2} className="demo-magnetic-button" onClick={() => setClicked(!clicked)}>
        {clicked ? 'Hello, you.' : 'A little closer'} <Icon name={clicked ? 'check' : 'arrow'} size={20} />
      </MagneticButton>
    </div><span className="demo-hint">{clicked ? 'That’s the feeling. Click to reset.' : 'Move your pointer. Feel the pull.'}</span>
  </div>;
  if (id === 'split-text') return <div className="demo demo-split">
    <span className="demo-eyebrow">ONE WORD AT A TIME</span>
    <SplitText as="p" text="Every word has its moment." replayKey={replay} delay={0.12} className="demo-split-text" />
    <div className="demo-baseline"><span className="demo-hint">A staggered entrance.</span><button className="replay-button" onClick={() => setReplay(replay + 1)} aria-label="Replay text animation"><Icon name="refresh" size={15} /> Replay</button></div>
  </div>;
  if (id === 'spotlight-card') return <div className="demo demo-spotlight">
    <SpotlightCard className="demo-spotlight-object" color={options.accent ?? '#c6efaa'}>
      <div className="spotlight-top"><span className="demo-eyebrow">A BRIGHTER KIND OF CARD</span><span className="tiny-star">✳</span></div>
      <div className="spotlight-art" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ transform: `rotate(${i * 22.5}deg)` }} />)}</div>
      <div className="spotlight-bottom"><h3>Less ordinary.</h3><span>Find your light. <Icon name="arrow" size={15}/></span></div>
    </SpotlightCard>
  </div>;
  if (id === 'tilt-card') return <div className="demo demo-tilt">
    <TiltCard className="demo-tilt-object" maxRotation={options.intensity !== undefined ? options.intensity * 30 : 12}>
      <div className="tilt-top"><b>ANTICRAFT</b><span>DIGITAL OBJECTS<br/>COLLECTION 001</span></div>
      <div className="sculpture" aria-hidden="true">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ '--ring': i } as CSSProperties} />)}</div>
      <div className="tilt-bottom"><span>A different<br/><em>perspective.</em></span><Icon name="arrow" size={24}/></div>
    </TiltCard><span className="tilt-caption">Move around. See it differently.</span>
  </div>;
  if (id === 'marquee') return <div className="demo demo-marquee">
    <span className="demo-eyebrow">THOUGHTS IN CONSTANT MOTION</span>
    <div className="marquee-lines"><Marquee speed={24}><span className="marquee-words">STAY CURIOUS <b>✳</b> </span></Marquee>
    <Marquee speed={28} reverse><span className="marquee-words marquee-outline">MAKE SOMETHING <b>↗</b> </span></Marquee></div>
    <div className="demo-baseline"><span className="demo-hint">A little momentum goes a long way.</span><span className="demo-hint">Hover to pause.</span></div>
  </div>;
  return <div className="demo demo-accordion"><span className="demo-eyebrow">THE ART OF THE DETAILS</span><p className="accordion-intro">Small details.<br/><em>Big difference.</em></p><EditorialAccordion items={accordionItems} defaultValue="yours" /></div>;
}
