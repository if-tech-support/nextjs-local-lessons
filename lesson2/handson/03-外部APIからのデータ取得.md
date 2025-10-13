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
- 型定義のみ（UI要素なし）

### ヒント
- 公式レスポンス構造をブラウザで開き、コピーせず手入力で理解
- ネストはそのまますべて保持

### 解答例

```ts
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
    geo: {
      lat: string;
      lng: string;
    };
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

## 課題B：ユーザー一覧ページ（25分）

25分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

外部APIから取得した10件のユーザーを表示します。

- 編集/対象ファイル: `src/app/users/page.tsx`
- データ取得処理
  - 定義: データ取得処理は`getUsers()` 関数に切り出し
  - データ取得: `fetch('https://jsonplaceholder.typicode.com/users')`で取得し、失敗時は例外を投げる
- ページ表示
  - コンポーネント: `export default async function UsersPage()`（サーバーコンポーネント）
  - 見出し「ユーザー一覧」を先頭に表示する。
  - ユーザー情報の `id` `username` `company.name` を表示する。

【使用タグ】
- （新規）`<div>`: 一覧全体のラッパー。
  - （新規）`<h1>`: ページタイトルを大きく太字で表示し、直下に余白を設ける。
  - （新規）`<ul>`: 一覧をグリッド配置し、アイテム間に間隔を設ける。中・大画面で列数を増やす。
    - （新規）`<li>`: 白背景で角丸と影を付けたカード。ホバーで影が強調される。内側に余白。
      - （新規）`<div>`: カード上部の情報ブロックに下余白を付与。
        - （新規）`<p>`: IDを小さめかつ淡い色で表示。
        - （新規）`<h3>`: ユーザー名をやや大きく太字で表示。
      - （新規）`<div>`: 会社情報ブロックに下余白を付与。
        - （新規）`<p>`: 本文色で会社名行を表示し、下余白を設ける。
          - （新規）`<span>`: ラベル部分のみを中太字にする。
      - （新規）`<Link>`: 青地に白文字のボタン風リンク。角丸で、ホバー時に色が濃くなり、色の遷移がかかる。小さめの文字サイズと中太字。

### ヒント
- 使用クラス一覧:
  - `h1`: `text-3xl`, `font-bold`, `mb-8`, `text-gray-800`
  - `ul`: `grid`, `gap-6`, `md:grid-cols-2`, `lg:grid-cols-3`
  - `li`: `bg-white`, `rounded-lg`, `shadow-md`, `p-6`, `hover:shadow-lg`, `transition-shadow`
  - `p（ID）`: `text-sm`, `text-gray-500`
  - `h3`: `font-semibold`, `text-lg`, `text-gray-800`
  - `div（会社ブロック内のp）`: `text-gray-600`, `mb-2`
  - `span（ラベル）`: `font-medium`
  - `Link`: `inline-block`, `bg-blue-600`, `text-white`, `px-4`, `py-2`, `rounded-md`, `hover:bg-blue-700`, `transition-colors`, `text-sm`, `font-medium`
- エラー: `if (!response.ok) throw new Error(...)`

### 解答例

```tsx
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
- 見出し文言は実コードと完全一致（Strict Parity）。

## 章末の確認
- `src/types/user.ts` に `User` 型が定義され全フィールド保持。
- `/users` で10件のカードが表示。
- 各カードにID/ユーザ名/会社名/「詳細を見る」ボタン。
- ネットワークタブの `users` 取得が1回。
- コンソールエラーなし。

主要コマンド（参考）:
```bash
npm run dev
```
