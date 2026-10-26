import type { ComponentDefinition } from './catalog';

export const interactiveHeroComponents: ComponentDefinition[] = [
  {
    slug: 'showreel-hero',
    title: 'Showreel Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'Give a film a proper introduction. A cinematic poster, considered typography, and a native video viewer visitors choose to open and play.',
    file: 'ShowreelHero.tsx',
    cssFile: 'showreel-hero.css',
    usage: `import { ShowreelHero } from '@/components/anticraft/ShowreelHero';

export function Example() {
  return (
    <ShowreelHero
      eyebrow="FRAME / INDEPENDENT FILM"
      title={'Stories worth\\nstaying for.'}
      description="A moving image can hold a whole world. Make room for the stories that deserve a little more time."
      poster="/images/film-poster.jpg"
      posterAlt="A wide landscape under an open sky"
      videoSrc="/videos/film.mp4"
      videoLabel="Watch the film"
      captionsSrc="/videos/film.en.vtt"
      transcript="Add the full dialogue, meaningful sounds, and visual context for your film here."
    />
  );
}`,
    useCases: ['Agency showreels', 'Brand films', 'Product stories', 'Filmmaker portfolios'],
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible section heading. A newline creates an intentional line break; long text can still wrap naturally.' },
      { name: 'poster', type: 'string', default: 'Required', description: 'Your own poster image URL. It fills the hero with object-fit: cover and also appears in the native player before playback.' },
      { name: 'videoSrc', type: 'string', default: 'Required', description: 'A browser-supported video file URL. The player uses preload="none", native controls, and playsInline. Opening the viewer does not start playback.' },
      { name: 'eyebrow', type: 'string', default: 'undefined', description: 'Optional short context above the heading, such as a studio name or film collection.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Optional visible introduction at the foot of the poster.' },
      { name: 'posterAlt', type: 'string', default: "''", description: 'A meaningful description of the poster when it conveys information. Leave empty for a purely decorative poster whose meaning is already in the visible copy.' },
      { name: 'videoLabel', type: 'string', default: "'Watch the film'", description: 'The visible opening button, dialog heading, and accessible player label.' },
      { name: 'captionsSrc', type: 'string', default: 'undefined', description: 'Optional URL to your own valid English WebVTT captions file. The native captions track is labeled English captions and marked default. Supply accurate captions for speech and meaningful audio; adapt the source track language if your film uses another language.' },
      { name: 'transcript', type: 'string', default: 'undefined', description: 'Optional complete readable transcript in a native disclosure beneath the player. Include dialogue, important sounds, and needed visual context. The silent original demo uses a short visual description.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme the poster foreground and opening button with --ac-showreel-paper and --ac-showreel-ink on the root.' },
    ],
    motion: 'The poster stays still. Watch opens a native modal; the visitor then presses Play in the video controls. Nothing autoplays or loops. The player includes native pause, seeking, volume, captions when supplied, and fullscreen controls. Escape or Close pauses the video, returns it to the beginning, restores background scrolling, and returns focus to the opening button. Cleanup also runs on unmount and is safe during React Strict Mode effect replay. Failed video loading displays a useful message and a link to the original file. A small opening-button hover lift is removed for reduced motion. The demo film is an original silent eight-second coastal visual study, with a slow camera move and no dialogue or sound. Provide your own poster, video, captions, and transcript for the example paths.',
  },
  {
    slug: 'product-spotlight-hero',
    title: 'Product Spotlight Hero',
    category: 'Heroes',
    tag: 'New',
    description: 'Put one considered product in focus. Numbered image points connect its form to useful, readable feature details.',
    file: 'ProductSpotlightHero.tsx',
    cssFile: 'product-spotlight-hero.css',
    usage: `import { ProductSpotlightHero } from '@/components/anticraft/ProductSpotlightHero';

export function Example() {
  return (
    <ProductSpotlightHero
      eyebrow="FORMA / SOUND"
      title={'Sound, with\\na softer side.'}
      description="Warm sound, natural textures, and the details that make an object feel at home."
      image={{ src: '/images/speaker.jpg', alt: 'An olive speaker with top controls, a woven grille, and wooden feet' }}
      features={[
        { id: 'controls', label: 'Tactile controls', detail: 'Volume and playback stay close to hand.', x: 0.63, y: 0.25 },
        { id: 'grille', label: 'A softer texture', detail: 'A woven front grille gives the room a softer focal point.', x: 0.50, y: 0.52 },
        { id: 'feet', label: 'Grounded in detail', detail: 'Low wooden feet give the form a little breathing room.', x: 0.37, y: 0.83 },
      ]}
      action={{ label: 'Explore the speaker', href: '/products/speaker' }}
    />
  );
}`,
    useCases: ['Product launches', 'Furniture and design objects', 'Material details', 'Hardware feature introductions'],
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible product introduction heading. Newlines preserve intentional line breaks.' },
      { name: 'image', type: '{ src: string; alt: string }', default: 'Required', description: 'Your product image and a meaningful accessible description. The stage follows the image’s natural aspect ratio without cropping or letterboxing, so points align directly with both wide and square source images.' },
      { name: 'features', type: 'ProductSpotlightFeature[]', default: 'Required', description: 'An ordered list with unique id, label, detail, x, and y for every feature. Each feature has a numbered image button and a matching text button. An empty list leaves a simple product hero without feature controls.' },
      { name: 'features[].x / y', type: 'number', default: 'Required', description: 'Normalized coordinates from 0 to 1 measured from the top-left corner of the source image: x is horizontal, y vertical. Values outside the range are clamped; non-finite values fall back to 0.5. Keep points at least 44px apart at the smallest intended size.' },
      { name: 'features[].label / detail', type: 'string', default: 'Required', description: 'A short feature name and useful description. Both stay readable in the text list, including on touch and small screens; selecting one also repeats its detail beneath the image.' },
      { name: 'eyebrow', type: 'string', default: 'undefined', description: 'Optional small context above the heading, such as a product family or edition.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Optional introductory copy beneath the heading.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'Optional ordinary link to a real product page, collection, or story. Replace the usage example path with your own destination.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Customize --ac-spotlight-surface, --ac-spotlight-ink, --ac-spotlight-muted, --ac-spotlight-line, and --ac-spotlight-accent on the root.' },
    ],
    motion: 'Choose a numbered point or its matching text row to select a feature. Native buttons support click, touch, Enter, and Space; aria-pressed communicates selection in both places, and a polite detail region announces the selected description. All feature descriptions remain visible in the list without hovering or opening a point. There is no automatic cycling or moving product image. The layout switches from two columns to one according to its own container width. Selection remains local to each instance; removing a selected feature returns the detail panel to its instruction. Subtle color and ring transitions disappear for reduced motion. The FORMA speaker in the demo is original example artwork; the story link opens a local example design case study. Supply your own source image and destination for the usage example.',
  },
];
