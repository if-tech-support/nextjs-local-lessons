import Link from 'next/link';
import type { Recipe } from '@/types/recipe';

type Props = {
  recipes: Recipe[];
  linkToDetail?: boolean; // ISR でのみ true
};

export function RecipeList({ recipes, linkToDetail }: Props) {
  return (
    <ul className="grid gap-3">
      {recipes.map((r) => (
        <li key={r.id} className="bg-white rounded p-3">
          <div className="text-pink-600 text-sm">{r.date}</div>
          <div className="font-semibold">{r.title}</div>
          <div className="text-slate-500 text-sm">by {r.author}</div>
          {linkToDetail ? (
            <Link href={`/recipes-isr/${r.id}`} className="text-blue-600">
              詳細へ →
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
