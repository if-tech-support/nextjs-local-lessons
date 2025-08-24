'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

type Props = {
  id: string;
  initialTitle: string;
  initialContent: string;
};

export default function EditMemoForm({ id, initialTitle, initialContent }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(apiUrl(`/api/memos/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? `Failed with ${res.status}`);
      }
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '更新に失敗しました';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 rounded bg-yellow-100">
      <h3 className="font-semibold text-yellow-900">編集</h3>
      <div className="space-y-2">
        <label className="block text-sm">タイトル</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm">詳細</label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded px-3 py-2 h-28"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-green-700">更新しました</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="inline-flex bg-yellow-500 px-4 py-2 rounded">
          {loading ? '更新中...' : '更新'}
        </button>
      </div>
    </form>
  );
}
