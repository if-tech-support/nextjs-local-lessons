## はじめに

`/api/memos` の一覧取得と新規作成エンドポイントを実装します。1エンドポイントあたり15分で完成を目指します。

## 目的

- `GET /api/memos` が配列のJSONを返せる。
- `POST /api/memos` が作成レコードを`201`で返せる。

## 学習対象のスキル

- Route Handler（Next.jsのAPIエンドポイントを定義する仕組み）の`GET/POST`。
- エラー時のHTTPステータスとJSON応答。

## 課題A：GET /api/memos を実装する（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- 要約
  - メモ一覧を取得し、更新日時の降順でJSON配列を返すGETエンドポイントを実装する。
- ファイルパス（作成）
  - `src/app/api/memos/route.ts`
- 取得フィールドと並び順
  - Supabaseから`id,title,content,created_at,updated_at`を取得し、更新日時の降順で返す。
- ステータスコード
  - 失敗時は`500`でエラーメッセージJSONを返す。
- 禁止事項
  - エンドポイントのパスやフィールド名を変更しない。


### ヒント

Tailwindの例：`px-4` `py-2` `rounded`

### 解答例

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/server';

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

## 課題B：POST /api/memos を実装する（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- 要約
  - リクエストJSONの`title`と`content`を受け取り、1件を作成して作成レコードを`201`で返すPOSTエンドポイントを実装する。
- ファイルパス（作成）
  - `src/app/api/memos/route.ts`
- 挿入データと返却内容
  - リクエストJSONの`title`,`content`を使って1件挿入し、作成レコードを返す。
- ステータスコード
  - 正常時は`201`。
  - 失敗時は`500`でエラーメッセージJSONを返す。
- 禁止事項
  - エンドポイントのパスやフィールド名を変更しない。


### ヒント

Tailwindの例：`px-4` `py-2` `rounded`

### 解答例

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/server';

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
