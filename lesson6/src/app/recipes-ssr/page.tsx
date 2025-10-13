import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';

export const dynamic = 'force-dynamic'; // 毎リクエスト実行

async function getRecipes(): Promise<Recipe[]> {
  const res = await fetch('https://api.vercel.app/blog', {
    cache: 'no-store', // データは都度取得
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
        <h1 className="text-xl font-bold">SSR: リクエスト毎に取得</h1>
        <p className="text-slate-600">サーバーで毎回実行。キャッシュは使わない。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <RecipeList recipes={recipes} />
    </section>
  );
}
