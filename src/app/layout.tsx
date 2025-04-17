import { AuthProvider } from '@/components/auth/AuthProvider';
import '@/styles/globals.css';
import './layout.css';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import React from 'react';

// Use Roboto instead of Inter for better professional appearance and consistent character display
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
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
      <body className={roboto.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 