# 対象者
- Reactを理解している
- Next.jsの基本を理解している

# 目的
1. Route Handlerの基本 (GET, POST, PUT, DELETE) を学ぶ
2. クエリパラメーターの取得方法を学ぶ
3. Supabaseによる永続化の最小実装を学ぶ

# 主要なスキル
- Route Handler
- NextResponse
- Supabase
- Supabase Database

# 題材とするアプリケーション
- メモ帳アプリ（2ページ）
  - `/memos` メモ一覧 + 新規作成フォーム
  - `/memos/[id]` メモ詳細（編集・削除）
- APIルート（章分割に合わせた学習順）
  - 03章: `GET /api/memos` 一覧取得、`POST /api/memos` 新規作成
  - 05章: `GET /api/memos/[id]` 1件取得
  - 06章: `PUT /api/memos/[id]` 更新、`DELETE /api/memos/[id]` 削除

# レイアウト
- 共通
  - ヘッダー
    - アプリタイトル (クリックで `/memos`)
  - フッター
    - © 2025 MemoLite
- `/memos`
  - ページタイトル
  - 新規作成フォーム
    - タイトル入力
    - 詳細入力
    - 送信ボタン
  - メモ一覧
    - タイトル
    - 作成日時
    - 更新日時
    - 詳細ページへのリンク
- `/memos/[id]`
  - ページタイトル
  - メモ詳細表示
    - タイトル
    - 詳細
    - 作成日時
    - 更新日時
  - 編集フォーム
    - タイトル入力
    - 詳細入力
    - 更新ボタン
    - 削除ボタン
  - 戻るボタン