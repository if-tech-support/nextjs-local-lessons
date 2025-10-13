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

## 課題A：middlewareの実装（12分）

12分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

セッション更新と認証チェックを行うmiddlewareを作成します。

- 作成するファイル: `src/lib/supabase/middleware.ts`
- セッション更新: Supabaseクライアントでcookiesを管理
- 認証チェック: `supabase.auth.getUser()`でユーザー状態を確認
- リダイレクト条件: 未認証かつ`/login`、`/signup`以外のパスにアクセス時
- リダイレクト先: `/login?next=<現在のパス>`
- ログイン済みユーザー: `/login`、`/signup`にアクセス時は`/`にリダイレクト
- 除外パス: `/login`、`/signup`、`/auth`で始まるパス

【命名】
- `updateSession`（セッション更新関数）
- `middleware`（middleware関数）
- `config`（設定オブジェクト）
- `supabaseResponse`（レスポンスオブジェクト）
- `supabase`（Supabaseクライアント）
- `user`（ユーザー情報）

【参照】
- `createServerClient`（Supabaseクライアント作成）
- `NextResponse`（Next.jsレスポンス制御）
- `NextRequest`（Next.jsリクエスト型）
- `cookies`（cookies管理）
- `redirect`（リダイレクト）

【使用タグ】
- 該当なし

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

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

【命名】
- `middleware`（middleware関数）
- `config`（設定オブジェクト）

【参照】
- `updateSession`（セッション更新関数）
- `Request`（リクエスト型）

【使用タグ】
- 該当なし

【使用クラス一覧】
UI描画なし（設定ファイル）

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

## 課題C：ダッシュボードページの作成（20分）

8分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

認証済みユーザー専用のダッシュボードページを作成します。

- 作成するファイル: `src/app/dashboard/page.tsx`
- 認証チェック: 未認証時は`/login?next=/dashboard`へリダイレクト
- ユーザー情報表示: メールアドレス、ユーザーID、作成日時
- ログアウト機能: ボタンクリックでログアウト
- レイアウト: 中央揃え、最大幅`max-w-3xl`

【命名】
- `DashboardPage`（コンポーネント名）
- `supabase`（Supabaseクライアント）
- `user`（ユーザー情報）
- `error`（エラー情報）

【参照】
- `createClient`（Supabaseクライアント作成）
- `signOut`（ログアウト関数）
- `redirect`（リダイレクト）

【使用タグ】
- （新規）`div`（ページラッパー）: ページ全体の余白 / 最大幅レイアウト調整
  - （新規）`div`（コンテンツラッパー / max-w-3xl）: 横幅制限と中央寄せ
    - （新規）`h1`: ページタイトル（ダッシュボード）
    - （新規）`p`: ページ概要テキスト
    - （新規）`div`（カード外枠）: ユーザー情報表示カード（背景 / 影 / 角丸）
      - （新規）`div`（カードヘッダー）: 見出しと補足説明のラッパー
  - （新規）`h3`: カード見出し（"ユーザー情報"）
  - （新規）`p`（補足説明）:「あなたのアカウント情報」
      - （新規）`div`（情報エリアラッパー）: 上部境界線 + 定義リスト包囲
        - （新規）`dl`: ユーザー属性の定義リスト全体
          - （繰り返し）`div`（行ラッパー：奇数/偶数交互）:
            - （新規）`dt`: ラベル（メールアドレス / ユーザーID / 作成日時）
            - （新規）`dd`: 対応する値
    - （新規）`div`（ログアウトエリア）: ボタンブロック余白調整
      - （新規）`form`: Server Action `signOut` をトリガー
        - （新規）`button`: サインアウト送信ボタン

【使用クラス一覧】
- `ページラッパーdiv`: `max-w-7xl` `mx-auto` `px-4` `sm:px-6` `lg:px-8` `py-12`
- `コンテンツラッパーdiv`: `max-w-3xl` `mx-auto`
- `見出しh1`: `text-3xl` `font-bold` `text-gray-900`
- `説明p`: `mt-2` `text-lg` `text-gray-600`
- `カード外枠div`: `mt-8` `bg-white` `shadow` `overflow-hidden` `sm:rounded-lg`
- `カードヘッダーdiv`: `px-4` `py-5` `sm:px-6`
- `カード見出しh3`: `text-lg` `leading-6` `font-medium` `text-gray-900`
- `カード補足p`: `mt-1` `max-w-2xl` `text-sm` `text-gray-500`
- `情報エリアラッパーdiv`: `border-t` `border-gray-200`
- `行div（奇数）`: `bg-gray-50` `px-4` `py-5` `sm:grid` `sm:grid-cols-3` `sm:gap-4` `sm:px-6`
- `行div（偶数）`: `bg-white` `px-4` `py-5` `sm:grid` `sm:grid-cols-3` `sm:gap-4` `sm:px-6`
- `dt`: `text-sm` `font-medium` `text-gray-500`
- `dd`: `mt-1` `text-sm` `text-gray-900` `sm:mt-0` `sm:col-span-2`
- `ログアウトエリアdiv`: `mt-8`
- `ログアウトbutton`: `inline-flex` `items-center` `px-4` `py-2` `border` `border-transparent` `text-sm` `font-medium` `rounded-md` `shadow-sm` `text-white` `bg-red-600` `hover:bg-red-700` `focus:outline-none` `focus:ring-2` `focus:ring-offset-2` `focus:ring-red-500`

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
- ログイン済みユーザーがログインページにアクセスした際のリダイレクトが動作する
- ログイン済みユーザーがサインアップページにアクセスした際のリダイレクトが動作する
- 静的ファイルがmiddlewareの対象外になっている
