import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SPACE_TYPES, type Space } from "@/lib/types";
import { getSpaceTasks } from "@/lib/tasks";
import { getSpaceNotes } from "@/lib/notes";
import { SpaceView } from "@/components/space/space-view";

export default async function SpacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ note?: string }>;
}) {
  const { id } = await params;
  const { note: openNoteId } = await searchParams;
  const supabase = await createClient();

  // RLS sayesinde sadece kullanıcının kendi space'i döner.
  const { data } = await supabase.from("spaces").select("*").eq("id", id).single();
  if (!data) notFound();

  const space = data as Space;
  const typeLabel = SPACE_TYPES.find((t) => t.value === space.type)?.label ?? space.type;

  // Görev + notları paralel çek, tipe göre doğru view'e ver.
  const [tasks, notes] = await Promise.all([getSpaceTasks(id), getSpaceNotes(id)]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${space.color}22` }}
        >
          {space.icon}
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{space.name}</h1>
          <p className="text-sm text-muted">{typeLabel} alanı</p>
        </div>
      </div>

      <SpaceView space={space} tasks={tasks} notes={notes} openNoteId={openNoteId} />
    </div>
  );
}
