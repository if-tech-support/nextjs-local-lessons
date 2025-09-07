## はじめに

`/api/memos/[id]` の更新（PUT）と削除（DELETE）エンドポイントを実装します。

## 目的

- `PUT /api/memos/[id]` で更新後レコードを返せる。
- `DELETE /api/memos/[id]` で削除結果を返せる。

## 学習対象のスキル

- リクエストボディの取り扱い。
- 変更系APIの正常/異常時の応答。

## 課題A：PUT /api/memos/[id] を実装する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

メモのIDを指定し、リクエストJSONの`title`と`content`で更新して、更新後レコードをJSONで返します。

- ファイルパス（編集）：`src/app/api/memos/[id]/route.ts`
- エンドポイント: `PUT /api/memos/[id]`
- リクエストボディの`title`と`content`で、該当IDのレコードを更新する。
- 応答は更新後レコード（`id`,`title`,`content`,`created_at`,`updated_at`）のJSONを返す。
- エラー時はHTTP 500を返す。
- エンドポイントのパスやフィールド名は変更しない。
 - 成功時はHTTP 200を返す。
 - 失敗時（500）のレスポンスは`{ "error": "<エラーメッセージ>" }`形式（`error`は文字列）。
 - 対象ID未存在時: 404 `{ "error": "Not Found" }` を返す（GETと同基準）。
 - 環境未設定（Supabaseクライアント生成不可）: 500 `{ "error": "Supabase client is not configured" }`。
 - レスポンス例（1行JSON）:
   - 成功: 更新後レコード例 `{"id":"...","title":"...","content":"...","created_at":"...","updated_at":"..."}`
   - 未存在: `{"error":"Not Found"}`
   - 環境未設定: `{"error":"Supabase client is not configured"}`
   - 内部エラー: `{"error":"<message>"}`

【使用タグ】
- なし（サーバーコードのため）

### ヒント

- ルーティング: HTTPメソッドはPUT、パスは`/api/memos/[id]`。
- ID取得: `new URL(req.url).pathname`から末尾セグメントを`decodeURIComponent`で取り出す。
- リクエスト: `await req.json()`で`{ title, content }`を受け取る。
- DB更新: `createClient()`でクライアントを作成し、`memos`に対して`update`し、`eq('id', id)`で対象を指定する。
- 戻り値: `select('id,title,content,created_at,updated_at').single()`で更新後レコードを返す。
- エラー: 失敗時は`NextResponse.json({ error }, { status: 500 })`を返す。

### 解答例

```ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// 既存のGET（前章までで実装済み）
export async function GET(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 404 });
  if (!data) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  return NextResponse.json(data);
}

// 今回実装するPUT
export async function PUT(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const body = await req.json();
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .update({ title: body.title, content: body.content })
    .eq('id', id)
    .select('id,title,content,created_at,updated_at')
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data);
}

```

## 課題B：DELETE /api/memos/[id] を実装する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

メモのIDを指定して該当レコードを削除し、結果をJSONで返します。

- ファイルパス（編集）：`src/app/api/memos/[id]/route.ts`
- エンドポイント: `DELETE /api/memos/[id]`
- 該当IDのレコードを削除する。
- 応答は`{ ok: true }`のJSONを返す。
- エラー時はHTTP 500を返す。
- エンドポイントのパスやフィールド名は変更しない。
 - 成功時はHTTP 200を返す。
 - 失敗時（500）のレスポンスは`{ "error": "<エラーメッセージ>" }`形式（`error`は文字列）。
 - 対象ID未存在時: 404 `{ "error": "Not Found" }` を返す。
 - 環境未設定（Supabaseクライアント生成不可）: 500 `{ "error": "Supabase client is not configured" }`。
 - レスポンス例（1行JSON）:
   - 成功: `{"ok":true}`
   - 未存在: `{"error":"Not Found"}`
   - 環境未設定: `{"error":"Supabase client is not configured"}`
   - 内部エラー: `{"error":"<message>"}`

【使用タグ】
- なし（サーバーコードのため）

### ヒント

- ルーティング: HTTPメソッドはDELETE、パスは`/api/memos/[id]`。
- ID取得: `new URL(req.url).pathname`から末尾セグメントを`decodeURIComponent`で取り出す。
- DB削除: `client.from('memos').delete().eq('id', id)`で該当レコードを削除する。
- 戻り値: 成功時は`{ ok: true }`をJSONで返す。
- エラー: 失敗時は`NextResponse.json({ error }, { status: 500 })`を返す。

### 解答例

```ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// 既存のGET（前章までで実装済み）
export async function GET(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 404 });
  if (!data) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  return NextResponse.json(data);
}

// 前課題で実装したPUT
export async function PUT(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const body = await req.json();
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .update({ title: body.title, content: body.content })
    .eq('id', id)
    .select('id,title,content,created_at,updated_at')
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data);
}

// 今回実装するDELETE
export async function DELETE(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { error } = await client.from('memos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}

```

## 章末の確認

次の手順で動作を確認しましょう。

```bash
# 開発サーバー起動（未起動なら）
npm run dev

# 1. 既存IDメモを取得（<既存ID> は実際の既存IDに置換）
curl -i http://localhost:3000/api/memos/<既存ID>

# 2. PUTでタイトルと内容を更新
curl -i -X PUT \
  -H "Content-Type: application/json" \
  -d '{"title":"更新後タイトル","content":"更新後本文"}' \
  http://localhost:3000/api/memos/<既存ID>

# 3. 再取得して更新結果を確認
curl -i http://localhost:3000/api/memos/<既存ID>

# 4. DELETEで削除
curl -i -X DELETE http://localhost:3000/api/memos/<既存ID>

# 5. 再取得して404/Not Foundを確認（実装状況により404レスポンス）
curl -i http://localhost:3000/api/memos/<既存ID>
```

期待される結果（要点）:

- PUT成功時: HTTP 200で更新後の`id,title,content,created_at,updated_at`が返る。
- DELETE成功時: HTTP 200で`{ ok: true }`が返る。
- 削除後の再取得: 404またはエラーJSON（`error`キーを含む）が返る。
- 異常系（DBエラー等）: HTTP 500で`{ error: "..." }`形式。
 - 1行JSON例: 404時 `{"error":"Not Found"}` / 500時 `{"error":"Supabase client is not configured"}`
