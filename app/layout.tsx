import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

import { Sidebar } from '@/components/sidebar/sidebar';

export const metadata: Metadata = {
  title: 'Elize AI',
  description: 'Premium AI Chatbot Web Application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground h-screen w-screen overflow-hidden flex`}>
        <Sidebar />
        <main className="flex-1 relative h-full flex flex-col bg-zinc-950">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          {children}
        </main>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
