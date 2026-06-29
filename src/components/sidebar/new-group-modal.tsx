"use client";

import { useState, useTransition } from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGroup } from "@/app/dashboard/actions";

// "Yeni Grup" formu: sadece isim.
export function NewGroupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  function submit() {
    if (!name.trim()) return;
    start(async () => {
      await createGroup(name.trim());
      setName("");
      onClose();
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Yeni Grup">
      <div className="flex flex-col gap-4">
        <div>
          <Label>İsim</Label>
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="örn. Üniversite"
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <div className="flex justify-end gap-2">
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
