import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary:
    "border border-border bg-card text-foreground hover:bg-border/40",
  ghost: "text-foreground hover:bg-border/40",
  danger: "text-red-500 hover:bg-red-500/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  icon: "h-8 w-8 rounded-md justify-center",
};

// Yeniden kullanılabilir buton. variant + size ile çeşitlenir.
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
