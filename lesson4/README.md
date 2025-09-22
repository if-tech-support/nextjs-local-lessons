# Lesson 4: 認証機能付きダッシュボード

Supabase CLIを使用したローカル開発環境でSupabase Authenticationを学習する会員限定ダッシュボードアプリケーションです。

## 学習目標

1. 認証 (Authentication) と認可 (Authorization) の違いを理解する
2. Supabase CLIを使用したローカル開発環境の構築
3. Supabase Authentication を用いてメール+パスワードのサインアップ/ログイン/ログアウトを実装する
4. Next.js の middleware でセッションを更新しつつ、未認証ユーザーをログインページへリダイレクトする方法を学ぶ

## 主要なスキル

- Supabase CLIの使用
- ローカル開発環境の構築
- Supabase Authentication (email/password)
- @supabase/ssr と cookies を用いた SSR 連携
- middleware によるセッション更新と楽観的チェック
- サーバーコンポーネントでの `redirect` と厳密ガード (`supabase.auth.getUser`)
- `cookies` (非同期 API) の取り扱い
- `NextResponse.redirect`

## アプリケーション構成

### ページ構成
- `/` - パブリック: アプリ説明と「ログインへ」リンク
- `/login` - ログインページ: メール/パスワードでログイン (Server Actions)
- `/signup` - サインアップページ: メール/パスワードで新規登録 (Server Actions)
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

2. Supabase CLIのインストール
```bash
npm install -g supabase
```

3. Supabaseローカル環境の初期化
```bash
npx supabase init
```

4. Supabaseローカル環境の起動
```bash
npx supabase start
```

5. Supabaseローカル環境の停止（開発終了時）
```bash
npx supabase stop
```

6. 環境変数の設定
`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

`your_anon_key_here` の部分を、`npx supabase start` で表示された実際のキーに置き換えてください。

6. 開発サーバーの起動
```bash
npm run dev
```

## 利用可能なコマンド

- `npm run dev` - 開発サーバーの起動
- `npm run supabase:start` - Supabaseローカル環境の起動
- `npm run supabase:stop` - Supabaseローカル環境の停止
- `npm run supabase:status` - Supabaseローカル環境の状態確認

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
│   ├── signup/
│   │   └── page.tsx            # サインアップページ
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # トップページ
├── config/
│   └── error-messages.json     # エラーメッセージ翻訳設定
├── lib/
│   ├── actions.ts              # Server Actions
│   ├── error-messages.ts       # エラーメッセージ管理ユーティリティ
│   └── supabase/
│       ├── client.ts           # クライアント用Supabase設定
│       ├── server.ts           # サーバー用Supabase設定
│       └── middleware.ts       # middleware用Supabase設定
└── types/
    └── auth.ts                 # 認証関連の型定義
```

## エラーメッセージ設定

このアプリケーションでは、設定ファイルベースのエラーメッセージ管理システムを使用しています。

### ファイル構成

- `src/config/error-messages.json` - エラーメッセージの翻訳設定

### 設定方法

#### 新しいエラーメッセージを追加

`error-messages.json`ファイルを編集して、新しいエラーメッセージを追加できます：

```json
{
  "error_messages": {
    "新しいエラーメッセージ": "翻訳されたメッセージ"
  }
}
```

#### 既存のメッセージを変更

既存のキーの値を変更することで、翻訳メッセージを更新できます。

#### メッセージの削除

不要になったメッセージは、JSONファイルからキーと値を削除してください。

### 動作仕様

- 完全一致でエラーメッセージを検索します
- 完全一致しない場合は、部分一致で検索します
- 翻訳が見つからない場合は、元のメッセージをそのまま返します
- 設定ファイルはキャッシュされ、ファイルが変更された場合のみ再読み込みされます

### 注意事項

- JSONファイルの構文エラーがある場合、デフォルトのメッセージが使用されます
- 設定ファイルの変更は、アプリケーションの再起動なしで反映されます
- キー名は英語のエラーメッセージと完全に一致させる必要があります

## ハンズオン資料

詳細なハンズオン資料は `handson/` ディレクトリを参照してください。
