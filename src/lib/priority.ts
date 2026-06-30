// Görev öncelik seviyeleri. 0 = yok.
export const PRIORITIES: { value: number; label: string; color: string }[] = [
  { value: 0, label: "Öncelik yok", color: "" },
  { value: 1, label: "Düşük", color: "#10b981" },
  { value: 2, label: "Orta", color: "#f59e0b" },
  { value: 3, label: "Yüksek", color: "#ef4444" },
];

export function priorityMeta(value: number) {
  return PRIORITIES.find((p) => p.value === value) ?? PRIORITIES[0];
}
