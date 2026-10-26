'use client'

import { ProcessTimeline } from '@/components/anticraft/ProcessTimeline'
import './process-demo.css'

function ProcessArt({ phase }: { phase: 'discover' | 'design' | 'build' | 'launch' }) {
  return <div className={`process-demo-art process-demo-art-${phase}`}>
    <div className="process-demo-art-top"><span>ANOTHER STUDIO.</span><span>PROJECT / 004</span></div>
    {phase === 'discover' ? <>
      <div className="process-demo-art-title">The right<br /><em>questions.</em></div>
      <div className="process-demo-strategy"><span>01 / THE AUDIENCE</span><strong>Who are we<br />making this for?</strong><div><i /><i /><i /></div><span>LISTEN FIRST. THEN MAKE.</span></div>
      <span className="process-demo-sticky-note">Make it<br /><em>useful.</em><span>↗</span></span>
    </> : phase === 'design' ? <>
      <div className="process-demo-art-title">Room for<br /><em>better.</em></div>
      <div className="process-demo-type"><span>Aa</span><span>DM SANS<br />INSTRUMENT SERIF</span></div>
      <div className="process-demo-swatches"><i /><i /><i /><i /></div>
      <div className="process-demo-wireframe"><span /><span /><span /></div>
    </> : phase === 'build' ? <>
      <div className="process-demo-art-title">Good design.<br /><em>Made real.</em></div>
      <div className="process-demo-code"><div><i /><i /><i /><span>page.tsx</span></div><code><span><b>export default</b> function Page() {'{'}</span><span>  <b>return</b> (</span><span>    &lt;<em>main</em>&gt;</span><span>      &lt;<em>Hero</em> /&gt;</span><span>      &lt;<em>SelectedWork</em> /&gt;</span><span>      &lt;<em>Contact</em> /&gt;</span><span>    &lt;/<em>main</em>&gt;</span><span>  )</span><span>{'}'}</span></code><p><span>✓</span> Build successful</p></div>
    </> : <>
      <div className="process-demo-art-title">Ready for<br /><em>what’s next.</em></div>
      <div className="process-demo-launch-check"><span>✓</span><strong>All systems<br />looking good.</strong></div>
      <div className="process-demo-launch-list"><span>QUALITY CHECKED <b>✓</b></span><span>TEAM HANDED OVER <b>✓</b></span><span>READY TO GO LIVE <b>✓</b></span></div>
    </>}
    <div className="process-demo-art-bottom"><span>FROM FIRST THOUGHT TO LAUNCH</span><span>↗</span></div>
  </div>
}

const steps = [
  { id: 'discover', title: 'Discover', duration: '1 week', description: 'We ask the right questions, get to know your audience, and agree on what success looks like before the first pixel.', deliverables: ['Workshop', 'Audience insights', 'Project brief'], media: <ProcessArt phase="discover" /> },
  { id: 'design', title: 'Design', duration: '2 weeks', description: 'We shape the story, explore a visual direction, and turn it into a prototype your team can click through and discuss.', deliverables: ['Art direction', 'UI system', 'Clickable prototype'], media: <ProcessArt phase="design" /> },
  { id: 'build', title: 'Build', duration: '2 weeks', description: 'The approved design becomes a fast, responsive website. We connect your content and check the details on real screens.', deliverables: ['Development', 'CMS setup', 'Device testing'], media: <ProcessArt phase="build" /> },
  { id: 'launch', title: 'Launch', duration: '1 week', description: 'We make the final checks, show your team around, and get the site into the world with a clear plan for what comes next.', deliverables: ['Quality assurance', 'Team training', 'Launch support'], media: <ProcessArt phase="launch" /> },
]

export function ProcessTimelineDemo() {
  return <div className="demo practical-demo process-timeline-demo" tabIndex={0} role="region" aria-label="Agency process preview. Scroll through the four stages.">
    <p className="process-demo-scroll-hint"><span>HOW WE GET THERE, TOGETHER.</span><span>Scroll through the four stages ↓</span></p>
    <ProcessTimeline steps={steps} title="A good process. A better outcome." />
    <p className="process-demo-end">ONE CLEAR DIRECTION. EVERY STEP OF THE WAY. <span>↗</span></p>
  </div>
}
