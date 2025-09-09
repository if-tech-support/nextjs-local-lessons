'use server';
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
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, qty')
    .eq('temp_user_id', tempUserId())
    .eq('product_id', id)
    .maybeSingle();
  if (existing) {
    await supabase
      .from('cart_items')
      .update({ qty: existing.qty + 1 })
      .eq('id', existing.id);
  } else {
    await supabase.from('cart_items').insert({ temp_user_id: tempUserId(), product_id: id, qty: 1 });
  }
  revalidatePath('/products');
  revalidatePath('/orders');
  revalidatePath('/cart');
}

export async function placeOrderAction() {
  const supabase = await createClient();
  try {
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('id, product_id, qty, products(price)')
      .eq('temp_user_id', tempUserId());
    if (!cartItems || cartItems.length === 0) {
      redirect('/orders?empty=1');
    }
    const { data: order } = await supabase.from('orders').insert({ temp_user_id: tempUserId() }).select('id').single();
    if (!order) {
      revalidatePath('/cart');
      revalidatePath('/products');
      revalidatePath('/orders');
      return;
    }
    type CartRow = { id: string; product_id: string; qty: number; products: { price: number } | null };
    const orderItems = (cartItems as unknown as CartRow[]).map((c) => ({
      order_id: order.id,
      product_id: c.product_id,
      qty: c.qty,
      price_at_order: c.products?.price ?? 0,
    }));
    await supabase.from('order_items').insert(orderItems);
    await supabase.from('cart_items').delete().eq('temp_user_id', tempUserId());
    revalidatePath('/orders');
    revalidatePath('/products');
    revalidatePath('/cart');
    redirect(`/orders?placed=${order.id}`);
  } finally {
    // 失敗時も最新化 (失敗で redirect されない場合に備える)
    revalidatePath('/orders');
    revalidatePath('/products');
    revalidatePath('/cart');
  }
}

// ---------- Cart CRUD ----------
export async function updateCartItemAction(formData: FormData) {
  const id = String(formData.get('id') || ''); // cart_item id
  const qty = Number(formData.get('qty')) || 0;
  if (!id) return;
  const supabase = await createClient();
  if (qty <= 0) {
    await supabase.from('cart_items').delete().eq('id', id);
  } else {
    await supabase.from('cart_items').update({ qty }).eq('id', id);
  }
  revalidatePath('/cart');
  revalidatePath('/products');
  revalidatePath('/orders');
}

export async function removeCartItemAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) return;
  const supabase = await createClient();
  await supabase.from('cart_items').delete().eq('id', id);
  revalidatePath('/cart');
  revalidatePath('/products');
  revalidatePath('/orders');
}

// ---------- Order CRUD (Delete) ----------
export async function deleteOrderAction(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) return;
  const supabase = await createClient();
  // 所有チェック: temp_user_id も条件に含める
  await supabase.from('orders').delete().eq('id', id).eq('temp_user_id', tempUserId());
  revalidatePath('/orders');
}
