import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KanbanFlow | Whiteboard',
  description: 'Collaborative Kanban Board',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans bg-[#f4f4f5] text-zinc-900 h-screen overflow-hidden flex flex-col selection:bg-indigo-200 selection:text-indigo-900`}>
        {children}
      </body>
    </html>
  );
}
