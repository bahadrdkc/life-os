// Koşullu className birleştirici (küçük, bağımlılıksız).
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
