'use server';
import { addToCart, placeOrder } from '@/lib/store';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// temp ユーザー識別 (本来は認証セッション利用)。
function tempUserId() {
  return 'demo-user'; // デモ用固定
}

export async function addToCartAction(formData: FormData) {
  const id = formData.get('id');
  if (typeof id !== 'string') return;

  const supabase = await createClient();
  try {
    // 既存行があれば qty インクリメント
    const { data: existing, error: selErr } = await supabase
      .from('cart_items')
      .select('id, qty')
      .eq('temp_user_id', tempUserId())
      .eq('product_id', id)
      .maybeSingle();
    if (selErr) throw selErr;
    if (existing) {
      const { error: updErr } = await supabase
        .from('cart_items')
        .update({ qty: existing.qty + 1 })
        .eq('id', existing.id);
      if (updErr) throw updErr;
    } else {
      const { error: insErr } = await supabase
        .from('cart_items')
        .insert({ temp_user_id: tempUserId(), product_id: id, qty: 1 });
      if (insErr) throw insErr;
    }
  } catch {
    // フォールバック: メモリ (ローカル学習用)
    addToCart(id);
  }
  revalidatePath('/products');
  revalidatePath('/orders');
}

export async function placeOrderAction() {
  const supabase = await createClient();
  try {
    // カート取得 + 商品価格
    const { data: cartItems, error: cartErr } = await supabase
      .from('cart_items')
      .select('id, product_id, qty, products(price)')
      .eq('temp_user_id', tempUserId());
    if (cartErr) throw cartErr;
    if (!cartItems || cartItems.length === 0) {
      redirect('/orders?empty=1');
      return;
    }
    const { data: order, error: ordErr } = await supabase
      .from('orders')
      .insert({ temp_user_id: tempUserId() })
      .select('id')
      .single();
    if (ordErr) throw ordErr;
    type CartRow = { id: string; product_id: string; qty: number; products: { price: number } | null };
    const orderItems = (cartItems as unknown as CartRow[]).map((c) => ({
      order_id: order.id,
      product_id: c.product_id,
      qty: c.qty,
      price_at_order: c.products?.price ?? 0,
    }));
    const { error: oiErr } = await supabase.from('order_items').insert(orderItems);
    if (oiErr) throw oiErr;
    // カート削除
    await supabase.from('cart_items').delete().eq('temp_user_id', tempUserId());
    revalidatePath('/orders');
    revalidatePath('/products');
    redirect(`/orders?placed=${order.id}`);
  } catch {
    // フォールバック: メモリ
    const order = placeOrder();
    revalidatePath('/orders');
    revalidatePath('/products');
    if (order) redirect(`/orders?placed=${order.id}`);
    else redirect('/orders?empty=1');
  }
}
