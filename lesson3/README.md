Lesson 3: MemoLite — Route Handlers / Query Params / Supabase minimal

学べること
- Route Handler基本 (GET/POST/PUT/DELETE)
- Supabaseを使った永続化（最小）

アプリ仕様
- ページ
	- /memos：一覧＋新規作成
	- /memos/[id]：詳細/編集/削除
- API
	- GET /api/memos
	- POST /api/memos
	- GET /api/memos/[id]
	- PUT /api/memos/[id]
	- DELETE /api/memos/[id]

動かし方
1) 依存インストール / 開発起動
```bash
npm i
npm run dev
```

2) ブラウザで http://localhost:3000 へ。ヘッダーの`MemoLite`から`/memos`を開く。

環境変数（.env）
- このレッスンではAPIはSupabaseのみを使用します（インメモリなし、サーバーアクション不使用）
- 以下を設定してください（.env.exampleを参照）:
	- NEXT_PUBLIC_SUPABASE_URL
	- NEXT_PUBLIC_SUPABASE_ANON_KEYまたはSUPABASE_SERVICE_ROLE_KEY
 - fetchはフルパスを要求するため、NEXT_PUBLIC_BASE_URLも設定してください（例: http://localhost:3000）。

Supabaseテーブル（memos）
```
id: uuid (PK, default uuid_generate_v4())
title: text
content: text
created_at: timestamp with time zone (default now())
updated_at: timestamp with time zone (default now())
```

Tips
- Route Handlerはsrc/app/api/*/route.tsに置く
- Tailwind CSS v4を使用
- フォーム送信はクライアントコンポーネントからfetchで実装（サーバーアクションは使用しません）
