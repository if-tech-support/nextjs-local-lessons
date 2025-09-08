// メモリ内データ（学習用・プロセス再起動でリセット）
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // 円
};

export type CartItem = { productId: string; qty: number };
export type Order = { id: string; items: CartItem[]; createdAt: Date };

// 商品サンプル
export const products: Product[] = [
  {
    id: 'p1',
    name: 'カラフルマグ',
    description: '朝が楽しくなるビビッドカラー',
    price: 1200,
  },
  {
    id: 'p2',
    name: 'ミニノート',
    description: 'ポケットに入るアイデア帳',
    price: 600,
  },
  {
    id: 'p3',
    name: 'ステッカーセット',
    description: 'PCを彩る6枚セット',
    price: 500,
  },
  {
    id: 'p4',
    name: 'エコバッグ',
    description: '軽くて丈夫で洗える',
    price: 1800,
  },
];

// カートと注文履歴（最小）
let cart: CartItem[] = [];
const orders: Order[] = [];

export function getCart() {
  return cart.slice();
}

export function getOrders() {
  return orders.slice().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addToCart(productId: string) {
  const item = cart.find((c) => c.productId === productId);
  if (item) item.qty += 1;
  else cart.push({ productId, qty: 1 });
}

export function clearCart() {
  cart = [];
}

export function placeOrder() {
  if (!cart.length) return null;
  const order: Order = { id: `o_${Date.now()}`, items: cart.map((c) => ({ ...c })), createdAt: new Date() };
  orders.push(order);
  clearCart();
  return order;
}

export function cartTotal() {
  return cart.reduce((sum, c) => {
    const p = products.find((p) => p.id === c.productId);
    return sum + (p ? p.price * c.qty : 0);
  }, 0);
}

export function productMap() {
  return new Map(products.map((p) => [p.id, p] as const));
}
