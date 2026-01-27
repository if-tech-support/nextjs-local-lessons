import Link from 'next/link';
import { createLink, deleteLink } from './actions';
import { prisma } from '@/lib/prisma';

// リンク一覧ページ
export default async function LinksPage() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4 rounded-xl border bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold text-white">リンクを保存する</h1>

        <form action={createLink} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-slate-100">
            タイトル
            <input
              className="rounded-lg border bg-slate-900 p-3"
              type="text"
              name="title"
              placeholder="タイトルを入力"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-slate-100 md:col-span-2">
            URL
            <input
              className="rounded-lg border bg-slate-900 p-3"
              type="url"
              name="url"
              placeholder="https://example.com"
              required
            />
          </label>
          <button type="submit" className="rounded-lg bg-emerald-400 py-2 text-slate-900 md:col-span-2">
            追加する
          </button>
        </form>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">保存済みリンク</h2>
        {links.length === 0 ? (
          <p className="rounded-xl border bg-slate-900 p-5 text-center">
            まだ登録がありません。上のフォームから追加してください。
          </p>
        ) : (
          <ul className="space-y-4">
            {links.map((link) => {
              return (
                <li key={link.id} className="space-y-3 rounded-xl border bg-slate-900 p-5">
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-white">
                    {link.title}
                  </a>
                  <p className="text-sm text-slate-400">{link.url}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/links/${link.id}`} className="rounded-lg border px-4 py-2 text-white">
                      詳細
                    </Link>
                    <form action={deleteLink}>
                      <input type="hidden" name="id" value={link.id} />
                      <button type="submit" className="rounded-lg border px-4 py-2 text-red-200">
                        削除
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
