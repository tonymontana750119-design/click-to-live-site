import { Link } from "@tanstack/react-router";
import { Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { discountPercent, formatCOP, type Product } from "@/lib/store";
import { useCart } from "@/lib/cart";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const d = discountPercent(Number(p.price), p.old_price ? Number(p.old_price) : null);
  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden flex flex-col transition hover:shadow-lift hover:-translate-y-0.5">
      <Link to="/producto/$slug" params={{ slug: p.slug }} className="relative block aspect-square bg-muted overflow-hidden">
        {p.image_url && <img src={p.image_url} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
        {d > 0 && <span className="absolute top-2 left-2 bg-sale text-sale-foreground text-xs font-bold rounded px-2 py-1">-{d}%</span>}
      </Link>
      <div className="p-3 flex flex-col gap-1 flex-1">
        <span className="text-xs text-muted-foreground uppercase font-semibold">{p.brand}</span>
        <Link to="/producto/$slug" params={{ slug: p.slug }} className="text-sm font-medium line-clamp-2 hover:text-primary">{p.name}</Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-rating text-rating" /> {Number(p.rating).toFixed(1)} ({p.reviews})
        </div>
        {d > 0 && <span className="text-xs text-muted-foreground line-through">{formatCOP(Number(p.old_price))}</span>}
        <span className="text-lg font-extrabold">{formatCOP(Number(p.price))}</span>
        {p.fast_shipping && <span className="text-xs text-success flex items-center gap-1 font-semibold"><Truck className="h-3.5 w-3.5" /> Envío rápido</span>}
        <button
          onClick={() => { add(); toast.success("Agregado al carrito"); }}
          className="mt-auto pt-2"
        >
          <span className="block w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2 hover:bg-primary-deep transition">Agregar al carrito</span>
        </button>
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
