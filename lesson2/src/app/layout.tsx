import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
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
  title: 'ユーザ管理アプリ',
  description: 'Next.jsで作成したユーザ管理ミニアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* ヘッダー */}
        <header className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <Link href="/users" className="text-2xl font-bold hover:text-blue-200 transition-colors">
              ユーザ管理アプリ
            </Link>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

        {/* フッター */}
        <footer className="bg-gray-100 border-t">
          <div className="container mx-auto px-4 py-4 text-center text-gray-600">© 2025 YourApp</div>
        </footer>
      </body>
    </html>
  );
}
