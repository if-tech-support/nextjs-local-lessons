# 対象者
- Reactを理解している
- Next.jsの基本とAppRouterのページ作成方法を理解している

# 目的
1. Next.jsで外部APIからデータを取得する方法を学ぶ
2. Dynamic Routesを使った詳細ページの作成方法を学ぶ
3. next/navigationのuseRouterでプログラム的遷移を体験する
4. next/imageで外部画像を最適化して表示する

# 主要なスキル
- fetch API
- Dynamic Routes
- next/navigation（useRouter）
- next/link
- next/image

# 題材とするアプリケーション
- ユーザ管理ミニアプリ（2 ページ構成）
  - `/users` (ユーザ一覧ページ)
    - `https://jsonplaceholder.typicode.com/users` から全 10 件を取得して表示
  - `/users/[id]` (ユーザ詳細ページ)
    - 動的セグメント `[id]` を利用して 1 件取得して表示

# レイアウト
- 共通
  - ヘッダー
    - アプリケーションタイトル (クリックで `/users` へ)
  - フッター
    - © 2025 YourApp
- `/users` ページ
  - ページタイトル (ユーザ一覧)
  - ユーザリスト (ul)
    - 各ユーザ項目 (li)
      - アバター画像 (next/image, 128x128, `https://robohash.org/{id}`)
      - id
      - username
      - company.name
      - 詳細ページへのリンク (`/users/{id}`)
- `/users/[id]` ページ
  - ページタイトル (ユーザ詳細)
  - ユーザ詳細カード
    - アバター画像 (next/image, 128x128)
    - username
    - email
    - company.name
    - website
  - 戻るボタン (useRouter().back())

以上を踏まえて、以下の手順でハンズオンMarkdownを出力してください。
①ハンズオンの設計書であるdesign.mdを読み込んで理解する
①contents.mdにハンズオンの概要説明と章立てした目次を記載する
②1章ずつ作成を行い、1章作成後にそれまでの章内容を実際に読み進めて想定通りのアプリケーションを作成できるかを検証する
