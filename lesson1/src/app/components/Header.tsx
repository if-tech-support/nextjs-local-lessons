import Link from 'next/link';

export const Header = () => {
  return (
    <header className="flex justify-between p-3 text-white bg-indigo-600">
      <Link href="/">
        <h1 className="text-xl font-bold hover:opacity-70">Web World Creators</h1>
      </Link>
      <div className="flex items-center justify-end gap-3">
        <Link href="/company" className="px-2 py-1 rounded-full bg-white/10 hover:opacity-70">
          会社概要
        </Link>
        <Link href="/service" className="px-2 py-1 rounded-full bg-white/10 hover:opacity-70">
          サービス紹介
        </Link>
      </div>
    </header>
  );
};
