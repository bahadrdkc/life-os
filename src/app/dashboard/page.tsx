import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BentoCard } from "@/components/ui/bento-card";
import type { Space } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: spaces } = await supabase
    .from("spaces")
    .select("*")
    .order("sort_order");

  const list = (spaces ?? []) as Space[];

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Panel</h1>

      {/* Bento grid — placeholder kutular. İçerik Aşama 2'de. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BentoCard title="Bugün" className="lg:col-span-2" />
        <BentoCard title="Hızlı Yakala" />
        <BentoCard title="Son Notlar" />

        <BentoCard title="Alanlarım" className="sm:col-span-2">
          {list.length === 0 ? (
            <p className="text-sm text-muted">
              Henüz alan yok. Sol menüden “+ Space” ile oluştur.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {list.map((s) => (
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
                  <span className="truncate text-sm font-medium text-foreground">
                    {s.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
    </div>
  );
}
