## はじめに

`/api/memos/[id]` の詳細取得エンドポイントを実装します。

## 目的

- `GET /api/memos/[id]` が該当IDのレコードを返せる。

## 学習対象のスキル

- パスからのID取得とバリデーション。
- 見つからない場合の`404`応答。

## 課題A：GET /api/memos/[id] を実装する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

- IDから1件を取得してJSONで返す詳細エンドポイントを実装する。
- 対象ファイル: `src/app/api/memos/[id]/route.ts`（作成）。
- URLからIDを取り出し、該当IDのレコードのみを1件返す。
- レコードが存在しない場合は404を返す。
- クライアント生成不可など環境設定に問題がある場合は500を返す。
- エンドポイントのパスやレスポンスのフィールド名を変更しない。

【使用タグ】
- なし（サーバーコードのため）

### ヒント

- URLからIDはURL APIと`decodeURIComponent`で取り出す。
- Supabaseクライアント生成に失敗した場合は`500`を返す。
- `memos`テーブルから`select('id,title,content,created_at,updated_at').eq('id', id).single()`で1件取得する。
- 見つからない場合は`404`、取得できたら`NextResponse.json(data)`で返す。

### 解答例

```ts
import { createClient } from '@/utils/server';
import { NextResponse } from 'next/server';

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

```

## 章末の確認

- 既存のIDで`GET /api/memos/[id]`がレコードを返す。
- 未存在のIDでは`404`のJSONが返る。
- `.env`の設定が不足している場合は`500`のエラーJSONが返る。
