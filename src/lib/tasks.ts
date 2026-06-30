import { createClient } from "@/lib/supabase/server";
import type { Task } from "@/lib/types";

// Görev okuma sorguları. RLS sadece kullanıcının kendi satırlarını döndürür.
// Mutasyonlar için: src/app/dashboard/tasks-actions.ts

// Bir Space'in tüm görevleri (heading + sıralamaya göre).
export async function getSpaceTasks(spaceId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .eq("space_id", spaceId)
    .order("sort_order");
  return (data ?? []) as Task[];
}

// Bugün son tarihi olan + tamamlanmamış görevler (tüm space'ler).
// Space adı/ikon/renk ile birlikte döner (dashboard "Bugün" kutusu için).
export type TaskWithSpace = Task & {
  spaces: { name: string; icon: string; color: string } | null;
};

export async function getTodayTasks(): Promise<TaskWithSpace[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { data } = await supabase
    .from("tasks")
    .select("*, spaces(name, icon, color)")
    .eq("due_date", today)
    .eq("is_done", false)
    .order("priority", { ascending: false });
  return (data ?? []) as TaskWithSpace[];
}
