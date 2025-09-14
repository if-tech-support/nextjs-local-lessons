import { createClient } from '@/lib/supabase/server';
import { updateCartItemAction, removeCartItemAction, placeOrderAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

async function getCartItems() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, quantity, products(id, name, price)')
      .eq('temp_user_id', 'demo-user')
      .order('created_at');
    if (error) throw error;
    return data;
  } catch (e) {
    throw e;
  }
}

export default async function CartPage() {
  const data = await getCartItems();
  const items = data || [];
  const total = items.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">カート</h1>
      <p className="text-sm">合計: ¥{total}</p>
      {!items.length && <p className="text-sm text-gray-500">カートは空です</p>}
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="border p-3 rounded space-y-2">
            <p className="text-sm font-semibold">{item.products?.name}</p>
            <p className="text-xs text-gray-500">¥{item.products?.price}</p>
            <div className="flex gap-2 items-center">
              <form action={updateCartItemAction} className="flex gap-2 items-center">
                <input type="hidden" name="id" value={item.id} />
                <input
                  type="number"
                  name="quantity"
                  defaultValue={item.quantity}
                  min={0}
                  className="border px-2 py-1 rounded w-20"
                />
                <button className="bg-pink-500 text-white p-2 rounded text-xs">更新</button>
              </form>
              <form action={removeCartItemAction}>
                <input type="hidden" name="id" value={item.id} />
                <button className="bg-gray-300 p-2 rounded text-xs">削除</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <form action={placeOrderAction}>
          <button className="bg-pink-600 text-white px-4 py-1 rounded">注文確定</button>
        </form>
      )}
    </div>
  );
}
