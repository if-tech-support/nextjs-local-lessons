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
1. `01-環境構築.md`（環境セットアップ）
  - 開発環境を用意してNext.jsとSupabaseを動かす土台を作る
2. `02-共通レイアウトとUI基盤.md`（共通レイアウト）
  - ヘッダー/フッター/ナビを共通レイアウトに入れて見た目の骨組みを整える
3. `03-DBスキーマとクライアント準備.md`（データ構造理解）
  - 商品/カート/注文テーブルの関係を理解しSupabaseクライアントを使える状態にする
4. `04-API（前編：商品一覧と追加）.md`（一覧取得と追加）
  - 商品一覧を読み込みカートに追加する最小のサーバー処理を作る
5. `05-新規追加ボタンの実装.md`（カート追加ボタン）
  - 商品カード内のボタン1つでカートへ数量1を追加する最小のServer Action送信を学ぶ
6. `06-送信後の再検証フロー.md`（送信と再検証）
  - カート追加/数量更新/注文確定後にrevalidatePathで一覧が更新される順序を確認する
7. `07-各ページの一覧更新確認.md`（再検証結果の見え方）
  - products/cart/ordersページ別々で操作後にUIがどう差し替わるかを観察する（統合ページなし）
8. `08-注文履歴の取得と集計.md`（履歴一覧）
  - ordersページでorder_itemsをネスト取得し各注文合計金額を計算して表示する
9. `09-API（後編：更新・削除）.md`（更新と削除）
  - 数量変更や削除などの更新処理と再検証の動きを押さえる
10. `10-詳細ページ.md`（計画：注文詳細）
  - （計画）注文ごとの専用詳細ページをどう作るか考える
11. `11-数量編集UI拡張.md`（計画：編集改善）
  - （計画）現在の行内数量更新を専用UI/楽観的更新に発展させる案
12. `12-削除後の遷移改善.md`（計画：削除後UX）
  - （計画）カート行/注文削除後の遷移先や完了表示を最適化する案
13. `13-まとめ.md`（まとめと次の一歩）
  - 学んだサーバーActionと再検証/Suspenseの要点と次の拡張アイデアを整理する

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
