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
    description: 'An image-led product configurator. Change the finish, inspect another view, and compare models with a live price and dimensions.',
    file: 'ProductSpotlightHero.tsx',
    cssFile: 'product-spotlight-hero.css',
    usage: `'use client';

import { ProductSpotlightHero } from '@/components/anticraft/ProductSpotlightHero';

export function Example() {
  return (
    <ProductSpotlightHero
      productName="MONO"
      productNumber="01"
      kicker="DESIGNED TO FEEL DIFFERENT"
      note="FORM. FUNCTION. NOTHING EXTRA."
      eyebrow="SOUND OBJECTS / COLLECTION 01"
      title={'Sound.\\nIn its purest form.'}
      description="One considered object. A quieter presence. Made for the spaces where life happens."
      image={{ src: '/images/speaker-graphite.webp', alt: 'A graphite speaker in three-quarter view' }}
      variants={[
        { id: 'graphite', label: 'Graphite', color: '#343936', image: { src: '/images/speaker-graphite.webp', alt: 'The speaker in Graphite' }, views: [{ id: 'detail', label: 'Detail', image: { src: '/images/speaker-detail.webp', alt: 'A closer look at the Graphite volume dial' } }] },
        { id: 'chalk', label: 'Chalk', color: '#e8e5dd', image: { src: '/images/speaker-chalk.webp', alt: 'The speaker in Chalk' } },
      ]}
      sizes={[
        { id: 'standard', label: 'MONO 01', dimensions: '270 × 140 × 130 mm', price: '$390' },
        { id: 'plus', label: '01 PLUS', dimensions: '340 × 170 × 150 mm', price: '$540' },
      ]}
      features={[
        { id: 'control', label: 'Tactile control', detail: 'A single top dial keeps volume within easy reach.', x: 0.80, y: 0.20 },
      ]}
      onSelectionChange={({ variant, size, view, image }) => {
        // Connect the selected IDs and price to your own product flow.
        console.log(variant?.id, size?.id, size?.price, view.id, image.src);
      }}
      action={{ label: 'Explore the object', href: '/products/speaker' }}
    />
  );
}`,
    useCases: ['Product launches', 'Furniture and design objects', 'Finish and model selection', 'Hardware product pages'],
    inspiration: { name: 'Oakâme product configurator', url: 'https://www.awwwards.com/inspiration/product-configurator-oakame', note: 'The large product stage and compact configuration panel draw on Oakâme’s product experience. MONO is Anticraft’s original fictional design study, with its own renders and example product data.' },
    props: [
      { name: 'title', type: 'string', default: 'Required', description: 'The visible section heading. Newlines preserve intentional line breaks; text can still wrap naturally. Use a suitable heading level for your page hierarchy when adapting the source.' },
      { name: 'image', type: 'ProductSpotlightImage', default: 'Required', description: 'A fallback product image with src and meaningful alt. With no variants it is the main view. Transparent product images work especially well against the stage. Main images preserve their natural aspect ratio so normalized feature points stay aligned. After the image loads, its natural ratio constrains the actual image frame to the available desktop stage height; no letterboxing is added around hotspot coordinates.' },
      { name: 'features', type: 'ProductSpotlightFeature[]', default: 'Required', description: 'A list with unique id, label, detail, x, and y. Each point opens one compact description, without a repeated accordion. An empty list removes points and the detail strip.' },
      { name: 'features[].x / y', type: 'number', default: 'Required', description: 'Coordinates from 0 to 1 measured from the complete main source image’s top-left corner. Values outside the range are clamped; non-finite values fall back to 0.5. Use equivalent compositions across finishes and keep points at least 44px apart at the smallest intended size. Points appear only in the main view.' },
      { name: 'productName', type: 'string', default: "'OBJECT / 01'", description: 'The compact product wordmark in the masthead. The selected model appears separately in the configuration summary.' },
      { name: 'productNumber', type: 'string', default: "'01'", description: 'A short decorative collection number. It appears in the masthead index and as large background typography, hidden from assistive technology.' },
      { name: 'variants', type: 'ProductSpotlightVariant[]', default: '[]', description: 'Finish options with unique id, label, CSS color, and image {src,alt}. The first is selected initially. Choosing a finish changes the main image and resets its view to Object. Removing a selected option falls back to the first available option without firing the callback.' },
      { name: 'variants[].views', type: 'ProductSpotlightView[]', default: '[]', description: 'Optional additional images of this finish, each with unique id, label, and image {src,alt}. The reserved main ID is automatically supplied for the main image. Only views belonging to the current finish are shown, so a detail never accidentally displays a different finish. Extra images use a 3:2 cover crop; supply suitable detail compositions.' },
      { name: 'sizes', type: 'ProductSpotlightSize[]', default: '[]', description: 'Model options with unique id, label, dimensions, and formatted price including currency. Selection updates the live summary. Dimensions and prices are supplied by you; changing a model does not distort or rescale the product image.' },
      { name: 'onSelectionChange', type: '(selection: ProductSpotlightSelection) => void', default: 'undefined', description: 'Called in the finish, model, or view button’s event handler. Receives {variant,size,view,image}: current full option objects, a view with its ID, and the exact displayed image. Variant and size are null when their lists are empty. It never fires on initial mount or prop changes. Use it to connect your own cart, URL, pricing, or product flow.' },
      { name: 'eyebrow', type: 'string', default: "'AN OBJECT, CONSIDERED.'", description: 'Short context in the masthead, such as a product family or collection.' },
      { name: 'description', type: 'string', default: 'undefined', description: 'Optional short introduction below the display heading. Keep it concise so the product stays prominent.' },
      { name: 'kicker', type: 'string', default: 'undefined', description: 'Optional small label above the heading. Omitted entirely when not supplied.' },
      { name: 'note', type: 'string', default: 'undefined', description: 'Optional compact line beneath the introduction. Hidden in compact containers to keep the product prominent.' },
      { name: 'action', type: '{ label: string; href: string }', default: 'undefined', description: 'An ordinary link to your product page, collection, or story. Selection does not alter its URL or perform a purchase. Connect onSelectionChange to your own application if the destination needs the chosen configuration.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes. Theme --ac-spotlight-surface, --ac-spotlight-ink, --ac-spotlight-muted, --ac-spotlight-line, and --ac-spotlight-accent on the root. Override --ac-spotlight-stage-height to set the desktop image stage; its default is clamp(320px, calc(100svh - 375px), 560px). Compact phone layouts use natural height.' },
    ],
    motion: 'Finish swatches replace the product image. Image thumbnail buttons switch views belonging to that finish; changing finishes resets to the main view. Model buttons update dimensions, formatted price, and model name in a polite live summary. Native buttons support click, touch, Enter, and Space, with aria-pressed selection and visible keyboard focus. Image points expose one concise, politely announced detail; activating the selected point closes it. Feature points are hidden for alternate detail views. Options are stored by ID and derived from current props, so removing or replacing selected data safely falls back to the first option. Configuration callbacks run only in user event handlers. On small containers the product comes directly after the heading and the price/action row moves above the finish and model controls. A brief image fade and tiny vertical entrance disappear for reduced motion. MONO is an original fictional product study; the model dimensions and prices are illustrative, and the action opens a local design story. Supply your own images, product data, and destination.',
  },
];
