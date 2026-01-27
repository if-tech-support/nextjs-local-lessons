# Prisma Clientのcreateメソッド

## 概要
`create` メソッドは、データベースに新しいデータを「追加」するための機能です。

イメージとしては、Excelの表に新しい行を追加してデータを書き込んだり、スマートフォンの連絡先アプリで「新規作成」ボタンを押して新しい人の情報を登録したりする操作と同じです。Prisma Clientを使うことで、この操作をプログラムから簡単に行うことができます。

## 特徴

### 1. 直感的な書き方
JavaScriptのオブジェクト（データのまとまり）を作るのと同じような感覚で、データベースへの保存ができます。「INSERT INTO...」のような難しいSQL言語を覚える必要はありません。

### 2. 入力ミスを防ぐ（型安全）
`schema.prisma` で定義した設計図に基づいているため、間違ったデータを入れようとするとエラーで教えてくれます。たとえば、「数字を入れるべき場所に文字を入れてしまった」といったミスを、プログラムを実行する前に防ぐことができます。

### 3. 必要な項目だけでOK
ID（通し番号）や作成日時（`createdAt`）など、自動的に決まるように設定した項目は、入力を省略できます。人間が入力する必要があるデータ（たとえばタイトルやURLなど）だけを指定すれば、あとはPrismaがよしなに処理してくれます。

## 使い方

基本の形は `prisma.モデル名.create()` です。
この中に `data` という名前の箱を用意し、その中に保存したいデータを入れます。

たとえば、`Link` というモデル（テーブル）に、新しいブックマークを追加する場合は以下のように書きます。

```typescript
// 1. Prisma Clientを準備します（前提知識）
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 2. createメソッドを使ってデータを追加します
  const newLink = await prisma.link.create({
    data: {
      title: 'Google',           // タイトルを指定
      url: 'https://google.com', // URLを指定
    },
  });

  // 追加されたデータを確認します
  console.log(newLink);
}

main();
```

### 解説
- `prisma.link.create`:「Prismaさん、Linkモデルに、新規作成（create）をお願いします」という命令です。
- `data: { ... }`:「登録するデータの中身はこれです」という指定です。
- `id` や `createdAt`: これらは `schema.prisma` で自動生成されるように設定されているため、ここでは書く必要がありません。

## 公式ドキュメント
より詳しい情報は、以下の公式ドキュメント（英語）を参照してください。

- [Prisma Client CRUD - Create](https://www.prisma.io/docs/orm/prisma-client/queries/crud#create)
