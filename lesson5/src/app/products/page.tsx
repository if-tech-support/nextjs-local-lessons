import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { addToCartAction } from '@/lib/actions';

export const dynamic = 'force-dynamic'; // 学習で都度最新を見やすく

async function getProductsAndCartItems() {
  try {
    const supabase = await createClient();
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, price')
      .order('created_at');
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('temp_user_id', 'demo-user');
    if (productsError) throw productsError;
    if (cartItemsError) throw cartItemsError;
    return { products, cartItems };
  } catch (e) {
    throw e;
  }
}

export default async function ProductsPage() {
  const { products, cartItems } = await getProductsAndCartItems();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">商品一覧</h1>
      <p className="text-xs text-gray-500">カート内: {cartCount} 点</p>
      <Suspense fallback={<p className="text-pink-500">検索準備...</p>}>
        <div className="space-y-4">
          <ul className="space-y-3">
            {products.map((product) => (
              <li key={product.id} className="border p-3 rounded space-y-1">
                <p className="font-semibold text-pink-600">{product.name}</p>
                <p className="text-xs text-gray-600">{product.description}</p>
                <p className="text-sm">¥{product.price}</p>
                <form action={addToCartAction} className="mt-1">
                  <input type="hidden" name="id" value={product.id} />
                  <button className="bg-pink-500 text-white p-2 rounded text-xs">カートに追加</button>
                </form>
              </li>
            ))}
            {!products.length && <p className="text-sm text-gray-500">該当なし</p>}
          </ul>
        </div>
      </Suspense>
    </div>
  );
}
