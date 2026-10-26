export function phones(raw: string | null | undefined): string[] {
  return (raw ?? "").split(/[-,/|]+/).map((s) => s.replace(/\D/g, "")).filter((s) => s.length >= 7)
    .map((d) => (d.length === 10 ? "57" + d : d));
}
export function waLink(num: string, text?: string) {
  return `https://wa.me/${num}${text ? "?text=" + encodeURIComponent(text) : ""}`;
}
export function prettyPhone(d: string) {
  const n = d.startsWith("57") ? d.slice(2) : d;
  return `+57 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}
