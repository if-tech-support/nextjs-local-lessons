import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default function Page() {
  async function revalidate() {
    'use server';
    revalidatePath('/recipes-isr');
  }

  return (
    <form action={revalidate} className="grid gap-3">
      <h1 className="text-xl font-bold">ISR 手動再検証</h1>
      <p className="text-slate-600">一覧ページのキャッシュを手動で再検証します。</p>
      <button type="submit" className="bg-pink-500 text-white rounded p-2">
        再検証する
      </button>
      <Link href="/recipes-isr" className="text-blue-600">
        ← 一覧へ
      </Link>
    </form>
  );
}
