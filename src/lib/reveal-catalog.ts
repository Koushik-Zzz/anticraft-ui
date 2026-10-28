import type { ComponentDefinition } from './catalog';

export const revealComponents: ComponentDefinition[] = [
  {
    slug: 'scratch-reveal', title: 'Scratch Reveal', category: 'Experiments', tag: 'New',
    description: 'A little curiosity pays off. Scratch a foil surface and uncover a print worth finding.',
    file: 'ScratchReveal.tsx', cssFile: 'scratch-reveal.css',
    usage: `import { ScratchReveal } from '@/components/anticraft/ScratchReveal';

export function Example() {
  return (
    <ScratchReveal coverText="A little curiosity pays off" coverColor="#a7bcb0">
      <div style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', background: '#f2a06d', color: '#41332c', textAlign: 'center' }}>
        <div><span style={{ fontSize: 72 }} aria-hidden="true">✳</span><h2>Another layer to explore.</h2></div>
      </div>
    </ScratchReveal>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'Required', description: 'The revealed artwork. It is hidden from assistive technology and made inert until fully revealed. Prefer decorative artwork; the reveal button remains available below it.' },
      { name: 'label', type: 'string', default: "'Scratch to reveal'", description: 'The visible instruction in the footer before the artwork is revealed.' },
      { name: 'coverText', type: 'string', default: "'A little curiosity pays off'", description: 'The phrase drawn onto the generated foil. Keep it short; up to three lines are displayed.' },
      { name: 'coverColor', type: 'string', default: "'#bdc4bd'", description: 'A CSS color used beneath the locally generated foil texture. Choose a light or muted color for readable dark lettering.' },
      { name: 'brushSize', type: 'number', default: '36', description: 'The scratch diameter in CSS pixels, clamped between 8 and 140.' },
      { name: 'threshold', type: 'number', default: '0.45', description: 'The erased fraction that reveals the complete artwork, clamped between 0.05 and 1. Coverage is estimated on an evenly spaced alpha grid.' },
      { name: 'onReveal', type: '() => void', default: 'undefined', description: 'Called once per completed reveal, whether scratched or opened with the button. Reset allows another reveal.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-scratch-height, --ac-scratch-paper, --ac-scratch-ink, --ac-scratch-border, and --ac-scratch-radius to customize the card.' },
    ],
    motion: 'Scratch with a mouse, pen, or touch, or activate Reveal artwork with the keyboard. Reset artwork restores the foil. Touch drawing reserves the canvas area, while the footer and surrounding page preserve normal scrolling. Scratch paths scale with a resized card. Reduced motion removes the final fade. All foil artwork is generated locally without images or network requests.',
  },
  {
    slug: 'pixel-swap', title: 'Pixel Swap', category: 'Experiments', tag: 'New',
    description: 'Switch between product views, project images, or campaign artwork with a pixel wipe.',
    file: 'PixelSwap.tsx', cssFile: 'pixel-swap.css',
    usage: `import { PixelSwap } from '@/components/anticraft/PixelSwap';

export function Example() {
  return (
    <PixelSwap
      frontLabel="Bag — exterior"
      backLabel="Bag — interior"
      buttonLabel="Change product view"
      front={<img src="/images/bag-exterior.jpg" alt="" />}
      back={<img src="/images/bag-interior.jpg" alt="" />}
      columns={8}
      rows={6}
      duration={800}
    />
  );
}`,
    useCases: ['Product image views', 'Campaign artwork', 'Project image transitions'],
    props: [
      { name: 'front', type: 'ReactNode', default: 'Required', description: 'Decorative artwork shown initially. Nested links, buttons, and inputs are made inert.' },
      { name: 'back', type: 'ReactNode', default: 'Required', description: 'The second decorative artwork. Both faces should fill the available stage.' },
      { name: 'frontLabel', type: 'string', default: "'First artwork'", description: 'The accessible name and visible footer label for the first artwork.' },
      { name: 'backLabel', type: 'string', default: "'Second artwork'", description: 'The accessible name and visible footer label for the second artwork.' },
      { name: 'buttonLabel', type: 'string', default: "'Swap artwork'", description: 'A visible action label, such as Change product view. Supply your own image files at the paths shown in the example.' },
      { name: 'columns', type: 'number', default: '8', description: 'The number of pixel columns, rounded and clamped between 2 and 20.' },
      { name: 'rows', type: 'number', default: '6', description: 'The number of pixel rows, rounded and clamped between 2 and 16.' },
      { name: 'duration', type: 'number', default: '800', description: 'The complete transition duration in milliseconds, clamped between 240 and 3000.' },
      { name: 'onValueChange', type: "(side: 'front' | 'back') => void", default: 'undefined', description: 'Called when the artwork changes beneath the fully covered pixel curtain. Reduced motion changes immediately.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Set --ac-pixel-height, --ac-pixel-curtain and optional --ac-pixel-curtain-secondary/tertiary colors, plus --ac-pixel-paper, --ac-pixel-ink, --ac-pixel-border, and --ac-pixel-radius.' },
    ],
    motion: 'Activate Swap artwork with a mouse, touch, Enter, or Space. A diagonal grid of blocks covers the current face before the artwork changes, then clears away. The button stays focused and ignores repeat activation during a transition. Only the current artwork is exposed to assistive technology, with its supplied label. Reduced motion switches immediately, and changing the preference mid-transition completes the swap.',
  },
];
