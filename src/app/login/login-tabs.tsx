import Link from "next/link";
import { cn } from "@/lib/cn";

// Giriş / Kayıt sekmeleri — URL ?mode ile durum tutar (server tarafı render).
export function LoginTabs({ isSignup }: { isSignup: boolean }) {
  const tab = "flex-1 rounded-md py-1.5 text-center text-sm font-medium transition-colors";
  return (
    <div className="mb-4 flex gap-1 rounded-lg border border-border bg-background p-1">
      <Link
        href="/login"
        className={cn(tab, !isSignup ? "bg-card text-foreground shadow-sm" : "text-muted")}
      >
        Giriş
      </Link>
      <Link
        href="/login?mode=signup"
        className={cn(tab, isSignup ? "bg-card text-foreground shadow-sm" : "text-muted")}
      >
        Kayıt
      </Link>
    </div>
  );
}
