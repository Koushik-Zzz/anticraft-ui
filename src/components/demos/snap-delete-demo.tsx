'use client';

import { useState } from 'react';
import { SnapDelete } from '../anticraft/SnapDelete';
import './snap-delete-demo.css';

type ObjectId = 'note' | 'photo' | 'sticker';
const emptyBoard: Record<ObjectId, boolean> = { note: false, photo: false, sticker: false };
const stickerPoints = Array.from({ length: 32 }, (_, index) => {
  const angle = index * Math.PI / 16 - Math.PI / 2;
  const radius = index % 2 ? 69 : 78;
  return `${(80 + Math.cos(angle) * radius).toFixed(3)},${(80 + Math.sin(angle) * radius).toFixed(3)}`;
}).join(' ');

export function SnapDeleteDemo() {
  const [removed, setRemoved] = useState(emptyBoard);
  const [edition, setEdition] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const remaining = Object.values(removed).filter(value => !value).length;

  function updateObject(id: ObjectId, deleted: boolean) {
    setRemoved(previous => ({ ...previous, [id]: deleted }));
    setAnnouncement('');
  }

  function reset() {
    setEdition(previous => previous + 1);
    setRemoved(emptyBoard);
    setAnnouncement('Board reset. All three objects restored.');
  }

  return <div className="demo snap-delete-demo">
    <div className="snap-board">
      <header className="snap-board__toolbar">
        <span className="snap-board__mark" aria-hidden="true"><i/><i/><i/><i/></span>
        <div className="snap-board__title"><span>Canvas</span><span aria-hidden="true">/</span><h2>Coastal escape</h2></div>
        <span className="snap-board__count"><i aria-hidden="true"/>{remaining} {remaining === 1 ? 'object' : 'objects'}</span>
        <button type="button" className="snap-board__reset" onClick={reset} aria-label="Reset board">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4v5h5M3.5 8.5A7 7 0 1 1 4 14"/></svg><span>Reset</span>
        </button>
      </header>

      <div className="snap-board__canvas" role="group" aria-label="Creative board with three removable objects">
        <section className="snap-board__object snap-board__object--note" aria-label="Text example">
          <SnapDelete key={`note-${edition}`} label="field note" className="snap-board__delete" onDelete={() => updateObject('note', true)} onRestore={() => updateObject('note', false)}>
            <article className="snap-board__note">
              <div className="snap-board__note-top"><span>FIELD NOTE</span><span>01</span></div>
              <p>Take the<br/>scenic route.</p>
              <div className="snap-board__note-bottom"><span>Leave Friday.<br/>Back on Sunday.</span><span aria-hidden="true">↗</span></div>
            </article>
          </SnapDelete>
          <p className="snap-board__object-label">01 <span>Text</span></p>
        </section>

        <section className="snap-board__object snap-board__object--photo" aria-label="Image example">
          <SnapDelete key={`photo-${edition}`} label="coastline image" className="snap-board__delete" onDelete={() => updateObject('photo', true)} onRestore={() => updateObject('photo', false)}>
            <figure className="snap-board__photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/demos/atlas-coast.webp" width={1672} height={941} alt="Coastal cliffs and a winding road above the ocean at sunset" draggable={false} loading="eager" decoding="sync"/>
              <figcaption><span>Coastline study, 01</span><span>↗</span></figcaption>
            </figure>
          </SnapDelete>
          <p className="snap-board__object-label">02 <span>Image</span></p>
        </section>

        <section className="snap-board__object snap-board__object--sticker" aria-label="Sticker example">
          <SnapDelete key={`sticker-${edition}`} label="off grid sticker" className="snap-board__delete" onDelete={() => updateObject('sticker', true)} onRestore={() => updateObject('sticker', false)}>
            <div className="snap-board__sticker">
              <svg viewBox="0 0 160 160" fill="none" aria-hidden="true"><polygon points={stickerPoints} fill="#ef9a56" stroke="#ffe2b8" strokeWidth="2.5"/></svg>
              <span className="snap-board__sticker-type">off<br/><em>grid.</em></span>
              <span className="snap-board__sticker-star" aria-hidden="true">✳</span>
            </div>
          </SnapDelete>
          <p className="snap-board__object-label">03 <span>Sticker</span></p>
        </section>
      </div>

      <footer className="snap-board__footer"><span className="snap-board__effect-name"><i aria-hidden="true"/>Snap Delete</span><p>Delete an object. Undo brings it back.</p><span className="snap-board__zoom" aria-hidden="true">100%</span></footer>
    </div>
    <span className="snap-board__announcement" role="status">{announcement}</span>
  </div>;
}
