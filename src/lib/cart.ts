import { useEffect, useState } from "react";

const KEY = "cart-count";
const EVT = "cart-change";

export function useCart() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const read = () => setCount(Number(localStorage.getItem(KEY) ?? 0));
    read();
    window.addEventListener(EVT, read);
    return () => window.removeEventListener(EVT, read);
  }, []);
  const add = () => {
    localStorage.setItem(KEY, String(Number(localStorage.getItem(KEY) ?? 0) + 1));
    window.dispatchEvent(new Event(EVT));
  };
  return { count, add };
}
