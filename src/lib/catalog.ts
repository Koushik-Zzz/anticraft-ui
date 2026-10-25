export type ComponentCategory = 'Backgrounds' | 'Buttons' | 'Typography' | 'Cards' | 'Layout';

export type ComponentDefinition = {
  slug: string;
  title: string;
  category: ComponentCategory;
  description: string;
  file: string;
  cssFile: string;
  tag?: 'New';
  usage: string;
  props: { name: string; type: string; default: string; description: string }[];
  motion: string;
};

export const categories: ComponentCategory[] = ['Backgrounds', 'Buttons', 'Typography', 'Cards', 'Layout'];

export const components: ComponentDefinition[] = [
  {
    slug: 'aurora-background',
    title: 'Aurora Background',
    category: 'Backgrounds',
    description: 'A moving wash of light that gives your next big idea its own atmosphere.',
    file: 'AuroraBackground.tsx',
    cssFile: 'aurora-background.css',
    tag: 'New',
    usage: `import { AuroraBackground } from '@/components/anticraft/AuroraBackground';

export function Example() {
  return (
    <AuroraBackground style={{ padding: '4rem 2rem', borderRadius: '1rem' }}>
      <h1>Make something that moves people.</h1>
    </AuroraBackground>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'Content displayed above the decorative background.' },
      { name: 'speed', type: 'number', default: '16', description: 'The ambient animation duration in seconds, clamped between 2 and 180.' },
      { name: 'paused', type: 'boolean', default: 'false', description: 'Pauses the background animation.' },
      { name: 'color1', type: 'string', default: "'#e89c62'", description: 'The first aurora color, as a CSS color.' },
      { name: 'color2', type: 'string', default: "'#9280da'", description: 'The second aurora color, as a CSS color.' },
      { name: 'color3', type: 'string', default: "'#edd1a3'", description: 'The third aurora color, as a CSS color.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Native div attributes and inline styles are supported.' },
    ],
    motion: 'The ambient animation becomes a static gradient when reduced motion is preferred.',
  },
  {
    slug: 'magnetic-button',
    title: 'Magnetic Button',
    category: 'Buttons',
    description: 'A tactile button with a soft magnetic pull. Go on, get a little closer.',
    file: 'MagneticButton.tsx',
    cssFile: 'magnetic-button.css',
    usage: `import { MagneticButton } from '@/components/anticraft/MagneticButton';

export function Example() {
  return <MagneticButton strength={0.2}>Make your move ↗</MagneticButton>;
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'The button label and optional decorative content.' },
      { name: 'strength', type: 'number', default: '0.2', description: 'How far the surface follows the pointer, clamped between 0 and 1.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button and resets its position.' },
      { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'The native button type.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for the button. Native button attributes and event handlers are supported.' },
    ],
    motion: 'Pointer movement runs only on a fine pointer with hover support. Reduced motion, touch input, keyboard focus, and disabled state keep the surface still.',
  },
  {
    slug: 'split-text',
    title: 'Split Text',
    category: 'Typography',
    description: 'An expressive word-by-word reveal for headlines that deserve an entrance.',
    file: 'SplitText.tsx',
    cssFile: 'split-text.css',
    usage: `import { SplitText } from '@/components/anticraft/SplitText';

export function Example() {
  return <SplitText as="h2" text="Less ordinary. More you." delay={0.08} />;
}`,
    props: [
      { name: 'text', type: 'string', default: 'Required', description: 'The complete phrase to reveal. Screen readers receive one uninterrupted copy.' },
      { name: 'as', type: "'h1' | 'h2' | 'h3' | 'p' | 'span'", default: "'p'", description: 'The semantic element wrapping the phrase.' },
      { name: 'delay', type: 'number', default: '0.06', description: 'The stagger between words in seconds.' },
      { name: 'replayKey', type: 'number', default: '0', description: 'Change this value to replay the reveal.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for typography and layout.' },
    ],
    motion: 'Reveals once on entering the viewport. With reduced motion, the complete phrase is immediately visible without animation.',
  },
  {
    slug: 'gradient-text',
    title: 'Gradient Text',
    category: 'Typography',
    description: 'A flowing spectrum of color for a few words you want to make unforgettable.',
    file: 'GradientText.tsx',
    cssFile: 'gradient-text.css',
    tag: 'New',
    usage: `import { GradientText } from '@/components/anticraft/GradientText';

export function Example() {
  return <GradientText>Stay a little different.</GradientText>;
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'Required', description: 'Text or inline content receiving the gradient.' },
      { name: 'colors', type: 'string[]', default: 'Orange, cream, violet, orange', description: 'Two to eight CSS colors. Defaults to #ef9b61, #f7e6cf, #b8a0e9, #ef9b61.' },
      { name: 'speed', type: 'number', default: '8', description: 'The gradient animation duration in seconds, clamped between 1 and 180.' },
      { name: 'paused', type: 'boolean', default: 'false', description: 'Pauses the gradient animation.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Native span attributes and inline styles are supported.' },
    ],
    motion: 'The gradient stops moving when reduced motion is preferred.',
  },
  {
    slug: 'spotlight-card',
    title: 'Spotlight Card',
    category: 'Cards',
    description: 'A quiet surface that lights up wherever curiosity takes the pointer.',
    file: 'SpotlightCard.tsx',
    cssFile: 'spotlight-card.css',
    usage: `import { SpotlightCard } from '@/components/anticraft/SpotlightCard';

export function Example() {
  return (
    <SpotlightCard color="#c4b5fd" style={{ padding: '2rem' }}>
      <h3>A brighter idea.</h3>
      <p>A little attention goes a long way.</p>
    </SpotlightCard>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'Card content, including links and other interactive elements.' },
      { name: 'color', type: 'string', default: "'#d7ee9e'", description: 'A CSS color used by the radial spotlight.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for the card.' },
      { name: 'style', type: 'CSSProperties', default: '—', description: 'Inline styles and CSS custom properties. Native div attributes are supported.' },
    ],
    motion: 'The light follows mouse input. Reduced motion holds it in the center; keyboard focus reveals the same centered light. Touch devices receive a static glow.',
  },
  {
    slug: 'tilt-card',
    title: 'Tilt Card',
    category: 'Cards',
    description: 'A gentle shift in perspective that makes a flat card feel like an object.',
    file: 'TiltCard.tsx',
    cssFile: 'tilt-card.css',
    usage: `import { TiltCard } from '@/components/anticraft/TiltCard';

export function Example() {
  return (
    <TiltCard maxRotation={8} perspective={900} style={{ padding: '2rem' }}>
      <h3>A different perspective.</h3>
      <p>Small details. A deeper impression.</p>
    </TiltCard>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'The contents of the dimensional card.' },
      { name: 'maxRotation', type: 'number', default: '8', description: 'Maximum rotation in degrees, clamped between 0 and 30.' },
      { name: 'perspective', type: 'number', default: '900', description: 'Viewer distance in pixels, with a minimum of 100.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for the card.' },
      { name: 'style', type: 'CSSProperties', default: '—', description: 'Inline styles and CSS custom properties. Native div attributes are supported.' },
    ],
    motion: 'Tilts only with mouse input and returns to center when the pointer leaves. Reduced motion, coarse pointers, and devices without hover keep the card flat.',
  },
  {
    slug: 'border-beam',
    title: 'Border Beam',
    category: 'Cards',
    description: 'A fine trace of light that travels around a surface and brings its edges to life.',
    file: 'BorderBeam.tsx',
    cssFile: 'border-beam.css',
    tag: 'New',
    usage: `import { BorderBeam } from '@/components/anticraft/BorderBeam';

export function Example() {
  return (
    <BorderBeam style={{ padding: '2rem' }}>
      <h3>Worth a closer look.</h3>
      <p>Let the details do the talking.</p>
    </BorderBeam>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: '—', description: 'Content inside the bordered surface.' },
      { name: 'duration', type: 'number', default: '8', description: 'The duration of a complete border loop in seconds, clamped between 1 and 180.' },
      { name: 'color', type: 'string', default: "'#f19451'", description: 'The CSS accent color of the moving beam.' },
      { name: 'paused', type: 'boolean', default: 'false', description: 'Pauses the border animation.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Native div attributes and inline styles are supported.' },
    ],
    motion: 'The moving border becomes a static accent when reduced motion is preferred.',
  },
  {
    slug: 'marquee',
    title: 'Marquee',
    category: 'Layout',
    description: 'An endless rhythm of words, logos, or cards with just the right amount of energy.',
    file: 'Marquee.tsx',
    cssFile: 'marquee.css',
    usage: `import { Marquee } from '@/components/anticraft/Marquee';

export function Example() {
  return (
    <Marquee speed={24} pauseOnHover>
      <span>Independent spirit</span>
      <span>Thoughtful details</span>
      <span>Free to create</span>
    </Marquee>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'Required', description: 'Items to repeat. One copy is exposed to assistive technology.' },
      { name: 'speed', type: 'number', default: '24', description: 'The duration of a complete loop in seconds. Lower values scroll faster.' },
      { name: 'reverse', type: 'boolean', default: 'false', description: 'Reverses the scrolling direction.' },
      { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pauses while the pointer hovers. Keyboard focus always pauses the strip.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for the outer strip.' },
    ],
    motion: 'A persistent pause button and focus pause give users control. Reduced motion removes the animation and duplicate content, leaving a static, wrapping strip.',
  },
  {
    slug: 'editorial-accordion',
    title: 'Editorial Accordion',
    category: 'Layout',
    description: 'Big type, fine rules, and room to breathe. A more considered way to tell the story.',
    file: 'EditorialAccordion.tsx',
    cssFile: 'editorial-accordion.css',
    usage: `import { EditorialAccordion } from '@/components/anticraft/EditorialAccordion';

export function Example() {
  return (
    <EditorialAccordion
      defaultValue="source"
      items={[
        { id: 'source', title: 'Make it your own', content: 'The source is yours to change.' },
        { id: 'license', title: 'Free to ship', content: 'Use it in personal and commercial projects.' },
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'EditorialAccordionItem[]', default: 'Required', description: 'Items with a unique id, string title, and ReactNode content.' },
      { name: 'defaultValue', type: 'string', default: 'undefined', description: 'The id of the item that starts open. At most one item is open at a time.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes for the accordion.' },
    ],
    motion: 'Uses native buttons with expanded state and linked content regions. Reduced motion removes the icon and text transitions.',
  },
];

export function getComponent(slug: string): ComponentDefinition | undefined {
  return components.find((component) => component.slug === slug);
}
