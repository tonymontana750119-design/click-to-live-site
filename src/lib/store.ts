import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Banner = Database["public"]["Tables"]["banners"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Settings = Database["public"]["Tables"]["settings"]["Row"];

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return data;
  },
});

export const bannersQuery = queryOptions({
  queryKey: ["banners"],
  queryFn: async () => {
    const { data, error } = await supabase.from("banners").select("*").order("sort");
    if (error) throw error;
    return data;
  },
});

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("sort");
    if (error) throw error;
    return data;
  },
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").order("sort");
    if (error) throw error;
    return data;
  },
});

export function formatCOP(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-CO");
}

export function discountPercent(price: number, old: number | null) {
  if (!old || old <= price) return 0;
  return Math.round((1 - price / old) * 100);
}

export async function uploadImage(file: File): Promise<string> {
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const { error } = await supabase.storage.from("images").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage
    .from("images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2 || !data) throw e2 ?? new Error("No se pudo obtener la URL");
  return data.signedUrl;
}
