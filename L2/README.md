# ユーザ管理ミニアプリ - Next.js教材

このプロジェクトは、Next.jsの主要な機能を学ぶための教材用アプリケーションです。

## 学習目標

1. **fetch API** - 外部APIからデータを取得する方法
2. **Dynamic Routes** - 動的ルーティングを使った詳細ページの作成
3. **next/navigation** - useRouterを使ったプログラム的遷移
4. **next/image** - 外部画像の最適化表示

## 主要なスキル

- `fetch` API
- Dynamic Routes (`[id]`)
- `next/navigation`（`useRouter`）
- `next/link`
- `next/image`

## アプリケーション構成

### ページ構成
- `/users` (ユーザ一覧ページ)
  - `https://jsonplaceholder.typicode.com/users` から全10件を取得して表示
- `/users/[id]` (ユーザ詳細ページ)
  - 動的セグメント `[id]` を利用して1件取得して表示

### レイアウト
- **共通**
  - ヘッダー: アプリケーションタイトル（クリックで `/users` へ）
  - フッター: © 2025 YourApp

- **`/users` ページ**
  - ページタイトル（ユーザ一覧）
  - ユーザリスト（ul）
    - 各ユーザ項目（li）
      - アバター画像（next/image, 128x128, `https://robohash.org/{id}`）
      - id
      - username
      - company.name
      - 詳細ページへのリンク（`/users/{id}`）

- **`/users/[id]` ページ**
  - ページタイトル（ユーザ詳細）
  - ユーザ詳細カード
    - アバター画像（next/image, 128x128）
    - username
    - email
    - company.name
    - website
  - 戻るボタン（useRouter().back()）

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ESLint**

## 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動したら、[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## 教材のポイント

### 1. fetch API
- サーバーコンポーネントでのデータ取得
- エラーハンドリング
- キャッシュ設定

### 2. Dynamic Routes
- `[id]` フォルダ構造
- `params` プロパティの活用
- 存在しないユーザの処理（notFound()）

### 3. next/navigation
- `useRouter` フックの使用
- `router.back()` での戻る機能
- クライアントコンポーネントでの使用

### 4. next/image
- 外部画像の最適化
- `remotePatterns` の設定
- レスポンシブ画像の実装

## ファイル構成

```
src/
├── app/
│   ├── layout.tsx          # 共通レイアウト
│   ├── page.tsx            # ルートページ（リダイレクト）
│   └── users/
│       ├── page.tsx        # ユーザ一覧ページ
│       └── [id]/
│           ├── page.tsx    # ユーザ詳細ページ
│           └── BackButton.tsx # 戻るボタンコンポーネント
└── types/
    └── user.ts             # ユーザ型定義
```
