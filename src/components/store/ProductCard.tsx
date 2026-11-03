import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageCircle, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { settingsQuery, type Product } from "@/lib/store";
import { phones, waLink } from "@/lib/whatsapp";

export function ProductCard({ p }: { p: Product }) {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const num = phones(s.whatsapp)[0];
  const { add } = useCart();
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col transition hover:shadow-lift hover:-translate-y-0.5">
      <Link to="/producto/$slug" params={{ slug: p.slug }} className="relative block aspect-square bg-muted overflow-hidden">
        {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
      </Link>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-xs text-muted-foreground uppercase font-semibold">{p.subcategory || p.brand}</span>
        <Link to="/producto/$slug" params={{ slug: p.slug }} className="text-sm font-medium line-clamp-3 hover:text-primary">{p.name}</Link>
        <button onClick={() => { add(p.slug, p.name); toast.success("Agregado al carrito"); }}
          className="mt-auto flex items-center justify-center gap-1.5 w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2 hover:bg-primary-deep transition">
          <ShoppingCart className="h-4 w-4" /> Agregar
        </button>
        {num && (
          <a href={waLink(num, `Hola, quiero información sobre: ${p.name}`)} target="_blank" rel="noreferrer"
            className="pt-1">
            <span className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-success text-primary-foreground text-sm font-semibold py-2 hover:brightness-110 transition"><MessageCircle className="h-4 w-4" /> Consultar</span>
          </a>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
