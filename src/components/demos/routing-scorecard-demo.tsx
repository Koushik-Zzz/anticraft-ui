'use client';

import { RoutingScorecard } from '@/components/anticraft/RoutingScorecard';
import './routing-scorecard-demo.css';

export function RoutingScorecardDemo({ paused = false }: { paused?: boolean } = {}) {
  return <div className="demo diagram-demo routing-scorecard-demo"><RoutingScorecard paused={paused}/></div>;
}
