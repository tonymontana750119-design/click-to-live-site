import { waLink } from "@/lib/whatsapp";

export type TransferSettings = {
  nequi_number: string;
  bancolombia_account: string;
  bancolombia_account_type: string;
  payment_holder: string;
  receipt_whatsapp: string;
};

export function transferMethods(s: TransferSettings) {
  return [
    { id: "nequi", name: "Nequi", account: s.nequi_number, type: "Número Nequi" },
    { id: "bancolombia", name: "Bancolombia", account: s.bancolombia_account, type: `Cuenta de ${s.bancolombia_account_type.toLowerCase()}` },
  ].filter((method) => method.account.trim());
}

export function receiptLink(s: TransferSettings, reference: string) {
  const digits = s.receipt_whatsapp.replace(/\D/g, "");
  const number = digits.length === 10 ? `57${digits}` : digits;
  if (!number) return null;
  return waLink(number, `Hola TECNOVA STORE, quiero enviar el comprobante de mi transferencia${reference.trim() ? ` para: ${reference.trim()}` : ""}. Quedo pendiente de la verificación del pago.`);
}