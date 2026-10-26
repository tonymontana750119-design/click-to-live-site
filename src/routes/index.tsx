import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Sparkles } from "lucide-react";
import { bannersQuery, categoriesQuery, productsQuery, settingsQuery } from "@/lib/store";
import { StoreLayout, CategoryIcon } from "@/components/store/Layout";
import { ProductGrid } from "@/components/store/ProductCard";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const FALLBACK = [hero1, hero2];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TECNOVA STORE — Tecnología para ti" },
      { name: "description", content: "Celulares, portátiles, televisores, impresoras y más. Consulta por WhatsApp." },
      { property: "og:title", content: "TECNOVA STORE — Tecnología para ti" },
      { property: "og:description", content: "Celulares, portátiles, televisores, impresoras y más. Consulta por WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery), q.ensureQueryData(bannersQuery), q.ensureQueryData(productsQuery)]),
  component: Home,
});

function Home() {
  const { data: banners } = useSuspenseQuery(bannersQuery);
  const { data: cats } = useSuspenseQuery(categoriesQuery);
  const { data: products } = useSuspenseQuery(productsQuery);
  const [i, setI] = useState(0);
  const n = banners.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-4 space-y-10">
        {n > 0 && (
          <section className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[5/2] bg-primary-deep">
            {banners.map((b, idx) => (
              <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                {b.video_url ? <video src={b.video_url} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
                  : <img src={b.image_url || FALLBACK[idx % 2]} alt={b.title} className="absolute inset-0 h-full w-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/80 to-transparent" />
                <div className="relative h-full flex flex-col justify-center gap-3 px-8 sm:px-12 max-w-xl text-primary-foreground">
                  {b.badge && <span className="self-start bg-accent text-accent-foreground text-xs font-bold uppercase rounded-full px-3 py-1">{b.badge}</span>}
                  <h1 className="text-3xl sm:text-5xl font-extrabold">{b.title}</h1>
                  <p className="sm:text-lg opacity-90">{b.subtitle}</p>
                  {b.button_text && (
                    <a href={b.link} className="self-start bg-accent text-accent-foreground font-bold rounded-lg px-5 py-2.5 hover:brightness-110">{b.button_text}</a>
                  )}
                </div>
              </div>
            ))}
            {n > 1 && (
              <>
                <button onClick={() => setI((i - 1 + n) % n)} aria-label="Anterior" className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/80 text-foreground grid place-items-center"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setI((i + 1) % n)} aria-label="Siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/80 text-foreground grid place-items-center"><ChevronRight className="h-5 w-5" /></button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {banners.map((b, idx) => <span key={b.id} className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-accent" : "w-2 bg-card/70"}`} />)}
                </div>
              </>
            )}
          </section>
        )}

        <section className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {cats.map((c) => (
            <Link key={c.id} to="/categoria/$slug" params={{ slug: c.slug }} className="bg-card rounded-xl shadow-card p-4 flex flex-col items-center gap-2 hover:shadow-lift transition">
              <span className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground grid place-items-center"><CategoryIcon name={c.icon} className="h-6 w-6" /></span>
              <span className="text-sm font-semibold text-center">{c.name}</span>
            </Link>
          ))}
        </section>

        <Section title="Ofertas flash" icon={<Flame className="h-6 w-6 text-sale" />} items={products.filter((p) => p.is_flash)} />
        <Section title="Los más vendidos" icon={<TrendingUp className="h-6 w-6 text-primary" />} items={products.filter((p) => p.is_bestseller)} />
        <Section title="Recomendados para ti" icon={<Sparkles className="h-6 w-6 text-accent" />} items={products.filter((p) => p.is_recommended)} />
      </div>
    </StoreLayout>
  );
}

function Section({ title, icon, items }: { title: string; icon: React.ReactNode; items: Parameters<typeof ProductGrid>[0]["items"] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-2xl font-extrabold flex items-center gap-2 mb-4">{icon}{title}</h2>
      <ProductGrid items={items} />
    </section>
  );
}
