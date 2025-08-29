import { Metadata } from 'next'
import BoothPackageGuide from './booth-package-guide'

export const metadata: Metadata = {
  title: 'Guide for Booth Package - DDCON 2025',
  description: 'Comprehensive guide for booth packages at DDCON 2025',
}

export default function BoothPackageGuidePage() {
  return <BoothPackageGuide />
} 