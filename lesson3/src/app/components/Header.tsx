import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-10 bg-sky-200">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <Link href="/memos" className="text-xl font-bold text-sky-900 hover:cursor-pointer">
          MemoLite
        </Link>
      </div>
    </header>
  );
}
