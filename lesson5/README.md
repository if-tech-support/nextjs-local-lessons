## Lesson5 MiniShop

学習目的:

1. サーバー / クライアントコンポーネントの役割分担
2. Server Actions によるフォーム送信 -> ミューテーション -> 再検証 -> `redirect`
3. Suspense と `loading.tsx` によるストリーミング / ローディング UI

### ルート

- `/products` 商品一覧 + クライアント検索 + 「カートに追加」（Server Action）
- `/orders` カート合計と「注文確定」（Server Action） + 過去注文一覧

### 技術ポイント

- Server Actions （`src/lib/actions.ts`） : `"use server"`、`revalidatePath`, `redirect`
- サーバーコンポーネント: デフォルト （一覧, 注文ページ骨格）
- クライアントコンポーネント: 検索ボックス + フィルタ表示 （`product-list-client.tsx`, `SearchBox.tsx`）
- Suspense + `app/**/loading.tsx`: 非同期領域のローディング表現

### 起動

```bash
npm install
npm run dev
```

`/products` へアクセスして学習を開始してください。

### ローカル Supabase を使ったセットアップ （オプション / 推奨）

アプリ内のデータをインメモリではなくローカルPostgres （Supabase CLI） 上で扱う手順です。

1. Supabase CLIインストール（未導入の場合）
  ```bash
  npm install supabase --save-dev
  ```
2. ログイン（初回のみ）
	```bash
	npx supabase init
	```
3. Docker Desktopを起動
4. プロジェクトルート（lesson5ディレクトリ）でローカル起動
	```bash
	npx supabase start
	```
	出力に表示される `API URL` と `anon key` を `.env` へコピーしてください。
	例:
	```env
	NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxxxxxxxxxxxxxxx
	```
5. テーブル作成用のマイグレーションファイル作成
	 ```bash
	 npx supabase migration new init
	 ```
	 `supabase/migrations/` 以下に `YYYYMMDDhhmmss_init.sql` が作成されるのでSQLを記述する。
6. 初期データ投入用のファイル作成
	`supabase/seed.sql`に初期データ投入用のSQLを記述する。
7. マイグレーション&初期データ投入
	```bash
	npx supabase db reset
	```
8. 型を作成
	```bash
	npx supabase gen types typescript --local --schema public > supabase/types/database.ts
	```
	`supabase/types/database.ts` が作成される。
9. Next.js起動（別ターミナル）
	```bash
	npm run dev
	```
10. `/products` で初期データ（6商品）が表示されることを確認。

フォルダー構成:

```
supabase/
  migrations/        # 0001_init.sql （スキーマ）
  seed/seed.sql      # 初期データ投入
  schema.sql         # 参考 （元の単一ファイル版）
  seed_products.sql  # 参考 （旧シード）
```

`schema.sql` / `seed_products.sql` は学習比較用に残しています。運用時は `migrations/` と `seed/` を利用してください。

### 実験手順例

1. 複数商品を「カートに追加」→ `/orders` で合計確認
2. 「注文確定」→ `redirect` でクエリ付き遷移 （`?placed=...`） を確認
3. 再度 `/products` に戻りカート数リセット（再検証）を確認
4. コンソールで Server Actions がネットワーク往復 1 回で完結していることを確認

### 次段階アイデア （レッスン外）

- Prisma + DB 永続化
- キャッシュタグ （`revalidateTag`） でのより粒度の細かい無効化
- 楽観的 UI / トースト通知

