import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { ProductGrid } from "@/components/store/ProductCard";

export const Route = createFileRoute("/catalogo")({
  head: () => ({ meta: [
    { title: "Catálogo completo — TECNOVA STORE" },
    { name: "description", content: "Todos los productos de TECNOVA STORE organizados por categoría." },
    { property: "og:title", content: "Catálogo completo — TECNOVA STORE" },
    { property: "og:description", content: "Todos los productos de TECNOVA STORE organizados por categoría." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(productsQuery)]),
  component: CatalogPage,
});

function CatalogPage() {
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const groups = cats.map((c) => ({ c, items: products.filter((p) => p.category_slug === c.slug) })).filter((g) => g.items.length);
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold">Catálogo completo</h1>
          <div className="flex flex-wrap gap-2">
            {groups.map(({ c, items }) => (
              <a key={c.id} href={`#${c.slug}`} className="rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm font-semibold hover:bg-primary hover:text-primary-foreground">
                {c.name} ({items.length})
              </a>
            ))}
          </div>
        </div>
        {groups.map(({ c, items }) => (
          <section key={c.id} id={c.slug} className="scroll-mt-32 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-extrabold">{c.name}</h2>
              <Link to="/categoria/$slug" params={{ slug: c.slug }} className="text-sm text-primary font-semibold underline">Ver categoría</Link>
            </div>
            <ProductGrid items={items.slice(0, 10)} />
          </section>
        ))}
      </div>
    </StoreLayout>
  );
}
