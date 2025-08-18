## はじめに

この章では、Next.jsのDynamic Routesを使ってユーザ詳細ページを作成します。URLパラメーターからユーザIDを取得し、個別のユーザ情報を表示するページを実装していきましょう。

## 目的

Dynamic Routesを使った詳細ページの作成方法を学ぶ

## 学習対象のスキル

- Dynamic Routes（`[id]`フォルダー）の作成
- URLパラメーターの取得
- 個別データの取得と表示

## 課題A：ユーザ詳細ページの作成

（目安：20分）ヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/[id]/page.tsx`を作成し、以下の要件を満たしてください：

- ページタイトル「ユーザ詳細」を`<h1>`で表示
- URLパラメーターからユーザIDを取得
- `https://jsonplaceholder.typicode.com/users/{id}`から該当ユーザのデータを取得
- 取得したデータを以下の構造で表示：
  - ユーザ名（`<h2>`で表示）
  - メールアドレス（`<p>`で表示）
  - 会社名（`<p>`で表示）
  - ウェブサイト（`<a>`タグでリンク表示）
- データ取得中は「読み込み中...」を表示
- エラー時は「エラーが発生しました」を表示
- ユーザが見つからない場合は「ユーザが見つかりません」を表示

### ヒント

- `params`プロパティからユーザIDを取得
- `useState`でユーザデータとローディング状態を管理
- `useEffect`でコンポーネントマウント時にデータを取得
- `fetch`でAPIからデータを取得
- Tailwindクラス：`max-w-2xl`、`mx-auto`、`p-6`、`space-y-4`

### 解答例

```tsx
'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
  website: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function UserDetailPage({ params }: PageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ユーザが見つかりません');
          }
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p>ユーザが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ユーザ詳細</h1>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            <span className="font-medium">メール:</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">会社:</span> {user.company.name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">ウェブサイト:</span>{' '}
            <a
              href={`https://${user.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {user.website}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 実装ポイント

- `params`プロパティの型定義が重要（TypeScript）
- 404エラーの適切なハンドリング
- ウェブサイトURLの適切な表示（`https://`プレフィックスの追加）
- セキュリティのため`rel="noopener noreferrer"`を設定

## 課題B：戻るボタンの実装

（目安：10分）ヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/[id]/BackButton.tsx`コンポーネントを作成し、以下の要件を満たしてください：

- 戻るボタンを`<button>`タグで作成
- ボタンのテキストは「← ユーザ一覧に戻る」
- クリック時にブラウザの履歴を1つ戻る（`window.history.back()`）
- ボタンのスタイルは青系の色で、ホバー時に少し暗くなる
- ユーザ詳細ページの上部に配置

### ヒント

- `onClick`イベントで`window.history.back()`を呼び出し
- Tailwindクラス：`bg-blue-600`、`hover:bg-blue-700`、`text-white`、`px-4`、`py-2`

### 解答例

```tsx
export default function BackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mb-4"
    >
      ← ユーザ一覧に戻る
    </button>
  );
}
```

### 実装ポイント

- `window.history.back()`でブラウザの履歴を操作
- ホバー効果とトランジションでUXを向上
- 適切な余白とボタンのサイズ設定

## 章末の確認

以下の手順で動作確認を行ってください：

1. 開発サーバーが起動していることを確認
```bash
npm run dev
```

2. ブラウザで`http://localhost:3000/users`にアクセス

3. 確認項目
- ユーザ一覧ページが表示される
- 任意のユーザ項目をクリックすると詳細ページに遷移する
- 詳細ページでユーザの詳細情報が正しく表示される
- 戻るボタンをクリックするとユーザ一覧ページに戻る
- 存在しないユーザIDでアクセスすると適切なエラーメッセージが表示される
- ヘッダーのタイトルをクリックするとユーザ一覧ページに遷移する
