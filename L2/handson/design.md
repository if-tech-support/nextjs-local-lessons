# 対象者
- Reactを理解している
- Next.jsの基本とApp Routerのページ作成方法を理解している

# 目的
1. Next.jsで外部APIからデータを取得する方法を学ぶ
2. Dynamic Routesを使った詳細ページの作成方法を学ぶ
3. next/navigationのuseRouterでプログラム的遷移を体験する
4. next/imageで外部画像を最適化して表示する
5. 学習内容を最終章で体系的にふりかえり自己評価する

# 主要なスキル
- fetch API
- Dynamic Routes
- next/navigation（useRouter）
- next/link
- next/image
- 画像最適化戦略（サイズ/remotePatternsの最小許可）

# 題材とするアプリケーション
- ユーザ管理ミニアプリ（一覧+詳細ページ）
  - `/users`（ユーザ一覧ページ）
    - `https://jsonplaceholder.typicode.com/users`から全10件を取得して表示
  - `/users/[id]`（ユーザ詳細ページ）
    - 動的セグメント`[id]`を利用して1件取得して表示
  - （トップページは一覧へ導線を持つ最小構成）

# レイアウト
- 共通
  - ヘッダー
  - アプリケーションタイトル（クリックで`/users`へ）
  - フッター
    - © 2025 YourApp
- `/users`ページ
  - ページタイトル（ユーザ一覧）
  - ユーザリスト（ul）
    - 各ユーザ項目（li）
      - アバター画像（next/image, 64x64, `https://robohash.org/{id}`）
      - id
      - username
      - company.name
      - 詳細ページへのリンク（`/users/{id}`）
- `/users/[id]`ページ
  - ページタイトル（ユーザ詳細）
  - ユーザ詳細カード
    - アバター画像（next/image, 128x128）
    - username
    - email
    - company.name
    - website
  - 戻るボタン（useRouter().back()）

## 章構成タイプ
- 01: Type B（環境構築: 課題見出しなし）
- 02〜05: Type A（課題+仕様/ヒント/解答例）
- 06: Type C（最終まとめ: 実装なし・ふりかえり）

以上を踏まえて、以下の手順でハンズオンMarkdownを出力してください。
1. 本design.mdを読み込んで理解する。
2. contents.mdにハンズオンの概要説明と章立て目次を記載する。
3. 各章を作成し完了ごとに通読と動作検証を行う。
4. 05完了後に06で学習内容を整理しセルフチェックを追加する。
