"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SPACE_TYPES, type SpaceType, type SpaceGroup } from "@/lib/types";
import { SPACE_COLORS, SPACE_ICONS } from "@/lib/space-options";
import { createSpace } from "@/app/dashboard/actions";

interface Props {
  open: boolean;
  onClose: () => void;
  groups: SpaceGroup[];
  defaultGroupId?: string | null;
}

// "Yeni Space" formu: isim, tip, renk, ikon, opsiyonel grup.
export function NewSpaceModal({ open, onClose, groups, defaultGroupId }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<SpaceType>("standard");
  const [color, setColor] = useState(SPACE_COLORS[0]);
  const [icon, setIcon] = useState(SPACE_ICONS[0]);
  const [groupId, setGroupId] = useState<string>(defaultGroupId ?? "");
  const [pending, start] = useTransition();

  function submit() {
    if (!name.trim()) return;
    start(async () => {
      await createSpace({
        name: name.trim(),
        type,
        color,
        icon,
        group_id: groupId || null,
      });
      setName("");
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni Space">
      <div className="flex flex-col gap-4">
        <div>
          <Label>İsim</Label>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="örn. Spor Günlüğü"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        <div>
          <Label>Tip</Label>
          <Select value={type} onChange={(e) => setType(e.target.value as SpaceType)}>
            {SPACE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Grup (opsiyonel)</Label>
          <Select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
            <option value="">— Bağımsız —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Renk</Label>
          <div className="flex flex-wrap gap-2">
            {SPACE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                onClick={() => setColor(c)}
                className={cn(
                  "h-7 w-7 rounded-full border-2 transition-transform",
                  color === c ? "scale-110 border-foreground" : "border-transparent",
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>İkon</Label>
          <div className="flex flex-wrap gap-1.5">
            {SPACE_ICONS.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIcon(i)}
                className={cn(
                  "h-8 w-8 rounded-md text-lg transition-colors",
                  icon === i ? "bg-accent/20 ring-1 ring-accent" : "hover:bg-border/40",
                )}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={submit} disabled={pending || !name.trim()}>
            {pending ? "Ekleniyor…" : "Oluştur"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
