'use client';

import './globals.css'
import { Inter, Roboto } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthProvider'
import '@/styles/globals.css';
import './layout.css';
import type { Metadata } from 'next';

// Load Inter font
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Load Roboto as a fallback font
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'AMSC 2025 - Exhibitor Manual Portal',
  description: 'Exhibitor Manual Portal for AMSC 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 