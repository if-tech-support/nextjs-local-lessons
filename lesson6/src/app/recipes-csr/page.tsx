'use client';
import { useEffect, useState } from 'react';
import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [renderedAt] = useState<string>(new Date().toLocaleTimeString('ja-JP'));
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      console.log('CSR: データ取得中...');
      try {
        const res = await fetch('/api/proxy-recipes');
        const data = (await res.json()) as Recipe[];
        setRecipes(data);
        setFetchedAt(new Date().toLocaleTimeString('ja-JP'));
        console.log('CSR: データ取得完了');
      } catch {
        setErr('取得に失敗しました');
      }
    };
    run();
  }, []);

  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">CSR: クライアント取得</h1>
        <p className="text-slate-600">初回は空。マウント後にfetch。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
        {fetchedAt && <p className="text-slate-500 text-sm">Fetched at: {fetchedAt}</p>}
      </header>
      {err && <p className="text-red-600">{err}</p>}
      {!recipes ? <p className="text-slate-500">読み込み中…</p> : <RecipeList recipes={recipes} />}
    </section>
  );
}
