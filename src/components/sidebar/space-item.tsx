"use client";

import Link from "next/link";
import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Space } from "@/lib/types";
import { renameSpace, deleteSpace, swapSpaceOrder } from "@/app/dashboard/actions";

interface Props {
  space: Space;
  prev?: Space; // bir üstteki space (yukarı taşıma için)
  next?: Space; // bir alttaki space (aşağı taşıma için)
}

// Tek bir Space satırı: link + yukarı/aşağı sıralama + yeniden adlandır/sil.
export function SpaceItem({ space, prev, next }: Props) {
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const active = pathname === `/dashboard/space/${space.id}`;

  function rename() {
    const name = prompt("Yeni isim:", space.name);
    if (name && name.trim() && name !== space.name) {
      start(() => renameSpace(space.id, name.trim()));
    }
  }

  function remove() {
    if (confirm(`"${space.name}" silinsin mi?`)) {
      start(() => deleteSpace(space.id));
    }
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-lg pr-1 transition-colors",
        active ? "bg-border/60" : "hover:bg-border/40",
      )}
    >
      <Link
        href={`/dashboard/space/${space.id}`}
        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-sm"
      >
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: space.color }}
        />
        <span className="shrink-0">{space.icon}</span>
        <span className="truncate text-foreground">{space.name}</span>
      </Link>

      <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
        <button
          title="Yukarı"
          disabled={!prev || pending}
          onClick={() => prev && start(() => swapSpaceOrder(space, prev))}
          className="px-1 text-muted hover:text-foreground disabled:opacity-30"
        >
          ↑
        </button>
        <button
          title="Aşağı"
          disabled={!next || pending}
          onClick={() => next && start(() => swapSpaceOrder(space, next))}
          className="px-1 text-muted hover:text-foreground disabled:opacity-30"
        >
          ↓
        </button>
        <button
          title="Yeniden adlandır"
          onClick={rename}
          className="px-1 text-muted hover:text-foreground"
        >
          ✎
        </button>
        <button
          title="Sil"
          onClick={remove}
          className="px-1 text-muted hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
