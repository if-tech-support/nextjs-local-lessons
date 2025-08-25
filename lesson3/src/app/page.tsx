import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-sky-900">MemoLite</h1>
      <Link href="/memos" className="inline-flex bg-sky-500 px-4 py-2 rounded text-white hover:cursor-pointer">
        メモ一覧へ
      </Link>
    </div>
  );
}
