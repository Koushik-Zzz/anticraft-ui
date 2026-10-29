'use client';

import { useState, type ReactNode } from 'react';
import { MorphingPopover } from '../anticraft/MorphingPopover';
import './morphing-popover-demo.css';

function Icon({ name }: { name: 'bell' | 'check' | 'spark' | 'file' | 'arrow' | 'trash' }) {
  const paths: Record<typeof name, ReactNode> = {
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z"/><path d="M10 21h4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z"/><path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z"/></>,
    file: <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></>,
    arrow: <path d="m9 6 6 6-6 6"/>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}

function Trigger({ icon, children, suffix }: { icon: 'bell' | 'check' | 'spark' | 'trash'; children: ReactNode; suffix?: ReactNode }) {
  return <span className="morphing-popover-demo__trigger-content"><span className="morphing-popover-demo__trigger-icon"><Icon name={icon}/></span><span>{children}</span><span className="morphing-popover-demo__trigger-end">{suffix ?? <Icon name="arrow"/>}</span></span>;
}

export function MorphingPopoverDemo() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [read, setRead] = useState(false);
  const [approved, setApproved] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  return <div className="demo morphing-popover-demo">
    <div className="morphing-popover-demo__inner">
      <header className="morphing-popover-demo__header">
        <span className="morphing-popover-demo__eyebrow">Morphing popover</span>
        <h2>A little more, on demand.</h2>
        <p>Open a pill. Close a card.</p>
      </header>

      <div className="morphing-popover-demo__grid">
        <section className="morphing-popover-demo__example" aria-label="Notification example">
          <div className="morphing-popover-demo__stage">
            <MorphingPopover
              label="Project notifications"
              trigger={<Trigger icon={read ? 'check' : 'bell'} suffix={read ? undefined : <span className="morphing-popover-demo__count">2</span>}>{read ? 'All caught up' : 'Project updates'}</Trigger>}
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
            >
              <div className="morphing-popover-demo__panel-heading"><span className="morphing-popover-demo__symbol morphing-popover-demo__symbol--amber"><Icon name="bell"/></span><p>WORKSPACE</p><h3>Project activity</h3></div>
              <div className="morphing-popover-demo__activity">
                <div><span className="morphing-popover-demo__avatar">AM</span><p><strong>Aria mentioned you</strong><span>“The new layout is ready.”</span></p><i data-read={read}/></div>
                <div><span className="morphing-popover-demo__avatar morphing-popover-demo__avatar--green">JL</span><p><strong>Jon added 3 files</strong><span>Brand assets · 12 min ago</span></p><i data-read={read}/></div>
              </div>
              <button className="morphing-popover-demo__primary" type="button" onClick={() => { setRead(value => !value); setNotificationsOpen(false); setAnnouncement(read ? 'Project updates marked unread.' : 'All project updates marked as read.'); }}>{read ? 'Mark as unread' : 'Mark all as read'}<Icon name="check"/></button>
            </MorphingPopover>
          </div>
          <footer><span>01</span><h3>Notifications</h3></footer>
        </section>

        <section className="morphing-popover-demo__example" aria-label="Task assistant example">
          <div className="morphing-popover-demo__stage">
            <MorphingPopover
              label="Review assistant"
              trigger={<Trigger icon={approved ? 'check' : 'spark'}>{approved ? 'Review approved' : 'Review is ready'}</Trigger>}
              open={reviewOpen}
              onOpenChange={setReviewOpen}
            >
              <div className="morphing-popover-demo__panel-heading"><span className="morphing-popover-demo__symbol morphing-popover-demo__symbol--green"><Icon name={approved ? 'check' : 'spark'}/></span><p>REVIEW ASSISTANT</p><h3>{approved ? 'Ready to ship.' : 'Your changes, reviewed.'}</h3></div>
              <p className="morphing-popover-demo__description">{approved ? 'The review is approved. Your team can move to the next step.' : 'The release notes and landing page are ready for your sign-off.'}</p>
              <div className="morphing-popover-demo__files"><div><Icon name="file"/><span>release-notes.md</span><span>+12</span></div><div><Icon name="file"/><span>landing-page.tsx</span><span>+38</span></div></div>
              <div className="morphing-popover-demo__review-status"><span/><span>{approved ? 'Approved by you' : '2 files · No conflicts'}</span></div>
              <button className="morphing-popover-demo__primary" type="button" onClick={() => { setApproved(value => !value); setReviewOpen(false); setAnnouncement(approved ? 'A new review is ready.' : 'Review approved.'); }}>{approved ? 'Start another review' : 'Approve review'}<Icon name="check"/></button>
            </MorphingPopover>
          </div>
          <footer><span>02</span><h3>Task assistant</h3></footer>
        </section>

        <section className="morphing-popover-demo__example" aria-label="Confirmation example">
          <div className="morphing-popover-demo__stage">
            <MorphingPopover
              label="Attachment confirmation"
              trigger={<Trigger icon={removed ? 'check' : 'trash'}>{removed ? 'Attachment removed' : 'Remove attachment'}</Trigger>}
              open={confirmationOpen}
              onOpenChange={setConfirmationOpen}
            >
              <div className="morphing-popover-demo__panel-heading"><span className="morphing-popover-demo__symbol morphing-popover-demo__symbol--rose"><Icon name={removed ? 'check' : 'trash'}/></span><p>ATTACHMENT</p><h3>{removed ? 'Removed from the draft.' : 'Remove this image?'}</h3></div>
              <p className="morphing-popover-demo__description">{removed ? 'The original file is still in your library.' : 'This removes the attachment from your draft. The original stays in your library.'}</p>
              <div className="morphing-popover-demo__attachment" data-removed={removed}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/demos/atlas-coast.webp" width={1672} height={941} alt="Coastal cliffs above the ocean"/>
                <p><strong>coastline.webp</strong><span>Image · 2.4 MB</span></p>
                {removed && <span className="morphing-popover-demo__removed-tag">Removed</span>}
              </div>
              <div className="morphing-popover-demo__actions"><button className="morphing-popover-demo__secondary" type="button" onClick={() => setConfirmationOpen(false)}>{removed ? 'Close' : 'Keep image'}</button><button className={`morphing-popover-demo__primary ${removed ? '' : 'morphing-popover-demo__primary--danger'}`} type="button" onClick={() => { setRemoved(value => !value); setConfirmationOpen(false); setAnnouncement(removed ? 'Attachment restored to the draft.' : 'Attachment removed from the draft.'); }}>{removed ? 'Restore image' : 'Remove image'}</button></div>
            </MorphingPopover>
          </div>
          <footer><span>03</span><h3>Confirmation</h3></footer>
        </section>
      </div>
      <p className="morphing-popover-demo__announcement" role="status" aria-live="polite">{announcement || 'Try an interaction above.'}</p>
    </div>
  </div>;
}
