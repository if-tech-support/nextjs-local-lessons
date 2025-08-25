## はじめに

APIエンドポイントを実装して、メモの一覧取得・作成・詳細取得・更新・削除を行えるようにします。App Router配下のRoute HandlerでHTTPメソッドごとに処理を定義します。

## 目的

- `GET/POST /api/memos` と `GET/PUT/DELETE /api/memos/[id]` を実装できる
- エラー時のHTTPステータスとJSON応答を適切に返せる
- Supabaseクライアントを用意し、最小のCRUDが通る準備ができている

## 学習対象のスキル

- Route Handler（`src/app/api/**/route.ts`）
- `NextRequest`/`NextResponse` の利用
- Supabaseクライアントの初期化とCRUDメソッド

## 課題A：DBスキーマを作る（5分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

1. ファイルパス（作成）
   - SupabaseのSQLエディターで実行（ローカルファイルは任意）
2. 要素構造と順序（親→子）
   - 拡張機能を有効化し、`public.memos`テーブルを作成する。
   - 主キーは`uuid`、作成・更新日時は自動で現在時刻を設定する。
3. 具体数値
   - `id`は`gen_random_uuid()`のデフォルト値を使用。
4. 最小禁止事項
   - カラム名や型を変更しない。
5. 使用タグセクション
   - 【使用タグ】（サーバーコード/SQLのため該当なし）

### ヒント

Tailwindの例：`text-sm` `font-mono` `p-2`

### 解答例

```sql
-- Enable required extension for gen_random_uuid
create extension if not exists pgcrypto;

-- Memos table
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

```

## 課題B：Supabaseクライアントと補助モジュール/型を用意する（10分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

1. ファイルパス（作成）
   - `src/server/supabase.ts`
   - `src/lib/api.ts`
   - `src/types/memo.ts`
2. 要素構造と順序（親→子）
   - モジュール内で環境変数を取得し、関数でSupabaseクライアントを生成して返す。
   - APIフルURLを生成する関数（`apiUrl`）を1つ作成する。
   - メモ型（`Memo`）と作成・更新用の型を定義する。
   - 生成関数は未設定時に`null`を返す。
3. 具体数値
   - `auth.persistSession`は`false`。
   - 末尾スラッシュの二重連結を回避する。
4. 最小禁止事項
   - 余計なラッパー関数やクラスを追加しない。
   - ベースURLを直書きしない。
5. 使用タグセクション
   - 【使用タグ】（サーバーコード/型定義のため該当なし）

### ヒント

Tailwindの例：`text-sm` `font-mono` `p-2`

### 解答例

```typescript
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 公式 Quickstart に沿ったシンプルなサーバーサイド用クライアント生成
 * - URL: NEXT_PUBLIC_SUPABASE_URL
 * - KEY: SUPABASE_SERVICE_ROLE_KEY (優先) or NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - persistSession: false（Route Handler での最小利用）
 */
export function createSupabaseClient(): SupabaseClient | null {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if (!url || !key) return null;
   return createClient(url, key, { auth: { persistSession: false } });
}

```

```typescript
// APIエンドポイントのフルURLを生成するユーティリティ
// NEXT_PUBLIC_BASE_URL を先頭に付与し、二重スラッシュを避けます
const BASE = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');

export function apiUrl(path: string) {
   const p = path.startsWith('/') ? path : `/${path}`;
   return `${BASE}${p}`;
}

```

```typescript
export type Memo = {
   id: string;
   title: string;
   content: string;
   created_at: string; // ISO string
   updated_at: string; // ISO string
};

export type MemoCreateInput = {
   title: string;
   content: string;
};

export type MemoUpdateInput = Partial<MemoCreateInput>;

```

## 課題C：CRUD APIを実装する（15分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

1. ファイルパス（作成）
   - `src/app/api/memos/route.ts`
   - `src/app/api/memos/[id]/route.ts`
2. 要素構造と順序（親→子）
   - 一覧API（`GET /api/memos`）は配列を返す。
   - 作成API（`POST /api/memos`）は作成レコードを返す。
   - 詳細API（`GET /api/memos/[id]`）は該当IDのレコードを返す。
   - 更新API（`PUT /api/memos/[id]`）は更新後レコードを返す。
   - 削除API（`DELETE /api/memos/[id]`）は結果を返す。
3. 具体数値
   - 作成成功は`201`。
   - 見つからない場合は`404`。
   - その他エラーは`500`。
4. 最小禁止事項
   - エンドポイントのパスやフィールド名を変更しない。
   - パラメーターの取得に別手段を導入しない（URLからIDを抽出する）。
5. 使用タグセクション
   - 【使用タグ】（サーバーコードのため該当なし）

### ヒント

Tailwindの例：`px-4` `py-2` `rounded`

### 解答例

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClient } from '@/server/supabase';

export async function GET() {
   const client = createSupabaseClient();
   if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
   const { data, error } = await client
      .from('memos')
      .select('id,title,content,created_at,updated_at')
      .order('updated_at', { ascending: false });
   if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
   return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
   const body = await req.json();
   const client = createSupabaseClient();
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
```typescript
import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/server/supabase';

export async function GET(req: Request) {
   const pathname = new URL(req.url).pathname;
   const id = decodeURIComponent(pathname.split('/').pop() || '');
   const client = createSupabaseClient();
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

export async function PUT(req: Request) {
   const pathname = new URL(req.url).pathname;
   const id = decodeURIComponent(pathname.split('/').pop() || '');
   const body = await req.json();
   const client = createSupabaseClient();
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

export async function DELETE(req: Request) {
   const pathname = new URL(req.url).pathname;
   const id = decodeURIComponent(pathname.split('/').pop() || '');
   const client = createSupabaseClient();
   if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
   const { error } = await client.from('memos').delete().eq('id', id);
   if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
   return NextResponse.json({ ok: true });
}

```

## 章末の確認

- 開発サーバーを起動している状態で、以下を順番に確認する。

```bash
# 一覧取得（空配列もOK）
curl -s http://localhost:3000/api/memos

# 新規作成（タイトルと詳細を送信）
curl -s -X POST http://localhost:3000/api/memos -H 'Content-Type: application/json' -d '{"title":"test","content":"hello"}'

# 1件取得（IDは上記応答のidに置換）
curl -s http://localhost:3000/api/memos/<id>

# 更新
curl -s -X PUT http://localhost:3000/api/memos/<id> -H 'Content-Type: application/json' -d '{"title":"updated","content":"world"}'

# 削除
curl -s -X DELETE http://localhost:3000/api/memos/<id>
```

- 正常時は`200/201`が返る。設定不足やDB未作成時はエラーJSONが返るため、`.env`やスキーマを見直す。

以上で、APIの最小CRUD実装が完了です。次章ではクライアントからの`fetch`を用いて一覧と新規作成のUIを作ります。
