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
- リクエストボディの`title`と`content`で、該当IDのレコードを更新する。
- 応答は更新後レコード（`id`,`title`,`content`,`created_at`,`updated_at`）のJSONを返す。
- エラー時はHTTP 500を返す。
- エンドポイントのパスやフィールド名は変更しない。

【使用タグ】
- 該当なし

### ヒント

- ルーティング: HTTPメソッドはPUT、パスは`/api/memos/[id]`。
- ID取得: `new URL(req.url).pathname`から末尾セグメントを`decodeURIComponent`で取り出す。
- リクエスト: `await req.json()`で`{ title, content }`を受け取る。
- DB更新: `createClient()`でクライアントを作成し、`memos`に対して`update`し、`eq('id', id)`で対象を指定する。
- 戻り値: `select('id,title,content,created_at,updated_at').single()`で更新後レコードを返す。
- エラー: 失敗時は`NextResponse.json({ error }, { status: 500 })`を返す。

### 解答例

```ts
import { createClient } from '@/utils/server';
import { NextResponse } from 'next/server';

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
- 該当IDのレコードを削除する。
- 応答は`{ ok: true }`のJSONを返す。
- エラー時はHTTP 500を返す。
- エンドポイントのパスやフィールド名は変更しない。

【使用タグ】
- 該当なし

### ヒント

- ルーティング: HTTPメソッドはDELETE、パスは`/api/memos/[id]`。
- ID取得: `new URL(req.url).pathname`から末尾セグメントを`decodeURIComponent`で取り出す。
- DB削除: `client.from('memos').delete().eq('id', id)`で該当レコードを削除する。
- 戻り値: 成功時は`{ ok: true }`をJSONで返す。
- エラー: 失敗時は`NextResponse.json({ error }, { status: 500 })`を返す。

### 解答例

```ts
import { createClient } from '@/utils/server';
import { NextResponse } from 'next/server';

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

- 既存IDで`PUT /api/memos/[id]`が更新後レコードを返す。
- 既存IDで`DELETE /api/memos/[id]`が成功し、`{ ok: true }`が返る。
- エラー時は`500`のJSONが返る。
