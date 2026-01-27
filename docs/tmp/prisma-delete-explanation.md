# Prismaのdeleteについて

## 概要
`delete`は、データベースに保存されているデータを削除するための機能です。
これまでに学習した`create`がデータの作成、`update`がデータの更新を行うのに対し、`delete`は不要になったデータを完全に取り除く役割を持ちます。

## 特徴
`delete`には主に以下のような特徴があります。

- **特定のデータを1つ削除する**: 条件を指定して、その条件に一致するデータを1つだけ削除します。
- **削除したデータを確認できる**: 削除を実行した後、その削除されたデータの内容を結果として受け取ることができます。
- **一意な条件が必要**: どのデータを削除するかを正確に特定するため、`id`などの重複しない値（ユニークな値）を条件に指定する必要があります。

## 使い方
`delete`を使用する際は、`prisma.モデル名.delete()`という形式で記述します。
引数には`where`を指定し、その中に削除したいデータを特定するための条件（主に`id`）を書きます。

以下は、`User`モデルから`id`が`1`のユーザーを削除する例です。

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // idが1のユーザーを削除する
  const deletedUser = await prisma.user.delete({
    where: {
      id: 1,
    },
  });

  console.log('削除されたユーザー:', deletedUser);
}

main();
```

このコードを実行すると、データベースから`id`が`1`のユーザーが削除され、そのユーザーの情報が`deletedUser`という変数に格納されます。

## 公式ドキュメント
より詳しい情報は、以下の公式ドキュメントを参照してください。

- [Prisma Client Reference - delete (English)](https://www.prisma.io/docs/orm/reference/prisma-client-reference#delete)
