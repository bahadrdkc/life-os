"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SpaceType } from "@/lib/types";

// Oturumlu kullanıcıyı döndürür; yoksa hata atar (RLS zaten korur, bu ek güvenlik).
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  return { supabase, user };
}

// ---- Gruplar ----------------------------------------------------------------

export async function createGroup(name: string) {
  const { supabase, user } = await requireUser();
  const { count } = await supabase
    .from("space_groups")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  await supabase.from("space_groups").insert({
    user_id: user.id,
    name,
    sort_order: count ?? 0,
  });
  revalidatePath("/dashboard");
}

export async function renameGroup(id: string, name: string) {
  const { supabase } = await requireUser();
  await supabase.from("space_groups").update({ name }).eq("id", id);
  revalidatePath("/dashboard");
}

export async function deleteGroup(id: string) {
  const { supabase } = await requireUser();
  // Gruptaki space'ler bağımsız kalsın (group_id null -> ON DELETE SET NULL).
  await supabase.from("space_groups").delete().eq("id", id);
  revalidatePath("/dashboard");
}

export async function toggleGroupCollapsed(id: string, value: boolean) {
  const { supabase } = await requireUser();
  await supabase.from("space_groups").update({ is_collapsed: value }).eq("id", id);
  revalidatePath("/dashboard");
}

// ---- Space'ler --------------------------------------------------------------

export async function createSpace(input: {
  name: string;
  type: SpaceType;
  color: string;
  icon: string;
  group_id: string | null;
}) {
  const { supabase, user } = await requireUser();
  const { count } = await supabase
    .from("spaces")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  await supabase.from("spaces").insert({
    user_id: user.id,
    name: input.name,
    type: input.type,
    color: input.color,
    icon: input.icon,
    group_id: input.group_id,
    sort_order: count ?? 0,
  });
  revalidatePath("/dashboard");
}

export async function renameSpace(id: string, name: string) {
  const { supabase } = await requireUser();
  await supabase.from("spaces").update({ name }).eq("id", id);
  revalidatePath("/dashboard");
}

export async function deleteSpace(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("spaces").delete().eq("id", id);
  revalidatePath("/dashboard");
}

// ---- Sıralama (ok-buton ile) ------------------------------------------------
// İki kaydın sort_order değerini takas eder. İskelet için yeterince basit.

export async function swapGroupOrder(
  a: { id: string; sort_order: number },
  b: { id: string; sort_order: number },
) {
  const { supabase } = await requireUser();
  await Promise.all([
    supabase.from("space_groups").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("space_groups").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath("/dashboard");
}

export async function swapSpaceOrder(
  a: { id: string; sort_order: number },
  b: { id: string; sort_order: number },
) {
  const { supabase } = await requireUser();
  await Promise.all([
    supabase.from("spaces").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("spaces").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath("/dashboard");
}
