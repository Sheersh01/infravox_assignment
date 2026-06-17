import React from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'KanbanFlow | Terminal',
  description: 'High-performance local-first project management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans bg-zinc-950 text-zinc-100 h-screen overflow-hidden flex flex-col selection:bg-lime-400 selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
