## はじめに
ユーザデータ一覧ページ（`/users`）を追加し、外部APIから取得した情報をグリッド表示します。取得結果は次章の動的ルーティング（詳細ページ）の基盤になります。

## 目的

Next.jsで外部APIからデータを取得する方法を学ぶ。

## 学習対象のスキル

- fetch APIを使ったデータ取得
- 基本的なリスト表示

## 課題A：`User` 型の定義（5分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様
外部APIレスポンス全体を表す型を専用ファイルに定義し、再利用できるようにします。

- 作成/編集ファイル: `src/types/user.ts`
- インターフェイス名: `User`
- フィールド: API（`https://jsonplaceholder.typicode.com/users`）のキーをすべて保持（後続章利用のため削除禁止）
- エクスポート: `export interface User { ... }` で他ファイルからインポート可能にする

【使用タグ】
 - `<none>` 型定義のみ（UI要素なし）

### ヒント
- Tailwindの例：該当なし（型のみ）
- 公式レスポンス構造をブラウザで開きコピーせず手入力で理解
- ネストはそのまますべて保持

### 解答例

```ts
// src/types/user.ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
```

### 実装ポイント
- 全フィールドを先に定義しておくと後続課題で型拡張が不要。
- ネストを忠実に写経することで構造理解を促進。

---

## 課題B：ユーザー一覧ページ（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様
外部APIから取得した10件のユーザーをグリッドでカード表示します。

- 編集/対象ファイル: `src/app/users/page.tsx`
- コンポーネント: `export default async function UsersPage()`（サーバーコンポーネント）
- データ取得: `fetch('https://jsonplaceholder.typicode.com/users')` 失敗時は例外
- 分割: `getUsers()` 関数に切り出し
- 見出し: ページ先頭に「ユーザ一覧」大きめ見出し（下余白32px）
- グリッド: 1列→（768px以上）2列→（1024px以上）3列 / カード間余白24px
- カード: 白背景 / 角丸8px / 内側余白24px / 初期影→ホバーで強い影に200ms遷移
- テキスト: ID小さく淡色 / ユーザー名やや大きく太字 / 会社名は本文より淡色
- リンク: カード末尾に詳細ページボタン（青→ホバー濃い青）
- 型: `User` の `id` `username` `company.name` を利用

【使用タグ】
 - `<div>` ルートラッパ
   - `<h1>` 見出し（ページタイトル）
   - `<ul>` 一覧
     - `<li>` カード（繰り返し）
       - `<div>` ヘッダー行（テキスト）
         - `<div>` テキストブロック
           - `<p>` ID行
           - `<h3>` ユーザ名
       - `<div>` 会社情報ブロック
         - `<p>` 会社行
           - `<span>` ラベル「会社:」
       - `<Link>` 詳細ボタン

### ヒント
- Tailwindの例：`grid` `gap-6` `md:grid-cols-2` `lg:grid-cols-3` `rounded-lg` `shadow-md` `hover:shadow-lg` `transition-shadow`
- レイアウト段階指定: モバイル→中→大の順でクラス追加
- エラー: `if (!response.ok) throw new Error(...)`

### 解答例

```tsx
// src/app/users/page.tsx
import Link from 'next/link';
import { User } from '@/types/user';

async function getUsers(): Promise<User[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ一覧</h1>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-500">ID: {user.id}</p>
              <h3 className="font-semibold text-lg text-gray-800">{user.username}</h3>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <span className="font-medium">会社:</span> {user.company.name}
              </p>
            </div>
            <Link
              href={`/users/${user.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              詳細を見る
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 実装ポイント
- サーバーコンポーネントのため状態フック不要。
- 画像はIDベースURLでユニーク化。
- 見出し文言は実コードと完全一致（Strict Parity）。
- カード階層を増やさずスタイルはユーティリティで直接指定。

## 章末の確認
- `src/types/user.ts` に `User` 型が定義され全フィールド保持。
- `/users` で10件のカードが表示。
- 列数が幅に応じ1→2→3に変化。
- 各カードにID/ユーザ名/会社名/「詳細を見る」ボタン。
- ホバーで影が強調される。
- ネットワークタブの `users` 取得が1回。
- コンソールエラーなし。

主要コマンド（参考）:
```bash
npm run dev
```

次章でユーザー詳細ページ（Dynamic Routes）を実装します。
