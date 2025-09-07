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

この課題では指定IDのメモ1件を取得するGET詳細エンドポイントを実装し、成功200／未存在404／環境不備500を正しいJSONで返せるようにします。

- 対象ファイル: `src/app/api/memos/[id]/route.ts`（新規作成）
- 振る舞い（今回実装分）:
  - リクエストURL末尾のID文字列を抽出（存在しない場合は空文字）
  - Supabaseクライアントを生成し`memos`テーブルから`id,title,content,created_at,updated_at`を1件取得
  - 取得成功時はそのままJSONで返却
- 成功時処理:
  - ステータス200
  - 返却オブジェクト: 取得した1件（`id`,`title`,`content`,`created_at`,`updated_at`）フィールド名は変更しない
- エラー処理:
  - レコード未存在または取得エラー: ステータス404
  - レスポンスボディ: `{ "error": "Not Found" }`またはSupabaseエラーの`message`文字列を`error`キーに格納したJSON
- 環境未設定エラー:
  - Supabaseクライアント生成不可時: ステータス500 `{ "error": "Supabase client is not configured" }`
- 返却形式:
  - `NextResponse.json()`によりContent-Typeは`application/json`（変更しない）
- 制約 / その他:
  - エンドポイントのURLパス構造を変更しない
  - レスポンスのフィールド名を変更しない

【使用タグ】
- なし（サーバーコードのため）

### ヒント

- URLからIDはURL APIと`decodeURIComponent`で取り出す。
- Supabaseクライアント生成に失敗した場合は`500`を返す。
- `memos`テーブルから`select('id,title,content,created_at,updated_at').eq('id', id).single()`で1件取得する。
- 見つからない場合は`404`、取得できたら`NextResponse.json(data)`で返す。

### 解答例

```ts
import { createClient } from '@/utils/supabase/server';
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

- 動作ポイント:
  - 既存のIDで `GET /api/memos/[id]` がステータス200と対象レコードJSONを返す。
  - 未存在のIDではステータス404と `{ "error": "Not Found" }`（またはエラーメッセージ）を返す。
  - `.env` の設定が不足している場合はステータス500と `error` キーを含むJSONを返す。

検証手順（例）:

```bash
npm run dev
```

別ターミナルで一覧からIDを取得:

```bash
curl -i http://localhost:3000/api/memos
```

取得したIDを <ID> に差し替えて詳細取得:

```bash
curl -i http://localhost:3000/api/memos/<ID>
```

存在しないIDで404確認:

```bash
curl -i http://localhost:3000/api/memos/non-existent-id
```

期待される結果（要点）:
- 200: 1件のメモオブジェクト（id,title,content,created_at,updated_at）。
- 404: `{ "error": "Not Found" }`（存在しないID）。
- 500: `{ "error": "Supabase client is not configured" }`（環境設定不備時）。
