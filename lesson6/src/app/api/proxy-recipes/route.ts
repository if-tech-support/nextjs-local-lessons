import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.vercel.app/blog');
    if (!res.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: JSON.stringify(error) }, { status: 500 });
  }
}
