import fs from "fs";
import path from "path";

// エラーメッセージの型定義
interface ErrorMessages {
  error_messages: Record<string, string>;
}

// キャッシュ用の変数
let cachedErrorMessages: Record<string, string> | null = null;
let lastModified: number | null = null;

// エラーメッセージ設定を読み込む関数（キャッシュ付き）
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

    // キャッシュが有効で、ファイルが変更されていない場合はキャッシュを返す
    if (cachedErrorMessages && lastModified === currentModified) {
      return cachedErrorMessages;
    }

    const fileContents = fs.readFileSync(configPath, "utf8");
    const config = JSON.parse(fileContents) as ErrorMessages;

    // キャッシュを更新
    cachedErrorMessages = config.error_messages;
    lastModified = currentModified;

    return config.error_messages;
  } catch (error) {
    console.error("エラーメッセージ設定の読み込みに失敗しました:", error);

    // キャッシュがある場合はそれを使用
    if (cachedErrorMessages) {
      return cachedErrorMessages;
    }

    // フォールバック用のデフォルトメッセージ
    return {
      "Invalid login credentials":
        "メールアドレスまたはパスワードが正しくありません",
      "User not found": "ユーザーが見つかりません",
      "Email not confirmed": "メールアドレスが確認されていません",
      "Password should be at least": "パスワードは6文字以上で入力してください",
      "User already registered": "このメールアドレスは既に登録されています",
      "Invalid email": "有効なメールアドレスを入力してください",
      "Signup is disabled": "新規登録は現在無効になっています",
      "Email rate limit exceeded":
        "メール送信回数が上限に達しました。しばらく待ってから再試行してください",
    };
  }
}

// エラーメッセージを翻訳する関数
export function translateErrorMessage(message: string): string {
  const errorMessages = loadErrorMessages();

  // 完全一致で検索
  if (errorMessages[message]) {
    return errorMessages[message];
  }

  // 部分一致で検索（キーワードを含む場合）
  for (const [key, translation] of Object.entries(errorMessages)) {
    if (message.includes(key)) {
      return translation;
    }
  }

  // 翻訳できない場合は元のメッセージを返す
  return message;
}

// 利用可能なエラーメッセージ一覧を取得する関数（デバッグ用）
export function getAvailableErrorMessages(): Record<string, string> {
  return loadErrorMessages();
}
