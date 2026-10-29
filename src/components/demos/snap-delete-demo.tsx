'use client';

import { SnapDelete } from '../anticraft/SnapDelete';
import './snap-delete-demo.css';

export function SnapDeleteDemo({ paused = false }: { paused?: boolean }) {
  return (
    <div className="demo snap-delete-demo" data-paused={paused || undefined}>
      <div className="snap-delete-demo__inner">
        <header className="snap-delete-demo__header">
          <span className="snap-delete-demo__eyebrow">Snap delete</span>
          <h2>Watch it disappear.</h2>
          <p>Delete any item. Undo brings it back.</p>
        </header>

        <div className="snap-delete-demo__grid">
          <section className="snap-delete-demo__example" aria-label="Text example">
            <div className="snap-delete-demo__label"><span>01</span><h3>Text</h3></div>
            <SnapDelete label="draft message" className="snap-delete-demo__delete">
              <div className="snap-delete-demo__text">
                <span className="snap-delete-demo__draft">Unsent draft</span>
                <p className="snap-delete-demo__message">Let’s move the review to Friday.</p>
                <p className="snap-delete-demo__message-note">The updated prototype is ready.</p>
              </div>
            </SnapDelete>
          </section>

          <section className="snap-delete-demo__example" aria-label="Image example">
            <div className="snap-delete-demo__label"><span>02</span><h3>Image</h3></div>
            <SnapDelete label="coastline image" className="snap-delete-demo__delete">
              <figure className="snap-delete-demo__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/demos/atlas-coast.webp" width={1672} height={941} alt="Coastal cliffs and a winding road above the ocean at sunset" draggable={false}/>
                <figcaption><span>Coastline study</span><span>01 / 06</span></figcaption>
              </figure>
            </SnapDelete>
          </section>

          <section className="snap-delete-demo__example" aria-label="Card example">
            <div className="snap-delete-demo__label"><span>03</span><h3>Card</h3></div>
            <SnapDelete label="brand assets card" className="snap-delete-demo__delete">
              <article className="snap-delete-demo__asset">
                <div className="snap-delete-demo__asset-top"><span className="snap-delete-demo__asset-icon" aria-hidden="true">A</span><span className="snap-delete-demo__asset-type">ZIP</span></div>
                <div className="snap-delete-demo__asset-name"><h4>Brand assets</h4><p>Logos, type &amp; color</p></div>
                <div className="snap-delete-demo__asset-bottom"><span>12 files</span><span>24.8 MB</span></div>
              </article>
            </SnapDelete>
          </section>
        </div>
        <p className="snap-delete-demo__footnote"><span aria-hidden="true">↶</span> Nothing leaves this preview.</p>
      </div>
    </div>
  );
}
