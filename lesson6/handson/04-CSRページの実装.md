## はじめに
クライアントサイドレンダリング（CSR）を行うページを作成します。
CSRでは、ブラウザがページ（JavaScript）を読み込んだ後に、クライアント側でAPIからデータを取得して画面を更新します。

## 目的
- クライアントコンポーネント (`'use client'`) を作成する
- `useEffect` を使用してマウント後にデータを取得する
- 読み込み中（ローディング）の状態を扱う

## 学習対象のスキル

- CSR

## 課題A：CSRページの実装（30分）

30分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

ページが表示された後にAPIからデータを取得し、レシピ一覧を表示するページを作成します。

- 作成するファイル: `src/app/recipes-csr/page.tsx`
  - 状態管理
    - `recipes`: レシピデータの配列（初期値 `null`）
    - `err`: エラーメッセージ（初期値 `null`）
    - `renderedAt`: コンポーネントがレンダリングされた時刻（初期値は現在時刻の文字列）
    - `fetchedAt`: データ取得が完了した時刻（初期値 `null`）
  - useEffectの処理
    - マウント時に1回だけ実行
    - 非同期関数`run` を定義して実行
      - `console.log` で`CSR: データ取得中...`と出力
      - try-catch文で以下を実行
      - tryブロック
        - `fetch` で `/api/proxy-recipes` からデータを取得
        - レスポンスをJSONとしてパースし、`recipes` にセット
        - `fetchedAt` に現在時刻をフォーマットした文字列をセット
        - `console.log` で`CSR: データ取得完了`と出力
      - catchブロック
        - `err` に`取得に失敗しました`をセット

【使用タグ】
- `<section>`: グリッドレイアウト。要素間の間隔を空ける。
  - `<header>`: グリッドレイアウト。要素間の間隔を少し空ける。
    - `<h1>`:`CSR: クライアント取得`を表示。大きく太い文字。
    - `<p>`:`初回は空。マウント後にfetch。`を表示。スレート色の文字。
    - `<p>`: `Rendered at: {renderedAt}`を表示。スレート色の小さめの文字。
    - `<p>`（条件付き）: `Fetched at: {fetchedAt}`を表示。データ取得後のみ表示。スレート色の小さめの文字。
  - `<p>`（条件付き）: エラーメッセージ。エラー時のみ表示。赤文字。
  - `<p>`（条件付き）:`読み込み中…`を表示。データ未取得時に表示。スレート色の文字。
  - `<RecipeList>`（条件付き）: データ取得後に表示。`recipes` プロパティを渡す。

【命名】
- コンポーネント: `Page`
- 状態: `recipes`, `setRecipes`, `err`, `setErr`, `renderedAt`, `fetchedAt`, `setFetchedAt`

【参照】
- インポート識別子: `useEffect`, `useState`, `RecipeList`, `Recipe`

### ヒント

- ファイルの先頭に `'use client';` が必要です。
- `useEffect` の依存配列を `[]`（空配列）にすることで、マウント時に1回だけ実行させます。
- 時刻のフォーマットは `new Date().toLocaleTimeString('ja-JP')` を使用します。
- 使用クラス一覧:
  - `section`: `grid`, `gap-4`
  - `header`: `grid`, `gap-1`
  - `h1`: `text-xl`, `font-bold`
  - `p（説明文）`: `text-slate-600` (#475569)
  - `p（時刻）`: `text-slate-500` (#64748b), `text-sm`
  - `p（エラー）`: `text-red-600` (#dc2626)
  - `p（読み込み中）`: `text-slate-500` (#64748b)

### 解答例

```tsx
'use client';
import { useEffect, useState } from 'react';
import { RecipeList } from '@/app/components/RecipeList';
import type { Recipe } from '@/types/recipe';

export default function Page() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [renderedAt] = useState<string>(new Date().toLocaleTimeString('ja-JP'));
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      console.log('CSR: データ取得中...');
      try {
        const res = await fetch('/api/proxy-recipes');
        const data = (await res.json()) as Recipe[];
        setRecipes(data);
        setFetchedAt(new Date().toLocaleTimeString('ja-JP'));
        console.log('CSR: データ取得完了');
      } catch {
        setErr('取得に失敗しました');
      }
    };
    run();
  }, []);

  return (
    <section className="grid gap-4">
      <header className="grid gap-1">
        <h1 className="text-xl font-bold">CSR: クライアント取得</h1>
        <p className="text-slate-600">初回は空。マウント後にfetch。</p>
        <p className="text-slate-500 text-sm">Rendered at: {renderedAt}</p>
        {fetchedAt && <p className="text-slate-500 text-sm">Fetched at: {fetchedAt}</p>}
      </header>
      {err && <p className="text-red-600">{err}</p>}
      {!recipes ? <p className="text-slate-500">読み込み中…</p> : <RecipeList recipes={recipes} />}
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

- ブラウザで `http://localhost:3000/recipes-csr` にアクセスします。
- 以下の挙動を確認します。
  1. ページが表示された直後は「読み込み中…」と表示される。
  2. 一瞬遅れてレシピ一覧が表示される。
  3. `Rendered at`と`Fetched at`の時刻が表示され、`Fetched at`の方が少し遅い時刻になっている。
- ブラウザのリロードボタンを押して、毎回「読み込み中…」が表示されることを確認します（クライアントで毎回取得しているため）。
