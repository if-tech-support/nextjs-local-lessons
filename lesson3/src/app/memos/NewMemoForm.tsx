'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function NewMemoForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/memos'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Failed with ${res.status}`);
      }
      setTitle('');
      setContent('');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '送信に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 rounded bg-yellow-100">
      <h2 className="font-semibold text-yellow-900">新規作成</h2>
      <div className="space-y-2">
        <label className="block text-sm">タイトル</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="タイトル"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">詳細</label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-28 p-2 border"
          placeholder="詳細"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="inline-flex bg-yellow-500 px-4 py-2 rounded">
        {loading ? '送信中...' : '送信'}
      </button>
    </form>
  );
}
