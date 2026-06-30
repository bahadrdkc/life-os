"use client";

import { useState, useTransition } from "react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PRIORITIES } from "@/lib/priority";
import { createTask } from "@/app/dashboard/tasks-actions";

interface Props {
  spaceId: string;
  heading: string | null; // bu görev hangi başlık altına eklenecek
}

// Tek satır görev ekleme. Genişletilince son tarih + öncelik alanları açılır.
export function AddTask({ spaceId, heading }: Props) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [pending, start] = useTransition();

  function submit() {
    if (!title.trim()) return;
    start(async () => {
      await createTask({
        space_id: spaceId,
        title: title.trim(),
        due_date: due || null,
        priority,
        parent_heading: heading,
      });
      setTitle("");
      setDue("");
      setPriority(0);
      setExpanded(false);
    });
  }

  return (
    <div className="flex flex-col gap-2 px-2 py-1">
      <div className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="+ Görev ekle"
          className="flex-1"
        />
        <Button onClick={submit} disabled={pending || !title.trim()} size="md">
          Ekle
        </Button>
      </div>
      {expanded && (
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
      )}
    </div>
  );
}
