import BackButton from './BackButton';
import { Memo } from '@/types/memo';
import { apiUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import EditMemoForm from './EditMemoForm';
import DeleteMemoButton from './DeleteMemoButton';

async function fetchMemo(id: string): Promise<Memo | null> {
  const res = await fetch(apiUrl(`/api/memos/${id}`), { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch memo');
  return res.json();
}

export default async function MemoDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const memo = await fetchMemo(id);
  if (!memo) return notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-sky-900">メモ詳細</h1>
      <div className="p-4 bg-white rounded">
        <h2 className="text-xl font-semibold text-sky-900">{memo.title}</h2>
        <p className="mt-2 whitespace-pre-wrap">{memo.content}</p>
        <p className="mt-3 text-sm text-sky-800">
          作成: {new Date(memo.created_at).toLocaleString()} / 更新: {new Date(memo.updated_at).toLocaleString()}
        </p>
      </div>
      <EditMemoForm id={memo.id} initialTitle={memo.title} initialContent={memo.content} />
      <div className="space-x-3">
        <DeleteMemoButton id={memo.id} />
        <BackButton />
      </div>
    </div>
  );
}
