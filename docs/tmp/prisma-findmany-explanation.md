# findMany について

## 概要
`findMany` は、データベースに保存されているデータを「まとめて取得する」ための機能です。

前回学習した `create` はデータを「新しく作る」機能でしたが、`findMany` はすでに保存されているデータを「探して持ってくる」機能になります。
たとえば、Todoリストアプリで「登録したタスクを一覧で画面に表示したい」という場合や、SNSで「投稿された記事をタイムラインに表示したい」という場合に使います。

## 特徴
`findMany` には、ただデータを全部持ってくるだけでなく、便利な特徴がいくつかあります。

1. **条件を指定して絞り込める**
「完了していないタスクだけ欲しい」「特定のユーザーのデータだけ欲しい」といったように、条件を指定して必要なデータだけを取得できます。

2. **並び替えができる**
「作成された日時が新しい順」や「名前順」など、好きな順番に並び替えてデータを取得できます。

3. **取得する件数を制限できる**
「最新の5件だけ表示したい」というように、取得するデータの数を制限できます。

## 使い方
`prisma.モデル名.findMany()` という形で使います。
カッコの中に、どのような条件でデータを取得したいかを指定します。

### 基本的な書き方（全件取得）
条件を何も指定しない場合、そのモデル（テーブル）にあるデータをすべて取得します。

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // すべてのユーザーを取得する
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main();
```

### 条件を指定して取得する
たとえば、「メールアドレスが特定のものと一致するユーザー」を探したい場合は、`where` というキーワードを使います。

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // メールアドレスが "alice@example.com" のユーザーを探す
  // 条件に合うデータが複数あれば、すべて取得されます
  const users = await prisma.user.findMany({
    where: {
      email: 'alice@example.com',
    },
  });
  console.log(users);
}

main();
```

## 公式ドキュメント
- [Prisma Client API Reference: findMany (English)](https://www.prisma.io/docs/orm/reference/prisma-client-reference#findmany)
