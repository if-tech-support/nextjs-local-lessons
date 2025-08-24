import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <Link href="/memos" className="text-xl font-bold text-gray-800 hover:text-blue-600">
          MemoLite
        </Link>
      </div>
    </header>
  );
}
