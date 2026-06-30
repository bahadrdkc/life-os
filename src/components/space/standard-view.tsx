import type { Note, Space, Task } from "@/lib/types";
import { TaskSection } from "./tasks/task-section";
import { NoteSection } from "./notes/note-section";

interface Props {
  space: Space;
  tasks: Task[];
  notes: Note[];
  openNoteId?: string;
}

// Standart görünüm: Görevler + Notlar. Diğer tip view'ler bunu temel alır.
export function StandardView({ space, tasks, notes, openNoteId }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <TaskSection spaceId={space.id} tasks={tasks} />
      <NoteSection spaceId={space.id} notes={notes} openNoteId={openNoteId} />
    </div>
  );
}
