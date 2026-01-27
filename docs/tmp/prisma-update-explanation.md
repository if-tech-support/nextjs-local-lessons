# Prismaのupdateについて

## 概要
`update` は、データベースにすでに保存されているデータを「書き換える」ための機能です。
これまでに学習した `create` は新しいデータを作る機能でしたが、`update` は既存のデータの内容を修正したい場合に使用します。
たとえば、ユーザーが自分のニックネームを変更したり、記事のタイトルを修正したりする場面で活躍します。

## 特徴
`update` には主に以下の特徴があります。

- **特定のデータを1つ狙って更新する**
  これまでに学習した `findUnique` のように、IDなどの一意な（他と被らない）情報を使って、更新したいデータを1つだけ特定します。

- **変更したい部分だけを指定できる**
  すべての情報を書き直す必要はありません。変更したい項目だけを指定すれば、それ以外の情報はそのまま残ります。

- **データが存在しない場合はエラーになる**
  指定した条件に合うデータが見つからない場合、処理は失敗（エラー）となります。確実に存在するデータを更新する必要があります。

## 使い方
`prisma.モデル名.update()` という書き方で使用します。
引数には、主に `where` と `data` という2つの情報を渡します。

- `where`: どのデータを更新するかを指定します。（`findUnique` と同じ使い方です）
- `data`: どのように書き換えるかを指定します。（`create` と同じような書き方です）

以下のコードは、`id` が `1` のユーザーの `name`（名前）を `"新しい名前"` に変更する例です。

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updatedUser = await prisma.user.update({
    where: {
      id: 1, // 更新したいユーザーのIDを指定
    },
    data: {
      name: "新しい名前", // 変更したい内容を指定
    },
  });

  console.log(updatedUser);
}

main();
```

この例では、`id` が `1` のユーザーを探し出し、その `name` だけを書き換えています。もし `email` などの他の項目があっても、それらは変更されません。

## 公式ドキュメント
より詳しい情報は、以下の公式ドキュメント（英語）を参照してください。

- [Prisma Client Reference - update](https://www.prisma.io/docs/orm/reference/prisma-client-reference#update)
