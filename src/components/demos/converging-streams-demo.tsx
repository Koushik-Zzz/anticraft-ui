'use client';

import { useState } from 'react';
import { ConvergingStreams } from '@/components/anticraft/ConvergingStreams';
import './converging-streams-demo.css';

export function ConvergingStreamsDemo({ paused = false }: { paused?: boolean }) {
  const [interactive, setInteractive] = useState(true);
  return <div className="demo diagram-demo converging-streams-demo"><label className="streams-demo-toggle"><input type="checkbox" checked={interactive} onChange={event => setInteractive(event.target.checked)}/>Pointer effect</label><ConvergingStreams paused={paused} interactive={interactive}>
    <span className="streams-demo-label">CONNECT YOUR STACK</span>
    <h2>Your tools.<br/><span>One workflow.</span></h2>
    <div className="streams-demo-actions"><a href="/docs/installation">Start building <span aria-hidden="true">↗</span></a><a href="/components/orbit-network">Explore integrations</a></div>
  </ConvergingStreams></div>;
}
