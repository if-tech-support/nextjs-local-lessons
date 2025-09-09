import { Suspense } from 'react';
import ClientProductList from './product-list-client';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // 学習で都度最新を見やすく

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: prods } = await supabase.from('products').select('id, name, description, price').order('created_at');
  const { data: cartItems } = await supabase.from('cart_items').select('qty').eq('temp_user_id', 'demo-user');
  const cartCount = (cartItems || []).reduce((s, c) => s + c.qty, 0);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">商品一覧</h1>
      <p className="text-xs text-gray-500">カート内: {cartCount} 点</p>
      <Suspense fallback={<p className="text-pink-500">検索準備...</p>}>
        <ClientProductList products={prods || []} />
      </Suspense>
    </div>
  );
}
