# Next.jsのgenerateStaticParamsについて

## 概要
`generateStaticParams` は、**Dynamic Routes（動的ルーティング）** を使ったページを、SSG（静的サイト生成）にするための特別な関数です。

通常、`[id]` のような動的なパスを持つページ（例: `/posts/1`, `/posts/2`）は、どんなIDが来るかわからないため、アクセスされた瞬間にページを作る（SSR）か、クライアント側でデータを取る（CSR）ことになります。

しかし、「記事IDが1から10まである」とあらかじめわかっているなら、ビルドするときにその10ページ分を全部作っておきたいですよね。それを実現するのが `generateStaticParams` です。

例えるなら、「宛名書き」です。
- 通常のDynamic Routes: 誰が来るかわからないので、受付に来てから名札を書く。
- `generateStaticParams`: 招待客リスト（ID一覧）を事前に渡しておき、全員分の名札をあらかじめ書いて並べておく。

## 特徴
この機能を使うメリットは主に2つあります。

1. **動的ページでも高速表示（SSG化）**
   詳細ページのような動的なページでも、事前にHTMLを作っておけるため、アクセス時の表示が非常に速くなります。

2. **ビルド時にエラーに気づける**
   事前にページを生成しようとするため、もしデータ取得に失敗したり、プログラムにミスがあったりした場合、本番公開前のビルド中に気づくことができます。

ブログの個別記事ページや、商品の詳細ページなど、IDによって内容が変わるが、ページ数が決まっている場合に最適です。

## 使い方
`page.tsx` ファイルの中で、`generateStaticParams` という名前の関数をエクスポートします。この関数は、そのページで使われるパラメータ（`[id]` など）のリストを返す必要があります。

```typescript
// app/posts/[id]/page.tsx

// この関数で、あらかじめ生成したいパスのリスト（ID一覧）を返す
export async function generateStaticParams() {
  // 外部APIなどから全記事のデータを取得
  const posts = await fetch('https://api.example.com/posts').then((res) => res.json());

  // 各記事のIDを返す（文字列である必要があります）
  return posts.map((post: any) => ({
    id: post.id.toString(),
  }));
}

// 通常のページコンポーネント
export default function Page({ params }: { params: { id: string } }) {
  return <div>記事ID: {params.id} のページです</div>;
}
```

このように記述すると、Next.jsはビルド時に `posts` の数だけページを自動的に生成してくれます。

## 公式ドキュメント
- [generateStaticParams | Next.js](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
