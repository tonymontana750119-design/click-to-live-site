import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Trash2, Plus, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { bannersQuery, categoriesQuery, productsQuery, settingsQuery, uploadImage } from "@/lib/store";
import { ICON_NAMES } from "@/components/store/Layout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel de edición — TECNOVA STORE" },
      { name: "description", content: "Edita textos, banners, categorías y productos de la tienda." },
      { property: "og:title", content: "Panel de edición — TECNOVA STORE" },
      { property: "og:description", content: "Edita textos, banners, categorías y productos de la tienda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const input = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const btn = "inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-primary-deep disabled:opacity-50";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin")
      .then(({ data }) => setIsAdmin(!!data?.length));
  }, [session]);

  if (!ready) return null;
  if (!session) return <Login />;
  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
          <span className="font-extrabold text-lg">Panel de edición</span>
          <Link to="/" className="text-sm underline">Ver tienda</Link>
          <button onClick={() => supabase.auth.signOut()} className="ml-auto text-sm flex items-center gap-1"><LogOut className="h-4 w-4" /> Salir</button>
        </div>
      </header>
      {isAdmin ? <Editor /> : (
        <p className="mx-auto max-w-5xl px-4 py-10 text-muted-foreground">Tu cuenta no tiene permisos de administrador. Solo la primera cuenta creada puede editar la tienda.</p>
      )}
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up") toast.success("Revisa tu correo para confirmar la cuenta.");
  }
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form onSubmit={submit} className="bg-card shadow-card rounded-2xl p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-extrabold">{mode === "in" ? "Entrar al panel" : "Crear cuenta"}</h1>
        <input className={input} type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={input} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <button className={btn + " w-full justify-center"} disabled={busy}>{mode === "in" ? "Entrar" : "Crear cuenta"}</button>
        <button type="button" className="text-sm text-primary underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "¿Primera vez? Crea tu cuenta" : "Ya tengo cuenta"}
        </button>
      </form>
    </div>
  );
}

const TABS = ["Tienda", "Banners", "Categorías", "Productos"] as const;

function Editor() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Productos");
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{t}</button>
        ))}
      </div>
      {tab === "Tienda" && <SettingsEditor />}
      {tab === "Banners" && <ListEditor table="banners" query={bannersQuery} fields={BANNER_FIELDS} blank={{ title: "Nuevo banner", sort: 99 }} label={(r) => r.title} />}
      {tab === "Categorías" && <ListEditor table="categories" query={categoriesQuery} fields={CAT_FIELDS} blank={{ name: "Nueva", slug: "nueva-" + Date.now(), sort: 99 }} label={(r) => r.name} />}
      {tab === "Productos" && <ListEditor table="products" query={productsQuery} fields={PRODUCT_FIELDS} blank={{ name: "Nuevo producto", slug: "producto-" + Date.now(), sort: 99 }} label={(r) => r.name} />}
    </div>
  );
}

type Field = { key: string; label: string; type: "text" | "textarea" | "number" | "bool" | "image" | "icon" };

const BANNER_FIELDS: Field[] = [
  { key: "badge", label: "Etiqueta", type: "text" }, { key: "title", label: "Título", type: "text" },
  { key: "subtitle", label: "Subtítulo", type: "text" }, { key: "button_text", label: "Texto del botón", type: "text" },
  { key: "link", label: "Enlace del botón", type: "text" }, { key: "image_url", label: "Imagen", type: "image" },
  { key: "video_url", label: "Video (URL, opcional)", type: "text" },
  { key: "sort", label: "Orden", type: "number" },
];
const CAT_FIELDS: Field[] = [
  { key: "name", label: "Nombre", type: "text" }, { key: "slug", label: "Dirección (sin espacios)", type: "text" },
  { key: "image_url", label: "Foto de la categoría (portada)", type: "image" },
  { key: "icon", label: "Ícono (se muestra si no hay foto)", type: "icon" }, { key: "sort", label: "Orden", type: "number" },
];
const PRODUCT_FIELDS: Field[] = [
  { key: "name", label: "Nombre", type: "text" }, { key: "brand", label: "Marca", type: "text" },
  { key: "slug", label: "Dirección (sin espacios)", type: "text" }, { key: "category_slug", label: "Categoría (dirección)", type: "text" },
  { key: "subcategory", label: "Subcategoría", type: "text" },
  { key: "image_url", label: "Imagen", type: "image" }, { key: "description", label: "Descripción", type: "textarea" },
  { key: "rating", label: "Calificación (0-5)", type: "number" }, { key: "reviews", label: "Nº opiniones", type: "number" },
  { key: "fast_shipping", label: "Envío rápido", type: "bool" }, { key: "is_flash", label: "En Ofertas flash", type: "bool" },
  { key: "is_bestseller", label: "En Más vendidos", type: "bool" }, { key: "is_recommended", label: "En Recomendados", type: "bool" },
  { key: "sort", label: "Orden", type: "number" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = any;

function FieldInput({ f, value, onChange }: { f: Field; value: any; onChange: (v: any) => void }) {
  const [up, setUp] = useState(false);
  if (f.type === "bool") return (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>
  );
  return (
    <label className={`block text-sm space-y-1 ${f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}`}>
      <span className="font-medium">{f.label}</span>
      {f.type === "textarea" ? <textarea className={input} rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
        : f.type === "icon" ? <select className={input} value={value} onChange={(e) => onChange(e.target.value)}>{ICON_NAMES.map((n) => <option key={n}>{n}</option>)}</select>
        : f.type === "image" ? (
          <div className="flex gap-3 items-center">
            {value && <img src={value} alt="" className="h-16 w-16 rounded object-cover" />}
            <input className={input} placeholder="URL de la imagen" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
            <label className={btn + " cursor-pointer shrink-0"}>
              <Upload className="h-4 w-4" />{up ? "Subiendo…" : "Subir"}
              <input type="file" accept="image/*" hidden onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setUp(true);
                try { onChange(await uploadImage(file)); } catch (err: any) { toast.error(err.message); }
                setUp(false);
              }} />
            </label>
          </div>
        )
        : <input className={input} type={f.type === "number" ? "number" : "text"} step="any" value={value ?? ""} onChange={(e) => onChange(f.type === "number" ? (e.target.value === "" ? null : Number(e.target.value)) : e.target.value)} />}
    </label>
  );
}

function SettingsEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [row, setRow] = useState<Row | null>(null);
  useEffect(() => { if (data) setRow(data); }, [data]);
  if (!row) return null;
  const fields: Field[] = [
    { key: "store_name", label: "Nombre de la tienda", type: "text" }, { key: "top_bar_text", label: "Texto barra superior", type: "text" },
    { key: "promo_label", label: "Etiqueta promoción", type: "text" }, { key: "city", label: "Ciudad de envío", type: "text" },
    { key: "whatsapp", label: "WhatsApp (separa varios con -)", type: "text" },
    { key: "logo_url", label: "Logo", type: "image" },
    { key: "logo_position", label: "Posición del logo (left / center / right)", type: "text" },
    { key: "logo_height", label: "Tamaño del logo (px)", type: "number" }, { key: "footer_text", label: "Texto del pie de página", type: "text" },
  ];
  return (
    <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">{fields.map((f) => <FieldInput key={f.key} f={f} value={row[f.key]} onChange={(v) => setRow({ ...row, [f.key]: v })} />)}</div>
      <button className={btn} onClick={async () => {
        const { id, ...rest } = row;
        const { error } = await supabase.from("settings").update(rest).eq("id", 1);
        if (error) { toast.error(error.message); return; }
        toast.success("Guardado"); qc.invalidateQueries({ queryKey: ["settings"] });
      }}>Guardar</button>
    </div>
  );
}

function ListEditor({ table, query, fields, blank, label }: { table: "banners" | "categories" | "products"; query: any; fields: Field[]; blank: Row; label: (r: Row) => string }) {
  const qc = useQueryClient();
  const { data } = useQuery<Row[]>(query);
  const [open, setOpen] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: query.queryKey });
  return (
    <div className="space-y-3">
      <button className={btn} onClick={async () => {
        const { data: r, error } = await supabase.from(table).insert(blank as any).select().single();
        if (error) { toast.error(error.message); return; }
        await refresh(); setOpen(r.id);
      }}><Plus className="h-4 w-4" /> Agregar</button>
      {data?.map((r) => (
        <div key={r.id} className="bg-card rounded-xl shadow-card">
          <button className="w-full text-left px-5 py-3 font-semibold flex items-center gap-3" onClick={() => setOpen(open === r.id ? null : r.id)}>
            {r.image_url && <img src={r.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
            {label(r)}
          </button>
          {open === r.id && <RowForm row={r} fields={fields} table={table} onDone={refresh} />}
        </div>
      ))}
    </div>
  );
}

function RowForm({ row: initial, fields, table, onDone }: { row: Row; fields: Field[]; table: "banners" | "categories" | "products"; onDone: () => void }) {
  const [row, setRow] = useState(initial);
  return (
    <div className="border-t px-5 py-4 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">{fields.map((f) => <FieldInput key={f.key} f={f} value={row[f.key]} onChange={(v) => setRow({ ...row, [f.key]: v })} />)}</div>
      <div className="flex gap-2">
        <button className={btn} onClick={async () => {
          const { id, created_at, ...rest } = row;
          const { error } = await supabase.from(table).update(rest as any).eq("id", id);
          if (error) { toast.error(error.message); return; }
          toast.success("Guardado"); onDone();
        }}>Guardar</button>
        <button className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-destructive hover:bg-muted" onClick={async () => {
          if (!confirm("¿Eliminar?")) return;
          const { error } = await supabase.from(table).delete().eq("id", row.id);
          if (error) { toast.error(error.message); return; }
          onDone();
        }}><Trash2 className="h-4 w-4" /> Eliminar</button>
      </div>
    </div>
  );
}
