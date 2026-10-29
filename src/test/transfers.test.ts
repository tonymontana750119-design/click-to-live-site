import { describe, it, expect } from "vitest";
import { receiptLink, transferMethods } from "@/lib/transfers";

const settings = { nequi_number: "3135366722", bancolombia_account: "525-82574626", bancolombia_account_type: "Ahorros", payment_holder: "", receipt_whatsapp: "573135366722" };

describe("Transferencias elegidas por la tienda", () => {
  it("usa el número Nequi indicado", () => {
    expect(transferMethods(settings).find((m) => m.id === "nequi")?.account).toBe("3135366722");
  });
  it("usa la cuenta de ahorros Bancolombia indicada", () => {
    expect(transferMethods(settings).find((m) => m.id === "bancolombia")).toMatchObject({ account: "525-82574626", type: "Cuenta de ahorros" });
  });
  it("dirige comprobantes al WhatsApp elegido", () => {
    expect(new URL(receiptLink(settings, "Celular") ?? "").pathname).toBe("/573135366722");
  });
  it("acepta el mismo WhatsApp con formato nacional", () => {
    expect(new URL(receiptLink({ ...settings, receipt_whatsapp: "3135366722" }, "") ?? "").pathname).toBe("/573135366722");
  });
  it("omite cuentas eliminadas por el administrador", () => {
    expect(transferMethods({ ...settings, nequi_number: "" }).map((m) => m.id)).toEqual(["bancolombia"]);
  });
});