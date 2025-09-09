import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          AuthMini
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          認証機能付きダッシュボードアプリケーション
        </p>
        <p className="mt-3 max-w-md mx-auto text-sm text-gray-400 sm:text-base md:mt-5 md:text-lg md:max-w-3xl">
          Supabase
          Authenticationを使用して、安全で簡単なログイン機能を体験できます。
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              ログインへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
