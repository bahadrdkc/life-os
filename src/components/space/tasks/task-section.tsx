"use client";

import { useMemo, useState, useTransition } from "react";
import type { Task } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TaskItem } from "./task-item";
import { AddTask } from "./add-task";
import { renameHeading } from "@/app/dashboard/tasks-actions";

interface Props {
  spaceId: string;
  tasks: Task[];
}

const GENERAL = "__general__"; // başlıksız görevler için iç anahtar

// Görevler bölümü: başlıklara (parent_heading) göre gruplar.
// Başlıksızlar "Genel" altında. "+ Başlık" ile yeni başlık eklenir.
export function TaskSection({ spaceId, tasks }: Props) {
  // Boş (henüz görevi olmayan) yerel başlıklar — ilk görev eklenince kalıcı olur.
  const [extraHeadings, setExtraHeadings] = useState<string[]>([]);

  const groups = useMemo(() => {
    const map = new Map<string, Task[]>();
    map.set(GENERAL, []);
    for (const t of tasks) {
      const key = t.parent_heading ?? GENERAL;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    for (const h of extraHeadings) if (!map.has(h)) map.set(h, []);
    return map;
  }, [tasks, extraHeadings]);

  function addHeading() {
    const name = prompt("Başlık adı:");
    if (name && name.trim()) setExtraHeadings((h) => [...h, name.trim()]);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Görevler</h2>
        <Button size="sm" variant="ghost" onClick={addHeading}>
          + Başlık
        </Button>
      </div>

      <div className="space-y-4">
        {[...groups.entries()].map(([heading, items]) => (
          <HeadingGroup
            key={heading}
            spaceId={spaceId}
            heading={heading}
            items={items}
          />
        ))}
      </div>
    </section>
  );
}

function HeadingGroup({
  spaceId,
  heading,
  items,
}: {
  spaceId: string;
  heading: string;
  items: Task[];
}) {
  const [pending, start] = useTransition();
  const isGeneral = heading === GENERAL;
  const realHeading = isGeneral ? null : heading;

  function rename() {
    if (isGeneral) return;
    const name = prompt("Başlık adı:", heading);
    if (name && name.trim() && name !== heading) {
      start(() => renameHeading(spaceId, heading, name.trim()));
    }
  }

  return (
    <div>
      <div className="group mb-1 flex items-center gap-2 px-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {isGeneral ? "Genel" : heading}
        </h3>
        {!isGeneral && (
          <button
            onClick={rename}
            disabled={pending}
            className="text-xs text-muted opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            title="Başlığı yeniden adlandır"
          >
            ✎
          </button>
        )}
      </div>

      <div className="space-y-0.5">
        {items.map((t, i) => (
          <TaskItem key={t.id} task={t} prev={items[i - 1]} next={items[i + 1]} />
        ))}
      </div>

      <AddTask spaceId={spaceId} heading={realHeading} />
    </div>
  );
}
