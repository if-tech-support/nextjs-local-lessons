import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { placeOrderAction, deleteOrderAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

async function getCartItems() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity, products(price)')
      .eq('temp_user_id', 'demo-user');
    if (error) throw error;
    return data;
  } catch (e) {
    throw e;
  }
}

export default async function OrdersPage() {
  const data = await getCartItems();
  const cartItems = data ?? [];
  const total = cartItems.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0) || 0;

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

async function getOrders() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('id, created_at, order_items(id, quantity, price_at_order, products(id, name))')
      .eq('temp_user_id', 'demo-user')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (e) {
    throw e;
  }
}

async function OrderHistory() {
  const data = await getOrders();
  const orders = data || [];
  if (!orders.length) return <p className="text-sm text-gray-500">まだ注文はありません</p>;

  return (
    <ul className="space-y-4">
      {orders.map((order) => {
        const sum = order.order_items.reduce((sum, item) => sum + item.price_at_order * item.quantity, 0);
        return (
          <li key={order.id} className="border p-3 rounded space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">{order.id}</p>
              <form action={deleteOrderAction}>
                <input type="hidden" name="id" value={order.id} />
                <button className="bg-gray-300 p-1 rounded text-xs" title="この注文を削除">
                  削除
                </button>
              </form>
            </div>
            <ul className="space-y-1">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.products?.name} x {item.quantity}
                  </span>
                  <span>¥{item.price_at_order * item.quantity}</span>
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
