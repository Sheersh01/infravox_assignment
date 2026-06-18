import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KanbanBoard | Whiteboard',
  description: 'Collaborative Kanban Board',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans bg-[#f4f4f5] text-zinc-900 h-screen overflow-hidden flex flex-col selection:bg-indigo-200 selection:text-indigo-900`}>
        {children}
      </body>
    </html>
  );
}
