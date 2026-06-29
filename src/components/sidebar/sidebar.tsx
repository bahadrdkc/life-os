"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Space, SpaceGroup } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SpaceItem } from "./space-item";
import { NewSpaceModal } from "./new-space-modal";
import { NewGroupModal } from "./new-group-modal";
import { logout } from "@/app/login/actions";
import {
  renameGroup,
  deleteGroup,
  toggleGroupCollapsed,
  swapGroupOrder,
} from "@/app/dashboard/actions";

interface Props {
  groups: SpaceGroup[];
  spaces: Space[];
  displayName: string;
}

export function Sidebar({ groups, spaces, displayName }: Props) {
  const [newSpaceOpen, setNewSpaceOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);

  const independent = spaces.filter((s) => !s.group_id);
  const spacesOf = (groupId: string) => spaces.filter((s) => s.group_id === groupId);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Başlık */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <Link href="/dashboard" className="text-base font-bold text-foreground">
          Life OS
        </Link>
        <ThemeToggle />
      </div>

      {/* Ekleme butonları */}
      <div className="flex gap-2 px-3 pb-2">
        <Button size="sm" className="flex-1 justify-center" onClick={() => setNewSpaceOpen(true)}>
          + Space
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1 justify-center"
          onClick={() => setNewGroupOpen(true)}
        >
          + Grup
        </Button>
      </div>

      {/* Liste */}
      <nav className="flex-1 space-y-3 overflow-auto px-2 py-2">
        {/* Bağımsız space'ler */}
        {independent.length > 0 && (
          <div className="space-y-0.5">
            {independent.map((s, i) => (
              <SpaceItem
                key={s.id}
                space={s}
                prev={independent[i - 1]}
                next={independent[i + 1]}
              />
            ))}
          </div>
        )}

        {/* Gruplar */}
        {groups.map((g, gi) => (
          <GroupSection
            key={g.id}
            group={g}
            prev={groups[gi - 1]}
            next={groups[gi + 1]}
            spaces={spacesOf(g.id)}
          />
        ))}

        {independent.length === 0 && groups.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-muted">
            Henüz space yok. “+ Space” ile başla.
          </p>
        )}
      </nav>

      {/* Alt: kullanıcı + çıkış */}
      <div className="flex items-center justify-between border-t border-border px-3 py-3">
        <span className="truncate text-sm text-muted" title={displayName}>
          {displayName}
        </span>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm">
            Çıkış
          </Button>
        </form>
      </div>

      <NewSpaceModal open={newSpaceOpen} onClose={() => setNewSpaceOpen(false)} groups={groups} />
      <NewGroupModal open={newGroupOpen} onClose={() => setNewGroupOpen(false)} />
    </aside>
  );
}

// Daraltılabilir grup başlığı + içindeki space'ler.
function GroupSection({
  group,
  prev,
  next,
  spaces,
}: {
  group: SpaceGroup;
  prev?: SpaceGroup;
  next?: SpaceGroup;
  spaces: Space[];
}) {
  const [pending, start] = useTransition();
  const collapsed = group.is_collapsed;

  function rename() {
    const name = prompt("Grup adı:", group.name);
    if (name && name.trim() && name !== group.name) {
      start(() => renameGroup(group.id, name.trim()));
    }
  }

  function remove() {
    if (confirm(`"${group.name}" grubu silinsin mi? (İçindeki space'ler bağımsız olur)`)) {
      start(() => deleteGroup(group.id));
    }
  }

  return (
    <div>
      <div className="group flex items-center gap-1 rounded-lg px-1 hover:bg-border/30">
        <button
          onClick={() => start(() => toggleGroupCollapsed(group.id, !collapsed))}
          className="flex min-w-0 flex-1 items-center gap-1 px-1 py-1 text-left"
        >
          <span className={cn("text-xs text-muted transition-transform", collapsed && "-rotate-90")}>
            ▾
          </span>
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-muted">
            {group.name}
          </span>
        </button>

        <div className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100">
          <button
            title="Yukarı"
            disabled={!prev || pending}
            onClick={() => prev && start(() => swapGroupOrder(group, prev))}
            className="px-1 text-muted hover:text-foreground disabled:opacity-30"
          >
            ↑
          </button>
          <button
            title="Aşağı"
            disabled={!next || pending}
            onClick={() => next && start(() => swapGroupOrder(group, next))}
            className="px-1 text-muted hover:text-foreground disabled:opacity-30"
          >
            ↓
          </button>
          <button title="Yeniden adlandır" onClick={rename} className="px-1 text-muted hover:text-foreground">
            ✎
          </button>
          <button title="Sil" onClick={remove} className="px-1 text-muted hover:text-red-500">
            ✕
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="ml-2 mt-0.5 space-y-0.5 border-l border-border pl-1.5">
          {spaces.length === 0 ? (
            <p className="px-2 py-1 text-xs text-muted/70">Boş</p>
          ) : (
            spaces.map((s, i) => (
              <SpaceItem key={s.id} space={s} prev={spaces[i - 1]} next={spaces[i + 1]} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
