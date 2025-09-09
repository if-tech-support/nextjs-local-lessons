import { signIn, signUp } from "@/lib/actions";
import { AuthFormData } from "@/types/auth";

export default function LoginPage() {
  async function handleSignIn(formData: FormData) {
    "use server";

    const data: AuthFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const error = await signIn(data);
    if (error) {
      // エラーハンドリングは簡略化
      console.error("Sign in error:", error.message);
    }
  }

  async function handleSignUp(formData: FormData) {
    "use server";

    const data: AuthFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const error = await signUp(data);
    if (error) {
      // エラーハンドリングは簡略化
      console.error("Sign up error:", error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または新しいアカウントを作成
          </p>
        </div>
        <form className="mt-8 space-y-6">
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

          <div className="flex space-x-4">
            <button
              formAction={handleSignIn}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ログイン
            </button>
            <button
              formAction={handleSignUp}
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              サインアップ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
