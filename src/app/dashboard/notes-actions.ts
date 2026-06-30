"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Not mutasyonları + Hızlı Yakala. Okuma için: src/lib/notes.ts

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  return { supabase, user };
}

export async function createNote(input: {
  space_id: string;
  title: string;
  content?: string;
}) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      space_id: input.space_id,
      title: input.title,
      content: input.content ?? "",
    })
    .select("id")
    .single();
  revalidatePath(`/dashboard/space/${input.space_id}`);
  revalidatePath("/dashboard");
  return data?.id as string | undefined;
}

export async function updateNote(
  id: string,
  spaceId: string,
  patch: { title?: string; content?: string },
) {
  const { supabase } = await requireUser();
  await supabase.from("notes").update(patch).eq("id", id);
  revalidatePath(`/dashboard/space/${spaceId}`);
  revalidatePath("/dashboard");
}

export async function deleteNote(id: string, spaceId: string) {
  const { supabase } = await requireUser();
  await supabase.from("notes").delete().eq("id", id);
  revalidatePath(`/dashboard/space/${spaceId}`);
  revalidatePath("/dashboard");
}

// "Gelen Kutusu" space'ini bulur, yoksa oluşturur (basit inbox).
async function getOrCreateInbox() {
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase
    .from("spaces")
    .select("id")
    .eq("user_id", user.id)
    .eq("name", "Gelen Kutusu")
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id as string;

  const { data: created } = await supabase
    .from("spaces")
    .insert({
      user_id: user.id,
      name: "Gelen Kutusu",
      type: "standard",
      color: "#64748b",
      icon: "📥",
      sort_order: 0,
    })
    .select("id")
    .single();
  return created!.id as string;
}

// Hızlı Yakala: metni nota çevirir. Space seçilmezse Gelen Kutusu'na düşer.
// Başlık = ilk satır (kısaltılmış), içerik = tam metin.
export async function quickCapture(text: string, spaceId?: string | null) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const targetSpace = spaceId || (await getOrCreateInbox());
  const firstLine = trimmed.split("\n")[0];
  const title = firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine;
  await createNote({ space_id: targetSpace, title, content: trimmed });
}
