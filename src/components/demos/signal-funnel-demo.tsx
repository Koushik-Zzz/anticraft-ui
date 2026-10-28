'use client';

import { SignalFunnel } from '@/components/anticraft/SignalFunnel';

export function SignalFunnelDemo({ paused = false }: { paused?: boolean }) {
  return <div className="demo diagram-demo signal-funnel-demo"><SignalFunnel paused={paused} /></div>;
}
