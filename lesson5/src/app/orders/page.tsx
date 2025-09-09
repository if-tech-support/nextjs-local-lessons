import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { placeOrderAction, deleteOrderAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createClient();
  // 現在のカート合計を取得 (orders画面で再度注文確定可能にする用途)
  const { data: cartRows } = await supabase
    .from('cart_items')
    .select('qty, products(price)')
    .eq('temp_user_id', 'demo-user');
  type CartRow = { qty: number; products: { price: number } | null };
  const total =
    (cartRows as unknown as CartRow[] | null)?.reduce((s, r) => s + (r.products?.price || 0) * r.qty, 0) || 0;
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">注文</h1>
      <p className="text-sm">カート合計: ¥{total}</p>
      {total > 0 && (
        <form action={placeOrderAction}>
          <button className="bg-pink-600 text-white px-4 py-1 rounded">注文確定</button>
        </form>
      )}
      <Suspense fallback={<p className="text-pink-500">履歴取得...</p>}>
        <OrderHistory />
      </Suspense>
    </div>
  );
}

async function OrderHistory() {
  const supabase = await createClient();
  // orders と order_items をまとめて取得 (ネスト select)
  const { data: orders } = await supabase
    .from('orders')
    .select('id, created_at, order_items(id, qty, price_at_order, products(id, name))')
    .eq('temp_user_id', 'demo-user')
    .order('created_at', { ascending: false });
  type OI = { id: string; qty: number; price_at_order: number; products: { id: string; name: string } | null };
  type Order = { id: string; created_at: string; order_items: OI[] };
  const list: Order[] = (orders as unknown as Order[]) || [];
  if (!list.length) return <p className="text-sm text-gray-500">まだ注文はありません</p>;
  return (
    <ul className="space-y-4">
      {list.map((o) => {
        const sum = o.order_items.reduce((s, it) => s + it.price_at_order * it.qty, 0);
        return (
          <li key={o.id} className="border p-3 rounded space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">{o.id}</p>
              <form action={deleteOrderAction}>
                <button className="bg-gray-300 p-1 rounded text-xs" name="id" value={o.id} title="この注文を削除">
                  削除
                </button>
              </form>
            </div>
            <ul className="space-y-1">
              {o.order_items.map((it) => (
                <li key={it.id} className="flex justify-between text-sm">
                  <span>
                    {it.products?.name} x {it.qty}
                  </span>
                  <span>¥{it.price_at_order * it.qty}</span>
                </li>
              ))}
            </ul>
            <p className="text-right text-sm font-semibold">計 ¥{sum}</p>
          </li>
        );
      })}
    </ul>
  );
}
