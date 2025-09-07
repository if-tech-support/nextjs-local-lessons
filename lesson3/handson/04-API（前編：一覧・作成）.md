## はじめに

`/api/memos` の一覧取得と新規作成エンドポイントを実装します。

## 目的

- `GET /api/memos` が配列のJSONを返せる。
- `POST /api/memos` が作成レコードを`201`で返せる。

## 学習対象のスキル

- Route Handler（Next.jsのAPIエンドポイントを定義する仕組み）の`GET/POST`。
- エラー時のHTTPステータスとJSON応答。

## 課題A：GET /api/memos を実装する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- 要約
  - メモ一覧を取得し、更新日時の降順でJSON配列を返すGETエンドポイントを実装する。
- ファイルパス（作成）
  - `src/app/api/memos/route.ts`
- 取得フィールドと並び順
  - Supabaseから`id,title,content,created_at,updated_at`を取得し、更新日時の降順で返す。
- レスポンスの形（成功時）
  - 配列。各要素は次のキーを持つオブジェクト。
    - `id`: 数値。
    - `title`: 文字列。
    - `content`: 文字列。
    - `created_at`: ISO8601形式の日時文字列（例: `2025-01-01T12:34:56.000Z`）。
    - `updated_at`: ISO8601形式の日時文字列。
- レスポンスの形（失敗時）
  - オブジェクト。次のキーを持つ。
    - `error`: 文字列（エラーメッセージ）。
  - 例: `{"error":"Supabase client is not configured"}` または `{"error":"エラーメッセージ"}`。
- ステータスコード
  - 成功時は`200`で配列JSONを返す。
  - 失敗時は`500`でエラーメッセージJSONを返す（キーは`error`のみで値は文字列）。
  - 失敗時のJSON例: `{"error":"Supabase client is not configured"}` または `{"error":"エラーメッセージ"}`。
- 禁止事項
  - エンドポイントのパスやフィールド名を変更しない。

### ヒント

- ルートファイルは `src/app/api/memos/route.ts` に配置し、`export async function GET()` を定義する。
- Supabaseクライアントを生成し、生成不可時は`500`でエラーメッセージJSONを返す。
- `memos` テーブルから `id,title,content,created_at,updated_at` を取得し、更新日時の降順で並べる。
- 正常時は配列JSONを返す（空配列可）。失敗時は`500`でエラー内容を含むJSONを返す。

### 解答例

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data ?? []);
}
```

## 課題B：POST /api/memos を実装する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- 要約
  - リクエストJSONの`title`と`content`を受け取り、1件を作成して作成レコードを`201`で返すPOSTエンドポイントを実装する。
 - ファイルパス（編集）
  - `src/app/api/memos/route.ts`（課題Aで作成した同じファイルに追記する。既存のGETは残す。）
- 挿入データと返却内容
  - リクエストJSONの`title`,`content`を使って1件挿入し、作成レコードを返す。
- レスポンスの形（成功時）
  - オブジェクト。次のキーを持つ。
    - `id`: 数値。
    - `title`: 文字列。
    - `content`: 文字列。
    - `created_at`: ISO8601形式の日時文字列。
    - `updated_at`: ISO8601形式の日時文字列。
- レスポンスの形（失敗時）
  - オブジェクト。次のキーを持つ。
    - `error`: 文字列（エラーメッセージ）。
  - 例: `{"error":"Supabase client is not configured"}` または `{"error":"エラーメッセージ"}`。
- ステータスコード
  - 正常時は`201`で作成レコードのオブジェクトを返す。
  - 失敗時は`500`でエラーメッセージJSONを返す（キーは`error`のみで値は文字列）。
  - 失敗時のJSON例: `{"error":"Supabase client is not configured"}` または `{"error":"エラーメッセージ"}`。
  - この章ではバリデーションエラーなども含めて`500`で扱う（`400`などのクライアントエラーは扱わない）。
- 禁止事項
  - エンドポイントのパスやフィールド名を変更しない。

### ヒント

- 同じファイル `src/app/api/memos/route.ts` に `export async function POST(req)` を定義する。
- `await req.json()` でリクエストボディを取得する（`title` と `content`）。
- `memos` テーブルへ挿入し、`select(...).single()` で作成レコードを取得する。
- 成功時は作成レコードを`201`で返す。失敗時は`500`でエラーメッセージJSONを返す。

### 解答例

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// 既存のGET（課題Aの実装）
export async function GET() {
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// 追記するPOST（課題Bの実装）
export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .insert({ title: String(body.title ?? ''), content: String(body.content ?? '') })
    .select('id,title,content,created_at,updated_at')
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
```

## 章末の確認

- `GET /api/memos` が配列のJSONを返す（空配列でも可）。
- `POST /api/memos` が`201`で作成レコードを返す。
- エラー時は`500`のJSONが返る。

以下のコマンドで動作確認できます（1行ずつ実行）。各curlは`-i`オプションによりHTTPステータスとレスポンスヘッダーも表示します。

・2行目のGETは事前状態の確認（空配列でも可）。3行目でPOSTし、4行目のGETで作成結果が配列に含まれることを確認します。

```bash
npm run dev
curl -i http://localhost:3000/api/memos
curl -i -X POST http://localhost:3000/api/memos -H 'Content-Type: application/json' -d '{"title":"サンプル","content":"本文"}'
curl -i http://localhost:3000/api/memos
```

期待される結果（要点）
- 2行目: `[]` などの配列（空でも可）。
- 3行目: ステータス`201`で作成レコードのオブジェクトが返る。
- 4行目: 3行目で作成したレコードが配列に含まれる。
