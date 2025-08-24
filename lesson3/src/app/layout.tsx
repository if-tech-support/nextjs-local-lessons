import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MemoLite | Lesson 3',
  description: 'Route Handlers, Redirect, Query Params, Supabase minimal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={geistSans.variable}>
      <body className="min-h-screen bg-yellow-50 flex flex-col">
        <Header />
        <main className="mx-auto max-w-3xl p-6 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
