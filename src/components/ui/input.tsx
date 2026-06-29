import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const base =
  "h-10 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-accent transition-colors";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(base, className)} {...props} />;
}

export function Select({
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(base, "cursor-pointer", className)} {...props} />;
}

export function Label({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-muted">
      {children}
    </label>
  );
}
