## はじめに

この章では外部APIからユーザデータを取得し一覧表示する最初のページを実装します。ここで取得した一覧は後続の詳細ページ実装の土台になります。

## 目的

Next.jsで外部APIからデータを取得する方法を学ぶ

## 学習対象のスキル

- fetch APIを使ったデータ取得
- 非同期処理とuseEffect
- 基本的なリスト表示

## 課題A：ユーザ一覧ページの作成（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- 作成するファイル：src/app/users/page.tsx
- ページ全体を囲む`<div>`を1つ用意する。画面の中央寄せ（左右余白が均等）、上下左右に24pxの余白。幅の上限はまだ付けない（次の課題Bで調整）。
- その一番上に`<h1>`でタイトル「ユーザ一覧」。タイトルのすぐ下に24pxの空き。
- タイトルの下に`<ul>`を置き、その中にユーザを10件分の`<li>`で並べる。上下の間隔は1件ごとに16pxあける。
- それぞれの`<li>`全体をクリックできるリンクにする（`/users/ユーザID`へ移動）。余計なネストは増やさない。
- 各`<li>`の中身は横並びで、左にID、右に名前と会社名。IDは少し薄いグレー。名前は太字で少し大きく、その下に会社名を通常の文字色よりやや淡い色で表示し、名前との間は少し（4px程度）空ける。
- 各`<li>`には1pxの線、角を少し丸める、内側余白16px。マウスを乗せると背景色がほんのり薄いグレーにふわっと変わる（変化時間およそ0.2秒）。
- データ取得前はリストの代わりに「読み込み中…」と表示。
- 取得エラーの場合は「エラーが発生しました」と表示。
- 型は`interface User`で最小限（`id`, `name`, `company.name`）で定義する。

### ヒント

- `useState`（`users`, `loading`, `error`）
- `useEffect`＋`fetch`＋`async/await`
- `next/link`（`Link`）
- Tailwind例：`container` `mx-auto` `p-6` `space-y-4` `border` `rounded-lg` `hover:bg-gray-50` `flex` `items-center` `space-x-4`

### 解答例

### 実装ポイント

- `UsersPage`はクライアントコンポーネント（`'use client'`）。
- 取得前後で`loading`と`error`を分岐早期returnするとJSXが読みやすい。
- API失敗時は`response.ok`で判定し例外を投げると`catch`に集約できる。
- `Link`全体をブロック化しホバー領域を広げる。

## 課題B：共通レイアウトの作成（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

編集ファイル：`src/app/layout.tsx`

実装要件（クラス名は解答例で確認）：
- `<body>`直下に全体を包む`<div>`を置き、縦方向にヘッダー→メイン→フッターの順で並べる。画面の高さいっぱいを使う。
- ヘッダーは最上部に配置し、背景を濃い青、文字を白、内側に上下左右16pxの余白。中身の横幅は中央に寄せ、最大幅960pxを超えないようにする。
- ヘッダー内にアプリ名「ユーザ管理アプリ」の`<h1>`。文字は太字で大きめ。マウスを乗せたら少し淡い色に変わる。クリックで`/users`へ移動。
- メイン領域は残りの高さを占め、内容の横幅は中央寄せ＋最大幅960px。横幅いっぱい使いたい要素は必要に応じて調整できるようにする。
- フッターは最下部。背景は濃いグレー、文字は白、上下左右16pxの余白。中のテキスト（コピーライト）は中央寄せ。最大幅960pxで中央寄せ。
- コピーライト表記は「©2025ユーザ管理アプリ」。
- フォントはプロジェクト作成時のInterを利用。
- ヘッダーとフッターは画面に貼り付ける形（スクロールで追従する固定表示）にはしない。
- 構造は後続章でも使うため必要最小限にとどめる。

### ヒント

- `useState`でユーザデータとローディング状態を管理
- `useEffect`でコンポーネントマウント時にデータを取得
- `fetch`でAPIからデータを取得
- `next/link`をインポートしてリンクを作成
- Tailwindの例：`min-h-screen` `flex` `flex-col` `max-w-[960px]` `mx-auto` `p-4` `bg-blue-600` `bg-gray-800`

### 解答例

```tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  company: {
    name: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ユーザ一覧</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <Link href={`/users/${user.id}`} className="block">
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">ID: {user.id}</span>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.company.name}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 実装ポイント

- `'use client'`ディレクティブが必要（useState、useEffectを使用するため）
- 非同期処理は`async/await`でシンプルに記述
- エラーハンドリングとローディング状態の管理が重要
- TypeScriptの型定義でAPIレスポンスの構造を明確化

## 課題B：共通レイアウトの作成（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/layout.tsx`を編集し、以下の要件を満たしてください：

- ヘッダー部分に`<header>`タグを使用
- アプリケーションタイトル「ユーザ管理アプリ」を`<h1>`で表示
- タイトルをクリックすると`/users`ページに遷移するように`<Link>`で設定
- フッター部分に`<footer>`タグを使用
- フッターに「© 2025 ユーザ管理アプリ」を表示
- メインコンテンツは`<main>`タグで囲む
- ヘッダーとフッターは固定、メインコンテンツは中央寄せで最大幅960px

### ヒント

- `next/link`をインポート
- Tailwindクラス：`min-h-screen`、`flex`、`flex-col`、`max-w-[960px]`、`mx-auto`

### 解答例

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ユーザ管理アプリ',
  description: 'Next.jsで作成したユーザ管理アプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-600 text-white p-4">
            <div className="max-w-[960px] mx-auto">
              <Link href="/users">
                <h1 className="text-2xl font-bold cursor-pointer hover:text-blue-200">
                  ユーザ管理アプリ
                </h1>
              </Link>
            </div>
          </header>
          
          <main className="flex-1 max-w-[960px] mx-auto w-full">
            {children}
          </main>
          
          <footer className="bg-gray-800 text-white p-4 mt-auto">
            <div className="max-w-[960px] mx-auto text-center">
              <p>© 2025 ユーザ管理アプリ</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
```

### 実装ポイント

- レイアウトコンポーネントは一度だけ読み込まれるためフォントやグローバルCSSのimportをここで行う。
- 最大幅を内部`div`に限定し背景色領域を全幅に広げるため二重構造（外header+内max-width div）。

## 章末の確認

- 開発サーバーを起動する
```bash
npm run dev
```
- `http://localhost:3000/users` を開く。
- 確認項目
  - 一覧に10件表示される。
  - 各行にID / ユーザ名 / 会社名が表示される。
  - 行ホバーで淡いグレー背景になる（スムーズに色が変わる）。
  - `/`ページからヘッダーのタイトルクリックで`/users`へ遷移できる。
  - フッターにコピーライトが表示される。
  - 横幅が中央に寄り左右余白が確保されている。
  - ローディング中に「読み込み中…」が一瞬でも表示される（高速環境では確認しづらい場合あり）。

問題なければ次章で詳細ページ（Dynamic Routes）を実装します。
