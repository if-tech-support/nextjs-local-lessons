import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 公式 Quickstart に沿ったシンプルなサーバーサイド用クライアント生成
 * - URL: NEXT_PUBLIC_SUPABASE_URL
 * - KEY: SUPABASE_SERVICE_ROLE_KEY (優先) or NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - persistSession: false（Route Handler での最小利用）
 */
export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
