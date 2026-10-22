import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { ProductGrid } from "@/components/store/ProductCard";

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — tecnomax` },
      { name: "description", content: `Encuentra lo mejor en ${params.slug} con descuentos.` },
      { property: "og:title", content: `${params.slug} — tecnomax` },
      { property: "og:description", content: `Encuentra lo mejor en ${params.slug} con descuentos.` },
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
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6">{cat?.name ?? slug}</h1>
        {items.length ? <ProductGrid items={items} /> : <p className="text-muted-foreground">Aún no hay productos en esta categoría.</p>}
      </div>
    </StoreLayout>
  );
}
