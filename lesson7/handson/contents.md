## はじめに
ORMとPrismaの役割を理解し、Supabase上のPostgreSQLに対して最小限のCRUD操作を行うアプリケーションを作成します。完成形は、ブックマーク（タイトルとURL）を一覧表示・作成・編集・削除できる管理アプリです。

技術スタック:
- Next.js (App Router)
- Prisma (ORM)
- Supabase (PostgreSQL)
- Server Actions

## 対象者
- Reactを理解している
- Next.jsの基本を理解している
- ORM未経験または初学者で、Prismaを用いた最小CRUDとマイグレーションを体験したい

## 目的
1. ORMとPrismaの役割（スキーマ駆動、型安全）を理解する
2. Prisma Schemaを作成し、マイグレーションを生成・適用する
3. Prisma Clientのシングルトンパターンを実装する
4. Supabase + PrismaでDB操作を行うCRUDアプリを構築する

## 学習対象のスキル
- Prisma Schemaの設計（model, @id, @default, @updatedAt）
- マイグレーション運用（`prisma migrate dev`）
- Prisma Clientのシングルトン化
- Server Actionsでのデータ操作（create, update, delete）
- `revalidatePath`によるキャッシュ更新

## 前提（推奨）
- Node.js v18以上
- Docker Desktop（Supabaseローカル環境用）
- Supabase CLI

データベースのセットアップ:
- 本レッスンではSupabase CLIを使用してローカルにPostgreSQLデータベースを立ち上げます。
- `npx supabase init` および `npx supabase start` でローカル環境を構築します。
- `.env`ファイルにローカルDBの`DATABASE_URL`を設定します。

参考ドキュメント:
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Prisma with Supabase](https://supabase.com/docs/guides/database/prisma)

主要ページ/ルート:
- `/links`: 一覧表示、新規作成フォーム
- `/links/[id]`: 詳細編集フォーム

環境変数:
- `DATABASE_URL`

---

## 章立て（目次）
1. `01-環境構築.md`
   - Supabaseローカル環境の起動とPrismaのインストール・初期設定
2. `02-スキーマ定義とマイグレーション.md`
   - `schema.prisma`でのモデル定義とDBへの反映
3. `03-PrismaClientの準備.md`
   - 開発環境での多重インスタンス化を防ぐクライアント実装
4. `04-一覧ページのUI実装.md`
   - `/links`のレイアウトと新規作成フォームのマークアップ
5. `05-一覧表示と新規作成機能.md`
   - Prismaでのデータ取得とServer Actionsによる保存処理
6. `06-詳細ページのUI実装.md`
   - `/links/[id]`の編集フォームのマークアップ
7. `07-詳細編集と更新機能.md`
   - 特定データの取得表示とServer Actionsによる更新処理
8. `08-削除機能の実装.md`
   - 一覧ページへの削除ボタン追加とServer Actions連携
9. `09-まとめ.md`
   - Prismaワークフローの総括と次のステップ

---

## 進め方と検証方針
- 各章の指示に従い、コードを実装してください。
- `npm run dev` で開発サーバーを起動し、ブラウザで動作を確認します。
- データベースの変更は `npx prisma migrate dev` で適用します。
- Prisma Studio (`npx prisma studio`) を使用してデータを直接確認することも可能です。

## 注意
- 開発時はDocker Desktopを起動しておく必要があります。
- データベース接続文字列（`DATABASE_URL`）は秘密情報を含むため、GitHub等にコミットしないでください。
- マイグレーションファイルはバージョン管理に含めます。
- 本番環境へのデプロイ時は、接続プーリングの設定が必要になる場合があります。
