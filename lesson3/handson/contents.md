## はじめに

本ハンズオンでは、Next.js（App Router）でルートハンドラーと最小のDB永続化（Supabase）を学ぶために、2ページ構成のメモアプリを題材に進めます。完成形は次の条件を満たすアプリケーションです。

- ページ構成：メモ一覧（`/memos`）・詳細（`/memos/[id]`）
- API構成：`GET/POST /api/memos`、`GET/PUT/DELETE /api/memos/[id]`
- データ永続化：Supabase（最小スキーマ）
- スタイリング：Tailwind CSS（v4、シンプルなクラス構成）
- 実装方針：サーバーアクションは使用せず、クライアント側からfetchでAPIを呼び出す

## 対象者

- Reactを理解している方
- Next.jsの基本を理解している方

## 目的

1. Route Handlerの基本（GET/POST/PUT/DELETE）を実装できる
2. クエリパラメーターの取得方法（`request.nextUrl.searchParams`）を理解する
3. Supabaseによる永続化の最小実装（テーブル作成〜CRUD連携）を体験する

## 学習対象のスキル

- Route Handler（App Router配下の `src/app/api/**/route.ts`）
- NextRequest/NextResponseの基礎
- クライアントコンポーネントからのfetch実装（POST/PUT/DELETE）
- Supabase JS（`createClient`）と最小スキーマ設計

## 前提（推奨）

- Node.js最新安定版（LTS推奨）
- パッケージマネージャー（npm/yarn/pnpmのいずれか）
- Next.js 15系（App Router）
- Supabaseプロジェクト（新規作成が必要。レッスン間で継続利用できる命名を推奨。例：`nextjs-local-lessons-<name>-dev`。URLとANONあるいはSERVICE_ROLEキーを取得）

Supabaseプロジェクト命名の指針（継続利用のため）

- 命名は環境と用途がわかる形にします（例：`nextjs-local-lessons-<yourname>-dev`）。
- レッスン2以降でも同一プロジェクトを流用できるよう、使い回し前提の名前にします。
- リージョンは普段利用する地域を選び、費用とレイテンシのバランスをとります。

環境変数（.env）例：

- `NEXT_PUBLIC_BASE_URL`（例: `http://localhost:3000`）
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`（または `SUPABASE_SERVICE_ROLE_KEY`）

---

## 章立て（目次）

本ハンズオンは、章ごとにファイルを分割し、順番に読み進めることで完成します。各章のファイル名は「`{章立て番号}-固有名詞.md`」です。

1. `01-環境構築.md`
   - 新規プロジェクトの作成、依存追加、`.env`設定、開発起動の確認（トップページのみ）。
2. `02-共通レイアウトとUI基盤.md`
   - 共通`layout.tsx`/フォント/グローバルスタイル/ヘッダー・フッター/テーマトークンを整備し、以降の章のUI土台を理解する。
3. `03-DBスキーマとクライアント準備.md`
   - `memos`テーブル作成、`createSupabaseClient`、`apiUrl`、`Memo`型定義。
4. `04-API（前編：一覧・作成）.md`
   - `GET /api/memos`、`POST /api/memos` の実装と動作確認。
5. `05-1-新規作成フォームのUI.md`
   - フォームのUI（見出し・入力・ボタン）を作成（機能は未実装）。
6. `06-フォーム送信とエラーハンドリング.md`
   - フォームをクライアント化し、POST/エラー表示/refreshを実装。
7. `07-一覧テーブルとページ統合.md`
   - 一覧テーブルの作成と `/memos` での統合・表示確認（fetch no-store）。
8. `08-API（後編：詳細）.md`
   - `GET /api/memos/[id]` の実装と動作確認。
9. `09-API（後編：更新・削除）.md`
   - `PUT /api/memos/[id]`、`DELETE /api/memos/[id]` の実装と動作確認。
10. `10-詳細ページ.md`
   - `/memos/[id]` の詳細表示と404分岐。
11. `11-編集フォーム.md`
   - 詳細ページに編集フォーム（PUT）を追加。
12. `12-削除と戻るボタン.md`
   - 削除ボタン（DELETE）と戻るボタンの実装。
13. `13-まとめ.md`
   - 学んだポイントの振り返りと軽い自己チェック。

各章のMarkdownは、次の見出しルールで統一されています。

- 章タイトルは不要（先頭はH2から）
- 見出し構成
  - `## はじめに`
  - `## 目的`
  - `## 学習対象のスキル`（目的の直後に配置）
  - 課題群：各課題は `## 課題X：...`、配下に `### 仕様`／`### ヒント`／`### 解答例`
  - `## 章末の確認`

---

## 進め方と検証方針

- 01章はトップページの表示のみ確認します。API実装の章（03/07/08）はコマンド（curlなど）でレスポンスを検証します。ページを用いた画面確認は04章以降（`/memos` と `/memos/[id]`）で行います。
- `.env`の設定（とくに`NEXT_PUBLIC_BASE_URL`とSupabaseの各キー）を忘れずに行い、API呼び出しがフルパスで成功することを確認します。
- スタイルは設計どおりの見た目に合わせ、値（余白/色/サイズ）はTailwindのユーティリティからシンプルに選択します。

## 注意

- 本資料だけで進められるように構成しています。章ごとの手順に沿って0から実装してください。
- サーバーアクションは学習範囲外です。フォーム送信や編集・削除はクライアント側からfetchで実装します。
- Supabaseのキー管理には注意してください（SERVICE_ROLEはサーバー側のみで使用）。
