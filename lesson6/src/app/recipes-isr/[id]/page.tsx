import type { Recipe } from '@/types/recipe';
import { formatDate } from '@/utils/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

async function getRecipe(id: string): Promise<Recipe | null> {
  const res = await fetch(`https://api.vercel.app/blog/${id}`, { next: { revalidate } });
  if (!res.ok) return null;
  return res.json();
}

// 一部のみ事前生成（例: 1,2,3）
export async function generateStaticParams() {
  return ['1', '2', '3'].map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const start = Date.now();
  const { id } = await params;
  const data = await getRecipe(id);
  if (!data) notFound();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <article className="grid gap-3">
      <h1 className="text-xl font-bold">{data.title}</h1>
      <div className="text-slate-500 text-sm">
        {formatDate(data.date)} / {data.author}
      </div>
      <div className="text-slate-500 text-sm">Rendered at: {renderedAt}</div>
      <p className="text-slate-700">{data.content}</p>
      <Link href="/recipes-isr" className="text-blue-600">
        ← 一覧へ
      </Link>
    </article>
  );
}
