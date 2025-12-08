import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';

export const dynamic = 'force-static'; // 既定: static

async function getRecipes(): Promise<Recipe[]> {
  console.log('SSG: データ取得中...');
  const res = await fetch('https://api.vercel.app/blog');
  if (!res.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return res.json();
}

export default async function Page() {
  const start = Date.now();
  const recipes = await getRecipes();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">SSG: ビルド時生成</h1>
        <p className="text-slate-600">HTML はビルド時に固定。データはキャッシュ使用。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <RecipeList recipes={recipes} />
    </section>
  );
}
