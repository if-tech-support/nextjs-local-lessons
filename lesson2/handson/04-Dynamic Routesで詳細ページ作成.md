## はじめに

この章では、Next.jsのDynamic Routesを使ってユーザー詳細ページを作成します。URLパラメーターからユーザーIDを取得し、個別のユーザー情報を表示するページを実装していきましょう。

## 目的

Dynamic Routesを使った詳細ページの作成方法を学ぶ。

## 学習対象のスキル

- Dynamic Routes（`[id]`フォルダー）の作成
- URLパラメーターの取得
- 個別データの取得と表示

## 課題A：レイアウトとデータ取得の実装（14分）

14分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/[id]/page.tsx` を作成し、ページのレイアウトとデータ取得を実装します。

- サーバーコンポーネント（`async`関数）として実装し、`params.id` を用いて外部APIからユーザを取得する（`useState`/`useEffect`は使わない）。
- ページタイトル `<h1>` に「ユーザ詳細」を表示する。
- カード上部ヘッダー行に、ユーザー名 `<h2>` と本名 `<p>` を表示する。
- 不要な余分のラッパー要素は作らない（最小の階層構造）。
- データ取得関数は `getUser(id: string): Promise<User>` とし、取得先は `https://jsonplaceholder.typicode.com/users/{id}`。成功以外は例外を送出する。
- ページ関数の引数は `UserDetailPageProps` とし、`params: Promise<{ id: string }>` を受け取る。`export default async function UserDetailPage({ params }: UserDetailPageProps)` の中で `const { id } = await params` として取り出し、`getUser(id)` を呼び出して取得する。

【使用タグ】
- （新規）`<div>`: 詳細ページ全体のラッパー。
  - （新規）`<h1>`: 大きめの太字見出しを表示し、直下に余白を付ける。
  - （新規）`<div>`: 白背景・角丸・影・内側余白・最大幅を持つカード。
    - （新規）`<div>`: 上部情報ブロックに下余白を付ける。
      - （新規）`<h2>`: ユーザー名を太字で表示し、直下に余白を付ける。
      - （新規）`<p>`: 本文色で本名を表示。

### ヒント

- 使用クラス一覧:
  - `h1`: `text-3xl`, `font-bold`, `mb-8`, `text-gray-800`
  - `カードdiv`: `bg-white`, `rounded-lg`, `shadow-lg`, `p-8`, `max-w-2xl`
  - `上部情報div`: `mb-8`
  - `h2`: `text-2xl`, `font-bold`, `text-gray-800`, `mb-2`
  - `p（本名）`: `text-gray-600`
- 動的セグメント（`[id]`）の `params.id` を引数に取得関数へ渡す。
- サーバーコンポーネントで `async` 関数を使い直接 `fetch` 実行。

### 解答例

```tsx
import { User } from "@/types/user";

// 特定のユーザデータを取得する関数
async function getUser(id: string): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ詳細</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.username}
          </h2>
          <p className="text-gray-600">{user.name}</p>
        </div>
      </div>
    </div>
  );
}
```

## 課題B：連絡先・会社情報セクションの実装（7分）

7分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

対象ファイル: `src/app/users/[id]/page.tsx` を編集します。課題Aで作成したヘッダーの下に情報セクションを追加し、次を満たしてください。

- 連絡先情報ブロックに、メール / 電話 / ウェブサイトの各行を表示する。
  - ラベルは太字にする。
  - ウェブサイトは外部リンク（`target="_blank" rel="noopener noreferrer"`）。
- 会社情報ブロックに、会社名とキャッチフレーズを表示する。

【使用タグ】
- `<div>`
  - `<h1>`
  - `<div>`
    - `<div>`
      - `<h2>`
      - `<p>`
  - （新規）`<div>`: 情報セクション全体を縦方向に並べる。
    - （新規）`<div>`: 連絡先情報ブロック（下境界線と下方向の内側余白）。
      - （新規）`<h3>`: セクション見出しを中程度の太さで表示し、直下に余白。
      - （新規）`<p>`: メール行。
        - （新規）`<span>`: 行のラベルのみ中太字にする。
      - （新規）`<p>`: 電話行。
        - （新規）`<span>`: 行のラベルのみ中太字にする。
      - （新規）`<p>`: ウェブサイト行。
        - （新規）`<span>`: 行のラベルのみ中太字にする。
        - （新規）`<a>`: 青系のリンク色で、ホバー時のみ下線を表示。
    - （新規）`<div>`: 会社情報ブロック（下境界線と下方向の内側余白）。
      - （新規）`<h3>`: セクション見出しを中程度の太さで表示し、直下に余白。
      - （新規）`<p>`: 会社名行。
        - （新規）`<span>`: 行のラベルのみ中太字にする。
      - （新規）`<p>`: キャッチフレーズ行。
        - （新規）`<span>`: 行のラベルのみ中太字にする。

### ヒント

- 使用クラス一覧:
  - `情報セクションdiv`: `space-y-4`
  - `各ブロックdiv`: `border-b`, `pb-4`
  - `h3`: `font-semibold`, `text-gray-700`, `mb-2`
  - `p`: `text-gray-600`
  - `span（ラベル）`: `font-medium`
  - `a（リンク）`: `text-blue-600`, `hover:underline`
- 外部リンクは `target="_blank" rel="noopener noreferrer"` を付与する。

### 解答例

```tsx
import { User } from "@/types/user";

// 特定のユーザデータを取得する関数
async function getUser(id: string): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ詳細</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.username}
          </h2>
          <p className="text-gray-600">{user.name}</p>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">連絡先情報</h3>
            <p className="text-gray-600">
              <span className="font-medium">メール:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">電話:</span> {user.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">ウェブサイト:</span>{" "}
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">会社情報</h3>
            <p className="text-gray-600">
              <span className="font-medium">会社名:</span> {user.company.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">キャッチフレーズ:</span>{" "}
              {user.company.catchPhrase}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 課題C：住所セクションと仕上げ（6分）

6分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

対象ファイル: `src/app/users/[id]/page.tsx` を編集します。以下を満たしてください。

- 住所ブロックを追加：
  - 1行目に「通り + スイート」。
  - 2行目に「市区 + 郵便番号」。
- 最終的にカード内部の階層が最小構成であることを確認。

【使用タグ】
- `<div>`
  - `<h1>`
  - `<div>`
    - `<div>`
      - `<h2>`
      - `<p>`
  - `<div>`
    - `<div>`
      - `<h3>`
      - `<p>`
        - `<span>`
      - `<p>`
        - `<span>`
      - `<p>`
        - `<span>`
        - `<a>`
    - `<div>`
      - `<h3>`
      - `<p>`
        - `<span>`
      - `<p>`
        - `<span>`
    - （新規）`<div>`: 住所ブロック。
      - （新規）`<h3>`: セクション見出しを中程度の太さで表示し、直下に余白。
      - （新規）`<p>`: 1行目（通り + スイート）。
      - （新規）`<p>`: 2行目（市区 + 郵便番号）。

### ヒント

- 使用クラス一覧:
  - `h3`: `font-semibold`, `text-gray-700`, `mb-2`
  - `p`: `text-gray-600`
- 住所は2行構成で段落要素を2つ用いる。

### 解答例

```tsx
import { User } from "@/types/user";

// 特定のユーザデータを取得する関数
async function getUser(id: string): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = await getUser(id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ詳細</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.username}
          </h2>
          <p className="text-gray-600">{user.name}</p>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">連絡先情報</h3>
            <p className="text-gray-600">
              <span className="font-medium">メール:</span> {user.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">電話:</span> {user.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">ウェブサイト:</span>{" "}
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">会社情報</h3>
            <p className="text-gray-600">
              <span className="font-medium">会社名:</span> {user.company.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">キャッチフレーズ:</span>{" "}
              {user.company.catchPhrase}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">住所</h3>
            <p className="text-gray-600">
              {user.address.street}, {user.address.suite}
            </p>
            <p className="text-gray-600">
              {user.address.city}, {user.address.zipcode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```


### 実装ポイント

- サーバーサイドfetchにより初回表示で完全レンダリング。
- 外部リンクは `rel="noopener noreferrer"` を忘れない。

## 章末の確認

以下の手順で動作確認を行ってください：

1. 開発サーバーが起動していることを確認。
```bash
npm run dev
```

2. ブラウザで`http://localhost:3000/users`にアクセス。

3. 確認項目
- ユーザ一覧ページから任意ユーザをクリックすると詳細ページへ遷移する。
- 見出し「ユーザ詳細」が表示される。
- ユーザ名（username）と本名（name）が表示される。
- 連絡先情報（メール/電話/ウェブサイトリンク）が表示される。
- 会社情報（会社名/キャッチフレーズ）が表示される。
- 住所（通り/スイート・市区/郵便番号）が表示される。
