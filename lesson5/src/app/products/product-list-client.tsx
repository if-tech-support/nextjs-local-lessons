'use client';
import { useMemo, useState } from 'react';
import { addToCartAction } from '@/lib/actions';
import { SearchBox } from './SearchBox';

interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ClientProductList({ products }: { products: DBProduct[] }) {
  const [q, setQ] = useState('');
  const list = useMemo(
    () => products.filter((p) => (p.name + p.description).toLowerCase().includes(q.toLowerCase())),
    [q, products]
  );
  return (
    <div className="space-y-4">
      <SearchBox onChange={setQ} />
      <ul className="space-y-3">
        {list.map((p) => (
          <li key={p.id} className="border p-3 rounded space-y-1">
            <p className="font-semibold text-pink-600">{p.name}</p>
            <p className="text-xs text-gray-600">{p.description}</p>
            <p className="text-sm">¥{p.price}</p>
            <form action={addToCartAction} className="mt-1">
              <input type="hidden" name="id" value={p.id} />
              <button className="bg-pink-500 text-white p-2 rounded text-xs">カートに追加</button>
            </form>
          </li>
        ))}
        {!list.length && <p className="text-sm text-gray-500">該当なし</p>}
      </ul>
    </div>
  );
}
