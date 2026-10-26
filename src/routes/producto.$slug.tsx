import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { phones, prettyPhone, waLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ context: { queryClient: q }, params }) => {
    const [, , products] = await Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(productsQuery)]);
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Producto"} — TECNOVA STORE` },
      { name: "description", content: loaderData?.description || `${loaderData?.name ?? "Producto"} en TECNOVA STORE` },
      { property: "og:title", content: `${loaderData?.name ?? "Producto"} — TECNOVA STORE` },
      { property: "og:description", content: loaderData?.description || "Producto en TECNOVA STORE" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: s } = useSuspenseQuery(settingsQuery);
  const p = products.find((x) => x.slug === slug)!;
  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden aspect-square">
          {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm uppercase font-semibold text-muted-foreground">{p.subcategory || p.brand}</span>
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          {p.description && <p className="text-muted-foreground whitespace-pre-line">{p.description}</p>}
          <p className="mt-4 font-semibold">Consulta precio y disponibilidad:</p>
          {phones(s.whatsapp).map((n) => (
            <a key={n} href={waLink(n, `Hola, quiero información sobre: ${p.name}`)} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-success text-primary-foreground font-bold py-3 hover:brightness-110">
              <MessageCircle className="h-5 w-5" /> WhatsApp {prettyPhone(n)}
            </a>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
