"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Giriş. Hatayı query string ile geri döner.
export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

// Kayıt. display_name meta'ya yazılır; profiles trigger ile otomatik oluşur.
export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  // E-posta onayı kapalıysa oturum hemen açılır; açıksa bilgilendirme göster.
  redirect("/login?message=" + encodeURIComponent("Hesap oluşturuldu. Giriş yapabilirsin."));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
