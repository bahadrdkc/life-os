"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/cn";
import { priorityMeta, PRIORITIES } from "@/lib/priority";
import type { Task } from "@/lib/types";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  toggleTask,
  deleteTask,
  updateTask,
  swapTaskOrder,
} from "@/app/dashboard/tasks-actions";

interface Props {
  task: Task;
  prev?: Task; // aynı başlık altındaki bir üst görev
  next?: Task; // aynı başlık altındaki bir alt görev
}

// Tek görev satırı: checkbox, başlık, son tarih + öncelik rozeti,
// inline düzenleme, ↑/↓ sıralama, sil.
export function TaskItem({ task, prev, next }: Props) {
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [due, setDue] = useState(task.due_date ?? "");
  const [priority, setPriority] = useState(task.priority);

  const pr = priorityMeta(task.priority);

  function saveEdit() {
    start(async () => {
      await updateTask(task.id, task.space_id, {
        title: title.trim() || task.title,
        due_date: due || null,
        priority,
      });
      setEditing(false);
    });
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <div className="flex gap-2">
          <Input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="flex-1"
          />
          <Select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="flex-1"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
            İptal
          </Button>
          <Button size="sm" onClick={saveEdit} disabled={pending}>
            Kaydet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-border/30">
      <input
        type="checkbox"
        checked={task.is_done}
        onChange={() => start(() => toggleTask(task.id, task.space_id, !task.is_done))}
        className="h-4 w-4 shrink-0 cursor-pointer accent-[var(--accent)]"
      />

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "text-sm",
            task.is_done ? "text-muted line-through" : "text-foreground",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="text-xs text-muted">📅 {task.due_date}</span>
          )}
          {task.priority > 0 && (
            <span className="text-xs font-medium" style={{ color: pr.color }}>
              ● {pr.label}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
        <button
          title="Yukarı"
          disabled={!prev || pending}
          onClick={() => prev && start(() => swapTaskOrder(task.space_id, task, prev))}
          className="px-1 text-muted hover:text-foreground disabled:opacity-30"
        >
          ↑
        </button>
        <button
          title="Aşağı"
          disabled={!next || pending}
          onClick={() => next && start(() => swapTaskOrder(task.space_id, task, next))}
          className="px-1 text-muted hover:text-foreground disabled:opacity-30"
        >
          ↓
        </button>
        <button
          title="Düzenle"
          onClick={() => setEditing(true)}
          className="px-1 text-muted hover:text-foreground"
        >
          ✎
        </button>
        <button
          title="Sil"
          onClick={() => {
            if (confirm("Görev silinsin mi?")) start(() => deleteTask(task.id, task.space_id));
          }}
          className="px-1 text-muted hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
