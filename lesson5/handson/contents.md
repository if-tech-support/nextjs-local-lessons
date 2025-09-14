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
1. `01-環境構築.md`
  - Next.jsプロジェクト初期化とTailwind導入およびSupabaseローカル起動準備
2. `02-共通レイアウトとUI基盤.md`
  - ヘッダー/フッター/基本レイアウトと色味や余白の最小デザイン適用
3. `03-DBスキーマとクライアント準備.md`
  - Supabaseテーブル定義と型生成およびサーバー/ブラウザクライアント作成
4. `04-API（前編：一覧・作成）.md`
  - 商品取得とカート追加のためのServer Actionおよび取得処理
5. `05-新規作成フォームのUI.md`
  - カート追加フォームUIと最小インタラクションの実装
6. `06-フォーム送信とエラーハンドリング.md`
  - Server Action送信時の例外処理とリダイレクト/再検証フロー
7. `07-一覧テーブルとページ統合.md`
  - 商品/カート/注文一覧のテーブル表示統合
8. `08-API（後編：詳細）.md`
  - 注文詳細取得パターンと関連テーブル結合の取得
9. `09-API（後編：更新・削除）.md`
  - 注文削除や数量更新などミューテーション系Action追加
10. `10-詳細ページ.md`
  - 注文履歴詳細表示UIの構成
11. `11-編集フォーム.md`
  - カート数量編集フォームと更新Action
12. `12-削除と戻るボタン.md`
  - 削除Actionとユーザー遷移補助UI
13. `13-まとめ.md`
  - 学習内容の整理と次ステップ案提示

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
