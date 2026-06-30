import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types";

// Not okuma sorguları. RLS sadece kullanıcının kendi satırlarını döndürür.
// Mutasyonlar için: src/app/dashboard/notes-actions.ts

// Bir Space'in notları (en son güncellenen üstte).
export async function getSpaceNotes(spaceId: string): Promise<Note[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("space_id", spaceId)
    .order("updated_at", { ascending: false });
  return (data ?? []) as Note[];
}

// En son düzenlenen notlar (tüm space'ler) — dashboard "Son Notlar" kutusu.
export type NoteWithSpace = Note & {
  spaces: { name: string; icon: string; color: string } | null;
};

export async function getRecentNotes(limit = 5): Promise<NoteWithSpace[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notes")
    .select("*, spaces(name, icon, color)")
    .order("updated_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as NoteWithSpace[];
}
