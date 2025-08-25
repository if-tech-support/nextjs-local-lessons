import { Memo } from '@/types/memo';
import { apiUrl } from '@/lib/api';
import NewMemoForm from './NewMemoForm';
import MemoTable from './MemoTable';

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
      <h1 className="text-2xl font-bold text-sky-900">メモ一覧</h1>

      <NewMemoForm />

      <section className="space-y-3">
        <MemoTable memos={memos} />
      </section>
    </div>
  );
}
