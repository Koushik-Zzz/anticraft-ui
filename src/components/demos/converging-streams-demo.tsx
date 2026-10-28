import { ConvergingStreams } from '@/components/anticraft/ConvergingStreams';
import './converging-streams-demo.css';

export function ConvergingStreamsDemo({ paused = false }: { paused?: boolean }) {
  return <div className="demo diagram-demo converging-streams-demo"><ConvergingStreams paused={paused}>
    <span className="streams-demo-label">CONNECT YOUR STACK</span>
    <h2>Your tools.<br/><span>One workflow.</span></h2>
    <div className="streams-demo-actions"><a href="/docs/installation">Start building <span aria-hidden="true">↗</span></a><a href="/components/orbit-network">Explore integrations</a></div>
  </ConvergingStreams></div>;
}
