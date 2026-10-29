# Anticraft UI

**Premium design. Free source.**

An open-source collection of expressive React components for websites with a point of view. Copy the source, make it your own, and ship it in personal or commercial projects under the MIT license.

The documentation website uses **Next.js App Router and TypeScript**, with a categorized component catalog at `/components`, individual demo pages, installation instructions, and source you can copy. The components themselves use React and plain CSS; they do not require Tailwind or an animation library.

## The collection

| Category | Components |
| --- | --- |
| Diagrams | Logo Orbit, Orbit Network, Signal Funnel, Routing Scorecard, Converging Streams |
| Heroes | Editor Canvas Hero, Notes Workflow Hero, Revenue Dashboard Hero, Frame Morph Hero, Showreel Hero, Product Spotlight Hero, Editorial Hero |
| Sections | Image Hotspots, Expandable Gallery, Searchable FAQ, Project Brief Builder, Reveal Footer, Feature Comparison, Case Study Story, Pricing Plans, Feature Bento, Team Grid, Process Timeline, Project Grid, Project Preview List, Service Showcase, Article Rail, Testimonial Slider |
| Navigation | Floating Dock, Sliding Nav, Expanding Menu, Radial Nav, Curtain Menu |
| Experiments | Snap Delete, Scratch Reveal, Pixel Swap, Cursor Trail, Throw Stack, Elastic Type, Peel Reveal, Orbit Gallery, Lenticular Panel, Sticker Field, Spine Archive, Morphing Stage |
| Backgrounds | Ripple Field, Aurora Background |
| Buttons | Arrow Capsule Button, Rolling Text Button, Circle Fill Button, Shutter Button, Outline Trace Button, Tactile Button, Magnetic Button |
| Typography | Particle Text, Split Flap, Split Text, Gradient Text |
| Forms | File Dropzone |
| Cards | Product Quick View, Product Gallery, Before After, Spotlight Card, Tilt Card, Border Beam |
| Layout | Marquee, Editorial Accordion |

All 67 components are included in the repository and local shadcn registry. Start with the **Sections** category for practical product and marketing content: clear pricing plans, feature grids, team profiles, process timelines, portfolio cards, service details, and client stories. Product Gallery in **Cards** adds thumbnails and a larger image viewer. Demo project and article links open complete local examples. The example brands and client stories are fictional. Pixel Swap now demonstrates switching between exterior and interior product views, with a customizable button label. Each component has a live demo, source, installation instructions, and prop documentation. Effects honor reduced motion, and interactive sections support keyboard and touch use.

[Snap Delete](http://localhost:5173/components/snap-delete) disperses text, images, and cards into dust using the content’s actual appearance. Its three demos include native Delete and Undo controls. The standalone component preserves child state for Undo, respects reduced motion, and exposes completion/restoration callbacks for your own persistence. It uses React and CSS masks without reading image pixels.

[Particle Text](http://localhost:5173/components/particle-text) in **Typography** gathers scattered dots into a headline, then resolves into selectable HTML text. Its motion draws on a live study of [Orgo’s closing call to action](https://www.orgo.ai/). It plays once on entry, offers replay and pause controls, and shows solid text for reduced motion or an unavailable canvas. The optional `ParticleTextGrid` wrapper adds a recessed grid moving left to right, rounded hover cells, sparse idle highlights, and a separate background pause control. Both exports ship in the same React/CSS pair.

The [Diagrams collection](http://localhost:5173/components/diagrams) includes Logo Orbit (a fixed central logo and upright orbiting integration badges), Orbit Network (selectable integration nodes), Signal Funnel (toggleable processing gates), Routing Scorecard (adjustable quality threshold), and Converging Streams (a compact CTA background with an optional pointer-following ASCII field). Their particle fields, traveling packets, and curved paths draw on a live motion study of [RouterPlus](https://routerplus.com/). Each supports pause and reduced motion, stops motion while hidden or offscreen, and includes standalone React/CSS source. Scores and processing stages are illustrative UI data.

Recent additions include three SaaS heroes: Editor Canvas (selectable documents and outline sections), Notes Workflow (source notes, reviewable tasks, owner edits, and copyable output), and Revenue Dashboard (linked range/channel filters, chart, metrics, and transactions). Each has a live documentation preview, full-width preview, typed props, and a standalone React/CSS registry item.

Other recent additions are Image Hotspots (clickable image annotations), Expandable Gallery (selectable image panels), File Dropzone (local file selection, validation and removal), and Searchable FAQ (search and category filtering). Each has a focused documentation demo and a standalone `/preview/<slug>` page. File Dropzone selects local files and calls `onFilesChange`; connect your own upload service when needed.

Other website components include a guided project brief with validation and review, a native-scroll reveal footer, a product quick-view dialog with real image/finish changes, a two-option feature comparison with a differences filter, and a complete editorial case study. Each has an interactive documentation preview and a full-width page at `/preview/<slug>`. The brief demo runs entirely in memory; connect its required `onSubmit` callback to your own service in a real project. Product links lead to local example stories, and all sample brands, prices, and results are illustrative.

The [Buttons collection](http://localhost:5173/components/buttons) has seven live button studies with keyboard, touch, disabled, and reduced-motion states. A dedicated button index sits to the right of the component catalog on wide screens and becomes a shortcut strip on smaller screens. Each new button forwards native props and a ref, and defaults to `type="button"`.

The [Heroes collection](http://localhost:5173/components/heroes) includes a product configurator with finish-specific renders, alternate views, model choices, and live dimensions/pricing. Frame Morph Hero coordinates a portrait window, panorama, and full scene with typography and chapter progress; its existing `ScrollExpandHero` export and `scroll-expand-hero` registry URL remain compatible. Gallery previews fit the complete composition, and each hero has a full-width live preview at `/preview/<slug>`. The speaker renders, architectural image, coastal artwork, and eight-second silent camera study are original demo assets. Product models, prices, and dimensions are fictional example data.

The [Button playground](http://localhost:5173/components/buttons/playground) lets you change the interaction, label, palette, background/text/accent colors, size, corner radius, and disabled state. The preview and copyable React example update together.

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open [localhost:5173](http://localhost:5173) or [the component catalog](http://localhost:5173/components). The development command builds the source registry before starting Next.js. If you change the server port, use that port in registry installation commands too.

## Copy a component

Copy its `.tsx` file and matching `.css` file from `src/components/anticraft` into the same folder in your React TypeScript project. Each component imports its stylesheet by relative path, so keep the pair together.

For example, copy `MagneticButton.tsx` and `magnetic-button.css` into `src/components/anticraft`, then use:

```tsx
import { MagneticButton } from '@/components/anticraft/MagneticButton';

export function Example() {
  return <MagneticButton strength={0.2}>Make your move ↗</MagneticButton>;
}
```

Use the import alias configured in your project. Components with hooks and pointer events already include the Next.js `'use client'` directive. They work when imported into an App Router page or another component.

## Install from the local shadcn registry

Keep the Anticraft UI development server running. From your existing shadcn-configured React TypeScript project, run:

```sh
npx shadcn@latest add http://localhost:5173/r/magnetic-button.json
```

Each item installs both the component and its stylesheet. Targets resolve through your configured components alias: with `@/components` pointing to `src/components`, the files are written into `src/components/anticraft/`.

Available registry items:

```text
/r/snap-delete.json
/r/particle-text.json
/r/logo-orbit.json
/r/orbit-network.json
/r/signal-funnel.json
/r/routing-scorecard.json
/r/converging-streams.json
/r/editor-canvas-hero.json
/r/notes-workflow-hero.json
/r/revenue-dashboard-hero.json
/r/project-brief-builder.json
/r/reveal-footer.json
/r/product-quick-view.json
/r/feature-comparison.json
/r/case-study-story.json
/r/scroll-expand-hero.json
/r/editorial-hero.json
/r/showreel-hero.json
/r/product-spotlight-hero.json
/r/arrow-capsule-button.json
/r/rolling-text-button.json
/r/circle-fill-button.json
/r/shutter-button.json
/r/outline-trace-button.json
/r/tactile-button.json
/r/pricing-plans.json
/r/feature-bento.json
/r/product-gallery.json
/r/team-grid.json
/r/process-timeline.json
/r/project-grid.json
/r/project-preview-list.json
/r/service-showcase.json
/r/article-rail.json
/r/testimonial-slider.json
/r/scratch-reveal.json
/r/pixel-swap.json
/r/ripple-field.json
/r/before-after.json
/r/split-flap.json
/r/floating-dock.json
/r/sliding-nav.json
/r/expanding-menu.json
/r/radial-nav.json
/r/curtain-menu.json
/r/cursor-trail.json
/r/throw-stack.json
/r/elastic-type.json
/r/peel-reveal.json
/r/orbit-gallery.json
/r/lenticular-panel.json
/r/sticker-field.json
/r/spine-archive.json
/r/morphing-stage.json
/r/aurora-background.json
/r/magnetic-button.json
/r/split-text.json
/r/gradient-text.json
/r/spotlight-card.json
/r/tilt-card.json
/r/border-beam.json
/r/marquee.json
/r/editorial-accordion.json
```

The combined registry is available at `/r/registry.json`. Run `npm run build:registry` after component edits to regenerate these files.

This repository does not have a hosted registry or public npm release yet. These URLs work while this project is running locally or after you deploy it. When hosting, set `homepage` in `registry.json` to your real site URL and rebuild. The registry format follows the [official shadcn registry documentation](https://ui.shadcn.com/docs/registry/getting-started).

## Build and check

```sh
npm run typecheck
npm run build
npm run build:lib
```

| Script | Purpose |
| --- | --- |
| `dev` | Build the registry and start the Next.js development website on port 5173. |
| `typecheck` | Check TypeScript. |
| `build:registry` | Generate installable registry JSON from the component source. |
| `build` | Build the registry and production Next.js website. |
| `build:lib` | Build the reusable library and TypeScript declarations. Vite is used only for this library bundle. |
| `start` | Serve the production Next.js website after a build. |

The optional library bundle keeps React external and exports CSS separately:

```tsx
import { MagneticButton } from '@anticraft-ui/react';
import '@anticraft-ui/react/styles.css';
```

`@anticraft-ui/react` is an unpublished local package. After `npm run build:lib`, run `npm pack ./lib` to create an archive you can install in another project. The built package has React peer dependencies and does not install the documentation app or Next.js.

## Inspiration

The first experimental collection studies interactions on sites featured by [Awwwards](https://www.awwwards.com/websites/). These are original React implementations with original demo artwork, adapting interaction ideas rather than copying site source or brand assets. Later additions explore folded paper, spatial displays, angle-dependent prints, pointer trails, throwable posters, elastic typography, scratchable foil, pixel wipes, ripple fields, and mechanical type with original code and artwork.

- **Sticker Field** draws on the draggable collage at [Studio Alphonse — About](https://www.studioalphonse.com/about). It adds bounded momentum, keyboard positioning and rotation, and reset controls.
- **Spine Archive** draws on the physical VHS shelf at [Studio Alphonse — Productions](https://www.studioalphonse.com/productions). The Anticraft adaptation expands a spine into its front cover and project details.
- **Morphing Stage** draws on the changing geometric compositions of [FORMAT by Obys × DES](https://format.obys.agency/). It adapts that idea to a bounded scroll stage with explicit frame navigation.

Source references also appear on the documentation pages for those three adaptations.

The practical sections study content patterns from other Awwwards-featured sites:

- [Instrument — Work](https://www.instrument.com/work/) informed Project Grid’s discipline filters and linked case-study cards.
- [Emotion Agency](https://emotion-agency.com/) informed Project Preview List’s numbered index and project metadata.
- [Whipsaw](https://www.whipsaw.com/) informed the client-story content and linked journal cards. [Whipsaw’s expertise](https://www.whipsaw.com/expertise) and [Instrument’s services](https://www.instrument.com/services/) informed Service Showcase’s descriptions and capabilities.

These adapt the observed content structures. Anticraft’s controls, transitions, source, and example artwork are original. Source notes on each component distinguish the reference from the adaptation.

Button studies also reviewed [Form Studio’s submitted button composition](https://www.awwwards.com/inspiration/button-animation-form-studio), [Noomo’s contact CTA](https://noomoagency.com/our-story), and current submissions such as [FD.EXP](https://www.awwwards.com/sites/fd-exp). The six new buttons explore original variations in arrows, typography, color fills, shutters, outlines, and mechanical feedback; they do not reproduce those sites’ source or assets.

## Contributing

Keep reusable component code in `src/components/anticraft`, with one stylesheet beside each component. Add the matching catalog entry in `src/lib/catalog.ts` and installable file pair in `registry.json`. Document props, provide a live demo, and check keyboard, touch, and reduced-motion behavior.

## License

[MIT](LICENSE). Free to use, modify, and ship.
