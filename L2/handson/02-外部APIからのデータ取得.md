## はじめに

この章では、Next.jsで外部APIからデータを取得してユーザ一覧を表示する方法を学びます。JSONPlaceholderのAPIを使って実際のデータを取得し、ユーザ管理アプリの基盤を作成していきましょう。

## 目的

Next.jsで外部APIからデータを取得する方法を学ぶ

## 学習対象のスキル

- fetch APIを使ったデータ取得
- 非同期処理とuseEffect
- 基本的なリスト表示

## 課題A：ユーザ一覧ページの作成

（目安：15分）ヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/page.tsx`を作成し、以下の要件を満たしてください：

- ページタイトル「ユーザ一覧」を`<h1>`で表示
- `https://jsonplaceholder.typicode.com/users`から10件のユーザデータを取得
- 取得したデータを`<ul>`内の`<li>`で表示
- 各ユーザ項目には以下の情報を含める：
  - ユーザID（`<span>`で表示）
  - ユーザ名（`<h3>`で表示）
  - 会社名（`<p>`で表示）
- データ取得中は「読み込み中...」を表示
- エラー時は「エラーが発生しました」を表示
- 各ユーザ項目は`<Link>`で`/users/{id}`へのリンクを設定

### ヒント

- `useState`でユーザデータとローディング状態を管理
- `useEffect`でコンポーネントマウント時にデータを取得
- `fetch`でAPIからデータを取得
- `next/link`をインポートしてリンクを作成
- Tailwindクラス：`container`、`mx-auto`、`p-6`、`space-y-4`

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

## 課題B：共通レイアウトの作成

（目安：10分）ヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

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

## 章末の確認

以下の手順で動作確認を行ってください：

1. 開発サーバーを起動
```bash
npm run dev
```

2. ブラウザで`http://localhost:3000/users`にアクセス

3. 確認項目
- ページタイトル「ユーザ一覧」が表示される
- 10件のユーザ情報がリストで表示される
- 各ユーザ項目にID、名前、会社名が表示される
- ヘッダーのタイトルをクリックすると`/users`ページに遷移する
- フッターにコピーライトが表示される
- レイアウトが中央寄せで最大幅960pxになっている
