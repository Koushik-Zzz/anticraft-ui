'use client';

import { useEffect, useId, useRef, useState } from 'react';
import './showreel-hero.css';

export interface ShowreelHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  poster: string;
  posterAlt?: string;
  videoSrc: string;
  videoLabel?: string;
  captionsSrc?: string;
  transcript?: string;
  className?: string;
}

/** A cinematic poster and an explicitly opened, manually played native video. */
export function ShowreelHero({
  eyebrow,
  title,
  description,
  poster,
  posterAlt = '',
  videoSrc,
  videoLabel = 'Watch the film',
  captionsSrc,
  transcript,
  className = '',
}: ShowreelHeroProps) {
  const [expanded, setExpanded] = useState(false);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const instance = useId();
  const titleId = `ac-showreel-title-${instance}`;
  const dialogId = `ac-showreel-dialog-${instance}`;
  const dialogTitleId = `${dialogId}-title`;

  useEffect(() => {
    if (!expanded) return;
    const modal = dialog.current;
    const player = video.current;
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!modal.open) modal.showModal();
    return () => {
      player?.pause();
      try {
        if (player) player.currentTime = 0;
      } catch {
        // A source with no loaded metadata may not have a seekable timeline yet.
      }
      if (modal.open) modal.close();
      document.body.style.overflow = previousOverflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [expanded]);

  function openFilm() {
    setExpanded(true);
  }

  return (
    <section className={`ac-showreel-hero ${className}`.trim()} aria-labelledby={titleId}>
      <img className="ac-showreel-poster" src={poster} alt={posterAlt} />
      <div className="ac-showreel-shade" aria-hidden="true" />
      <div className="ac-showreel-content">
        <div className="ac-showreel-intro">
          {eyebrow && <p className="ac-showreel-eyebrow">{eyebrow}</p>}
          <h2 id={titleId}>{title}</h2>
        </div>
        <div className="ac-showreel-bottom">
          {description && <p className="ac-showreel-description">{description}</p>}
          <button
            ref={opener}
            type="button"
            className="ac-showreel-play"
            aria-haspopup="dialog"
            aria-expanded={expanded}
            aria-controls={dialogId}
            onClick={openFilm}
          >
            <span className="ac-showreel-play-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M7 4.5v11L15.5 10z" /></svg>
            </span>
            <span>{videoLabel}</span>
            <span className="ac-showreel-play-arrow" aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        id={dialogId}
        className="ac-showreel-dialog"
        aria-labelledby={dialogTitleId}
        onCancel={event => { event.preventDefault(); setExpanded(false); }}
        onClose={() => { if (!dialog.current?.open) setExpanded(false); }}
      >
        <header className="ac-showreel-dialog-header">
          <h2 id={dialogTitleId}>{videoLabel}</h2>
          <button type="button" autoFocus onClick={() => setExpanded(false)}>Close <span aria-hidden="true">×</span></button>
        </header>
        <video
          ref={video}
          className="ac-showreel-video"
          src={videoSrc}
          poster={poster}
          controls
          playsInline
          preload="none"
          aria-label={videoLabel}
          onError={() => setFailedSource(videoSrc)}
          onLoadedMetadata={() => setFailedSource(null)}
        >
          {captionsSrc && <track kind="captions" src={captionsSrc} srcLang="en" label="English captions" default />}
          Your browser cannot play this video. <a href={videoSrc}>Open the video file</a>.
        </video>
        {failedSource === videoSrc && <p className="ac-showreel-error" role="alert">This video could not be loaded. <a href={videoSrc} target="_blank" rel="noreferrer">Open the video file</a> or check the video source.</p>}
        <div className="ac-showreel-dialog-copy">
          <p className="ac-showreel-play-note">Use the player controls to start the film.</p>
          {transcript && <details className="ac-showreel-transcript"><summary>Read the transcript</summary><p>{transcript}</p></details>}
        </div>
      </dialog>
    </section>
  );
}
