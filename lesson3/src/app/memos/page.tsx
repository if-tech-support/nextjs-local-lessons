import Link from 'next/link';
import { Memo } from '@/types/memo';
import { apiUrl } from '@/lib/api';
import NewMemoForm from './NewMemoForm';

async function fetchMemos(): Promise<Memo[]> {
  const res = await fetch(apiUrl(`/api/memos`), {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch memos');
  return res.json();
}

export default async function MemosPage() {
  const memos = await fetchMemos();
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">メモ一覧</h1>

      <NewMemoForm />

      <section className="space-y-3">
        <ul className="space-y-2">
          {memos.map((m) => (
            <li key={m.id} className="p-4 bg-white rounded border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-lg">{m.title}</h3>
                  <p className="text-sm text-gray-500">
                    作成: {new Date(m.created_at).toLocaleString()} / 更新: {new Date(m.updated_at).toLocaleString()}
                  </p>
                </div>
                <Link href={`/memos/${m.id}`} className="text-blue-600 hover:underline">
                  詳細へ
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
