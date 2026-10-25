"use client";

import { useEffect, useState } from 'react';
import type { ComponentDefinition } from '@/lib/catalog';
import { ComponentDemo } from '@/components/demos/component-demo';
import { Icon } from './icon';
import { CopyButton } from './copy-button';

export function CodeBlock({ code, label = 'TypeScript' }: { code: string; label?: string }) {
  return <div className="code-block"><div className="code-heading"><span>{label}</span><CopyButton key={code} text={code}/></div><pre className="doc-code" tabIndex={0}><code>{code}</code></pre></div>;
}

function SourceFiles({ item, source, css }: { item: ComponentDefinition; source: string; css: string }) {
  const [file, setFile] = useState<'react' | 'css'>('react');
  const code = file === 'react' ? source : css;
  return <div className="source-files"><div className="source-files-tabs" aria-label="Source file"><button aria-pressed={file === 'react'} onClick={() => setFile('react')}>{item.file}</button><button aria-pressed={file === 'css'} onClick={() => setFile('css')}>{item.cssFile}</button></div><CodeBlock code={code} label={file === 'react' ? 'REACT / TYPESCRIPT' : 'STYLES / CSS'}/></div>;
}

export function ComponentWorkbench({ item, source, css }: { item: ComponentDefinition; source: string; css: string }) {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [replay, setReplay] = useState(0);
  const [accent, setAccent] = useState<string>();
  const [intensity, setIntensity] = useState(item.slug === 'tilt-card' ? 0.4 : 0.2);
  const customColor = ['aurora-background', 'spotlight-card', 'gradient-text', 'border-beam'].includes(item.slug);
  const customIntensity = ['magnetic-button', 'tilt-card'].includes(item.slug);
  return <div className="component-workbench"><div className="workbench-toolbar"><div className="preview-tabs" role="tablist" aria-label="Component view">{(['preview', 'code'] as const).map((tab) => <button key={tab} id={`view-${tab}`} role="tab" aria-selected={view === tab} aria-controls={`panel-${tab}`} tabIndex={view === tab ? 0 : -1} onClick={() => setView(tab)} onKeyDown={(event) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'preview' : event.key === 'End' ? 'code' : tab === 'preview' ? 'code' : 'preview'; setView(next); document.getElementById(`view-${next}`)?.focus(); }
  }}>{tab === 'preview' ? <Icon name="grid" size={14}/> : <Icon name="code" size={16}/>} {tab === 'preview' ? 'Preview' : 'Code'}</button>)}</div><div className="workbench-meta"><span>React + CSS</span><button aria-label="Replay component preview" title="Replay preview" onClick={() => setReplay(replay + 1)}><Icon name="refresh" size={15}/></button></div></div>
    <div id="panel-preview" role="tabpanel" aria-labelledby="view-preview" hidden={view !== 'preview'}><div className="component-playground"><ComponentDemo key={`${item.slug}-${replay}`} slug={item.slug} options={{ accent, intensity }}/></div><div className="playground-controls"><span className="playground-hint"><span className="status-dot"/>Live component. Go ahead, interact.</span>{customColor && <div className="color-controls"><span>Accent</span>{['#e89c62', '#b8a0e9', '#c5e4a2'].map((color) => <button key={color} style={{ background: color }} aria-label={`Set accent to ${color}`} aria-pressed={accent === color} onClick={() => setAccent(color)}/>)}</div>}{customIntensity && <label className="intensity-control">{item.slug === 'tilt-card' ? 'Rotation' : 'Pull'}<input type="range" aria-label={item.slug === 'tilt-card' ? 'Tilt rotation' : 'Magnetic strength'} min="0" max="1" step="0.05" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))}/></label>}</div></div>
    <div id="panel-code" role="tabpanel" aria-labelledby="view-code" hidden={view !== 'code'}><SourceFiles item={item} source={source} css={css}/></div>
  </div>;
}

export function InstallPanel({ item, source, css }: { item: ComponentDefinition; source: string; css: string }) {
  const [method, setMethod] = useState<'cli' | 'manual'>('cli');
  const [manager, setManager] = useState('npm');
  const [origin, setOrigin] = useState('http://localhost:5173');
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const commands: Record<string, string> = { npm: 'npx shadcn@latest add', pnpm: 'pnpm dlx shadcn@latest add', bun: 'bunx --bun shadcn@latest add' };
  const command = `${commands[manager]} ${origin}/r/${item.slug}.json`;
  return <div className="install-panel"><div className="install-method" aria-label="Installation method"><button aria-pressed={method === 'cli'} onClick={() => setMethod('cli')}><Icon name="terminal" size={15}/>CLI</button><button aria-pressed={method === 'manual'} onClick={() => setMethod('manual')}><Icon name="code" size={16}/>Manual</button></div>{method === 'cli' ? <><p>Run this in your shadcn-configured React project. The component and stylesheet are added together.</p><div className="package-tabs" aria-label="Package manager">{['npm', 'pnpm', 'bun'].map((name) => <button aria-pressed={manager === name} onClick={() => setManager(name)} key={name}>{name}</button>)}</div><CodeBlock code={command} label="TERMINAL"/><p className="code-note">This command uses the current site address. For localhost, keep this preview running on the same computer. Files follow your configured components alias.</p></> : <><p>Copy both files into <code>components/anticraft</code> in your React project. Keep them in the same folder: the React file imports its stylesheet.</p><SourceFiles item={item} source={source} css={css}/><p className="code-note">For Next.js, the interactive components already include a client directive. No animation dependencies or Tailwind configuration required.</p></>}</div>;
}
