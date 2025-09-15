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
  title: 'MiniShop Lesson5',
  description: 'Server / Client Components & Server Actions Lesson',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="border-b border-pink-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/products" className="font-semibold text-pink-600">
            MiniShop
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/products" className="text-gray-700 hover:text-pink-600">
              商品
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-pink-600">
              注文
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-pink-600">
              カート
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-pink-200 mt-8">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <p className="text-center text-xs text-gray-500">© 2025 MiniShop</p>
      </div>
    </footer>
  );
}
