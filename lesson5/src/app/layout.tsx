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
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              <Header />
              <main className="space-y-6">{children}</main>
            </div>
          </div>
          <div className="max-w-3xl mx-auto p-4">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="flex items-center gap-4">
      <Link href="/products" className="font-bold text-pink-600">
        MiniShop
      </Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/products" className="hover:underline">
          商品
        </Link>
        <Link href="/orders" className="hover:underline">
          注文
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return <footer className="text-center text-xs text-gray-500 py-4">© 2025 MiniShop</footer>;
}
