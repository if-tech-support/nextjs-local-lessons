## はじめに
静的サイト生成（SSG）を行うページを作成します。
SSGでは、ビルド時にサーバー側でデータを取得してHTMLを生成します。生成されたHTMLは再利用されるため、高速に表示できますが、ビルド後のデータ更新は反映されません。

## 目的
- `dynamic = 'force-static'` を使用してSSGを明示する
- ビルド時にHTMLが生成されることを理解する
- 開発サーバーと本番ビルドでの挙動の違いを確認する

## 学習対象のスキル

- SSG

## 課題A：SSGページの実装（30分）

30分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

ビルド時にデータを取得し、HTMLを固定化するページを作成します。

- 作成するファイル: `src/app/recipes-ssg/page.tsx`
  - ページ設定
    - `dynamic`: `'force-static'` をエクスポート
  - データ取得関数 `getRecipes`
    - 非同期関数として定義
    - `console.log` で `SSG: データ取得中...` と表示
    - `fetch` で `https://api.vercel.app/blog` からデータを取得
    - `res.ok` が`false` の場合は`throw new Error('データの取得に失敗しました')` を実行
    - レスポンスをJSONとしてパースして返す
  - コンポーネント `Page`
    - 非同期関数として定義
    - 変数`start`に現在時刻のタイムスタンプを保存
    - `getRecipes`関数を呼び出してデータを取得し、変数`recipes`に保存
    - 変数`renderedAt`に現在時刻をフォーマットした文字列をセット

【使用タグ】
- `<section>`: グリッドレイアウト。要素間の間隔を空ける。
  - `<header>`: グリッドレイアウト。要素間の間隔を少し空ける。
    - `<h1>`:`SSG: ビルド時生成`を表示。大きく太い文字。
    - `<p>`:`HTML はビルド時に固定。データはキャッシュ使用。`を表示。スレート色の文字。
    - `<p>`: `Rendered at: {renderedAt}`を表示。スレート色の小さめの文字。
  - `<RecipeList>`: 取得した `recipes` を渡す。

【命名】
- コンポーネント: `Page`
- データ取得関数: `getRecipes`
- 定数: `dynamic`

【参照】
- インポート識別子: `RecipeList`, `Recipe`

### ヒント

- `export const dynamic = 'force-static';` を記述します（Next.jsのデフォルトでもありますが、明示することで意図をはっきりさせます）。
- 時刻のフォーマットは `new Date().toLocaleTimeString('ja-JP')` を使用します。
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

export const dynamic = 'force-static'; // 既定: static

async function getRecipes(): Promise<Recipe[]> {
  console.log('SSG: データ取得中...');
  const res = await fetch('https://api.vercel.app/blog');
  if (!res.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return res.json();
}

export default async function Page() {
  const start = Date.now();
  const recipes = await getRecipes();
  const renderedAt = new Date(start).toLocaleTimeString('ja-JP');
  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">SSG: ビルド時生成</h1>
        <p className="text-slate-600">HTML はビルド時に固定。データはキャッシュ使用。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <RecipeList recipes={recipes} />
    </section>
  );
}
```

## 章末の確認

- 以下のコマンドを実行して、本番ビルドとサーバー起動を行います。

```bash
npm run build
npm run start
```

- ビルドログで `/recipes-ssg` が `○` (Static) として出力されていることを確認します。
- ブラウザで `http://localhost:3000/recipes-ssg` にアクセスします。
- 以下の挙動を確認します。
  1. `Rendered at` の時刻を確認します。
  2. ブラウザのリロードボタンを何度か押します。
  3. `Rendered at` の時刻が**変化しない**ことを確認します（ビルド時の時刻で固定されているため）。