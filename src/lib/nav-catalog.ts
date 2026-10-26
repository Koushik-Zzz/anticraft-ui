import type { ComponentDefinition } from './catalog';

function navigationProps(itemType: string, label: string): ComponentDefinition['props'] {
  return [
    { name: 'items', type: `${itemType}[]`, default: 'Required', description: 'Destinations with a unique id, visible label, and real href. Replace the example URLs with destinations in your project.' },
    { name: 'activeId', type: 'string', default: 'undefined', description: 'The controlled id of the current destination. Only that link receives aria-current="page". Update this from your route or selected section.' },
    { name: 'label', type: 'string', default: `'${label}'`, description: 'The accessible navigation label. Disclosure components also use it for their visible trigger.' },
    { name: 'onNavigate', type: '(id: string, event: MouseEvent<HTMLAnchorElement>) => void', default: 'undefined', description: 'Runs when a destination is activated. Anchors navigate normally; call event.preventDefault() only when handling navigation yourself, such as a local preview or router adapter.' },
    { name: 'className', type: 'string', default: "''", description: 'Additional classes for sizing and CSS custom properties. Each component imports its matching stylesheet; keep both files together.' },
  ];
}

const openChangeProp = { name: 'onOpenChange', type: '(open: boolean) => void', default: 'undefined', description: 'Receives changes to the internal disclosure state when visitors open, dismiss, or navigate.' };

export const navComponents: ComponentDefinition[] = [
  {
    slug: 'floating-dock', title: 'Floating Dock', category: 'Navigation', tag: 'New',
    description: 'A little lift for every destination. Icons grow and make room as your pointer passes.',
    file: 'FloatingDock.tsx', cssFile: 'floating-dock.css',
    usage: `import { FloatingDock } from '@/components/anticraft/FloatingDock';

export function Example() {
  return (
    <FloatingDock
      activeId="work"
      label="Studio navigation"
      items={[
        { id: 'work', label: 'Work', href: '/#work', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 10h16M10 10v10" /></svg> },
        { id: 'about', label: 'About', href: '/#about', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></svg> },
        { id: 'contact', label: 'Contact', href: '/#contact', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg> },
      ]}
    />
  );
}`,
    props: [
      ...navigationProps('FloatingDockItem', 'Primary navigation'),
      { name: 'items[].icon', type: 'ReactNode', default: 'Required', description: 'Decorative artwork for each destination. Links receive their accessible name from label; do not put interactive elements inside icons.' },
    ],
    motion: 'Fine mouse movement magnifies nearby artwork while the fixed link targets remain easy to hit. Hover or keyboard focus reveals a label; the current destination has a small marker. Tab reaches every link, and Left/Right, Home, and End provide optional shortcuts. Long docks scroll horizontally. Coarse pointers and reduced motion keep artwork still. Customize the surface, icons, label, and focus colors with --ac-dock-* properties.',
  },
  {
    slug: 'sliding-nav', title: 'Sliding Nav', category: 'Navigation', tag: 'New',
    description: 'An ink pill that follows your attention, then settles back on the place you call home.',
    file: 'SlidingNav.tsx', cssFile: 'sliding-nav.css',
    usage: `import { SlidingNav } from '@/components/anticraft/SlidingNav';

export function Example() {
  return (
    <SlidingNav
      activeId="work"
      label="Studio sections"
      items={[
        { id: 'work', label: 'Selected work', href: '/#work' },
        { id: 'about', label: 'The studio', href: '/#about' },
        { id: 'contact', label: 'Say hello', href: '/#contact' },
      ]}
    />
  );
}`,
    props: navigationProps('SlidingNavItem', 'Primary navigation'),
    motion: 'Hover or focus moves the shared indicator; leaving the navigation restores activeId. The active page stays separate from the transient preview. Every link remains in the ordinary Tab order, with optional Left/Right, Home, and End shortcuts. Measurements update after resizing, scrolling, and font loading. The strip scrolls horizontally on narrow screens. Reduced motion removes indicator and color transitions. Theme it with --ac-sliding-surface, --ac-sliding-color, --ac-sliding-active-surface, and --ac-sliding-active-color.',
  },
  {
    slug: 'expanding-menu', title: 'Expanding Menu', category: 'Navigation', tag: 'New',
    description: 'One compact capsule unfolds into an editorial index. A small entrance to a bigger world.',
    file: 'ExpandingMenu.tsx', cssFile: 'expanding-menu.css',
    usage: `import { ExpandingMenu } from '@/components/anticraft/ExpandingMenu';

export function Example() {
  return (
    <ExpandingMenu
      label="Find your way"
      activeId="work"
      items={[
        { id: 'work', label: 'Selected work', href: '/#work', description: 'A few things we put into the world.' },
        { id: 'about', label: 'The studio', href: '/#about', description: 'People, process, and a point of view.' },
        { id: 'contact', label: 'Start something', href: '/#contact', description: 'Good things begin with a conversation.' },
      ]}
    />
  );
}`,
    props: [
      ...navigationProps('ExpandingMenuItem', 'Menu'),
      { name: 'items[].description', type: 'string', default: 'undefined', description: 'Optional supporting text beneath a destination label.' },
      openChangeProp,
    ],
    motion: 'Click, tap, Enter, or Space toggles the disclosure. Up/Down on its trigger opens and focuses the last/first link. Ordinary Tab order reaches the revealed links; Escape returns focus to the trigger. Outside presses, focus leaving the component, and link activation dismiss it. Closed links are hidden and removed from the focus order. The disclosure expands in normal document flow and leaves the rest of the page available. Reduced motion removes the opening animation. Set --ac-surface, --ac-ink, --ac-accent, and --ac-serif to match your site.',
  },
  {
    slug: 'radial-nav', title: 'Radial Nav', category: 'Navigation', tag: 'New',
    description: 'A constellation of destinations around one central idea. Open up and choose a direction.',
    file: 'RadialNav.tsx', cssFile: 'radial-nav.css',
    usage: `import { RadialNav } from '@/components/anticraft/RadialNav';

export function Example() {
  const icon = <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 19 19 5M5 5h14v14" /></svg>;
  return (
    <RadialNav
      label="Explore"
      activeId="work"
      items={[
        { id: 'work', label: 'Work', href: '/#work', icon },
        { id: 'about', label: 'About', href: '/#about', icon },
        { id: 'journal', label: 'Journal', href: '/#journal', icon },
        { id: 'contact', label: 'Contact', href: '/#contact', icon },
      ]}
    />
  );
}`,
    props: [
      ...navigationProps('RadialNavItem', 'Explore'),
      { name: 'items[].icon', type: 'ReactNode', default: 'Required', description: 'Decorative artwork for a destination. Use short labels and a small group of destinations so links have room around the orbit.' },
      openChangeProp,
    ],
    motion: 'Click or tap the center to reveal the destinations. Enter and Space operate its native button. Arrow keys open the orbit and move between links; Home and End reach its edges. Tab also follows the normal document order. Escape closes and restores trigger focus; outside presses, focus leaving, and link activation dismiss it. Closed links are hidden from interaction and assistive technology. Reduced motion reveals the links without radial animation. Set --ac-radial-height for the stage and --ac-surface, --ac-ink, and --ac-accent for its palette.',
  },
  {
    slug: 'curtain-menu', title: 'Curtain Menu', category: 'Navigation', tag: 'New',
    description: 'Give navigation the whole stage. A sweeping curtain makes way for oversized destinations.',
    file: 'CurtainMenu.tsx', cssFile: 'curtain-menu.css',
    usage: `import { CurtainMenu } from '@/components/anticraft/CurtainMenu';

export function Example() {
  return (
    <CurtainMenu
      label="Explore menu"
      title="Where next?"
      activeId="work"
      footer={<a href="mailto:hello@example.com">Have a project in mind? Say hello ↗</a>}
      items={[
        { id: 'work', label: 'Selected work', href: '/#work', description: 'Made with a point of view.' },
        { id: 'about', label: 'The studio', href: '/#about', description: 'A few good people and a lot of curiosity.' },
        { id: 'contact', label: 'Let’s talk', href: '/#contact', description: 'Your next good idea starts here.' },
      ]}
    />
  );
}`,
    props: [
      ...navigationProps('CurtainMenuItem', 'Explore menu'),
      { name: 'items[].description', type: 'string', default: 'undefined', description: 'Optional supporting text beside each destination; it moves below the label on small screens.' },
      { name: 'title', type: 'string', default: "'Where next?'", description: 'The visible heading and accessible name for the modal navigation sheet.' },
      { name: 'footer', type: 'ReactNode', default: 'undefined', description: 'Optional supporting content or links beneath the destinations.' },
      openChangeProp,
    ],
    motion: 'The trigger opens a native modal dialog above the page. Its close control receives initial focus; the browser keeps keyboard focus in the dialog and makes the background unavailable. Escape, Close, or destination activation dismisses it and restores trigger focus. Closed navigation stays out of the focus order. The sheet scrolls independently for longer content. Reduced motion removes the curtain sweep and row entrances. Set --ac-curtain-background, --ac-curtain-foreground, --ac-curtain-accent, and --ac-curtain-display-font to style the sheet.',
  },
];
