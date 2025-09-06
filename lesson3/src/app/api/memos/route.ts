import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .insert({ title: String(body.title ?? ''), content: String(body.content ?? '') })
    .select('id,title,content,created_at,updated_at')
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
