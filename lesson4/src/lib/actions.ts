'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AuthFormData, AuthError } from '@/types/auth';

export async function signUp(formData: FormData): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signIn(formData: FormData): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
