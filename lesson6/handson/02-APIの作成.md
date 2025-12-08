## はじめに
アプリケーションで使用するデータ取得用のAPIエンドポイントを作成します。
今回は外部のサンプルAPI（Vercel Blog API）からデータを取得し、それをそのままクライアントに返すプロキシAPIを実装します。

## 目的
- Route Handlerを使用してAPIエンドポイントを作成する
- 外部APIからデータを取得してレスポンスを返す

## 学習対象のスキル
- Route Handler (`route.ts`)
- `NextResponse`
- `fetch`

## 課題A：プロキシAPIの作成（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

外部APIからデータを取得し、その結果をクライアントに中継して返すAPIルートを作成します。

- 作成するファイル: `src/app/api/proxy-recipes/route.ts`
- エンドポイント: `GET /api/proxy-recipes`
  - 外部API `https://api.vercel.app/blog` にデータ取得リクエスト（GET）を送信する。
  - 外部APIからの応答状況に応じてレスポンスを返す。
    - 成功時: 取得したJSONデータをそのまま返す（ステータスコード: `200`）。
    - 失敗時（`res.ok` が `false` の場合）: `throw new Error('データの取得に失敗しました');`
  - エラーハンドリング: 例外が発生した場合は以下のレスポンスを返す。
    - レスポンスボディ: `{ "error": "<エラーメッセージ>" }`
    - ステータスコード: `500`

【使用タグ】
- （APIのため該当なし）

【命名】
- 関数: `GET`

【参照】
- インポート識別子: `NextResponse`

### ヒント

- Route Handlerの基本形:
  ```ts
  import { NextResponse } from 'next/server';
  export async function GET() {
    // ...
    return NextResponse.json(data);
  }
  ```
- エラーハンドリングには `try-catch` ブロックを使用します。

### 解答例

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.vercel.app/blog');
    if (!res.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}
```

## 章末の確認

- 開発サーバーを起動した状態で、以下のコマンドを実行してAPIの動作を確認します。
- JSONデータ（ブログ記事のリスト）が返ってくることを確認します。

```bash
npm run dev
```

```bash
curl -i http://localhost:3000/api/proxy-recipes
```

- 期待される結果（要点）:
  - ステータスコード `200 OK` が返る。
  - レスポンスボディに記事データの配列（`id`, `title` などを含むオブジェクトのリスト）が含まれている。
