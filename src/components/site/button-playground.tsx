'use client';

import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import { ArrowCapsuleButton } from '@/components/anticraft/ArrowCapsuleButton';
import { RollingTextButton } from '@/components/anticraft/RollingTextButton';
import { CircleFillButton } from '@/components/anticraft/CircleFillButton';
import { ShutterButton } from '@/components/anticraft/ShutterButton';
import { OutlineTraceButton } from '@/components/anticraft/OutlineTraceButton';
import { TactileButton } from '@/components/anticraft/TactileButton';
import { MagneticButton } from '@/components/anticraft/MagneticButton';
import { CopyButton } from './copy-button';
import { Icon } from './icon';
import './button-playground.css';

const variants = [
  { id: 'arrow-capsule-button', name: 'Arrow Capsule', component: 'ArrowCapsuleButton', hint: 'A little direction. A clear invitation.' },
  { id: 'rolling-text-button', name: 'Rolling Text', component: 'RollingTextButton', hint: 'A typographic detail, one letter at a time.' },
  { id: 'circle-fill-button', name: 'Circle Fill', component: 'CircleFillButton', hint: 'A quiet outline with a generous reveal.' },
  { id: 'shutter-button', name: 'Shutter', component: 'ShutterButton', hint: 'Two opposing panels. One confident action.' },
  { id: 'outline-trace-button', name: 'Outline Trace', component: 'OutlineTraceButton', hint: 'A fine line that follows your intention.' },
  { id: 'tactile-button', name: 'Tactile', component: 'TactileButton', hint: 'A raised surface with a satisfying press.' },
  { id: 'magnetic-button', name: 'Magnetic', component: 'MagneticButton', hint: 'A surface that gently follows your pointer.' },
] as const;

type Variant = typeof variants[number]['id'];
type Size = 'small' | 'medium' | 'large';

const palettes = [
  { name: 'Moss', background: '#e2ead8', text: '#243026', accent: '#243026' },
  { name: 'Terra', background: '#efb093', text: '#34271f', accent: '#693d2e' },
  { name: 'Ink', background: '#282b26', text: '#f4f4e9', accent: '#d5ef96' },
];

const sizes: Record<Size, { fontSize: number; minHeight: number }> = {
  small: { fontSize: 13, minHeight: 52 },
  medium: { fontSize: 15, minHeight: 60 },
  large: { fontSize: 18, minHeight: 68 },
};

/** Choose a readable label for the filled hover/pressed surface. */
function contrastingInk(color: string) {
  const channels = [1, 3, 5].map((offset) => {
    const channel = parseInt(color.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return luminance > 0.179 ? '#171914' : '#fffdf6';
}

function buttonStyle(variant: Variant, background: string, text: string, accent: string, size: Size, radius: number): CSSProperties {
  const shared = { ...sizes[size], borderRadius: radius, minWidth: 0, maxWidth: '100%', overflowWrap: 'anywhere' as const };
  const activeInk = contrastingInk(accent);
  const variables: Record<Variant, Record<string, string>> = {
    'arrow-capsule-button': {
      '--ac-arrow-bg': background,
      '--ac-arrow-color': text,
      '--ac-arrow-circle-bg': accent,
      '--ac-arrow-circle-color': activeInk,
      '--ac-arrow-hover-bg': background,
      '--ac-arrow-active-bg': background,
      '--ac-arrow-focus': accent,
      '--ac-arrow-press-ring': text,
    },
    'rolling-text-button': {
      '--ac-roll-bg': background,
      '--ac-roll-color': text,
      '--ac-roll-border': accent,
      '--ac-roll-hover-bg': background,
      '--ac-roll-active-bg': background,
      '--ac-roll-focus': accent,
      '--ac-roll-press-ring': accent,
    },
    'circle-fill-button': {
      '--ac-fill-background': background,
      '--ac-fill-foreground': text,
      '--ac-fill-accent': accent,
      '--ac-fill-active-foreground': activeInk,
      '--ac-fill-border': accent,
      '--ac-fill-focus': accent,
    },
    'shutter-button': {
      '--ac-shutter-background': background,
      '--ac-shutter-foreground': text,
      '--ac-shutter-panel': accent,
      '--ac-shutter-active-foreground': activeInk,
      '--ac-shutter-border': accent,
      '--ac-shutter-focus': accent,
    },
    'outline-trace-button': {
      '--ac-trace-radius': `${radius}px`,
      '--ac-trace-surface': background,
      '--ac-trace-ink': text,
      '--ac-trace-accent': accent,
      '--ac-trace-line': `${text}55`,
    },
    'tactile-button': {
      '--ac-tactile-radius': `${radius}px`,
      '--ac-tactile-surface': background,
      '--ac-tactile-ink': text,
      '--ac-tactile-base': accent,
      '--ac-tactile-line': accent,
    },
    'magnetic-button': {
      '--ac-accent': background,
      '--ac-accent-hover': background,
      '--ac-ink': text,
      '--ac-focus': accent,
    },
  };
  return { ...shared, ...variables[variant] } as CSSProperties;
}

function generateCode(component: string, label: string, style: CSSProperties, disabled: boolean) {
  return `'use client';\n\nimport { useState, type CSSProperties } from 'react';\nimport { ${component} } from '@/components/anticraft/${component}';\n\nconst buttonStyle = ${JSON.stringify(style, null, 2)} as CSSProperties;\n\nexport function Example() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <${component}\n        type="button"\n        style={buttonStyle}${component === 'MagneticButton' ? '\n        strength={0.2}' : ''}\n        disabled={${disabled}}${label.trim() ? '' : '\n        aria-label="Button preview"'}\n        onClick={() => setCount(value => value + 1)}\n      >\n        {${JSON.stringify(label)}}\n      </${component}>\n      <p role="status">\n        {count ? \`Demo action activated \${count} times.\` : 'Try the button.'}\n      </p>\n    </div>\n  );\n}\n`;
}

export function ButtonPlayground() {
  const [variant, setVariant] = useState<Variant>('arrow-capsule-button');
  const [label, setLabel] = useState('Make something good');
  const [background, setBackground] = useState(palettes[0].background);
  const [text, setText] = useState(palettes[0].text);
  const [accent, setAccent] = useState(palettes[0].accent);
  const [size, setSize] = useState<Size>('medium');
  const [radius, setRadius] = useState(24);
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(0);
  const selected = variants.find((item) => item.id === variant)!;
  const style = buttonStyle(variant, background, text, accent, size, radius);
  const code = generateCode(selected.component, label, style, disabled);
  const props = {
    type: 'button' as const,
    style,
    disabled,
    'aria-label': label.trim() ? undefined : 'Button preview',
    onClick: () => setCount((value) => value + 1),
    children: label,
  };

  function reset() {
    setVariant('arrow-capsule-button');
    setLabel('Make something good');
    setBackground(palettes[0].background);
    setText(palettes[0].text);
    setAccent(palettes[0].accent);
    setSize('medium');
    setRadius(24);
    setDisabled(false);
    setCount(0);
  }

  return (
    <main id="main-content" className="catalog-page button-playground-page">
      <div className="doc-breadcrumb">
        <Icon name="grid" size={14}/>
        <Link href="/components/buttons">Buttons</Link>
        <span aria-hidden="true">/</span>
        <span>Playground</span>
      </div>
      <div className="catalog-heading">
        <span className="eyebrow">A LITTLE ROOM TO PLAY</span>
        <h1>Your words.<br/><em>Your kind of click.</em></h1>
        <p>Pick an interaction, find your colors, and make the details yours. The code follows along.</p>
      </div>
      <div className="button-playground-workspace">
        <section className="button-playground-controls" aria-labelledby="button-controls-title">
          <div className="button-playground-panel-heading">
            <h2 id="button-controls-title">Make it yours</h2>
            <button type="button" className="button-playground-reset" onClick={reset}>Reset</button>
          </div>
          <label className="button-playground-field">
            <span>Interaction</span>
            <select value={variant} onChange={(event) => { setVariant(event.target.value as Variant); setCount(0); }}>
              {variants.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="button-playground-field">
            <span>Button label <span className="button-playground-optional">{label.length}/80</span></span>
            <input type="text" aria-label="Button label" maxLength={80} value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Your call to action"/>
          </label>
          <fieldset className="button-playground-fieldset">
            <legend>Palette</legend>
            <div className="button-playground-palettes">
              {palettes.map((palette) => (
                <button
                  key={palette.name}
                  type="button"
                  aria-pressed={background === palette.background && text === palette.text && accent === palette.accent}
                  onClick={() => { setBackground(palette.background); setText(palette.text); setAccent(palette.accent); }}
                >
                  <span className="button-playground-palette-dot" style={{ background: palette.background, color: palette.text }} aria-hidden="true">a</span>
                  {palette.name}
                </button>
              ))}
            </div>
            <div className="button-playground-colors">
              {[
                { name: 'Background', value: background, set: setBackground },
                { name: 'Text', value: text, set: setText },
                { name: 'Accent', value: accent, set: setAccent },
              ].map((color) => (
                <label key={color.name}>
                  <span>{color.name}</span>
                  <span className="button-playground-color-input"><input type="color" value={color.value} onChange={(event) => color.set(event.target.value)}/><span aria-hidden="true">{color.value}</span></span>
                </label>
              ))}
            </div>
            <p className="button-playground-field-note">Accent colors the icon, fill, border, base, or focus ring for your chosen interaction.</p>
          </fieldset>
          <fieldset className="button-playground-fieldset">
            <legend>Size</legend>
            <div className="button-playground-sizes">
              {(['small', 'medium', 'large'] as const).map((value) => (
                <button key={value} type="button" aria-pressed={size === value} onClick={() => setSize(value)}>{value}</button>
              ))}
            </div>
          </fieldset>
          <label className="button-playground-field button-playground-radius">
            <span>Corner radius <output>{radius}px</output></span>
            <input type="range" aria-label="Corner radius" min={0} max={32} step={1} value={radius} onChange={(event) => setRadius(Number(event.target.value))}/>
          </label>
          <label className="button-playground-checkbox"><input type="checkbox" checked={disabled} onChange={(event) => setDisabled(event.target.checked)}/><span>Disabled state</span></label>
        </section>
        <section className="button-playground-preview-panel" aria-labelledby="button-preview-title">
          <div className="button-playground-preview-top"><h2 id="button-preview-title">Live preview</h2><span><span className="status-dot"/> {disabled ? 'DISABLED' : 'READY TO TRY'}</span></div>
          <div className="button-playground-preview">
            <span className="button-playground-preview-index" aria-hidden="true">{String(variants.findIndex((item) => item.id === variant) + 1).padStart(2, '0')} / 07</span>
            <div className="button-playground-button" data-variant={variant}>
              {variant === 'arrow-capsule-button' && <ArrowCapsuleButton {...props}/>}
              {variant === 'rolling-text-button' && <RollingTextButton {...props}/>}
              {variant === 'circle-fill-button' && <CircleFillButton {...props}/>}
              {variant === 'shutter-button' && <ShutterButton {...props}/>}
              {variant === 'outline-trace-button' && <OutlineTraceButton {...props}/>}
              {variant === 'tactile-button' && <TactileButton {...props}/>}
              {variant === 'magnetic-button' && <MagneticButton {...props}/>}
            </div>
            <p role="status" className="button-playground-activation">{count ? `Demo action activated ${count} ${count === 1 ? 'time' : 'times'}.` : disabled ? 'Enable the button to try its action.' : 'Hover, focus, or press to try it.'}</p>
          </div>
          <div className="button-playground-preview-bottom"><div><h3>{selected.name}</h3><p>{selected.hint}</p></div><Link href={`/components/${variant}`} aria-label={`View ${selected.name} documentation`}><Icon name="arrow" size={18}/></Link></div>
          <p className="button-playground-access-note">Native keyboard and touch controls. Reduced motion built in. Connect the click handler to your own action.</p>
        </section>
      </div>
      <section className="button-playground-source" aria-labelledby="button-code-title">
        <div className="button-playground-source-intro"><div><span className="eyebrow">TAKE IT WITH YOU</span><h2 id="button-code-title">Your button, ready to build.</h2><p>Install <Link href={`/components/${variant}`}>{selected.name}</Link>, then copy this example into your app.</p></div><Link href={`/components/${variant}`} className="button-playground-install">Installation <Icon name="arrow" size={13}/></Link></div>
        <div className="code-block"><div className="code-heading"><span>Example.tsx</span><CopyButton key={code} text={code} label="Copy code"/></div><pre tabIndex={0} aria-label="Generated button example"><code>{code}</code></pre></div>
      </section>
    </main>
  );
}
