'use client';

import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import './routing-scorecard.css';

export type RoutingScorecardModel = {
  id: string;
  name: string;
  /** A supplied evaluation score between 0 and 1, not a live benchmark. */
  score: number;
  task: string;
  color?: string;
  /** Short, decorative mark. Defaults to the first letter of the model name. */
  symbol?: string;
};

export type RoutingScorecardProps = {
  models?: RoutingScorecardModel[];
  defaultThreshold?: number;
  inputLabel?: string;
  title?: string;
  /** Stops motion externally. The visitor can also pause from the built-in control. */
  paused?: boolean;
  className?: string;
};

const palette = ['#c4d5ff', '#d6d1bf', '#cabaff', '#f1d88f', '#b5c9af', '#e5b8e9'];
const exampleModels: RoutingScorecardModel[] = [
  { id: 'atlas', name: 'Atlas', score: .96, task: 'Support triage', symbol: '◇' },
  { id: 'cedar', name: 'Cedar', score: .78, task: 'Classification', symbol: '⌁' },
  { id: 'prism', name: 'Prism', score: .92, task: 'Extraction', symbol: '✳' },
  { id: 'cinder', name: 'Cinder', score: .89, task: 'Code review', symbol: '⌘' },
  { id: 'mosaic', name: 'Mosaic', score: .82, task: 'Summarization', symbol: '▦' },
  { id: 'vector', name: 'Vector', score: .91, task: 'Agent tasks', symbol: '↗' },
];

function normalizedScore(value: number, fallback = 0) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;
}

function noise(a: number, b: number) {
  const value = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

/** An evaluation diagram with supplied scores, a working quality cutoff and ASCII request streams. */
export function RoutingScorecard({
  models: suppliedModels = exampleModels,
  defaultThreshold = .85,
  inputLabel = 'Incoming requests',
  title = 'Route by measured fit',
  paused: externallyPaused = false,
  className = '',
}: RoutingScorecardProps) {
  const uid = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const [threshold, setThreshold] = useState(() => normalizedScore(defaultThreshold, .85));
  const [localPaused, setLocalPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const paused = externallyPaused || localPaused;
  const models = useMemo(() => {
    const seen = new Set<string>();
    return suppliedModels.filter(model => {
      if (!model.id || seen.has(model.id) || !Number.isFinite(model.score)) return false;
      seen.add(model.id);
      return true;
    }).map((model, index) => ({ ...model, score: normalizedScore(model.score), color: model.color || palette[index % palette.length] }));
  }, [suppliedModels]);
  const passing = models.filter(model => model.score >= threshold);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const layout = layoutRef.current;
    const canvas = canvasRef.current;
    if (!section || !layout || !canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let frame = 0;
    let visible = typeof IntersectionObserver === 'undefined';
    let width = 0;
    let height = 0;
    let compact = false;
    let incoming = { left: 0, width: 0, height: 0, top: 0 };
    let previous = 0;
    let lastDraw = 0;
    let stopped = false;
    let routes: { startX: number; startY: number; endX: number; endY: number; color: string; seed: number }[] = [];
    const glyphs = ['·', '+', '×', '=', ':', '*', '○'];

    function draw(time: number) {
      if (!context || width <= 0 || height <= 0) return;
      context.clearRect(0, 0, width, height);
      context.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const leftWidth = incoming.width;
      const midY = incoming.top + incoming.height / 2;
      // A deterministic grid keeps paused and reduced-motion frames complete.
      for (let x = 5; x < leftWidth - 4; x += 10) {
        const progress = x / Math.max(1, leftWidth);
        const envelope = (1 - progress) * incoming.height * .43 + 14;
        for (let offset = -envelope; offset <= envelope; offset += 10) {
          const seed = noise(Math.floor(x / 10), Math.floor(offset / 10));
          const edge = Math.max(0, 1 - Math.abs(offset) / envelope);
          const pulse = .5 + .5 * Math.sin(progress * 16 - time * 1.5 + seed * 5);
          context.globalAlpha = (.12 + seed * .42) * Math.min(1, edge * 3) * (.6 + pulse * .4);
          context.fillStyle = seed > .86 ? '#c4b5f4' : '#b3b29a';
          const character = glyphs[(Math.floor(seed * 21 + time * 1.8 - progress * 4) % glyphs.length + glyphs.length) % glyphs.length];
          context.fillText(character, incoming.left + x, midY + offset + Math.sin(progress * 5 + time * .6) * 3);
        }
      }
      if (!compact) {
        routes.forEach(route => {
          const distance = route.endX - route.startX;
          context.globalAlpha = .16;
          context.strokeStyle = route.color;
          context.lineWidth = .7;
          context.beginPath();
          context.moveTo(route.startX, route.startY);
          context.bezierCurveTo(route.startX + distance * .45, route.startY, route.endX - distance * .35, route.endY, route.endX, route.endY);
          context.stroke();
          for (let index = 0; index < 24; index++) {
            const t = (index / 24 + time * .085 + route.seed * .13) % 1;
            const inv = 1 - t;
            const x = inv ** 3 * route.startX + 3 * inv ** 2 * t * (route.startX + distance * .45) + 3 * inv * t ** 2 * (route.endX - distance * .35) + t ** 3 * route.endX;
            const y = inv ** 3 * route.startY + 3 * inv ** 2 * t * route.startY + 3 * inv * t ** 2 * route.endY + t ** 3 * route.endY;
            context.globalAlpha = .35 + noise(index, route.seed) * .6;
            context.fillStyle = route.color;
            context.fillText(glyphs[(index + route.seed + Math.floor(time * 2)) % glyphs.length], x, y + (noise(index + 7, route.seed) - .5) * 18 * Math.sin(t * Math.PI));
          }
          context.globalAlpha = 1;
          context.fillStyle = route.color;
          context.fillRect(route.startX - 3, route.startY - 3, 6, 6);
        });
      }
      context.globalAlpha = 1;
    }

    function measure() {
      if (!layout || !canvas || !context) return;
      const rect = layout.getBoundingClientRect();
      // DOM rectangles include ancestor transforms; canvas coordinates use the
      // untransformed layout size so scaled catalog previews stay aligned.
      width = layout.clientWidth;
      height = layout.clientHeight;
      const scaleX = rect.width ? width / rect.width : 1;
      const scaleY = rect.height ? height / rect.height : 1;
      compact = width < 800;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const input = layout.querySelector<HTMLElement>('.ac-routing-input')?.getBoundingClientRect();
      incoming = input ? { left: (input.left - rect.left) * scaleX, width: input.width * scaleX, height: input.height * scaleY, top: (input.top - rect.top) * scaleY } : { left: 0, width: 0, height: 0, top: 0 };
      const destinations = new Map(Array.from(layout.querySelectorAll<HTMLElement>('[data-ac-route-target]')).map(element => [element.dataset.acRouteTarget, element]));
      routes = [];
      layout.querySelectorAll<HTMLElement>('[data-ac-route-row]').forEach((row, index) => {
        const destination = destinations.get(row.dataset.acRouteRow);
        if (!destination) return;
        const start = row.getBoundingClientRect();
        const end = destination.getBoundingClientRect();
        const color = getComputedStyle(destination.querySelector('span') || destination).backgroundColor;
        routes.push({ startX: (start.right - rect.left) * scaleX + 1, startY: (start.top - rect.top + start.height / 2) * scaleY, endX: (end.left - rect.left) * scaleX - 10, endY: (end.top - rect.top + end.height / 2) * scaleY, color, seed: index });
      });
      draw(reducedMotion ? 0 : timeRef.current);
    }

    function canRun() { return !stopped && !paused && !reducedMotion && visible && !document.hidden; }
    function tick(now: number) {
      frame = 0;
      if (!canRun()) return;
      if (previous) timeRef.current += Math.min(now - previous, 64) / 1000;
      previous = now;
      if (now - lastDraw >= 32) { draw(timeRef.current); lastDraw = now; }
      frame = requestAnimationFrame(tick);
    }
    function synchronize() {
      if (canRun()) {
        if (!frame) { previous = 0; frame = requestAnimationFrame(tick); }
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    }
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    resize?.observe(layout);
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      synchronize();
    }, { threshold: 0 });
    intersection?.observe(section);
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', synchronize);
    measure();
    synchronize();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      intersection?.disconnect();
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', synchronize);
    };
  }, [models, threshold, paused, reducedMotion]);

  return <section ref={sectionRef} className={`ac-routing-scorecard ${className}`.trim()} aria-labelledby={`${uid}-title`} data-paused={paused || reducedMotion}>
    <header className="ac-routing-toolbar"><span>Evaluation routing <span aria-hidden="true">/</span> {suppliedModels === exampleModels ? 'Sample data' : 'Supplied scores'}</span><button type="button" className="ac-routing-motion" onClick={() => setLocalPaused(value => !value)} disabled={reducedMotion || externallyPaused} aria-label={externallyPaused ? 'Animation paused' : reducedMotion ? 'Animation disabled by reduced motion preference' : paused ? 'Play routing animation' : 'Pause routing animation'}><span aria-hidden="true">{paused || reducedMotion ? '▷' : 'Ⅱ'}</span>{externallyPaused ? 'Animation paused' : reducedMotion ? 'Motion off' : paused ? 'Play' : 'Pause'}</button></header>
    <div className="ac-routing-layout" ref={layoutRef}>
      <canvas className="ac-routing-canvas" ref={canvasRef} aria-hidden="true"/>
      <div className="ac-routing-input"><span>{inputLabel}</span><span className="ac-routing-input-count">1 input <b aria-hidden="true">→</b> {models.length} candidates</span></div>
      <div className="ac-routing-panel">
        <div className="ac-routing-panel-heading"><h2 id={`${uid}-title`}>{title}</h2><span>Supplied evaluation scores</span></div>
        {models.length > 0 ? <div className="ac-routing-matrix" style={{ '--ac-routing-cutoff': `${threshold * 100}%` } as CSSProperties}>
          <div className="ac-routing-axis" aria-hidden="true"><span>0.00</span><span>1.00</span></div>
          <div className="ac-routing-cutoff-field" aria-hidden="true"><div className="ac-routing-cutoff-line"><span style={{ transform: threshold > .85 ? 'translateX(-100%)' : threshold < .15 ? 'none' : undefined }}>{threshold.toFixed(2)} min</span></div></div>
          <ul className="ac-routing-models">{models.map(model => {
            const passes = model.score >= threshold;
            return <li key={model.id} data-ac-route-row={model.id} data-passing={passes} style={{ '--ac-routing-model-color': model.color } as CSSProperties}>
              <span className="ac-routing-model-name"><span className="ac-routing-symbol" aria-hidden="true">{model.symbol || model.name.trim().slice(0, 1) || '·'}</span><span>{model.name || 'Unnamed model'}</span></span>
              <span className="ac-routing-bar" aria-hidden="true"><span style={{ width: `${model.score * 100}%` }}/></span>
              <span className="ac-routing-score">{model.score.toFixed(2)}<span className="ac-routing-sr">, {passes ? 'passes' : 'below'} the quality threshold{passes ? `, routed to ${model.task}` : ''}</span></span>
            </li>;
          })}</ul>
        </div> : <p className="ac-routing-empty">Add evaluation scores to create routes.</p>}
        <div className="ac-routing-threshold-control"><label htmlFor={`${uid}-threshold`}>Quality threshold <output htmlFor={`${uid}-threshold`}>{threshold.toFixed(2)}</output></label><input id={`${uid}-threshold`} type="range" min="0" max="1" step="0.01" value={threshold} onChange={event => setThreshold(normalizedScore(Number(event.target.value)))} aria-valuetext={`${threshold.toFixed(2)} minimum score`}/><div><span>0.00</span><span>1.00</span></div></div>
      </div>
      <div className="ac-routing-outputs" aria-label="Routes passing the quality threshold">
        <p className="ac-routing-route-count" role="status" aria-live="polite" aria-atomic="true">{passing.length} of {models.length} routes active</p>
        <div className="ac-routing-destinations">{passing.map(model => <div key={model.id} className="ac-routing-destination" data-ac-route-target={model.id} style={{ '--ac-routing-model-color': model.color } as CSSProperties}><span>{model.task || 'Unassigned task'}</span><strong>{model.name || 'Unnamed model'}</strong></div>)}</div>
        {passing.length === 0 && <p className="ac-routing-no-routes">{models.length ? 'No scores meet this threshold.' : 'No routes configured.'}</p>}
      </div>
    </div>
  </section>;
}
