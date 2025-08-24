import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lesson 3: MemoLite</h1>
      <p className="text-gray-600">Route Handlers / Redirect / Query Params / Supabase</p>
      <Link
        href="/memos"
        className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        メモ一覧へ
      </Link>
    </div>
  );
}
