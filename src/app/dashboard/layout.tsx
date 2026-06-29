import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar/sidebar";
import type { Space, SpaceGroup } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Grup ve space'leri sıralı çek (RLS sadece kendi satırlarını döndürür).
  const [{ data: groups }, { data: spaces }, { data: profile }] = await Promise.all([
    supabase.from("space_groups").select("*").order("sort_order"),
    supabase.from("spaces").select("*").order("sort_order"),
    supabase.from("profiles").select("display_name").eq("id", user.id).single(),
  ]);

  return (
    <div className="flex min-h-full flex-1">
      <Sidebar
        groups={(groups ?? []) as SpaceGroup[]}
        spaces={(spaces ?? []) as Space[]}
        displayName={profile?.display_name || user.email || "Kullanıcı"}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
