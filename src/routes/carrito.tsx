import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Landmark, MessageCircle, Minus, Plus, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categoriesQuery, settingsQuery } from "@/lib/store";
import { receiptLink, transferMethods } from "@/lib/transfers";
import { orderSummary, useCart } from "@/lib/cart";
import { StoreLayout } from "@/components/store/Layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/carrito")({
  head: () => ({ meta: [
    { title: "Carrito de compras — TECNOVA STORE" },
    { name: "description", content: "Revisa tu pedido y paga por Nequi o Bancolombia." },
    { property: "og:title", content: "Carrito de compras — TECNOVA STORE" },
    { property: "og:description", content: "Revisa tu pedido y paga por Nequi o Bancolombia." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  loader: ({ context: { queryClient: q } }) => Promise.all([q.ensureQueryData(settingsQuery), q.ensureQueryData(categoriesQuery)]),
  component: CartPage,
});

function CartPage() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const { items, setQty, clear } = useCart();
  const methods = transferMethods(s);
  const [method, setMethod] = useState<string | null>(null);
  const chosen = methods.find((m) => m.id === method);
  const link = chosen ? receiptLink(s, `pago por ${chosen.name} — ${orderSummary(items)}`) : null;

  return (
    <StoreLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-extrabold">Tu carrito</h1>
        {!items.length ? (
          <div className="space-y-3"><p className="text-muted-foreground">Tu carrito está vacío.</p>
            <Button asChild><Link to="/catalogo">Ver catálogo</Link></Button></div>
        ) : (
          <>
            <ul className="divide-y divide-border rounded-lg border border-border bg-card">
              {items.map((i) => (
                <li key={i.slug} className="flex items-center gap-3 p-3">
                  <Link to="/producto/$slug" params={{ slug: i.slug }} className="flex-1 text-sm font-medium hover:text-primary">{i.name}</Link>
                  <Button size="icon" variant="outline" aria-label="Quitar uno" onClick={() => setQty(i.slug, i.qty - 1)}><Minus /></Button>
                  <span className="w-6 text-center font-semibold">{i.qty}</span>
                  <Button size="icon" variant="outline" aria-label="Agregar uno" onClick={() => setQty(i.slug, i.qty + 1)}><Plus /></Button>
                  <Button size="icon" variant="ghost" aria-label="Eliminar" onClick={() => setQty(i.slug, 0)}><Trash2 /></Button>
                </li>
              ))}
            </ul>
            <button className="text-sm text-muted-foreground underline" onClick={clear}>Vaciar carrito</button>

            <div className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold">Ir a pagar</h2>
              <p className="text-sm text-muted-foreground">Elige cómo pagar. Antes de transferir, confirma por WhatsApp el valor total y la disponibilidad.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {methods.map((m) => (
                  <Button key={m.id} variant={method === m.id ? "default" : "outline"} className="h-auto py-4 text-base" onClick={() => setMethod(m.id)}>
                    {m.id === "nequi" ? <Smartphone /> : <Landmark />} Pagar con {m.name}
                  </Button>
                ))}
              </div>
              {chosen && (
                <article className="rounded-lg border border-border bg-card p-5 space-y-3">
                  <p className="text-sm text-muted-foreground">{chosen.type}</p>
                  <p className="text-2xl font-semibold break-all">{chosen.account}</p>
                  {s.payment_holder && <p className="text-sm">Titular: {s.payment_holder}</p>}
                  <Button variant="outline" onClick={async () => {
                    try { await navigator.clipboard.writeText(chosen.account.replace(/\D/g, "")); toast.success("Número copiado"); }
                    catch { toast.error("No se pudo copiar."); }
                  }}><Copy /> Copiar número</Button>
                  {link && <Button asChild className="w-full h-auto whitespace-normal py-3"><a href={link} target="_blank" rel="noreferrer"><MessageCircle /> Enviar pedido y comprobante por WhatsApp</a></Button>}
                  <p className="text-xs text-muted-foreground">El pago queda pendiente hasta que la tienda confirme el dinero recibido.</p>
                </article>
              )}
            </div>
          </>
        )}
      </section>
    </StoreLayout>
  );
}
