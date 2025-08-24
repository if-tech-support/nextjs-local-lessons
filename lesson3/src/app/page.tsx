import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-yellow-900">Lesson 3: MemoLite</h1>
      <p className="text-yellow-800">Route Handlers / Query Params / Supabase</p>
      <Link href="/memos" className="inline-flex bg-yellow-500 px-4 py-2 rounded">
        メモ一覧へ
      </Link>
    </div>
  );
}
