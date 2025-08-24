'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function DeleteMemoButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (!confirm('本当に削除しますか？')) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl(`/api/memos/${id}`), { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Failed with ${res.status}`);
      }
      router.push('/memos');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '削除に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block mr-3">
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 px-4 py-2 rounded"
      >
        {loading ? '削除中...' : '削除'}
      </button>
    </div>
  );
}
