import Link from 'next/link';
import { Memo } from '@/types/memo';

export default function MemoTable({ memos }: { memos: Memo[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white">
        <thead>
          <tr>
            <th className="text-left p-3">タイトル</th>
            <th className="text-left p-3">作成</th>
            <th className="text-left p-3">更新</th>
            <th className="text-left p-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {memos.map((m) => (
            <tr key={m.id}>
              <td className="p-3">
                <Link href={`/memos/${m.id}`} className="text-sky-700 underline hover:cursor-pointer">
                  {m.title}
                </Link>
              </td>
              <td className="p-3 text-sm text-sky-800">{new Date(m.created_at).toLocaleString()}</td>
              <td className="p-3 text-sm text-sky-800">{new Date(m.updated_at).toLocaleString()}</td>
              <td className="p-3">
                <Link href={`/memos/${m.id}`} className="text-sky-700 underline hover:cursor-pointer">
                  詳細
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
