## Lesson5 MiniShop

学習目的:

1. サーバー / クライアントコンポーネントの役割分担
2. Server Actions によるフォーム送信 -> ミューテーション -> 再検証 -> `redirect`
3. Suspense と `loading.tsx` によるストリーミング / ローディング UI

### ルート

- `/products` 商品一覧 + クライアント検索 + 「カートに追加」(Server Action)
- `/orders` カート合計と「注文確定」(Server Action) + 過去注文一覧

### 技術ポイント

- メモリ内ストア (`src/lib/store.ts`) : プロセス再起動でリセットされる簡易データ
- Server Actions (`src/lib/actions.ts`) : `"use server"`、`revalidatePath`, `redirect`
- サーバーコンポーネント: デフォルト (一覧, 注文ページ骨格)
- クライアントコンポーネント: 検索ボックス + フィルタ表示 (`product-list-client.tsx`, `SearchBox.tsx`)
- Suspense + `app/**/loading.tsx`: 非同期領域のローディング表現

### 起動

```bash
npm install
npm run dev
```

`/products` へアクセスして学習を開始してください。

### 実験手順例

1. 複数商品を「カートに追加」→ `/orders` で合計確認
2. 「注文確定」→ `redirect` でクエリ付き遷移 (`?placed=...`) を確認
3. 再度 `/products` に戻りカート数リセット（再検証）を確認
4. コンソールで Server Actions がネットワーク往復 1 回で完結していることを確認

### 次段階アイデア (レッスン外)

- Prisma + DB 永続化
- キャッシュタグ (`revalidateTag`) でのより粒度の細かい無効化
- 楽観的 UI / トースト通知

