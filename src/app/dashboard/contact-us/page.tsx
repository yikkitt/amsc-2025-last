import { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'KLCC Map and Location Guide - AMSC 2025',
  description: 'Location guide and map for the KLCC venue',
}

export default function ContactUsPage() {
  return <ContactContent />
} 