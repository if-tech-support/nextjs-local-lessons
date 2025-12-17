# Next.jsのSSR（サーバーサイドレンダリング）について

## 概要
SSR（Server-Side Rendering）とは、ユーザーがページにアクセスするたびに、サーバー側でHTML（ページの見た目）を作成して、完成した状態でブラウザに送る仕組みのことです。

すでに学習済みの **CSR（Client-Side Rendering）** と比較してみましょう。
- **CSR**: ブラウザが「ページの設計図（JavaScript）」を受け取り、ブラウザ上で組み立てて表示します。
- **SSR**: サーバーが「完成したページ（HTML）」を作り、それをブラウザに送ります。

料理で例えると、以下のようになります。
- **CSR**: ミールキットが届き、自宅（ブラウザ）で調理して食べる。
- **SSR**: レストランで注文し、シェフ（サーバー）が調理した完成品が運ばれてくる。

SSRは、アクセスがあるたびにサーバーが最新の状態でページを作ってくれるのが最大の特徴です。

## 特徴
SSRには主に3つのメリットがあります。

1. **初期表示が速い**
   サーバーから送られてきた時点でページが完成しているため、ユーザーはすぐに内容を見ることができます。CSRのように、画面が真っ白な時間が少なくなります。

2. **SEO（検索エンジン最適化）に強い**
   Googleなどの検索エンジンロボットは、完成されたHTMLを読み取るのが得意です。SSRでは最初からコンテンツが含まれているため、検索順位への良い影響が期待できます。

3. **常に最新の情報を表示できる**
   ページを開くたびにサーバーでデータを取得してページを作るため、ニュースサイトや株価表示のように、常にリアルタイムな情報を見せたい場合に適しています。

## 使い方
Next.jsの **App Router** では、特別な設定を書かなくても、データの取得方法によって自動的にSSRのような挙動（動的レンダリング）になります。

具体的には、`fetch` 関数を使ってデータを取得する際に、キャッシュ（保存）をしない設定にするだけで実現できます。

```typescript
// 毎回サーバーで新しいデータを取得する（SSRの挙動）
const res = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});
```

`cache: 'no-store'` というオプションをつけることで、「データを保存せずに、毎回新しく取りに行く」という意味になります。これにより、ユーザーがアクセスするたびに最新のデータでページが作られます。

## 公式ドキュメント
- [Rendering: Server Components | Next.js](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching, Caching, and Revalidating | Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
