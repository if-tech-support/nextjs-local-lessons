import type { Recipe } from '@/types/recipe';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

// 1, 2, 3 のIDのみビルド時に生成
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

async function getRecipe(id: string): Promise<Recipe | null> {
  const res = await fetch(`https://api.vercel.app/blog/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const start = Date.now();
  const { id } = await params;
  const data = await getRecipe(id);
  if (!data) notFound();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <article className="grid gap-3">
      <h1 className="text-xl font-bold">{data.title}</h1>
      <div className="text-slate-500 text-sm">
        {data.date} / {data.author}
      </div>
      <div className="text-slate-500 text-sm">Rendered at: {renderedAt}</div>
      <p className="text-slate-700">{data.content}</p>
      <Link href="/recipes-isr" className="text-blue-600">
        ← 一覧へ
      </Link>
    </article>
  );
}
