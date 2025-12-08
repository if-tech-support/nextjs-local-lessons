## はじめに
サーバーサイドレンダリング（SSR）を行うページを作成します。
SSRでは、リクエストがあるたびにサーバー側でデータを取得し、HTMLを生成してクライアントに返します。常に最新のデータを表示したい場合に適しています。

## 目的
- サーバーコンポーネントでデータを取得する
- `dynamic = 'force-dynamic'` と `cache: 'no-store'` を使用してSSRを強制する
- リクエストごとにレンダリング時刻が変わることを確認する

## 学習対象のスキル

- SSR
- dynamic

## 課題A：SSRページの実装（30分）

30分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

リクエストごとにサーバーでデータを取得し、HTMLを生成するページを作成します。

- 作成するファイル: `src/app/recipes-ssr/page.tsx`
  - ページ設定
    - `dynamic` 定数をエクスポートし、`'force-dynamic'` を設定（動的レンダリングを強制）
  - データ取得関数 `getRecipes`
    - 非同期関数として定義
    - `console.log` で `SSR: データ取得中...` と表示
    - `fetch` で `https://api.vercel.app/blog` からデータを取得
      - オプションに `{ cache: 'no-store' }` を指定（キャッシュを使用しない）
    - レスポンスをJSONとしてパースして返す
  - Pageコンポーネント
    - 非同期関数（Server Component）として定義
    - レンダリング開始時の時刻を取得
    - `getRecipes` を呼び出してデータを取得
    - `renderedAt`: レンダリング時刻を「ja-JP」形式の文字列に変換

【使用タグ】
- `<section>`: グリッドレイアウト。要素間の間隔を空ける。
  - `<header>`: グリッドレイアウト。要素間の間隔を少し空ける。
    - `<h1>`:`SSR: リクエスト毎に取得`を表示。大きく太い文字。
    - `<p>`:`サーバーで毎回実行。キャッシュは使わない。`を表示。スレート色の文字。
    - `<p>`: `Rendered at: {renderedAt}`を表示。スレート色の小さめの文字。
  - `<RecipeList>`: `recipes` プロパティを渡す。

【命名】
- コンポーネント: `Page`
- データ取得関数: `getRecipes`
- 定数: `dynamic`

【参照】
- インポート識別子: `RecipeList`, `Recipe`

### ヒント

- ファイルのトップレベルで `export const dynamic = 'force-dynamic';` を宣言します。
- `fetch` の第2引数に `{ cache: 'no-store' }` を渡します。
- サーバーコンポーネント内で `new Date().toLocaleTimeString('ja-JP')` を呼ぶと、サーバーの時刻（レンダリング時の時刻）になります。
- 使用クラス一覧:
  - `section`: `grid`, `gap-4`
  - `header`: `grid`, `gap-1`
  - `h1`: `text-xl`, `font-bold`
  - `p（説明文）`: `text-slate-600`
  - `p（時刻）`: `text-slate-500`, `text-sm`

### 解答例

```tsx
import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';

export const dynamic = 'force-dynamic'; // 毎リクエスト実行

async function getRecipes(): Promise<Recipe[]> {
  console.log('SSR: データ取得中...');
  const res = await fetch('https://api.vercel.app/blog', {
    cache: 'no-store', // データは都度取得
  });
  return res.json();
}

export default async function Page() {
  const start = Date.now();
  const recipes = await getRecipes();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">SSR: リクエスト毎に取得</h1>
        <p className="text-slate-600">サーバーで毎回実行。キャッシュは使わない。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <RecipeList recipes={recipes} />
    </section>
  );
}
```

## 章末の確認

- 以下のコマンドを実行して、本番ビルドを作成しサーバーを起動します。

```bash
npm run build
npm run start
```

- ブラウザで `http://localhost:3000/recipes-ssr` にアクセスします。
- 以下の挙動を確認します。
  1. ページが表示され、レシピ一覧が表示される。
  2. "Rendered at" の時刻を確認する。
  3. ブラウザのリロードボタンを押す。
  4. "Rendered at" の時刻が更新されることを確認する（リクエストのたびに再生成されているため）。
- ターミナルを確認し、`SSR: データ取得中...`というログがリロードのたびに出力されていることを確認します。
