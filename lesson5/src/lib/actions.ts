'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// テストユーザー識別 (本来は認証セッション利用)。
function tempUserId() {
  return 'demo-user';
}

export async function addToCartAction(formData: FormData) {
  try {
    const id = formData.get('id');
    if (typeof id !== 'string') return;
    const supabase = await createClient();
    const { data: existing, error } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('temp_user_id', tempUserId())
      .eq('product_id', id)
      .maybeSingle();
    if (error) throw error;

    if (existing) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('cart_items')
        .insert({ temp_user_id: tempUserId(), product_id: id, quantity: 1 });
      if (error) throw error;
    }
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath('/products');
    revalidatePath('/orders');
    revalidatePath('/cart');
  }
}

export async function placeOrderAction() {
  const supabase = await createClient();
  try {
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(price)')
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
    type CartRow = { id: string; product_id: string; quantity: number; products: { price: number } | null };
    const orderItems = (cartItems as unknown as CartRow[]).map((c) => ({
      order_id: order.id,
      product_id: c.product_id,
      quantity: c.quantity,
      price_at_order: c.products?.price ?? 0,
    }));
    await supabase.from('order_items').insert(orderItems);
    await supabase.from('cart_items').delete().eq('temp_user_id', tempUserId());
    revalidatePath('/orders');
    revalidatePath('/products');
    revalidatePath('/cart');
    redirect(`/orders?placed=${order.id}`);
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath('/orders');
    revalidatePath('/products');
    revalidatePath('/cart');
  }
}

export async function updateCartItemAction(formData: FormData) {
  try {
    const id = String(formData.get('id') || '');
    const quantity = Number(formData.get('quantity')) || 0;
    if (!id) return;
    const supabase = await createClient();
    if (quantity <= 0) {
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
      if (error) throw error;
    }
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath('/cart');
    revalidatePath('/products');
    revalidatePath('/orders');
  }
}

export async function removeCartItemAction(formData: FormData) {
  try {
    const id = String(formData.get('id') || '');
    if (!id) return;
    const supabase = await createClient();
    const { error } = await supabase.from('cart_items').delete().eq('id', id);
    if (error) throw error;
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath('/cart');
    revalidatePath('/products');
    revalidatePath('/orders');
  }
}

export async function deleteOrderAction(formData: FormData) {
  try {
    const id = String(formData.get('id') || '');
    if (!id) return;
    const supabase = await createClient();
    const { error } = await supabase.from('orders').delete().eq('id', id).eq('temp_user_id', tempUserId());
    if (error) throw error;
  } catch (e) {
    console.error(e);
  } finally {
    revalidatePath('/orders');
  }
}
