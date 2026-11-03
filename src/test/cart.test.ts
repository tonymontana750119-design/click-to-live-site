import { describe, it, expect } from "vitest";
import { addItem, orderSummary } from "@/lib/cart";
describe("cart", () => {
  it("adding the same product twice increases quantity", () => {
    const a = addItem(addItem([], "x", "Celular X"), "x", "Celular X");
    expect(a).toEqual([{ slug: "x", name: "Celular X", qty: 2 }]);
  });
  it("summary lists quantities for WhatsApp", () => {
    expect(orderSummary([{ slug: "x", name: "A", qty: 2 }, { slug: "y", name: "B", qty: 1 }])).toBe("2 x A; 1 x B");
  });
});
