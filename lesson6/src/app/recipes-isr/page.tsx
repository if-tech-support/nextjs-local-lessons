import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';
import Link from 'next/link';

export const revalidate = 60; // 60秒で再検証

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch('https://api.vercel.app/blog', {
    next: { revalidate },
  });
  return res.json();
}

export default async function Page() {
  const start = Date.now();
  const recipes = await getRecipes();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">ISR: 増分静的再生成</h1>
        <p className="text-slate-600">一覧は 60 秒ごとに再検証。詳細は on-demand 生成。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <Link href="/recipes-isr/refresh" className="text-blue-600">
        手動で再検証する →
      </Link>
      <RecipeList recipes={recipes} linkToDetail />
    </section>
  );
}
