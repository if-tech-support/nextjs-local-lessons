import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .select('id,title,content,created_at,updated_at')
    .eq('id', id)
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 404 });
  if (!data) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const body = await req.json();
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { data, error } = await client
    .from('memos')
    .update({ title: body.title, content: body.content })
    .eq('id', id)
    .select('id,title,content,created_at,updated_at')
    .single();
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const pathname = new URL(req.url).pathname;
  const id = decodeURIComponent(pathname.split('/').pop() || '');
  const client = await createClient();
  if (!client) return NextResponse.json({ error: 'Supabase client is not configured' }, { status: 500 });
  const { error } = await client.from('memos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: String(error.message ?? error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
