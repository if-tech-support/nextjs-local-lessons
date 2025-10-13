import Link from 'next/link';

export default function Home() {
  return (
    <section className="grid gap-3">
      <h1 className="text-2xl font-bold">Next.js レンダリング比較</h1>
      <p className="text-slate-600">ヘッダーのリンクから CSR / SSR / SSG / ISR を確認できます。</p>
      <Link href="/recipes-ssg" className="text-blue-600">
        まずは SSG 一覧へ →
      </Link>
    </section>
  );
}
