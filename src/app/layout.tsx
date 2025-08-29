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
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'DDCON 2025 Exhibitor Manual',
  description: 'Manage your DDCON 2025 exhibition forms and information',
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link
          rel="preload"
          href={`https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap`}
          as="style"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect" 
          href="https://kiotgupdmepdyiscbrmb.supabase.co"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              margin: 0;
              padding: 0;
              font-family: var(--font-roboto), system-ui, sans-serif;
              text-rendering: optimizeSpeed;
            }
            img, svg, video {
              max-width: 100%;
              display: block;
            }
          `
        }} />
      </head>
      <body className={roboto.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
} 