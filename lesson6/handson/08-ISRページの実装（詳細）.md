## はじめに
動的ルート（Dynamic Routes）を使用した詳細ページを作成します。
`generateStaticParams` を使用することで、特定のパス（ID）をビルド時に静的に生成し、それ以外のパスはアクセス時にオンデマンドで生成（ISR）するように設定します。

## 目的
- `generateStaticParams` を使用して静的パスを生成する
- 動的ルートパラメーター (`params`) を取得する
- ビルド時に生成されるページと、アクセス時に生成されるページの違いを理解する

## 学習対象のスキル
- Dynamic Routes (`[id]`)
- `generateStaticParams`
- `notFound`

## 課題A：ISR詳細ページの実装（20分）

20分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

レシピの詳細情報を表示する動的ページを作成します。IDが1, 2, 3のページはビルド時に生成し、それ以外はアクセス時に生成します。

- 作成するファイル: `src/app/recipes-isr/[id]/page.tsx`
  - 設定
    - `revalidate`: 60（秒）をエクスポート
  - 関数 `generateStaticParams`
    - 非同期関数としてエクスポート
    - `id`プロパティが `'1'`, `'2'`, `'3'` のオブジェクトの配列を返す
  - データ取得関数 `getRecipe`
    - 引数: `id` (`string`)
    - 非同期関数として定義
    - `fetch` で `https://api.vercel.app/blog/[id]` からデータを取得
    - `res.ok` が `false` の場合は `null` を返す
    - レスポンスをJSONとしてパースして返す
  - コンポーネント `Page`
    - 非同期関数として定義
    - Props: `params`（`Promise<{ id: string }>`）
    - 変数`start`に現在時刻のタイムスタンプを保存
    - `params` を`await`して `id` を取得
    - `getRecipe`関数を呼び出してデータを取得し、変数`data`に保存
    - `data` が存在しない場合は `notFound()` を実行
    - 変数`renderedAt`に現在時刻をフォーマットした文字列をセット

【使用タグ】
- `<article>`: グリッドレイアウト。要素間の間隔を空ける。
  - `<h1>`: 記事のタイトルを表示。大きく太い文字。
  - `<div>`: 日付と著者名を表示。スレート色の小さめの文字。
  - `<div>`: `Rendered at: {renderedAt}`を表示。スレート色の小さめの文字。
  - `<p>`: 記事の本文を表示。スレート色の文字。
  - `<Link>`: `← 一覧へ`を表示。青色の文字。

【命名】
- コンポーネント: `Page`
- データ取得関数: `getRecipe`
- 定数: `revalidate`
- 関数: `generateStaticParams`

【参照】
- インポート識別子: `Recipe`, `notFound`, `Link`

### ヒント

- Next.js 15では、`params` は `Promise` として受け取る必要があります（`await params`）。
- `generateStaticParams` は文字列の配列ではなく、パラメータオブジェクトの配列（`[{ id: '1' }, ...]`）を返します。
- 使用クラス一覧:
  - `article`: `grid`, `gap-3`
  - `h1`: `text-xl`, `font-bold`
  - `div（メタ情報）`: `text-slate-500` (#64748b), `text-sm`
  - `div（Rendered at）`: `text-slate-500` (#64748b), `text-sm`
  - `p（本文）`: `text-slate-700` (#334155)
  - `Link`: `text-blue-600` (#2563eb)

### 解答例

```tsx
import type { Recipe } from '@/types/recipe';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

// 1, 2, 3 のIDのみビルド時に生成
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

async function getRecipe(id: string): Promise<Recipe | null> {
  const res = await fetch(`https://api.vercel.app/blog/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const start = Date.now();
  const { id } = await params;
  const data = await getRecipe(id);
  if (!data) notFound();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <article className="grid gap-3">
      <h1 className="text-xl font-bold">{data.title}</h1>
      <div className="text-slate-500 text-sm">
        {data.date} / {data.author}
      </div>
      <div className="text-slate-500 text-sm">Rendered at: {renderedAt}</div>
      <p className="text-slate-700">{data.content}</p>
      <Link href="/recipes-isr" className="text-blue-600">
        ← 一覧へ
      </Link>
    </article>
  );
}
```

## 章末の確認

1. ビルドを実行します。
   ```bash
   npm run build
   ```
2. ビルドログを確認し、`/recipes-isr/[id]` のセクションで、`● /recipes-isr/[id]` (ISR) と表示され、その下に生成されたパス（`1`, `2`, `3`）が表示されていることを確認します。
3. サーバーを起動します。
   ```bash
   npm run start
   ```
4. ブラウザで `/recipes-isr/1` にアクセスします。高速に表示されるはずです（事前生成済み）。
5. ブラウザで `/recipes-isr/4` にアクセスします。初回は少し時間がかかるかもしれませんが、表示されます（オンデマンド生成）。
6. `/recipes-isr/4` をリロードすると、2回目以降は高速に表示され、"Rendered at" の時刻もしばらく変わらないことを確認します（キャッシュ有効）。
