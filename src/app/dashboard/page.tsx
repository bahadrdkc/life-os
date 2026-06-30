import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BentoCard } from "@/components/ui/bento-card";
import { QuickCapture } from "@/components/dashboard/quick-capture";
import { getTodayTasks, getUndatedTasks } from "@/lib/tasks";
import { getRecentNotes } from "@/lib/notes";
import { formatDateTime } from "@/lib/format";
import { priorityMeta } from "@/lib/priority";
import type { Space } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Tüm panel verisini paralel çek.
  const [{ data: spacesData }, todayTasks, undatedTasks, recentNotes] = await Promise.all([
    supabase.from("spaces").select("*").order("sort_order"),
    getTodayTasks(),
    getUndatedTasks(),
    getRecentNotes(5),
  ]);
  const spaces = (spacesData ?? []) as Space[];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Panel</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Bugün */}
        <BentoCard title="Bugün" className="lg:col-span-2">
          {todayTasks.length === 0 ? (
            <p className="text-sm text-muted">Bugün için görev yok 🎉</p>
          ) : (
            <ul className="space-y-1.5">
              {todayTasks.map((t) => {
                const pr = priorityMeta(t.priority);
                return (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: t.spaces?.color ?? "#888" }} />
                    <span className="truncate text-foreground">{t.title}</span>
                    {t.spaces && (
                      <span className="shrink-0 text-xs text-muted">
                        {t.spaces.icon} {t.spaces.name}
                      </span>
                    )}
                    {t.priority > 0 && (
                      <span className="shrink-0 text-xs" style={{ color: pr.color }}>●</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </BentoCard>

        {/* Hızlı Yakala */}
        <BentoCard title="Hızlı Yakala">
          <QuickCapture spaces={spaces} />
        </BentoCard>

        {/* Tarihsiz / Genel — son tarihi olmayan, tamamlanmamış görevler */}
        <BentoCard title="Tarihsiz / Genel" className="lg:col-span-2">
          {undatedTasks.length === 0 ? (
            <p className="text-sm text-muted">Tarihsiz görev yok.</p>
          ) : (
            <ul className="space-y-1.5">
              {undatedTasks.map((t) => {
                const pr = priorityMeta(t.priority);
                return (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: t.spaces?.color ?? "#888" }} />
                    <span className="truncate text-foreground">{t.title}</span>
                    {t.spaces && (
                      <span className="shrink-0 text-xs text-muted">
                        {t.spaces.icon} {t.spaces.name}
                      </span>
                    )}
                    {t.priority > 0 && (
                      <span className="shrink-0 text-xs" style={{ color: pr.color }}>●</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </BentoCard>

        {/* Son Notlar */}
        <BentoCard title="Son Notlar">
          {recentNotes.length === 0 ? (
            <p className="text-sm text-muted">Henüz not yok.</p>
          ) : (
            <ul className="space-y-1">
              {recentNotes.map((n) => (
                <li key={n.id}>
                  <Link
                    href={`/dashboard/space/${n.space_id}?note=${n.id}`}
                    className="flex flex-col rounded-lg px-2 py-1 hover:bg-border/40"
                  >
                    <span className="line-clamp-1 text-sm font-medium text-foreground">
                      {n.spaces?.icon} {n.title || "Başlıksız"}
                    </span>
                    <span className="text-xs text-muted">{formatDateTime(n.updated_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </BentoCard>

        {/* Alanlarım */}
        <BentoCard title="Alanlarım" className="sm:col-span-2 lg:col-span-3">
          {spaces.length === 0 ? (
            <p className="text-sm text-muted">
              Henüz alan yok. Sol menüden “+ Space” ile oluştur.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {spaces.map((s) => (
                <Link
                  key={s.id}
                  href={`/dashboard/space/${s.id}`}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 transition-colors hover:border-accent"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg"
                    style={{ backgroundColor: `${s.color}22` }}
                  >
                    {s.icon}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">{s.name}</span>
                </Link>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
    </div>
  );
}
