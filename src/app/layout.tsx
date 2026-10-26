import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from '@/components/site/chrome';
import './fonts.css';
import './globals.css';
import '@/components/demos/demo.css';

export const metadata: Metadata = {
  title: { default: 'Anticraft UI — Interfaces with feeling.', template: '%s · Anticraft UI' },
  description: 'Expressive, open-source React components for a web with character. Live previews, editable TypeScript source, and considered motion.',
  icons: { icon: '/favicon.svg' },
};

const themeScript = `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('anticraft-theme')==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head><link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><SiteHeader/>{children}<SiteFooter/></body></html>;
}
