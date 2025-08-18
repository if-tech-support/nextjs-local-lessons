## はじめに

この章では外部APIからユーザデータを取得し一覧表示する最初のページを実装します。ここで取得した一覧は後続の詳細ページ実装の土台になります。

## 目的

Next.jsで外部APIからデータを取得する方法を学ぶ

## 学習対象のスキル

- fetch APIを使ったデータ取得
- 非同期処理とuseEffect
- 基本的なリスト表示

## 課題A：`User` 型の定義（5分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

`src/app/users/page.tsx` でユーザを表す型を定義する。

- 定義場所：`src/app/users/page.tsx` の先頭付近
- フィールド：`id: number` / `username: string` / `company: { name: string }`

### ヒント

- `interface User { ... }` を書く
- ネストは `company` の `name` まで

### 解答例（型定義）

```ts
interface User {
  id: number;
  username: string;
  company: { name: string };
}
```

### 実装ポイント

- 型を置くと補完が働きタイポを防げる
- ネスト構造もそのまま表現できる

---

## 課題B：ユーザ一覧ページの作成（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

外部APIから取得した10件のユーザをカードグリッドで表示する。

- 対象ファイル：src/app/users/page.tsx
- コンポーネント：関数は`async`
- データ取得：`https://jsonplaceholder.typicode.com/users` へ `fetch`（モック禁止）
- 関数分割：データ取得は`getUsers()`のような関数に分けて定義する
- 見出し：ページ先頭に「ユーザ一覧」
- レイアウト：グリッド1列→中画面2列→大画面3列（均等な余白）
- カード外観：白背景／角丸／薄い影／内側余白あり／ホバーで影強調（滑らか）
- カード内容：上部に簡易アバター（丸背景＋頭文字1文字）とID＋ユーザ名、下に会社名
- 表示テキスト：IDは小さく淡色／ユーザ名はやや大きく太字／会社名は本文色より少し淡く
- アバター：画像を使わず丸背景＋頭文字表示
- エラー：`response.ok`が`false`なら`throw`
- 型利用：`id` / `username` / `company.name`

（デザインの数値は解答例内クラスで確認できれば十分です。ここでは概念を優先してください。）

### ヒント

- `export default async function UsersPage()`
- `await fetch(url)` → `await res.json()`
- （最小型はページ内で定義するためインポート不要）
- グリッド：`grid` + `gap-*` + `md:` / `lg:`


### 解答例（抜粋）

```tsx
interface User {
  id: number;
  username: string;
  company: { name: string };
}

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) {
    throw new Error('ユーザ取得に失敗しました');
  }
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ一覧</h1>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                {user.username.slice(0,1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-gray-500">ID: {user.id}</p>
                <h3 className="font-semibold text-lg text-gray-800">{user.username}</h3>
              </div>
            </div>
            <p className="text-gray-600">
              <span className="font-medium">会社:</span> {user.company.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 実装ポイント

- サーバーコンポーネントなので`useState`や`useEffect`不要
- エラーは`throw`でNext.jsに委ねる（後続章でハンドリング余地）
- 列切り替えでレスポンシブを体験

## 章末の確認

- 課題Aで `User` 型を定義済みか（`id` / `username` / `company.name`）
- 開発サーバーを起動（未起動なら）
```bash
npm run dev
```
- `http://localhost:3000/users` を開く
- チェックリスト
  - 10件のカードが表示される
  - 列数が1→2→3に切り替わる
  - 各カードにアバター / ID / ユーザ名 / 会社名
  - ホバーで影が強調される
  - コンソールエラーがない

問題なければ次章でユーザ詳細ページ（Dynamic Routes）を実装します。
