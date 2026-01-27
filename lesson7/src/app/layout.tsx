import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'リンクスタジオ',
  description: 'ブックマークを保存して管理するアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100`}>
        <div className="min-h-screen">
          <header className="border-b border-slate-800 bg-slate-950">
            <div className="mx-auto max-w-4xl px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <Link href="/links" className="text-lg font-semibold text-white">
                  リンクスタジオ
                </Link>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
