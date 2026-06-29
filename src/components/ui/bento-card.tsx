import { cn } from "@/lib/cn";

interface Props {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

// Bento dashboard kutusu. İçi şimdilik placeholder; Aşama 2'de doldurulacak.
export function BentoCard({ title, className, children }: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        className,
      )}
    >
      <h2 className="mb-3 text-sm font-semibold text-foreground">{title}</h2>
      {children ?? (
        <p className="text-sm text-muted">Yakında…</p>
      )}
    </section>
  );
}
