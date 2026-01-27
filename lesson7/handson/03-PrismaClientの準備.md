## はじめに
アプリケーション全体でデータベース操作を行うためのPrisma Clientインスタンスを作成します。今回はPostgreSQLドライバーアダプターを使用した構成にします。

## 目的
- Prisma Clientをインスタンス化する
- PostgreSQLドライバーアダプターを設定する
- アプリケーション内で再利用可能な `prisma` オブジェクトをエクスポートする

## 学習対象のスキル
- `PrismaClient`
- `@prisma/adapter-pg`

## 課題A：Prisma Clientをインスタンス化する（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/lib/prisma.ts` を作成し、Prisma Clientのインスタンス化とエクスポートを行います。

- ファイルを作成する: `src/lib/prisma.ts`
- 以下の内容を記述する
```ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

【命名】
- 変数: `connectionString`, `adapter`, `prisma`

【参照】
- インポート: `PrismaPg`, `PrismaClient`

【使用タグ】
- （該当なし）

### ヒント

- `PrismaClient` のインポートパスは、`schema.prisma` で設定した `output` に合わせます（`../generated/prisma/client`）。
- `dotenv/config` をインポートすることで、`.env` ファイルの環境変数が読み込まれます。
- 参考: [Prisma Postgres Quickstart](https://www.prisma.io/docs/getting-started/prisma-postgres/quickstart/prisma-orm#7-instantiate-prisma-client)

### 解答例

```ts
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
```

## 章末の確認

- `src/lib/prisma.ts` ファイルが作成されていることを確認します。
- `prisma` インスタンスが名前付きエクスポートされていることを確認します。
- エディター上で型エラーやインポートエラーが表示されていないことを確認します。
