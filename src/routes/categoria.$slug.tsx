import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { ProductGrid } from "@/components/store/ProductCard";
import { FileText } from "lucide-react";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — TECNOVA STORE` },
      { name: "description", content: `Catálogo de ${params.slug} en TECNOVA STORE.` },
      { property: "og:title", content: `${params.slug} — TECNOVA STORE` },
      { property: "og:description", content: `Catálogo de ${params.slug} en TECNOVA STORE.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(productsQuery)]),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const cat = cats.find((c) => c.slug === slug);
  const items = products.filter((p) => p.category_slug === slug);
  const groups = new Map<string, typeof items>();
  items.forEach((p) => { const k = p.subcategory || "Otros"; groups.set(k, [...(groups.get(k) ?? []), p]); });
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-extrabold">{cat?.name ?? slug}</h1>
          {GUIDES[slug] && (
            <a href={GUIDES[slug]} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-5 py-2.5 font-semibold hover:bg-primary-deep">
              <FileText className="h-5 w-5" /> Ver guía en PDF
            </a>
          )}
        </div>
        {items.length ? [...groups].map(([g, list]) => (
          <section key={g}>
            <h2 className="text-xl font-bold mb-3">{g}</h2>
            <ProductGrid items={list} />
          </section>
        )) : <p className="text-muted-foreground">Aún no hay productos en esta categoría.</p>}
      </div>
    </StoreLayout>
  );
}
