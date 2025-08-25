'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="text-blue-600 hover:underline hover:cursor-pointer">
      戻る
    </button>
  );
}
