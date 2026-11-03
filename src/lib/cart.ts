import { useEffect, useState } from "react";

const KEY = "cart-items";
const EVT = "cart-change";
export type CartItem = { slug: string; name: string; qty: number };

function read(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVT));
}

export function addItem(items: CartItem[], slug: string, name: string): CartItem[] {
  const found = items.find((i) => i.slug === slug);
  return found ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + 1 } : i)) : [...items, { slug, name, qty: 1 }];
}

export function orderSummary(items: CartItem[]) {
  return items.map((i) => `${i.qty} x ${i.name}`).join("; ");
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    const r = () => setItems(read());
    r();
    window.addEventListener(EVT, r);
    return () => window.removeEventListener(EVT, r);
  }, []);
  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    add: (slug: string, name: string) => write(addItem(read(), slug, name)),
    setQty: (slug: string, qty: number) => write(read().map((i) => (i.slug === slug ? { ...i, qty } : i)).filter((i) => i.qty > 0)),
    clear: () => write([]),
  };
}
