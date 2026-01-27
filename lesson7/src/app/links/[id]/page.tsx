import { notFound } from 'next/navigation';
import { updateLink } from '../actions';
import { prisma } from '@/lib/prisma';

// リンク詳細ページ
export default async function LinkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) {
    notFound();
  }

  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border bg-slate-900 p-6">
        <form className="flex flex-col gap-4" action={updateLink}>
          <label className="flex flex-col gap-2 text-sm text-slate-100">
            タイトル
            <input
              className="rounded-lg border bg-slate-900 p-3"
              type="text"
              name="title"
              defaultValue={link.title}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-100">
            URL
            <input
              className="rounded-lg border bg-slate-900 p-3"
              type="url"
              name="url"
              defaultValue={link.url}
              required
            />
          </label>

          <p className="text-sm text-slate-400">
            作成: {link.createdAt.toLocaleString()} ／ 更新: {link.updatedAt.toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              name="id"
              value={link.id}
              className="rounded-lg bg-emerald-400 px-5 py-2 text-slate-900"
            >
              更新する
            </button>
            <a href={link.url} target="_blank" rel="noreferrer" className="rounded-lg border px-5 py-2 text-white">
              URLを開く
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
