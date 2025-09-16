## はじめに
ミニECサイトを題材にサーバーコンポーネント/クライアントコンポーネントの役割分担とServer Actionsによるミューテーションと再検証、Suspenseと`loading.tsx`の非同期UI表現を一連のフローで学ぶ。学習到達点は商品一覧/カート/注文履歴のページ構成と注文確定までの操作をサーバー往復最小で実装できる状態。
- Next.js（App Router）
- Server Components / Client Components
- Server Actions + `redirect` + `revalidatePath`
- Suspense + ルートセグメント`loading.tsx`
- Supabase（Postgres）による簡易永続化
- Tailwind CSS最小クラス設計

## 対象者
- React理解がある
- Next.js App Router基礎を学習済
- サーバー/クライアントコンポーネントの実践感覚を得たい
- Server Actionsと再検証パターンをまとめて触れたい

## 目的
1. サーバー/クライアントコンポーネントの責務分離を理解し適切に配置できる
2. Server Actionsでフォーム送信→DB更新→`revalidatePath`→`redirect`を1往復で完結させる
3. Suspenseと`loading.tsx`を用いて非同期領域に段階的ローディングUIを適用できる
4. Supabaseクライアントをサーバー/ブラウザで安全に初期化しCRUDを行う

## 学習対象のスキル
- サーバーコンポーネント
- クライアントコンポーネント
- 'use server'ディレクティブ
- Server Actionsフォームハンドリング
- `revalidatePath`によるキャッシュ再検証
- `redirect`による遷移制御
- Suspense境界
- ルート`loading.tsx`
- Supabaseサーバー/ブラウザクライアント
- Postgres基本CRUD
- Tailwind最小ユーティリティ選定

## 前提（推奨）
- Node.js LTS環境
- npmもしくは同等パッケージマネージャー
- 基本的なGit操作
- React/Next.js基礎知識（App Router, layout/page構造）
- 基本的なRDB概念（テーブル/主キー/外部キー）

DB利用時はローカルSupabase（Postgres）をCLIで起動しマイグレーションとシードを適用する。

主要ページ/ルート:
- `/`（リダイレクト→`/products`）
- `/products`
- `/cart`
- `/orders`

実装ルール:
- サーバーコンポーネントをデフォルトとしブラウザ状態/入力が必要な箇所のみクライアント化
- Server Actionsは`'use server'`先頭宣言ファイルに集約（`src/lib/actions.ts`）
- ミューテーション後は関連ページへ`revalidatePath`で一貫性維持
- 一時ユーザー識別は`demo-user`固定（認証導入箇所は簡略化）
- Tailwindクラスは1要素概ね5個以内
- 動的キャッシュ性確保のため対象ページは`export const dynamic = 'force-dynamic'`

環境変数:
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---
## 章立て（目次）
1. `01-環境構築.md`（環境セットアップ）: 対象ファイル=`package.json` `next.config.ts` `supabase/schema.sql` / 後続章で扱うUI構造・Server Actionsは未導入
2. `02-共通レイアウトとUI基盤.md`（共通レイアウト）: 対象ファイル=`src/app/layout.tsx` `src/app/page.tsx` / 後続章: 動的データ取得・Server Actions未実装
3. `03-DBスキーマとクライアント準備.md`（データ構造理解）: 対象ファイル=`supabase/migrations/{YYYYMMDDhhmmss_init}.sql` `supabase/seed.sql` `src/lib/supabase/server.ts` `src/lib/supabase/client.ts` / 後続章: CRUD呼び出し・Action未実装
4. `04-商品一覧.md`（一覧取得と表示、カート件数の取得と表示）: 対象ファイル=`src/app/products/page.tsx` / 後続章: カート追加ボタン・Server Action・Suspense未実装
5. `05-カート追加.md`（カート追加機能）: 対象ファイル=`src/app/products/page.tsx` `src/lib/actions.ts`（`addToCartAction`）/後続章: カート一覧表示・数量更新未実装・Suspense未実装・ `src/lib/actions.ts`の`addToCartAction`以外のAction未実装
6. `06-カート一覧.md`（カート取得と表示）: 対象ファイル=`src/app/cart/page.tsx`/後続章: 数量更新・削除Action未実装・Suspense未実装
7. `07-カート更新と削除.md`（カート更新/削除機能）: 対象ファイル=`src/lib/actions.ts`（`updateCartItemAction` `removeCartItemAction`）`src/app/cart/page.tsx`/後続章: 注文確定未実装・Server Action・Suspense未実装・ `src/lib/actions.ts`の`addToCartAction`と`updateCartItemAction`と`removeCartItemAction`以外のAction未実装
8. `08-注文確定.md`（注文確定機能）: 対象ファイル=`src/lib/actions.ts`（`placeOrderAction`）`src/app/cart/page.tsx` /後続章: `src/app/orders/page.tsx`の注文確定機能の実装は未実装・注文一覧取得と表示未実装・注文削除未実装・遅延読み込み未実装・Suspense未実装・ `src/lib/actions.ts`の`addToCartAction`と`updateCartItemAction`と`removeCartItemAction`と`placeOrderAction`以外のAction未実装
9. `09-注文一覧.md`（注文確定機能の完成・注文一覧取得と表示）: 対象ファイル=`src/app/orders/page.tsx`/後続章: 注文削除Action・遅延読み込み未実装・Suspense未実装
10. `10-注文削除.md`（注文削除機能）: 対象ファイル=`src/lib/actions.ts`（`deleteOrderAction`）`src/app/orders/page.tsx`/後続章: Suspense/`loading.tsx`適用未実装
11. `11-遅延読み込みUI.md`（Suspenseとloading.tsx）: 対象ファイル=`src/app/(各ページ)/loading.tsx`（導入）/後続章: まとめのみ
12. `12-まとめ.md`（まとめと次の一歩）: 対象ファイル=（新規コード追加なし）/後続章なし（学習到達点整理）

次のルールで各章を参照する。章ファイルは存在する`NN-*.md`のみ対象。
- ファイル名は変更しない
- 概要は章冒頭要約を1文で簡潔に示す
- 時間目安や冗長な前置きは含めない

---
## 進め方と検証方針
- 各章ごとにブラウザで対象ページ（`/products`等）を即確認
- Server Actions実行後はクエリ/DB状態と`revalidatePath`効果を観察
- Suspenseと`loading.tsx`の表示タイミングをNetwork/Performanceで確認
- ミューテーション後のキャッシュ不整合がないかUI差異を点検
- 環境変数未設定時エラーメッセージ/挙動を確認

## 注意
- ビルド生成物や既存`contents.md`を参照しない
- 架空のページ/環境変数/APIを追加しない
- Server Actionsは副作用と再検証の順序を崩さない
- 認証は範囲外のため固定ユーザーID利用を前提
- Tailwindクラス追加時は肥大化を避け簡潔性維持
