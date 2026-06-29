"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Koyu/açık mod toggle. Hydration uyumsuzluğunu önlemek için mount sonrası render.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Temayı değiştir"
      title="Temayı değiştir"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (isDark ? "☀️" : "🌙") : "🌓"}
    </Button>
  );
}
