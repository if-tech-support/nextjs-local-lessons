// APIエンドポイントのフルURLを生成するユーティリティ
// NEXT_PUBLIC_BASE_URL を先頭に付与し、二重スラッシュを避けます
const BASE = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');

export function apiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${p}`;
}
