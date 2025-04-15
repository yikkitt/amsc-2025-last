import { Metadata } from 'next'
import KLCCMapTabs from './klcc-map-tabs'

export const metadata: Metadata = {
  title: 'KLCC Map - AMSC 2025',
  description: 'Map of Kuala Lumpur Convention Centre for AMSC 2025',
}

export default function KLCCMapPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Kuala Lumpur Convention Centre Map</h1>
      <KLCCMapTabs />
    </div>
  )
} 