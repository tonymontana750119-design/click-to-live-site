import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, MessageCircle, Landmark, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery, categoriesQuery } from "@/lib/store";
import { receiptLink, transferMethods } from "@/lib/transfers";
import { StoreLayout } from "@/components/store/Layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pagos")({
  validateSearch: (s: Record<string, unknown>) => ({ producto: typeof s.producto === "string" ? s.producto : "" }),
  head: () => ({ meta: [
    { title: "Transferencias Nequi y Bancolombia — TECNOVA STORE" },
    { name: "description", content: "Datos de transferencia de TECNOVA STORE y envío de comprobantes por WhatsApp." },
    { property: "og:title", content: "Transferencias Nequi y Bancolombia — TECNOVA STORE" },
    { property: "og:description", content: "Paga tu compra acordada y envía tu comprobante a TECNOVA STORE." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: ({ context: { queryClient } }) => Promise.all([queryClient.ensureQueryData(settingsQuery), queryClient.ensureQueryData(categoriesQuery)]),
  component: PaymentsPage,
});

function PaymentsPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { producto } = Route.useSearch();
  const [reference, setReference] = useState(producto);
  const methods = transferMethods(settings);
  const link = receiptLink(settings, reference);
  return <StoreLayout>
    <section className="mx-auto max-w-3xl px-4 py-10 space-y-7">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold">Pagos por transferencia</h1>
        <p className="text-muted-foreground">Antes de transferir, confirma por WhatsApp la disponibilidad y el valor total de tu compra.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {methods.map((method) => <article key={method.id} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-xl font-bold">{method.id === "nequi" ? <Smartphone className="text-primary" /> : <Landmark className="text-primary" />}{method.name}</h2>
          <p className="text-sm text-muted-foreground">{method.type}</p>
          <p className="text-xl font-semibold break-all">{method.account}</p>
          {settings.payment_holder && <p className="text-sm">Titular: {settings.payment_holder}</p>}
          <Button variant="outline" onClick={async () => {
            try { await navigator.clipboard.writeText(method.account.replace(/\D/g, "")); toast.success("Número copiado"); }
            catch { toast.error("No se pudo copiar. Selecciona el número para copiarlo."); }
          }}><Copy /> Copiar número</Button>
        </article>)}
      </div>
      {!methods.length && <p className="text-muted-foreground">Los datos de pago no están disponibles. Contacta a la tienda por WhatsApp.</p>}
      <div className="space-y-4 border-t border-border pt-6">
        <h2 className="text-xl font-bold">Enviar comprobante</h2>
        <label className="block space-y-2 text-sm font-medium">Producto o referencia de compra (opcional)
          <input value={reference} onChange={(e) => setReference(e.target.value)} maxLength={300} className="block w-full rounded-md border border-input bg-card px-3 py-2 text-foreground" />
        </label>
        {link && <Button asChild className="h-auto whitespace-normal py-3"><a href={link} target="_blank" rel="noreferrer"><MessageCircle /> Enviar comprobante por WhatsApp</a></Button>}
        <p className="text-sm text-muted-foreground">Adjunta la foto del comprobante en WhatsApp. El pago queda pendiente hasta que la tienda confirme el dinero recibido; el comprobante no confirma el pago.</p>
      </div>
    </section>
  </StoreLayout>;
}