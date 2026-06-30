"use client";

import { useState } from "react";
import type { Note } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { NoteEditor } from "./note-editor";

interface Props {
  spaceId: string;
  notes: Note[];
  openNoteId?: string; // dashboard "Son Notlar" linkinden gelince otomatik açılır
}

// Notlar bölümü: liste + "+ Not". Bir nota tıklayınca editör modalı açılır.
export function NoteSection({ spaceId, notes, openNoteId }: Props) {
  const initial = openNoteId ? notes.find((n) => n.id === openNoteId) ?? null : null;
  const [editing, setEditing] = useState<Note | null>(initial);
  const [creating, setCreating] = useState(false);

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Notlar</h2>
        <Button size="sm" variant="ghost" onClick={() => setCreating(true)}>
          + Not
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="px-2 py-4 text-center text-xs text-muted">Henüz not yok.</p>
      ) : (
        <div className="space-y-1">
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => setEditing(n)}
              className="flex w-full flex-col items-start gap-0.5 rounded-lg px-2 py-1.5 text-left hover:bg-border/30"
            >
              <span className="line-clamp-1 text-sm font-medium text-foreground">
                {n.title || "Başlıksız"}
              </span>
              <span className="text-xs text-muted">
                {formatDateTime(n.updated_at)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Yeni not */}
      <NoteEditor
        open={creating}
        onClose={() => setCreating(false)}
        spaceId={spaceId}
      />
      {/* Düzenleme */}
      <NoteEditor
        key={editing?.id}
        open={!!editing}
        onClose={() => setEditing(null)}
        spaceId={spaceId}
        note={editing}
      />
    </section>
  );
}
