import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SPACE_TYPES, type Space } from "@/lib/types";

export default async function SpacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS sayesinde sadece kullanıcının kendi space'i döner.
  const { data } = await supabase.from("spaces").select("*").eq("id", id).single();
  if (!data) notFound();

  const space = data as Space;
  const typeLabel = SPACE_TYPES.find((t) => t.value === space.type)?.label ?? space.type;

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

      {/* İçerik Aşama 2'de tipe göre doldurulacak (tracker / kanban / language…). */}
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-foreground">
          Bu bir <span className="font-semibold">{typeLabel}</span> alanı.
        </p>
        <p className="mt-1 text-sm text-muted">İçerik yakında eklenecek.</p>
      </div>
    </div>
  );
}
