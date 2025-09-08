import { Suspense } from 'react';
import { products, getCart } from '@/lib/store';
import ClientProductList from './product-list-client';

export const dynamic = 'force-dynamic'; // 学習で都度最新を見やすく

export default async function ProductsPage() {
  // サーバー側でカート数量把握
  const cart = getCart();
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-pink-600">商品一覧</h1>
      <p className="text-xs text-gray-500">カート内: {cartCount} 点</p>
      <Suspense fallback={<p className="text-pink-500">検索準備...</p>}>
        <ClientProductList products={products} />
      </Suspense>
    </div>
  );
}
