# @prisma/adapter-pg

## 概要
`@prisma/adapter-pg` は、Prisma ClientがPostgreSQLデータベースと通信する方法を変更するための「アダプター（変換器）」です。

通常、Prisma Clientは自分自身の中にデータベースと通信する機能を持っています。しかし、このアダプターを使うと、JavaScriptの世界で昔から広く使われている `pg`（node-postgres）というツールを経由して、データベースとやり取りをするようになります。

例えるなら、海外旅行に行くときに、自分が現地の言葉を話すのではなく、現地に詳しい通訳さん（`pg`）を雇ってから通訳さん経由で会話をするようなイメージです。`@prisma/adapter-pg` は、Prismaとその通訳さんをつなぐ役割を果たします。

## 特徴

### 1. 特殊な環境でも動くようになる
これが最大の特徴です。通常のPrisma Clientは、裏側で少し重たい仕組み（Rust製のエンジン）を使っているため、Cloudflare WorkersやVercel Edge Functionsといった「Edge（エッジ）」と呼ばれる軽量なサーバー環境では動かないことがありました。
`@prisma/adapter-pg` を使うと、JavaScriptベースの `pg` を使うことになるため、これらの軽量な環境でもPrismaを動かせるようになります。

### 2. 既存の仕組みを再利用できる
もしプロジェクトですでに `pg` を使ってデータベース接続の設定をしている場合、その設定や接続（コネクションプール）をPrismaでもそのまま使うことができます。

## 使い方

`@prisma/adapter-pg` を使うには、パッケージのインストールと、`PrismaClient` を作るときのコードを少し変更する必要があります。

### 1. インストール
まず、必要なパッケージをインストールします。

```bash
npm install @prisma/adapter-pg pg
```

### 2. PrismaClientの初期化
次に、`PrismaClient` を作るときにアダプターを設定します。

```typescript
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. pg の接続プール（Pool）を作成します
// connectionString にはデータベースの URL を設定します
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });

// 2. Prisma のアダプターを作成し、pg のプールを渡します
const adapter = new PrismaPg(pool);

// 3. アダプターを使って PrismaClient を作成します
const prisma = new PrismaClient({ adapter });
```

このように設定することで、Prismaは `pg` を経由してデータベースにアクセスするようになります。あとはこれまで通り `prisma.link.findMany()` のように使うだけです。

## 公式ドキュメント
- [Prisma Adapter for PostgreSQL(公式ドキュメント)](https://www.prisma.io/docs/orm/overview/databases/postgresql#driver-adapters)
