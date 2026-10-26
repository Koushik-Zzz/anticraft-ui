import type { ComponentDefinition } from './catalog';

export const buttonComponents: ComponentDefinition[] = [
  {
    slug: "arrow-capsule-button",
    title: "Arrow Capsule Button",
    category: "Buttons",
    tag: "New",
    description: "A clear call to action with a circular arrow that slides into its next direction.",
    file: "ArrowCapsuleButton.tsx",
    cssFile: "arrow-capsule-button.css",
    useCases: [
      "Contact actions",
      "Hero calls to action",
      "Project enquiries"
    ],
    props: [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "Required",
        "description": "A meaningful button label. Keep children non-interactive; decorative icons should be hidden from assistive technology."
      },
      {
        "name": "icon",
        "type": "ReactNode",
        "default": "Diagonal arrow",
        "description": "An optional decorative replacement icon, repeated inside the circle. It is hidden from assistive technology and made inert; keep it non-interactive."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-arrow-bg, --ac-arrow-color, --ac-arrow-circle-bg, --ac-arrow-circle-color, --ac-arrow-hover-bg, and --ac-arrow-focus."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "ArrowCapsuleButton accepts an optional decorative icon. The default arrow repeats inside a clipped circle on fine-pointer hover or visible keyboard focus. Its hit area stays still. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { ArrowCapsuleButton } from '@/components/anticraft/ArrowCapsuleButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <ArrowCapsuleButton onClick={() => setCount(value => value + 1)}>\n        Let’s work together\n      </ArrowCapsuleButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
  {
    slug: "rolling-text-button",
    title: "Rolling Text Button",
    category: "Buttons",
    tag: "New",
    description: "A typographic button whose letters roll into place, one small detail at a time.",
    file: "RollingTextButton.tsx",
    cssFile: "rolling-text-button.css",
    useCases: [
      "Portfolio actions",
      "Creative studio sites",
      "Editorial calls to action"
    ],
    props: [
      {
        "name": "children",
        "type": "string",
        "default": "Required",
        "description": "The visible label. Use plain text; the component supplies a single accessible name."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-roll-bg, --ac-roll-color, --ac-roll-border, --ac-roll-radius, --ac-roll-hover-bg, and --ac-roll-focus."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "A plain-text label rolls in staggered letter pairs on fine-pointer hover or keyboard focus. The accessible label occurs once. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    inspiration: {
      "name": "Noomo Agency — contact CTA",
      "url": "https://noomoagency.com/our-story",
      "note": "Noomo’s rounded contact action and repeated visual Send label informed this typographic button study. Anticraft adds an original per-letter roll with one accessible name, a native disabled state, and reduced-motion support."
    },
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { RollingTextButton } from '@/components/anticraft/RollingTextButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <RollingTextButton onClick={() => setCount(value => value + 1)}>\n        Make your move\n      </RollingTextButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
  {
    slug: "circle-fill-button",
    title: "Circle Fill Button",
    category: "Buttons",
    tag: "New",
    description: "An outlined pill that fills with color from a small point at its edge.",
    file: "CircleFillButton.tsx",
    cssFile: "circle-fill-button.css",
    useCases: [
      "Primary actions",
      "Contact forms",
      "Product launches"
    ],
    props: [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "Required",
        "description": "A meaningful button label. Keep children non-interactive; decorative icons should be hidden from assistive technology."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-fill-background, --ac-fill-foreground, --ac-fill-accent, --ac-fill-active-foreground, --ac-fill-border, and --ac-fill-focus."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "A decorative circular color field expands from the lower-left corner on hover or visible focus. Touch input receives a distinct pressed state. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { CircleFillButton } from '@/components/anticraft/CircleFillButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <CircleFillButton onClick={() => setCount(value => value + 1)}>\n        Open possibilities\n      </CircleFillButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
  {
    slug: "shutter-button",
    title: "Shutter Button",
    category: "Buttons",
    tag: "New",
    description: "Two diagonal panels meet behind the label for a confident, architectural click.",
    file: "ShutterButton.tsx",
    cssFile: "shutter-button.css",
    useCases: [
      "Studio enquiries",
      "Product actions",
      "Campaign pages"
    ],
    props: [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "Required",
        "description": "A meaningful button label. Keep children non-interactive; decorative icons should be hidden from assistive technology."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-shutter-background, --ac-shutter-foreground, --ac-shutter-panel, --ac-shutter-active-foreground, --ac-shutter-border, and --ac-shutter-focus."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "Two clipped panels close beneath the label on hover or keyboard focus, while the decorative plus rotates. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { ShutterButton } from '@/components/anticraft/ShutterButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <ShutterButton onClick={() => setCount(value => value + 1)}>\n        Start something\n      </ShutterButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
  {
    slug: "outline-trace-button",
    title: "Outline Trace Button",
    category: "Buttons",
    tag: "New",
    description: "A fine accent line draws around a restrained button, with a quiet arrow lift.",
    file: "OutlineTraceButton.tsx",
    cssFile: "outline-trace-button.css",
    useCases: [
      "Dark hero sections",
      "Technical portfolios",
      "Secondary actions"
    ],
    props: [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "Required",
        "description": "A meaningful button label. Keep children non-interactive; decorative icons should be hidden from assistive technology."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-trace-surface, --ac-trace-ink, --ac-trace-accent, and --ac-trace-line."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "A decorative SVG border draws once around the button on fine-pointer hover or visible keyboard focus. The arrow lifts slightly; there is no looping animation. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { OutlineTraceButton } from '@/components/anticraft/OutlineTraceButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <OutlineTraceButton onClick={() => setCount(value => value + 1)}>\n        Explore the details\n      </OutlineTraceButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
  {
    slug: "tactile-button",
    title: "Tactile Button",
    category: "Buttons",
    tag: "New",
    description: "A raised key with a mechanical press, a steady base, and a satisfying release.",
    file: "TactileButton.tsx",
    cssFile: "tactile-button.css",
    useCases: [
      "Form actions",
      "Creative portfolios",
      "Playful product sites"
    ],
    props: [
      {
        "name": "children",
        "type": "ReactNode",
        "default": "Required",
        "description": "A meaningful button label. Keep children non-interactive; decorative icons should be hidden from assistive technology."
      },
      {
        "name": "type",
        "type": "'button' | 'submit' | 'reset'",
        "default": "'button'",
        "description": "The native button type. Set submit explicitly when the button should submit its associated form."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Disables native activation and decorative hover/pressed effects. The live demo includes a checkbox to inspect this state."
      },
      {
        "name": "onClick",
        "type": "MouseEventHandler<HTMLButtonElement>",
        "default": "undefined",
        "description": "Your action handler. Native keyboard and touch activation use the same handler. Buttons have no built-in navigation, payment, or form-submission action."
      },
      {
        "name": "className / style",
        "type": "string / CSSProperties",
        "default": "'' / undefined",
        "description": "Additional classes and native inline styles. Theme with --ac-tactile-surface, --ac-tactile-ink, --ac-tactile-base, and --ac-tactile-line."
      },
      {
        "name": "Native button props / ref",
        "type": "ButtonHTMLAttributes<HTMLButtonElement> / Ref<HTMLButtonElement>",
        "default": "undefined",
        "description": "Native form, name, value, aria-*, data-*, event, and other button attributes pass through. A forwarded ref points to the actual button. Native disabled behavior is preserved."
      }
    ],
    motion: "A fixed base holds the click target while the raised surface moves into its pressed position. Keyboard Space and touch presses receive the same native feedback. Motion is finite and removed for prefers-reduced-motion. Every variant keeps a visible focus outline, a native button hit area of at least 44px, and a disabled state. In the demo, activation increments a clearly labeled demo counter; connect your own action in your app.",
    usage: "'use client';\n\nimport { useState } from 'react';\nimport { TactileButton } from '@/components/anticraft/TactileButton';\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <TactileButton onClick={() => setCount(value => value + 1)}>\n        Give it a push\n      </TactileButton>\n      <p role=\"status\">{count ? `Demo action activated ${count} times.` : 'Try the button.'}</p>\n    </div>\n  );\n}",
  },
];
