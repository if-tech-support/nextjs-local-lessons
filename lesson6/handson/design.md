あなたはプロのプログラミングスクールの教材作成のエキスパートです。これから以下の要件を満たす教材用のアプリケーションの作成をお願いします

lesson6ディレクトリ配下に作成してください
以下は既習として考えてください
・lesson1
・lesson2
・lesson3
・lesson4
・lesson5
スタイルはTailwind CSSで実装してください
デザインはポップでモダンで極力簡単で簡潔な記載で実装できるものにして、1つのclassName属性の値は5つ以下にしてください
必要な質問などが他にあれば適宜お願いします

# 対象者
- Reactを理解している
- Next.jsの基本 (App Router) を理解している
- データ取得とルーティングの初歩を実装できる

# 目的
1. 4つのレンダリング方式を最小実装で比較して理解する
   - CSR / SSR / SSG / ISR
2. プリレンダリングとキャッシュの関係を理解する
   - ルート結果は既定でサーバー側キャッシュされる点
   - fetchは既定でデータキャッシュされない一方、HTMLはプリレンダリングされ得る点
3. キャッシュ制御の要点を理解する
   - `dynamic` / `revalidate` / `revalidatePath`
   - `generateStaticParams` による動的ページの静的生成

# 主要なスキル
- CSR
- SSR
- SSG
- ISR
- `export const dynamic`
- `export const revalidate`
- `generateStaticParams`
- `revalidatePath`

# 題材とするアプリケーション
- レシピカタログ（同じドメインのUIを4パターンで実装して挙動比較）
  - データソースはVercelのサンプルAPI `https://api.vercel.app/blog` を使用
  - ページ構成
    - `/recipes-csr` クライアント取得 (CSR)
    - `/recipes-ssr` リクエスト毎にサーバー取得 (SSR)
    - `/recipes-ssg` ビルド時生成 (SSG)
    - `/recipes-isr` 一覧を60秒で再検証 (ISR)
    - `/recipes-isr/[id]` 一部IDを静的生成し、その他はアクセス時に生成 (ISR + `generateStaticParams`)
- レイアウト
  - 共通ヘッダー
    - アプリタイトル (クリックで `/recipes-ssg`)
    - ナビゲーションリンク
      - CSR / SSR / SSG / ISRへのリンク
  - 共通フッター
    - © 2025 RecipeModes
  - 各ページ共通の表示パーツ
    - ページタイトル
    - データ取得方式の説明テキスト（方式・キャッシュ戦略を短文で表示）
    - レシピ一覧
      - タイトル
      - 著者名
      - 投稿日
      - 詳細ページへのリンク（ISRルートのみ）

---

## 使い方と学習ポイント

1) 開発サーバを起動し、各ページを開く

- /recipes-ssg: ビルド時生成。HTMLは固定。再読込でも変わらない。
- /recipes-ssr: 毎回サーバ実行。`dynamic: "force-dynamic"` と `cache: "no-store"` を確認。
- /recipes-csr: 初回は空表示→マウント後にfetch。HTMLは空に近いがクライアントで埋まる。
- /recipes-isr: 一覧は `revalidate = 60`。60秒以内は同じHTML/データが返る。
- /recipes-isr/1など: `generateStaticParams`で1,2,3は事前生成。それ以外は初回アクセスで生成＋以降キャッシュ。

2) 比較の観点（最低限）

- いつサーバで実行されるか（ビルド時 / リクエスト時 / アクセス時）
- データ取得のキャッシュ戦略（force-cache / no-store / revalidate）
- HTMLとデータのキャッシュが別物である点（プリレンダーHTML vs fetchキャッシュ）

3) 変更して挙動を見る例

- `src/app/recipes-ssr/page.tsx` の `cache: "no-store"` をコメントアウトするとサーバーキャッシュが効くことを確認。
- `src/app/recipes-isr/page.tsx`の`revalidate`を5に下げ、短い間隔で更新されることを確認。
- `src/app/recipes-isr/[id]/page.tsx`の`generateStaticParams`にIDを追加/削除して、ビルド後の初回アクセス時の生成の有無を比較。

4) 用語の最小要約

- CSR: HTMLは薄い。クライアントでデータ取得して描画。
- SSR: リクエスト毎にサーバでレンダリング。`dynamic: "force-dynamic"`。
- SSG: ビルド時にHTMLを生成。`dynamic: "force-static"`（既定）。
- ISR: 生成済みHTMLを一定間隔で再検証。`export const revalidate = 秒`。

5) タイムスタンプの見方（デモ表示）

- Rendered at: ページがレンダリングされた時刻
  - SSG: ビルド時刻と一致
  - SSR: 毎回変わる（都度サーバー実行）
  - ISR: 再検証の瞬間に更新（60秒周期or手動）
  - CSR: クライアントのマウント時刻
- Fetched at（CSRのみ）: データ取得が完了した時刻

6) 手動再検証の使い方（ISR）

- `/recipes-isr/refresh` を開いて「再検証する」ボタンを押す
- 直後に`/recipes-isr`のRendered atが更新される（`revalidatePath("/recipes-isr")`）