## はじめに

Next.jsのmiddlewareを使用してセッション管理と認証ガードを実装します。未認証ユーザーの自動リダイレクトとダッシュボードページの保護機能を構築します。

## 目的

- middlewareによるセッション更新の実装
- 未認証ユーザーの自動リダイレクト機能
- ダッシュボードページの保護
- 認証状態に応じたページ表示

## 学習対象のスキル

- Next.js middlewareの実装
- セッション更新と楽観的チェック
- 認証ガードとリダイレクト
- サーバーコンポーネントでの認証確認

## 課題A：middlewareの実装（15分）

15分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

セッション更新と認証チェックを行うmiddlewareを作成します。

- 作成するファイル: `src/lib/supabase/middleware.ts`
- セッション更新: Supabaseクライアントでcookiesを管理
- 認証チェック: `supabase.auth.getUser()`でユーザー状態を確認
- リダイレクト条件: 未認証かつ`/login`以外のパスにアクセス時
- リダイレクト先: `/login?next=<現在のパス>`
- 除外パス: `/login`と`/auth`で始まるパス

【使用タグ】
- `updateSession`（セッション更新関数）
- `createServerClient`（Supabaseクライアント）
- `NextResponse`（レスポンス制御）

### ヒント

- `@supabase/ssr`の`createServerClient`を使用
- cookiesの`getAll`と`setAll`でセッション管理
- `NextResponse.redirect`でリダイレクト
- パス判定は`request.nextUrl.pathname.startsWith`を使用

### 解答例

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse;
}
```

## 課題B：middleware設定ファイルの作成（5分）

5分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

middlewareを有効化する設定ファイルを作成します。

- 作成するファイル: `middleware.ts`（プロジェクトルート）
- middleware関数: `updateSession`を呼び出し
- マッチャー設定: 静的ファイルを除外
- 除外パス: `_next/static`、`_next/image`、`favicon.ico`、画像ファイル

【使用タグ】
- `middleware`（middleware関数）
- `config`（設定オブジェクト）

### ヒント

- プロジェクトルートに配置
- `updateSession`をインポートして呼び出し
- `matcher`で適用パスを制御

### 解答例

```typescript
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: Request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## 課題C：ダッシュボードページの作成（10分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

認証済みユーザー専用のダッシュボードページを作成します。

- 作成するファイル: `src/app/dashboard/page.tsx`
- 認証チェック: 未認証時は`/login?next=/dashboard`へリダイレクト
- ユーザー情報表示: メールアドレス、ユーザーID、作成日時
- ログアウト機能: ボタンクリックでログアウト
- レイアウト: 中央揃え、最大幅`max-w-3xl`

【使用タグ】
- `div`（最上位コンテナー）
  - `div`（コンテンツラッパー）
    - `h1`（ページタイトル）
    - `p`（説明文）
    - `div`（ユーザー情報カード）
      - `div`（ヘッダー）
        - `h3`（カードタイトル）
        - `p`（説明文）
      - `div`（情報エリア）
        - `dl`（定義リスト）
          - `div`（情報項目）
            - `dt`（項目名）
            - `dd`（項目値）
    - `div`（ログアウトエリア）
      - `form`（ログアウトフォーム）
        - `button`（ログアウトボタン）

### ヒント

- Tailwindの例：`max-w-3xl` `mx-auto` `bg-white` `shadow` `sm:rounded-lg`
- 認証チェックは`supabase.auth.getUser()`を使用
- エラー時は`redirect`でリダイレクト
- ユーザー情報は定義リスト（`dl`）で表示

### 解答例

```tsx
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-2 text-lg text-gray-600">
          認証済みユーザー専用ページです
        </p>

        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              ユーザー情報
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              あなたのアカウント情報
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  メールアドレス
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  ユーザーID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.id}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">作成日時</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(user.created_at).toLocaleString("ja-JP")}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8">
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

## 章末の確認

- middlewareが未認証ユーザーをログインページへリダイレクトする
- ダッシュボードページで認証済みユーザー情報が表示される
- ログアウトボタンで正常にログアウトできる
- セッション状態が正しく管理される
