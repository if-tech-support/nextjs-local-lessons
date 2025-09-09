# 対象者
- React を理解している
- Next.js の基本 (App Router, page.js / layout.js) を理解している
- Supabase を使ったことがない、または軽く触った程度

# 目的
1. 認証 (Authentication) と認可 (Authorization) の違いを理解する
2. Supabase Authentication を用いてメール+パスワードのサインアップ/ログイン/ログアウトを実装する
3. Next.js の middleware でセッションを更新しつつ、未認証ユーザーをログインページへリダイレクトする方法を学ぶ

# 主要なスキル
- Supabase Authentication (email/password)
- @supabase/ssr と cookies を用いた SSR 連携
- middleware によるセッション更新と楽観的チェック
- サーバーコンポーネントでの `redirect` と厳密ガード (`supabase.auth.getUser`)
- `cookies` (非同期 API) の取り扱い
- `NextResponse.redirect`

# 題材とするアプリケーション
- 会員限定ダッシュボード (最小構成、3 ページ)
  - `/` パブリック: アプリ説明と「ログインへ」リンク
  - `/login` 認証: メール/パスワードでログイン・サインアップ (Server Actions)
  - `/dashboard` 保護ページ: ログイン中ユーザーの email を表示。未認証は `/login?next=/dashboard` へリダイレクト

# レイアウト
- 共通
  - ヘッダー
    - アプリタイトル (クリックで `/`)
    - ナビゲーション
      - 「ログイン」(未認証時) / 「ダッシュボード」(認証時)
  - フッター
    - © 2025 AuthMini
- `/` ページ
  - ページタイトル
  - 説明テキスト
  - 「ログインへ」ボタン
- `/login` ページ
  - ページタイトル
  - フォーム
    - Email 入力
    - Password 入力
    - 「ログイン」ボタン
    - 「サインアップ」ボタン
- `/dashboard` ページ
  - ページタイトル
  - 認証済みユーザー情報
    - Email 表示
    - 「ログアウト」ボタン
