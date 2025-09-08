import { getOrders, cartTotal, productMap } from '@/lib/store';
import { placeOrderAction } from '@/lib/actions';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const total = cartTotal();
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">注文</h1>
      <p className="text-sm">合計: ¥{total}</p>
      <form action={placeOrderAction}>
        <button className="bg-pink-600 text-white px-4 py-1 rounded">注文確定</button>
      </form>
      <Suspense fallback={<p className="text-pink-500">履歴取得...</p>}>
        <OrderHistory />
      </Suspense>
    </div>
  );
}

async function OrderHistory() {
  const orders = getOrders();
  const map = productMap();
  if (!orders.length) return <p className="text-sm text-gray-500">まだ注文はありません</p>;
  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="border p-3 rounded space-y-2">
          <p className="text-xs text-gray-500">{o.id}</p>
          <ul className="space-y-1">
            {o.items.map((it) => {
              const p = map.get(it.productId)!;
              return (
                <li key={p.id} className="flex justify-between text-sm">
                  <span>
                    {p.name} x {it.qty}
                  </span>
                  <span>¥{p.price * it.qty}</span>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
