import { Metadata } from 'next'
import KLCCMapTabs from './klcc-map-tabs'

export const metadata: Metadata = {
  title: 'KLCC Map - DDCON 2025',
  description: 'Map of Sime Darby Convention Centre for DDCON 2025',
}

export default function KLCCMapPage() {
  return (
    <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold mb-4 text-blue-900">Sime Darby Convention Centre Map</h1>
      <KLCCMapTabs />
    </div>
  )
} 