## はじめに

エラーメッセージの翻訳システムを構築し、Server Actionsを用いたサインアップ/サインイン/サインアウト処理を実装、さらにログインページ（基本形）を作成します。

## 目的

- 設定ファイルベースのエラーメッセージ管理
- Server Actionsによる認証処理
- ログインページUIとエラーハンドリング

## 学習対象のスキル

- Supabase Authentication API

## 課題A：エラーメッセージ管理システムの実装（20分）

7分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

設定ファイルベースのエラーメッセージ管理システムを作成します。

- 作成するファイル: `src/config/error-messages.json`
- 作成するファイル: `src/lib/error-messages.ts`
- 設定ファイル: JSON形式でエラーメッセージの翻訳を管理（Node.js標準）
- 翻訳関数: 完全一致と部分一致でエラーメッセージを翻訳
- キャッシュ機能: ファイル変更検知による効率的な読み込み
- フォールバック: 設定ファイル読み込み失敗時のデフォルトメッセージ

#### 動作仕様
- 完全一致でエラーメッセージを検索します
- 完全一致しない場合は、部分一致で検索します
- 翻訳が見つからない場合は、元のメッセージをそのまま返します
- 設定ファイルはキャッシュされ、ファイルが変更された場合のみ再読み込みされます

#### 注意事項
- JSONファイルの構文エラーがある場合、デフォルトのメッセージが使用されます
- 設定ファイルの変更は、アプリケーションの再起動なしで反映されます
- キー名は英語のエラーメッセージと完全に一致させる必要があります

【使用タグ】
- なし

### ヒント

- 設定ファイルは`src/config/`ディレクトリに配置
- キャッシュ機能でパフォーマンスを最適化
- エラーハンドリングで堅牢性を確保
- 型安全性のためにTypeScriptインターフェイスを定義

#### 設定方法
- **新しいエラーメッセージを追加**: `error-messages.json`ファイルを編集
- **既存のメッセージを変更**: 既存のキーの値を変更
- **メッセージの削除**: 不要になったメッセージはJSONファイルからキーと値を削除

### 解答例

```json
// src/config/error-messages.json
{
  "error_messages": {
    "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません",
    "User not found": "ユーザーが見つかりません",
    "Email not confirmed": "メールアドレスが確認されていません",
    "Password should be at least": "パスワードは6文字以上で入力してください",
    "User already registered": "このメールアドレスは既に登録されています",
    "Invalid email": "有効なメールアドレスを入力してください",
    "Signup is disabled": "新規登録は現在無効になっています",
    "Email rate limit exceeded": "メール送信回数が上限に達しました。しばらく待ってから再試行してください"
  }
}
```

```ts
// src/lib/error-messages.ts
import fs from "fs";
import path from "path";

interface ErrorMessages {
  error_messages: Record<string, string>;
}

let cachedErrorMessages: Record<string, string> | null = null;
let lastModified: number | null = null;

function loadErrorMessages(): Record<string, string> {
  try {
    const configPath = path.join(
      process.cwd(),
      "src",
      "config",
      "error-messages.json"
    );
    const stats = fs.statSync(configPath);
    const currentModified = stats.mtime.getTime();

    if (cachedErrorMessages && lastModified === currentModified) {
      return cachedErrorMessages;
    }

    const fileContents = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(fileContents) as ErrorMessages;

    cachedErrorMessages = config.error_messages;
    lastModified = currentModified;

    return config.error_messages;
  } catch (error) {
    console.error("エラーメッセージ設定の読み込みに失敗しました:", error);

    if (cachedErrorMessages) {
      return cachedErrorMessages;
    }

    return {
      "Invalid login credentials": "メールアドレスまたはパスワードが正しくありません",
      "User not found": "ユーザーが見つかりません",
      "Email not confirmed": "メールアドレスが確認されていません",
      "Password should be at least": "パスワードは6文字以上で入力してください",
      "User already registered": "このメールアドレスは既に登録されています",
      "Invalid email": "有効なメールアドレスを入力してください",
      "Signup is disabled": "新規登録は現在無効になっています",
      "Email rate limit exceeded": "メール送信回数が上限に達しました。しばらく待ってから再試行してください",
    };
  }
}

export function translateErrorMessage(message: string): string {
  const errorMessages = loadErrorMessages();

  if (errorMessages[message]) {
    return errorMessages[message];
  }

  for (const [key, translation] of Object.entries(errorMessages)) {
    if (message.includes(key)) {
      return translation;
    }
  }

  return message;
}

export function getAvailableErrorMessages(): Record<string, string> {
  return loadErrorMessages();
}
```

## 課題B：Server Actionsの実装（20分）

10分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

認証処理を行うServer Actionsを作成します。

- 作成するファイル: `src/lib/actions.ts`
- sinUp関数
  - 定義: `signUp(formData: AuthFormData): Promise<AuthError | null>`
  - Supabaseサーバークライアント取得: `const supabase = await createClient()`。
  - クライアント生成後: `supabase.auth.signUp({ email: formData.email, password: formData.password })` を実行。
  - 戻り値の`error`を取得してチェック。
    - エラーがある場合: `translateErrorMessage(error.message)` で日本語へ変換し `{ message: 変換後 }` を返して終了（リダイレクト無し）。
    - エラーがない場合: `revalidatePath("/", "layout")` でルートレイアウトを再検証しログイン状態反映を促す。
  - `redirect("/dashboard")` でダッシュボードへ遷移。
- signIn関数
  - 定義: `signIn(formData: AuthFormData): Promise<AuthError | null>`
  - Supabaseサーバークライアント取得: `const supabase = await createClient()`。
  - クライアント生成後 `supabase.auth.signInWithPassword({ email, password })` を実行。
  - 戻り値の`error`を取得してチェック。
    - エラーがある場合: `translateErrorMessage(error.message)` で日本語へ変換し `{ message: 変換後 }` を返して終了（リダイレクト無し）。
    - エラーがない場合: `revalidatePath("/", "layout")` でルートレイアウトを再検証しログイン状態反映を促す。
  - `redirect("/dashboard")` でダッシュボードへ遷移。
- signUpAction関数
  - 定義: `signUpAction(formData: FormData): Promise<AuthError | null>`（Client Component用）
  - 受け取った`formData`から`email`と`password`を取り出し`data`に格納。`data`は`AuthFormData`型。
  - `return await signUp(data)`を実行し結果をそのまま返す。
- signInAction関数
  - 定義: `signInAction(formData: FormData): Promise<AuthError | null>`（Client Component用）
  - `signUpAction` と同様に`formData`から`email`と`password`を取り出し`data`に格納。`data`は`AuthFormData`型。
  - `return await signIn(data)`を実行し結果をそのまま返す。
- signOut関数
  - 定義: `signOut(): Promise<void>`
  - Supabaseサーバークライアント取得: `const supabase = await createClient()`。
  - クライアント生成後 `supabase.auth.signOut()` を実行。
  - `revalidatePath("/", "layout")` を呼び、トップレイアウトから再描画させる。
  - 最後に `redirect("/")` でトップページへ遷移。

【使用タグ】
- なし

### ヒント

- `"use server"`ディレクティブを追加
- `revalidatePath`でキャッシュを更新
- `redirect`でページ遷移
- エラー時は`translateErrorMessage`で日本語翻訳
- Client Component用のAction関数を追加

### 解答例

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthFormData, AuthError } from "@/types/auth";
import { translateErrorMessage } from "@/lib/error-messages";

export async function signUp(
  formData: AuthFormData
): Promise<AuthError | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(
  formData: AuthFormData
): Promise<AuthError | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  formData: FormData
): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  return await signUp(data);
}

export async function signInAction(
  formData: FormData
): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  return await signIn(data);
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
```

## 課題C：ログインページの作成（20分）

8分ほどヒントを参考にして仕様どおりにコーディングに挑戦し、その後に解答例で確認しましょう。

### 仕様

ログインとサインアップのフォームを持つページを作成します。

- 作成するファイル: `src/app/login/page.tsx`
- LoginPageコンポーネント
  - 状態: `error`（`string | null`）、`isLoading`（`boolean`）を`useState`で定義
  - ルーター: `useRouter`で`router`を取得
  - handleSignIn関数
    - 引数: `formData: FormData`
    - 初期化: `setIsLoading(true)` と `setError(null)`
    - 概要: `try { ... } catch(error) { ... } finally { ... }` の構造を用いる。
    - 処理: `await signInAction(formData)` を実行し、戻り値の`result`をチェック。
      - `result`が存在する場合: `setError(result.message)`を実行して終了。
    - 失敗時: `catch`ブロックで`error`をキャッチし、`setError("ログインに失敗しました");`を実行。
   - 最後に`setIsLoading(false)`を実行。
- JSX構造
  - 見出し: `h2` で文言は`アカウントにログイン`
  - 補助テキスト: `p` でサインアップ誘導（`/signup` へのリンク）
  - エラー: `error`が存在する場合に`div`で表示
  - フォーム
    - ラベル: `label`で`メールアドレス`と`パスワード`
    - メールアドレス入力: `input`で`type="email"`、`name="email"`
    - パスワード入力: `input`で`type="password"`、`name="password"`
  - フォーム送信: `<form action={handleSignIn}>`

【使用タグ】
- （新規）`<div>`（ページラッパー）: 全画面高を確保し中央配置。上下左右に余白。淡いグレー背景。
  - （新規）`<div>`（フォームカード）: 幅を最大約mdに制限し全幅。子要素に縦間隔。白背景・内側余白・角丸・影。
    - （新規）`<div>`（ヘッダー）
      - （新規）`<h2>`: 上に余白。中央揃え。大きめで極太の濃いグレー見出し。
      - （新規）`<p>`: 上に少し余白。中央揃えの小さめ補助テキスト（薄いグレー）。
    - （新規）`<div>`（エラー）: 薄い赤背景と赤系ボーダー・文字色。小さめ文字で内側余白と角丸。
    - （新規）`<form>`: 上に余白。要素間に十分な縦間隔。
      - （新規）`<div>`（入力群）: 角丸と小さな影。上下で枠線を重ねて隙間なしに。
        - （新規）`<div>`
          - （新規）`<label>`: 画面外に配置（スクリーンリーダー用）。
          - （新規）`<input>`（メール）: 全幅・内側余白・枠線付き。フォーカス時にブルーのリング/枠。上側角丸。小さめ文字。
        - （新規）`<div>`
          - （新規）`<label>`: 画面外に配置（スクリーンリーダー用）。
          - （新規）`<input>`（パスワード）: 全幅・内側余白・枠線付き。フォーカス時にブルーのリング/枠。下側角丸。小さめ文字。
      - （新規）`<div>`（ボタン行ラッパー）
        - （新規）`<button>`（ログイン）: 全幅の主要ボタン。白文字・ブルー背景。ホバーで濃く。角丸・内側余白。無効時は半透明で操作不可。

### ヒント

- `useState`でエラー状態とローディング状態を管理
- `useRouter`で成功時のリダイレクトを処理
- 使用クラス一覧:
  - `div（ページラッパー）`: `min-h-screen`, `flex`, `items-center`, `justify-center`, `py-12`, `px-4`, `sm:px-6`, `lg:px-8`, `bg-gray-50`
  - `div（フォームカード）`: `max-w-md`, `w-full`, `space-y-8`, `bg-white`, `p-8`, `rounded-lg`, `shadow-md`
  - `h2`: `mt-6`, `text-center`, `text-3xl`, `font-extrabold`, `text-gray-900`
  - `p`: `mt-2`, `text-center`, `text-sm`, `text-gray-600`
  - `エラー`: `bg-red-50`, `border`, `border-red-200`, `text-red-600`, `px-4`, `py-3`, `rounded-md`, `text-sm`
  - `form`: `mt-8`, `space-y-6`
  - `div（入力群）`: `rounded-md`, `shadow-sm`, `-space-y-px`
  - `input`: `appearance-none`, `rounded-none`, `relative`, `block`, `w-full`, `px-3`, `py-2`, `border`, `border-gray-300`, `placeholder-gray-500`, `text-gray-900`, `rounded-t-md/rounded-b-md`, `focus:outline-none`, `focus:ring-blue-500`, `focus:border-blue-500`, `focus:z-10`, `sm:text-sm`
  - `button（ログイン）`: `group`, `w-full`, `flex`, `justify-center`, `py-2`, `px-4`, `border`, `border-transparent`, `text-sm`, `font-medium`, `rounded-md`, `text-white`, `bg-blue-600`, `hover:bg-blue-700`, `focus:outline-none`, `focus:ring-2`, `focus:ring-offset-2`, `focus:ring-blue-500`, `disabled:opacity-50`, `disabled:cursor-not-allowed`

### 解答例

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInAction } from "@/lib/actions";
import { AuthFormData } from "@/types/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSignIn(formData: FormData) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signInAction(formData);
      if (result) {
        setError(result.message);
      }
    } catch (error) {
      setError("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントをお持ちでない場合は
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 underline"
            >
              新規登録
            </Link>
            してください
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "処理中..." : "ログイン"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

## 章末の確認

- Server Actionsで認証処理が実行される
- エラーメッセージ管理システムが設定ファイルベースで動作する
- 日本語翻訳されたエラーメッセージが表示される
- Client Componentでのエラーハンドリングが適切に行われている
- ログインページでフォーム送信ができる
- ローディング状態とエラー状態のUIが正しく表示される
