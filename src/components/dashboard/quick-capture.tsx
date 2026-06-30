"use client";

import { useState, useTransition } from "react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Space } from "@/lib/types";
import { quickCapture } from "@/app/dashboard/notes-actions";

// Hızlı Yakala: metni nota çevirir. Space seçilmezse "Gelen Kutusu"na düşer.
export function QuickCapture({ spaces }: { spaces: Space[] }) {
  const [text, setText] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  function submit() {
    if (!text.trim()) return;
    start(async () => {
      await quickCapture(text, spaceId || null);
      setText("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Aklındakini yaz…"
        className="min-h-20 w-full resize-none rounded-lg border border-border bg-background p-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <div className="flex gap-2">
        <Select value={spaceId} onChange={(e) => setSpaceId(e.target.value)} className="flex-1">
          <option value="">📥 Gelen Kutusu</option>
          {spaces.map((s) => (
            <option key={s.id} value={s.id}>
              {s.icon} {s.name}
            </option>
          ))}
        </Select>
        <Button onClick={submit} disabled={pending || !text.trim()}>
          {pending ? "…" : saved ? "✓" : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}
