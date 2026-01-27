# findUnique について

## 概要
`findUnique` は、データベースの中から「たった1つの特定のデータ」をピンポイントで探し出すための機能です。

例えるなら、学校の出席番号や、社員ID、マイナンバーのように、「この番号なら絶対にこの人しかいない」という情報を使って特定の一人を指名して呼び出すようなものです。
たくさんのデータの中から、迷うことなく「これ！」という1つを見つけたい時に使います。

## 特徴

### 1. 必ず1件だけ（または0件）
条件に合うデータが見つかれば、その「1件」だけを返します。もし見つからなければ `null`（何もない）を返します。
`findMany` のように複数のデータがリストになって返ってくることは絶対にありません。

### 2. 「ユニーク」な条件が必要
探すための手がかりとして使えるのは、他と絶対に被らない項目だけです。
具体的には、`schema.prisma` で `@id`（ID）や `@unique`（重複禁止）と設定された項目を使います。
たとえば、「名前」は同姓同名の人がいるかもしれないので、`findUnique` の条件としては使えません（名前を `@unique` に設定していない場合）。

## 使い方
`prisma.モデル名.findUnique()` という形で使います。
`where` というキーワードを使って、「どのIDのデータを探すか」を指定します。

### コード例
たとえば、IDが `1` のユーザーを探す場合は以下のように書きます。

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // IDが 1 のユーザーを特定して取得する
  const user = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });

  console.log(user);
}

main();
```

### 解説
- `where`:「どこ（where）」を探すかという条件を指定する場所です。
- `id: 1`: ここには、`schema.prisma` で一意（ユニーク）であると保証されている項目を指定します。

## 公式ドキュメント
- [Prisma Client API Reference: findUnique (英語)](https://www.prisma.io/docs/orm/reference/prisma-client-reference#findunique)
