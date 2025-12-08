import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Recipes',
  description: 'CSR / SSR / SSG / ISR を比べて学ぶ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
          <header className="bg-pink-500 text-white">
            <div className="max-w-3xl mx-auto flex justify-between p-3">
              <Link href="/recipes-ssg" className="font-bold">
                Recipes
              </Link>
              <nav className="flex gap-3">
                <Link href="/recipes-csr" className="hover:underline">
                  CSR
                </Link>
                <Link href="/recipes-ssr" className="hover:underline">
                  SSR
                </Link>
                <Link href="/recipes-ssg" className="hover:underline">
                  SSG
                </Link>
                <Link href="/recipes-isr" className="hover:underline">
                  ISR
                </Link>
              </nav>
            </div>
          </header>
          <main className="max-w-3xl mx-auto w-full p-4">{children}</main>
          <footer className="bg-slate-50 text-slate-500">
            <div className="max-w-3xl mx-auto p-3">© 2025 Recipes</div>
          </footer>
        </div>
      </body>
    </html>
  );
}
