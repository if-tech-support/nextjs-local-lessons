# 対象者
- Reactを理解している
- Next.jsの基本を理解している
- ORM未経験または初学者で、Prismaを用いた最小CRUDとマイグレーションを体験したい

# 目的
1. ORMとPrismaの役割を理解する（スキーマ＝単一のソース・オブ・トゥルース、型安全なクエリ、コード生成）
2. Prisma Schemaを作成し、`prisma migrate dev`でマイグレーションを生成・適用できる
3. 開発時のPrismaクライアント多重生成を防ぐシングルトンを理解する
4. Supabase + Prismaでデータベースを操作する最小CRUDアプリケーションを作成できる

# 主要なスキル
- Prisma Schemaの設計（model・enum・@id・@default・@updatedAt）
- `npx prisma migrate dev` によるマイグレーション運用（開発）
- Prisma Clientのシングルトン化（globalThisを用いた多重生成防止）
- Server Actionsでの`redirect`と`revalidatePath`を使ったポストミューテーション更新

# 題材とするアプリケーション
- ブックマーク管理（Links）最小CRUD
  - ページ
    - `/links` 一覧 + 作成 + 削除
    - `/links/[id]` 詳細 + 更新
  - データモデル
    - Link
      - id Int 自動採番
      - title String 必須
      - url String 必須
      - createdAt DateTime 既定 now()
      - updatedAt DateTime @updatedAt
  - レイアウト（表示パーツ）
    - 共通ヘッダー：アプリタイトル（クリックで /links）
    - `/links`：ページタイトル、新規作成フォーム（title, url）、一覧（title, url, 詳細リンク、削除ボタン）
    - `/links/[id]`：ページタイトル、編集フォーム（title, url）、更新ボタン