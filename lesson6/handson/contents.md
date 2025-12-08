## はじめに
レシピカタログを題材に、Next.jsの4つのレンダリング方式（CSR/SSR/SSG/ISR）を最小実装で比較し、プリレンダリングとキャッシュの挙動を理解する。
完成形は、同じドメイン内で異なるレンダリング戦略を持つ4つのページ（`/recipes-csr`など）を行き来し、データ取得のタイミングやキャッシュの有効期限を確認できるアプリケーションとなる。
- Next.js (App Router)
- CSR / SSR / SSG / ISR
- キャッシュ制御 (`dynamic`, `revalidate`, `revalidatePath`)
- `generateStaticParams` による動的ルート生成

## 対象者
- Reactを理解している
- Next.jsの基本 (App Router) を理解している
- データ取得とルーティングの初歩を実装できる

## 目的
1. 4つのレンダリング方式を最小実装で比較して理解する
2. プリレンダリングとキャッシュの関係を理解する
3. キャッシュ制御の要点を理解する

## 学習対象のスキル
- CSR
- SSR
- SSG
- ISR
- `export const dynamic`
- `export const revalidate`
- `generateStaticParams`
- `revalidatePath`

## 前提（推奨）
- Node.js (LTS)
- npm/yarn/pnpm/bun

主要ページ/ルート:
- `/recipes-csr`: クライアント取得 (CSR)
- `/recipes-ssr`: リクエスト毎にサーバー取得 (SSR)
- `/recipes-ssg`: ビルド時生成 (SSG)
- `/recipes-isr`: 一覧を60秒で再検証 (ISR)
- `/recipes-isr/[id]`: 一部IDを静的生成し、その他はアクセス時に生成 (ISR + `generateStaticParams`)

---

## 章立て（目次）
1. `01-環境構築.md`
   - プロジェクトのセットアップと初期設定
2. `02-APIルートの作成.md`
   - 検証用データソースとなるAPIエンドポイントの実装
3. `03-共通レイアウトの作成.md`
   - ヘッダーやナビゲーションを含む共通レイアウトの実装
4. `04-CSRページの実装.md`
   - `/recipes-csr`でのクライアントサイドデータ取得
5. `05-SSRページの実装.md`
   - `/recipes-ssr`でのサーバーサイドレンダリング
6. `06-SSGページの実装.md`
   - `/recipes-ssg`での静的サイト生成
7. `07-ISRページの実装（一覧）.md`
   - `/recipes-isr`でのインクリメンタル静的再生成
8. `08-ISRページの実装（詳細）.md`
   - `/recipes-isr/[id]`での動的ルートと`generateStaticParams`
9. `09-まとめ.md`
   - 4つのレンダリング方式の挙動比較と総括

---

## 進め方と検証方針
1. 各レンダリング方式ごとにページを作成し、ビルド出力やネットワークタブで挙動を確認する
2. `next build` と `next start` を使用して、本番環境相当での動作（SSG/ISR）を検証する
3. データの更新や再検証（Revalidation）のタイミングを確認する

## 注意
- 開発サーバー（`next dev`）ではSSG/ISRの挙動がSSRと区別しにくい場合があるため、必ずビルドして確認する
- VercelのサンプルAPIを使用するため、外部APIのレート制限等に留意する
