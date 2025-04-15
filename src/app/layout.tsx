import { AuthProvider } from '@/components/auth/AuthProvider';
import '@/styles/globals.css';
import './layout.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import React from 'react';

// Use local font instead of Google Fonts to avoid network issues
const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    }
  ],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AMSC 2025 Exhibitor Manual',
  description: 'Manage your AMSC 2025 exhibition forms and information',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 