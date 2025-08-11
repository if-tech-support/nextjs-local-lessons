import Link from 'next/link';

export const Header = () => {
  return (
    <header className="flex justify-between p-3 text-white bg-[#1d5396]">
      <Link href="/">
        <h1 className="text-[24px] font-bold transition-all duration-300 hover:opacity-70">Web World Creators</h1>
      </Link>
      <div className="flex items-center justify-end gap-3">
        <Link href="/company" className="transition-all duration-300 hover:opacity-70">
          会社概要
        </Link>
        <Link href="/service" className="transition-all duration-300 hover:opacity-70">
          サービス紹介
        </Link>
      </div>
    </header>
  );
};
