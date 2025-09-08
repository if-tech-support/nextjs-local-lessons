'use client';
import { useState } from 'react';

type Props = { onChange: (v: string) => void; initial?: string };

export function SearchBox({ onChange, initial = '' }: Props) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex gap-2">
      <input
        className="border px-2 py-1 rounded"
        value={v}
        placeholder="商品検索"
        onChange={(e) => {
          const nv = e.target.value;
          setV(nv);
          onChange(nv);
        }}
      />
      <button
        type="button"
        className="bg-gray-200 px-2 rounded"
        onClick={() => {
          setV('');
          onChange('');
        }}
      >
        クリア
      </button>
    </div>
  );
}
