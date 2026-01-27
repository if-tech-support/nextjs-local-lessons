# Prisma Clientについて

## 概要
Prisma Clientは、プログラム（JavaScriptやTypeScript）からデータベースを操作するための「道具」です。

これまでに学習した `schema.prisma` で設計図を作り、マイグレーションでデータベースの形を作りました。Prisma Clientは、そのデータベースに対して「データを保存して」「データを取ってきて」といった命令を出す役割を持っています。

例えるなら、データベースが「図書館の書庫」だとしたら、Prisma Clientは「司書さん」です。私たちは司書さん（Prisma Client）にお願いするだけで、複雑な書庫（データベース）から本（データ）を探し出したり、新しい本をしまったりしてくれます。

## 特徴

### 1. 安全にコードが書ける（型安全性）
`schema.prisma` の内容を元に作られるため、プログラムを書くときに「そんなデータ項目はないよ」とエディターが教えてくれます。書き間違いを未然に防ぐことができます。

### 2. 直感的に書ける
SQLという難しいデータベース言語を直接書かなくても、JavaScriptやTypeScriptの書き方でデータベースを操作できます。

## 使い方

Prisma Clientを使うには、まずコードの中で「司書さん」を呼び出す準備をします。

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

### データを取得する例
たとえば、`User` というモデル（テーブル）から全部のデータを取り出す場合はこのように書きます。

```typescript
// 全てのユーザーを取得する
const allUsers = await prisma.user.findMany()
```

### データを保存する例
新しいユーザーを登録する場合はこのように書きます。

```typescript
// 新しいユーザーを作成する
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
  },
})
```

## 公式ドキュメント
より詳しい情報は以下の公式ドキュメントを参照してください。

[Prisma Client Documentation](https://www.prisma.io/docs/orm/prisma-client)
