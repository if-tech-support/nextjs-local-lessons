# Next.jsのSSG（静的サイト生成）について

## 概要
SSG（Static Site Generation）とは、アプリケーションをビルド（本番用に準備）するタイミングで、あらかじめすべてのページをHTMLとして作成しておく仕組みのことです。

SSR（サーバーサイドレンダリング）と比較してみましょう。
- **SSR**: 注文が入ってからシェフが料理を作る（アクセスごとにHTMLを作る）。
- **SSG**: 開店前にお弁当を大量に作っておき、注文が入ったらすぐに渡す（ビルド時にHTMLを作っておく）。

ユーザーがアクセスしたときには、すでに完成しているページを渡すだけなので、表示が非常に高速です。

## 特徴
SSGには主に3つのメリットがあります。

1. **表示速度が最速**
   すでにHTMLファイルが存在しているため、サーバーでの処理時間がほぼゼロで、ユーザーに即座にページを表示できます。

2. **サーバーへの負荷が低い**
   アクセスごとにページを作る必要がないため、たくさんの人が同時にアクセスしてもサーバーがダウンしにくいです。

3. **SEOに強い**
   SSRと同様に、最初から完成したHTMLがあるため、検索エンジンが内容を理解しやすく、検索順位に良い影響を与えます。

ブログ記事や、会社のホームページ、ヘルプセンターなど、内容があまり頻繁に変わらないページに最適です。

## 使い方
Next.jsの **App Router** では、動的なデータ取得（`fetch` など）を行わないページや、データをキャッシュする設定にしているページは、自動的にSSGとして扱われます。

`fetch` を使う場合、デフォルト（何も設定しない状態）ではデータがキャッシュされるため、SSGになります。

```typescript
// デフォルトでキャッシュされるため、ビルド時に一度だけ実行される（SSGの挙動）
const res = await fetch('https://api.example.com/posts');
```

また、明示的にキャッシュすることを書く場合は `force-cache` を使います。

```typescript
const res = await fetch('https://api.example.com/posts', {
  cache: 'force-cache'
});
```

これにより、ビルド時に取得したデータを使ってHTMLが作られ、その後は同じ内容が表示され続けます。

## 公式ドキュメント
- [Rendering: Server Components | Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default)
- [Data Fetching, Caching, and Revalidating | Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#caching-data)
