import specs from "@/data/specs.json";
import type { Product } from "@/lib/store";
const map = specs as Record<string, string>;
export function specUrl(p: Pick<Product, "slug"> & { spec_url?: string | null }) {
  return p.spec_url || map[p.slug] || null;
}
