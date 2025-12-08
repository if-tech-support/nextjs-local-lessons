## はじめに
インクリメンタル静的再生成（ISR）を行うページを作成します。
ISRでは、SSGのようにビルド時にHTMLを生成しますが、設定した有効期限（revalidate時間）が過ぎると、バックグラウンドで再生成が行われます。これにより、静的なパフォーマンスとデータの鮮度を両立できます。

## 目的
- `export const revalidate` を使用してISRを設定する
- `revalidatePath` を使用してオンデマンドでキャッシュを無効化する
- Server Actionを使用して再検証を実行する

## 学習対象のスキル

- ISR

## 課題A：ISR一覧ページの実装（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

一定時間ごとに再検証される一覧ページを作成します。

- 作成するファイル: `src/app/recipes-isr/page.tsx`
  - 設定
    - `revalidate`: 60（秒）をエクスポート
  - データ取得関数 `getRecipes`
    - 非同期関数として定義
    - `console.log` で `ISR: データ取得中...` と出力
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
    - `<h1>`: `ISR: 増分静的再生成` を表示。大きく太い文字。
    - `<p>`: `一覧は 60 秒ごとに再検証。詳細は on-demand 生成。` を表示。スレート色の文字。
    - `<p>`: `Rendered at: {renderedAt}` を表示。スレート色の小さめの文字。
  - `<Link>`: `手動で再検証する →` を表示。青色の文字。`/recipes-isr/refresh` へ遷移。
  - `<RecipeList>`: `recipes` と `linkToDetail` プロパティを渡す。

【命名】
- コンポーネント: `Page`
- 定数: `revalidate`
- 関数: `getRecipes`

【参照】
- インポート識別子: `RecipeList`, `Recipe`, `Link`

### ヒント

- `export const revalidate = 60;` を記述することで、ページ単位のISR設定が可能です。
- `RecipeList` に `linkToDetail` プロパティ（boolean）を渡すことで、詳細リンクを表示させます。
- 使用クラス一覧:
  - `section`: `grid`, `gap-4`
  - `header`: `grid`, `gap-1`
  - `h1`: `text-xl`, `font-bold`
  - `p（説明文）`: `text-slate-600`
  - `p（時刻）`: `text-slate-500`, `text-sm`
  - `Link`: `text-blue-600`

### 解答例

```tsx
import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';
import Link from 'next/link';

export const revalidate = 60; // 60秒で再検証

async function getRecipes(): Promise<Recipe[]> {
  console.log('ISR: データ取得中...');
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
        <h1 className="text-xl font-bold">ISR: 増分静的再生成</h1>
        <p className="text-slate-600">一覧は 60 秒ごとに再検証。詳細は on-demand 生成。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
      </header>
      <Link href="/recipes-isr/refresh" className="text-blue-600">
        手動で再検証する →
      </Link>
      <RecipeList recipes={recipes} linkToDetail />
    </section>
  );
}
```

## 課題B：手動再検証ページの実装（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

Server Actionを使用して、ISRページのキャッシュを手動で無効化（再検証）するページを作成します。

- 作成するファイル: `src/app/recipes-isr/refresh/page.tsx`
  - コンポーネント `Page`
    - Server Action `revalidate`
      - 非同期関数として定義
      - 関数内に `'use server';` を記述
      - `revalidatePath('/recipes-isr')` を実行
    - `form` 要素を返す
      - `form` の `action` 属性に `revalidate` 関数を指定

【使用タグ】
- `<form>`: グリッドレイアウト。要素間の間隔を空ける。
  - `<h1>`: `ISR 手動再検証` を表示。大きく太い文字。
  - `<p>`: `一覧ページのキャッシュを手動で再検証します。` を表示。スレート色の文字。
  - `<button>`: `再検証する` を表示。ピンク色の背景、白文字、角丸、内側の余白あり。`type="submit"`。
  - `<Link>`: `← 一覧へ` を表示。青色の文字。`/recipes-isr` へ遷移。

【命名】
- コンポーネント: `Page`
- Server Action関数: `revalidate`

【参照】
- インポート識別子: `revalidatePath`, `Link`

### ヒント

- Server Action関数には `'use server';` ディレクティブが必要です。
- `form` の `action` 属性に関数を渡すことで、JavaScriptが無効な環境でも動作するフォーム（Progressive Enhancement）になります。
- 使用クラス一覧:
  - `form`: `grid`, `gap-3`
  - `h1`: `text-xl`, `font-bold`
  - `p`: `text-slate-600`
  - `button`: `bg-pink-500`, `text-white`, `rounded`, `p-2`
  - `Link`: `text-blue-600`

### 解答例

```tsx
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

export default function Page() {
  async function revalidate() {
    'use server';
    revalidatePath('/recipes-isr');
  }

  return (
    <form action={revalidate} className="grid gap-3">
      <h1 className="text-xl font-bold">ISR 手動再検証</h1>
      <p className="text-slate-600">一覧ページのキャッシュを手動で再検証します。</p>
      <button type="submit" className="bg-pink-500 text-white rounded p-2">
        再検証する
      </button>
      <Link href="/recipes-isr" className="text-blue-600">
        ← 一覧へ
      </Link>
    </form>
  );
}
```

## 章末の確認

- 以下のコマンドを実行して、本番ビルドとサーバー起動を行います。

```bash
npm run build
npm run start
```

- ブラウザで `http://localhost:3000/recipes-isr` にアクセスします。
- 以下の挙動を確認します。
  1. `Rendered at`の時刻をメモします。
  2. すぐにリロードしても時刻が変わらないことを確認します（60秒以内はキャッシュ有効）。
  3. 「手動で再検証する」リンクをクリックし、次のページで「再検証する」ボタンを押します。
  4. 「← 一覧へ」で戻ると、`Rendered at`の時刻が更新されていることを確認します（オンデマンド再検証）。
