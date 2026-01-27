import { redirect } from 'next/navigation';

// ルートアクセス時は即座にリンク一覧へ誘導する
export default function Home() {
  redirect('/links');
}
