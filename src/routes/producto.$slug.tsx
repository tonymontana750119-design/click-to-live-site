import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { categoriesQuery, discountPercent, formatCOP, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout } from "@/components/store/Layout";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/producto/$slug")({
  loader: async ({ context: { queryClient: q }, params }) => {
    const [, , products] = await Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(productsQuery)]);
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { name: p.name, description: p.description };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Producto"} — tecnomax` },
      { name: "description", content: loaderData?.description || "Producto en tecnomax" },
      { property: "og:title", content: `${loaderData?.name ?? "Producto"} — tecnomax` },
      { property: "og:description", content: loaderData?.description || "Producto en tecnomax" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { add } = useCart();
  const p = products.find((x) => x.slug === slug)!;
  const d = discountPercent(Number(p.price), p.old_price ? Number(p.old_price) : null);
  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl shadow-card overflow-hidden aspect-square">
          {p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-sm uppercase font-semibold text-muted-foreground">{p.brand}</span>
          <h1 className="text-3xl font-extrabold">{p.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-rating text-rating" /> {Number(p.rating).toFixed(1)} ({p.reviews} opiniones)</div>
          {d > 0 && <div className="flex items-center gap-2"><span className="line-through text-muted-foreground">{formatCOP(Number(p.old_price))}</span><span className="bg-sale text-sale-foreground text-xs font-bold rounded px-2 py-0.5">-{d}%</span></div>}
          <div className="text-4xl font-extrabold">{formatCOP(Number(p.price))}</div>
          {p.fast_shipping && <span className="text-success flex items-center gap-1 font-semibold"><Truck className="h-4 w-4" /> Envío rápido</span>}
          <p className="text-muted-foreground whitespace-pre-line">{p.description}</p>
          <button onClick={() => { add(); toast.success("Agregado al carrito"); }} className="mt-4 rounded-lg bg-accent text-accent-foreground font-bold py-3 hover:brightness-110">Agregar al carrito</button>
        </div>
      </div>
    </StoreLayout>
  );
}
