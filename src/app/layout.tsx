import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '齐鲁乐眠智慧诊疗系统',
  description: '齐鲁医院睡眠科 - 睡眠分析系统',
  icons: {
    icon: '/favicon.png?v=20260319',
    shortcut: '/favicon.png?v=20260319',
    apple: '/favicon.png?v=20260319',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
