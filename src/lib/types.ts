// Veritabanı tablolarının TypeScript karşılıkları.
// Şema genişledikçe burayı güncelleyin (supabase/schema.sql ile eşik tutun).

export type SpaceType = "standard" | "tracker" | "kanban" | "language";

export const SPACE_TYPES: { value: SpaceType; label: string }[] = [
  { value: "standard", label: "Standart" },
  { value: "tracker", label: "Takip (Tracker)" },
  { value: "kanban", label: "Kanban" },
  { value: "language", label: "Dil" },
];

export interface Profile {
  id: string;
  display_name: string | null;
  created_at: string;
}

export interface SpaceGroup {
  id: string;
  user_id: string;
  name: string;
  sort_order: number;
  is_collapsed: boolean;
  created_at: string;
}

export interface Space {
  id: string;
  user_id: string;
  group_id: string | null;
  name: string;
  type: SpaceType;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  space_id: string;
  parent_heading: string | null;
  title: string;
  due_date: string | null;
  priority: number;
  is_done: boolean;
  sort_order: number;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  space_id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}
