import { Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Zap, Search, ShoppingCart, MapPin, User, Menu, Flame,
  Smartphone, Laptop, Tv, Headphones, Gamepad2, Watch, Camera, Tag,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { categoriesQuery, settingsQuery } from "@/lib/store";
import { phones, prettyPhone, waLink } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

const ICONS: Record<string, typeof Smartphone> = {
  smartphone: Smartphone, laptop: Laptop, tv: Tv, headphones: Headphones,
  gamepad: Gamepad2, watch: Watch, camera: Camera, tag: Tag,
};
export const ICON_NAMES = Object.keys(ICONS);
export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Tag;
  return <I className={className} />;
}

export function StoreLayout({ children }: { children: ReactNode }) {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { count } = useCart();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const half = Math.ceil(s.store_name.length / 2);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-primary-deep text-primary-foreground text-xs sm:text-sm py-1.5 px-4 flex items-center justify-center gap-2">
        <Zap className="h-4 w-4 text-accent" /> {s.top_bar_text}
      </div>
      <header className="bg-primary text-primary-foreground sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
          <Link to="/" className={`shrink-0 ${s.logo_position === "center" ? "md:mx-auto md:order-none" : s.logo_position === "right" ? "order-last" : ""}`}>
            {s.logo_url ? (
              <span className="inline-block bg-card rounded-lg px-2 py-1"><img src={s.logo_url} alt={s.store_name} style={{ height: s.logo_height || 48 }} className="w-auto" /></span>
            ) : (
              <span className="text-2xl font-extrabold tracking-tight">{s.store_name.slice(0, half)}<span className="text-accent">{s.store_name.slice(half)}</span></span>
            )}
          </Link>
          <form
            className="flex-1 flex rounded-lg overflow-hidden bg-card"
            onSubmit={(e) => { e.preventDefault(); navigate({ to: "/buscar", search: { q } }); }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="¿Qué estás buscando hoy?"
              className="flex-1 px-4 py-2.5 text-sm text-foreground outline-none bg-transparent min-w-0"
            />
            <button className="bg-accent text-accent-foreground px-4" aria-label="Buscar">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <div className="hidden md:flex items-center gap-1 text-xs leading-tight">
            <MapPin className="h-5 w-5" />
            <div>Enviar a<br /><b>{s.city}</b></div>
          </div>
          <Link to="/carrito" className="relative flex items-center gap-1 text-sm" aria-label="Carrito">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && <span className="absolute -top-2 -right-2 min-w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs font-bold grid place-items-center px-1">{count}</span>}
          </Link>
          <Link to="/admin" className="hidden sm:flex items-center gap-1 text-sm">
            <User className="h-5 w-5" /> Mi Cuenta
          </Link>
        </div>
        <nav className="border-t border-primary-foreground/15">
          <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-6 text-sm font-medium overflow-x-auto">
            <Link to="/catalogo" className="flex items-center gap-1 shrink-0 font-bold hover:text-accent"><Menu className="h-4 w-4" /> Catálogo</Link>
            {cats.map((c) => (
              <Link key={c.id} to="/categoria/$slug" params={{ slug: c.slug }} className="shrink-0 hover:text-accent">
                {c.name}
              </Link>
            ))}
            <span className="ml-auto shrink-0 bg-accent text-accent-foreground rounded px-2.5 py-1 text-xs font-bold flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" /> {s.promo_label}
            </span>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-primary-deep text-primary-foreground mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 md:grid-cols-[1fr_3fr] text-sm">
          <div className="space-y-2">
            <div className="text-xl font-extrabold">{s.store_name}</div>
            {phones(s.whatsapp).map((n) => (
              <a key={n} href={waLink(n)} target="_blank" rel="noreferrer" className="block opacity-90 hover:text-accent">
                WhatsApp {prettyPhone(n)}
              </a>
            ))}
            <p className="opacity-80">{s.footer_text}</p>
            <Link to="/pagos" search={{ producto: "" }} className="block underline hover:text-accent">Pagos: Nequi y Bancolombia</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1">
            {cats.map((c) => (
              <Link key={c.id} to="/categoria/$slug" params={{ slug: c.slug }} className="opacity-80 hover:opacity-100 truncate">{c.name}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
