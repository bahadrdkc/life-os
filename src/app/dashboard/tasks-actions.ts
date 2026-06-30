"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Görev mutasyonları. Tüm view'ler (standard/tracker/kanban) bunları kullanır.
// Okuma sorguları için: src/lib/tasks.ts

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  return { supabase, user };
}

export async function createTask(input: {
  space_id: string;
  title: string;
  due_date?: string | null;
  priority?: number;
  parent_heading?: string | null;
}) {
  const { supabase, user } = await requireUser();
  // Yeni görev listenin sonuna eklensin.
  const { count } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("space_id", input.space_id);
  await supabase.from("tasks").insert({
    user_id: user.id,
    space_id: input.space_id,
    title: input.title,
    due_date: input.due_date ?? null,
    priority: input.priority ?? 0,
    parent_heading: input.parent_heading ?? null,
    sort_order: count ?? 0,
  });
  revalidatePath(`/dashboard/space/${input.space_id}`);
  revalidatePath("/dashboard");
}

export async function updateTask(
  id: string,
  spaceId: string,
  patch: {
    title?: string;
    due_date?: string | null;
    priority?: number;
    parent_heading?: string | null;
  },
) {
  const { supabase } = await requireUser();
  await supabase.from("tasks").update(patch).eq("id", id);
  revalidatePath(`/dashboard/space/${spaceId}`);
  revalidatePath("/dashboard");
}

export async function toggleTask(id: string, spaceId: string, isDone: boolean) {
  const { supabase } = await requireUser();
  await supabase.from("tasks").update({ is_done: isDone }).eq("id", id);
  revalidatePath(`/dashboard/space/${spaceId}`);
  revalidatePath("/dashboard");
}

export async function deleteTask(id: string, spaceId: string) {
  const { supabase } = await requireUser();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath(`/dashboard/space/${spaceId}`);
  revalidatePath("/dashboard");
}

// İki görevin sort_order değerini takas eder (↑/↓ ok ile sıralama).
export async function swapTaskOrder(
  spaceId: string,
  a: { id: string; sort_order: number },
  b: { id: string; sort_order: number },
) {
  const { supabase } = await requireUser();
  await Promise.all([
    supabase.from("tasks").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("tasks").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidatePath(`/dashboard/space/${spaceId}`);
}

// Bir başlık (heading) altındaki tüm görevleri yeni başlığa taşır (yeniden adlandırma).
export async function renameHeading(
  spaceId: string,
  oldHeading: string | null,
  newHeading: string | null,
) {
  const { supabase } = await requireUser();
  let q = supabase.from("tasks").update({ parent_heading: newHeading }).eq("space_id", spaceId);
  q = oldHeading === null ? q.is("parent_heading", null) : q.eq("parent_heading", oldHeading);
  await q;
  revalidatePath(`/dashboard/space/${spaceId}`);
}
