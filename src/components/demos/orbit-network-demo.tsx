'use client'

import { OrbitNetwork } from '@/components/anticraft/OrbitNetwork'

export function OrbitNetworkDemo({ paused = false }: { paused?: boolean }) {
  return <div className="demo diagram-demo orbit-network-demo"><OrbitNetwork paused={paused} /></div>
}
