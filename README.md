# Anticraft UI

**Premium design. Free source.**

An open-source collection of expressive React components for websites with a point of view. Copy the source, make it your own, and ship it in personal or commercial projects under the MIT license.

The documentation website uses **Next.js App Router and TypeScript**, with a categorized component catalog at `/components`, individual demo pages, installation instructions, and source you can copy. The components themselves use React and plain CSS; they do not require Tailwind or an animation library.

## The collection

| Category | Components |
| --- | --- |
| Navigation | Floating Dock, Sliding Nav, Expanding Menu, Radial Nav, Curtain Menu |
| Experiments | Scratch Reveal, Pixel Swap, Cursor Trail, Throw Stack, Elastic Type, Peel Reveal, Orbit Gallery, Lenticular Panel, Sticker Field, Spine Archive, Morphing Stage |
| Backgrounds | Ripple Field, Aurora Background |
| Buttons | Magnetic Button |
| Typography | Split Flap, Split Text, Gradient Text |
| Cards | Before After, Spotlight Card, Tilt Card, Border Beam |
| Layout | Marquee, Editorial Accordion |

All 28 components are included in the repository and local shadcn registry. The newest additions explore texture and transformation: scratchable foil, a pixel wipe, water-like ripples, a before-and-after comparison, and a mechanical split-flap display. Each includes an original live demo, editable source, and prop documentation. Scratch Reveal has a button alternative to painting; Before After uses a native slider; Split Flap changes only when its text changes. Navigation uses ordinary anchors and keyboard access, and Curtain Menu uses a native modal dialog. Effects honor reduced motion; the marquee also includes a pause control.

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

## Contributing

Keep reusable component code in `src/components/anticraft`, with one stylesheet beside each component. Add the matching catalog entry in `src/lib/catalog.ts` and installable file pair in `registry.json`. Document props, provide a live demo, and check keyboard, touch, and reduced-motion behavior.

## License

[MIT](LICENSE). Free to use, modify, and ship.
