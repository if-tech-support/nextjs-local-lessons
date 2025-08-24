## はじめに

この章では、Next.jsのDynamic Routesを使ってユーザー詳細ページを作成します。URLパラメーターからユーザーIDを取得し、個別のユーザー情報を表示するページを実装していきましょう。

## 目的

Dynamic Routesを使った詳細ページの作成方法を学ぶ。

## 学習対象のスキル

- Dynamic Routes（`[id]`フォルダー）の作成
- URLパラメーターの取得
- 個別データの取得と表示

## 課題A：ユーザ詳細ページの作成（20分）

20分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/[id]/page.tsx` を作成/編集し、以下を満たしてください。

1. 見出し`<h1>`で「ユーザ詳細」を表示（フォントサイズ1.875rem、太字、下余白32px、文字色#1f2937相当）。
2. 詳細カードコンテナーを水平方向中央寄せし最大幅672px（背景白・角丸8px・影・内側余白32px、幅制限はカード自身）。
3. カード上部ヘッダー行：ユーザー名（`<h2>`、余白下8px）と本名（`<p>`）を表示。
4. 下部情報セクションを3ブロックで縦並び（各ブロック間の縦余白16px、内部ブロック下境界線＋下余白16pxを連絡先/会社情報に付与）。
5. 連絡先情報ブロック：`<h3>`見出し（余白下8px）→ メール・電話・ウェブサイト行。それぞれラベル（太字）＋値（通常）。ウェブサイトはリンク（青系#2563eb、通常は下線無し・ホバー時のみ下線）。
6. 会社情報ブロック：会社名とキャッチフレーズを表示。
7. 住所ブロック：1行目に通り+スイート、2行目に市区+郵便番号。
8.  データ取得はサーバーコンポーネント（`async`関数）内で行い、クライアント側の`useState`/`useEffect`を使わない。
9.   不要な追加ラッパー`<div>`を増やさない（カード内部構造は最小階層）。

【使用タグ】
- `<div>` 最上位コンテナー
  - `<h1>` ページタイトル
  - `<div>` 詳細カード
    - `<div>` ヘッダー行
      - `<div>` 基本情報
        - `<h2>` ユーザー名（username）
        - `<p>` 本名（name）
    - `<div>` 情報セクション集合
      - `<div>` 連絡先情報
        - `<h3>` 見出し
        - `<p>` メール
        - `<p>` 電話
        - `<p>` ウェブサイトリンク
      - `<div>` 会社情報
        - `<h3>` 見出し
        - `<p>` 会社名
        - `<p>` キャッチフレーズ
      - `<div>` 住所
        - `<h3>` 見出し
        - `<p>` 通り/スイート
        - `<p>` 市区/郵便番号

### ヒント

Tailwindの例：`mb-8` `shadow-lg` `space-y-4` `rounded-lg` `mx-auto`

- 動的セグメント（`[id]`）の `params.id` を引数に取得関数へ渡す。
- サーバーコンポーネントで `async` 関数を使い直接 `fetch` 実行。
- ラベルは `<span className="font-medium">` で太字化。

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
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await getUser(params.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ詳細</h1>

      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
        <div className="flex items-center space-x-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {user.username}
            </h2>
            <p className="text-gray-600">{user.name}</p>
          </div>
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
- 情報ブロックは縦方向の余白ユーティリティで間隔確保。
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
