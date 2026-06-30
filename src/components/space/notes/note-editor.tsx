"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { cn } from "@/lib/cn";
import type { Note } from "@/lib/types";
import { createNote, updateNote, deleteNote } from "@/app/dashboard/notes-actions";

interface Props {
  open: boolean;
  onClose: () => void;
  spaceId: string;
  note?: Note | null; // verilirse düzenleme, yoksa yeni
}

// Not oluştur/düzenle modalı. Yaz / Önizle sekmeleri (markdown).
export function NoteEditor({ open, onClose, spaceId, note }: Props) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [preview, setPreview] = useState(false);
  const [pending, start] = useTransition();

  function save() {
    if (!title.trim() && !content.trim()) return;
    start(async () => {
      if (note) {
        await updateNote(note.id, spaceId, { title: title.trim() || "Başlıksız", content });
      } else {
        await createNote({ space_id: spaceId, title: title.trim() || "Başlıksız", content });
      }
      onClose();
    });
  }

  function remove() {
    if (note && confirm("Not silinsin mi?")) {
      start(async () => {
        await deleteNote(note.id, spaceId);
        onClose();
      });
    }
  }

  const tab = "rounded-md px-3 py-1 text-sm font-medium transition-colors";

  return (
    <Modal open={open} onClose={onClose} title={note ? "Notu düzenle" : "Yeni not"}>
      <div className="flex flex-col gap-3">
        <div>
          <Label>Başlık</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Not başlığı"
            autoFocus
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label>İçerik (markdown)</Label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPreview(false)}
                className={cn(tab, !preview ? "bg-border text-foreground" : "text-muted")}
              >
                Yaz
              </button>
              <button
                type="button"
                onClick={() => setPreview(true)}
                className={cn(tab, preview ? "bg-border text-foreground" : "text-muted")}
              >
                Önizle
              </button>
            </div>
          </div>

          {preview ? (
            <div className="min-h-40 rounded-lg border border-border bg-background p-3">
              {content.trim() ? (
                <Markdown>{content}</Markdown>
              ) : (
                <p className="text-sm text-muted">Önizlenecek içerik yok.</p>
              )}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Başlık&#10;- madde&#10;**kalın** metin…"
              className="min-h-40 w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground outline-none focus:border-accent"
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {note && (
              <Button variant="danger" size="sm" onClick={remove} disabled={pending}>
                Sil
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              İptal
            </Button>
            <Button onClick={save} disabled={pending}>
              {pending ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
