import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { ProductGrid } from "@/components/store/ProductCard";

export const Route = createFileRoute("/buscar")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => ({
    meta: [
      { title: "Buscar — TECNOVA STORE" },
      { name: "description", content: "Busca productos de tecnología en TECNOVA STORE." },
      { property: "og:title", content: "Buscar — TECNOVA STORE" },
      { property: "og:description", content: "Busca productos de tecnología en TECNOVA STORE." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(productsQuery)]),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { data: products } = useSuspenseQuery(productsQuery);
  const t = q.toLowerCase();
  const items = products.filter((p) => (p.name + " " + p.brand).toLowerCase().includes(t));
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-6">Resultados para “{q}”</h1>
        {items.length ? <ProductGrid items={items} /> : <p className="text-muted-foreground">No encontramos productos.</p>}
      </div>
    </StoreLayout>
  );
}
