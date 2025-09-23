"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthFormData, AuthError } from "@/types/auth";
import { translateErrorMessage } from "@/lib/error-messages";

export async function signUp(
  formData: AuthFormData
): Promise<AuthError | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUpAction(
  formData: FormData
): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signIn(
  formData: AuthFormData
): Promise<AuthError | null> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signInAction(
  formData: FormData
): Promise<AuthError | null> {
  const data: AuthFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { message: translateErrorMessage(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}
