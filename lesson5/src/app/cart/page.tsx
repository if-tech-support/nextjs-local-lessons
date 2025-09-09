import { createClient } from '@/lib/supabase/server';
import { updateCartItemAction, removeCartItemAction, placeOrderAction } from '@/lib/actions';

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from('cart_items')
    .select('id, qty, products(id, name, price)')
    .eq('temp_user_id', 'demo-user')
    .order('created_at');
  type Row = { id: string; qty: number; products: { id: string; name: string; price: number } | null };
  const items: Row[] = (rows as unknown as Row[]) || [];
  const total = items.reduce((s, r) => s + (r.products?.price || 0) * r.qty, 0);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">カート</h1>
      <p className="text-sm">合計: ¥{total}</p>
      {!items.length && <p className="text-sm text-gray-500">カートは空です</p>}
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="border p-3 rounded space-y-2">
            <p className="text-sm font-semibold">{it.products?.name}</p>
            <p className="text-xs text-gray-500">¥{it.products?.price}</p>
            <div className="flex gap-2 items-center">
              <form action={updateCartItemAction} className="flex gap-2 items-center">
                <input type="hidden" name="id" value={it.id} />
                <input
                  type="number"
                  name="qty"
                  defaultValue={it.qty}
                  min={0}
                  className="border px-2 py-1 rounded w-20"
                />
                <button className="bg-pink-500 text-white p-2 rounded text-xs">更新</button>
              </form>
              <form action={removeCartItemAction}>
                <input type="hidden" name="id" value={it.id} />
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
