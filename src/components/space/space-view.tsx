import type { Note, Space, Task } from "@/lib/types";
import { StandardView } from "./standard-view";

interface Props {
  space: Space;
  tasks: Task[];
  notes: Note[];
  openNoteId?: string;
}

// Space tipine göre doğru görünümü seçer.
// page.tsx buraya veri verir ve BİR DAHA DOKUNULMAZ.
//
// Paralel çalışma: yeni tip görünümü = yeni dosya + buraya bir case.
//   tracker → components/space/tracker-view.tsx   (arkadaşım/ben ekler)
//   kanban  → components/space/kanban-view.tsx
//   language→ components/space/language-view.tsx
// Hepsi şimdilik StandardView (not + görev temeli) üstüne kurulur.
export function SpaceView({ space, tasks, notes, openNoteId }: Props) {
  switch (space.type) {
    // case "tracker": return <TrackerView ... />;
    // case "kanban":  return <KanbanView ... />;
    // case "language":return <LanguageView ... />;
    case "standard":
    default:
      return (
        <StandardView
          space={space}
          tasks={tasks}
          notes={notes}
          openNoteId={openNoteId}
        />
      );
  }
}
