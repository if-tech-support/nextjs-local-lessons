# Lesson 4: 認証機能付きダッシュボード

Supabase Authenticationを使用した会員限定ダッシュボードアプリケーションです。

## 学習目標

1. 認証 (Authentication) と認可 (Authorization) の違いを理解する
2. Supabase Authentication を用いてメール+パスワードのサインアップ/ログイン/ログアウトを実装する
3. Next.js の middleware でセッションを更新しつつ、未認証ユーザーをログインページへリダイレクトする方法を学ぶ

## 主要なスキル

- Supabase Authentication (email/password)
- @supabase/ssr と cookies を用いた SSR 連携
- middleware によるセッション更新と楽観的チェック
- サーバーコンポーネントでの `redirect` と厳密ガード (`supabase.auth.getUser`)
- `cookies` (非同期 API) の取り扱い
- `NextResponse.redirect`

## アプリケーション構成

### ページ構成
- `/` - パブリック: アプリ説明と「ログインへ」リンク
- `/login` - 認証: メール/パスワードでログイン・サインアップ (Server Actions)
- `/dashboard` - 保護ページ: ログイン中ユーザーの email を表示。未認証は `/login?next=/dashboard` へリダイレクト

### 技術スタック
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Authentication
- @supabase/ssr

## セットアップ

1. 依存関係のインストール
```bash
npm install
```

2. 環境変数の設定
`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Supabaseプロジェクトの設定
- Supabaseプロジェクトを作成
- Authentication設定でEmail認証を有効化
- プロジェクトURLとanon keyを環境変数に設定

4. 開発サーバーの起動
```bash
npm run dev
```

## ファイル構成

```
src/
├── app/
│   ├── components/
│   │   ├── Header.tsx          # ヘッダーコンポーネント
│   │   └── Footer.tsx          # フッターコンポーネント
│   ├── dashboard/
│   │   └── page.tsx            # ダッシュボードページ
│   ├── login/
│   │   └── page.tsx            # ログインページ
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # トップページ
├── lib/
│   ├── actions.ts              # Server Actions
│   └── supabase/
│       ├── client.ts           # クライアント用Supabase設定
│       ├── server.ts           # サーバー用Supabase設定
│       └── middleware.ts       # middleware用Supabase設定
└── types/
    └── auth.ts                 # 認証関連の型定義
```

## ハンズオン資料

詳細なハンズオン資料は `handson/` ディレクトリを参照してください。
