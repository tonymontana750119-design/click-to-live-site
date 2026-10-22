create type public.app_role as enum ('admin');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role public.app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role public.app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.user_roles where user_id=_user_id and role=_role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.handle_first_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role='admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.handle_first_admin();

create table public.settings (id int primary key default 1, store_name text not null default 'tecnomax', top_bar_text text not null default 'Envío gratis en compras desde $199.000 · Hasta 24 cuotas sin interés', promo_label text not null default 'Madrugón', city text not null default 'Bogotá', footer_text text not null default '© tecnomax. Todos los derechos reservados.', whatsapp text not null default '', constraint single check (id=1));
create table public.banners (id uuid primary key default gen_random_uuid(), badge text not null default '', title text not null default '', subtitle text not null default '', button_text text not null default 'Ver ofertas', link text not null default '/', image_url text not null default '', sort int not null default 0, created_at timestamptz not null default now());
create table public.categories (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, icon text not null default 'smartphone', sort int not null default 0);
create table public.products (id uuid primary key default gen_random_uuid(), slug text unique not null, brand text not null default '', name text not null, description text not null default '', image_url text not null default '', price numeric not null default 0, old_price numeric, rating numeric not null default 4.5, reviews int not null default 0, fast_shipping boolean not null default true, category_slug text not null default '', is_flash boolean not null default false, is_bestseller boolean not null default false, is_recommended boolean not null default false, sort int not null default 0, created_at timestamptz not null default now());

do $$ declare t text; begin foreach t in array array['settings','banners','categories','products'] loop
  execute format('grant select on public.%I to anon, authenticated', t);
  execute format('grant insert, update, delete on public.%I to authenticated', t);
  execute format('grant all on public.%I to service_role', t);
  execute format('alter table public.%I enable row level security', t);
  execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
  execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.has_role(auth.uid(),''admin''))', t);
  execute format('create policy "admin update" on public.%I for update to authenticated using (public.has_role(auth.uid(),''admin''))', t);
  execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.has_role(auth.uid(),''admin''))', t);
end loop; end $$;

insert into public.settings(id) values (1);
insert into public.banners(badge,title,subtitle,button_text,link,image_url,sort) values
('Solo hoy hasta el mediodía','Madrugón Tecno','Hasta 40% dcto. en celulares y portátiles','Ver ofertas','/categoria/celulares','',0),
('Ofertas del día','Tu sala, nivel cine','Smart TV y consolas con envío gratis','Comprar ahora','/categoria/televisores','',1);
insert into public.categories(slug,name,icon,sort) values
('celulares','Celulares','smartphone',0),('computadores','Computadores','laptop',1),('televisores','Televisores','tv',2),('audio','Audio','headphones',3),('videojuegos','Videojuegos','gamepad',4),('accesorios','Accesorios','watch',5);
insert into public.products(slug,brand,name,image_url,price,old_price,rating,reviews,fast_shipping,category_slug,is_flash,is_bestseller,is_recommended,sort,description) values
('galaxy-s24-ultra','Samsung','Galaxy S24 Ultra 512 GB con Galaxy AI','https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80&auto=format&fit=crop',5249250,6999000,4.8,932,true,'celulares',true,true,false,1,'Pantalla de 6.8", cámara de 200 MP y Galaxy AI.'),
('xiaomi-redmi-note-13','Xiaomi','Redmi Note 13 Pro 256 GB','https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80&auto=format&fit=crop',1049300,1499000,4.5,2210,false,'celulares',true,false,true,2,'Cámara de 200 MP y carga rápida de 67 W.'),
('hp-pavilion-14','HP','Portátil Pavilion 14 AMD Ryzen 5 8 GB 256 GB SSD','https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80&auto=format&fit=crop',2124150,2499000,4.4,301,true,'computadores',true,false,false,3,'Ligero y potente para el día a día.'),
('asus-rog-strix','ASUS','Portátil Gamer ROG Strix G16 RTX 4060 1 TB','https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80&auto=format&fit=crop',6319200,7899000,4.7,188,false,'computadores',true,false,false,4,'Rendimiento gamer con RTX 4060.'),
('samsung-tv-65-qled','Samsung','Smart TV 65" QLED 4K Q60D','https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80&auto=format&fit=crop',3249350,4999000,4.7,742,true,'televisores',true,true,false,5,'Colores vivos con tecnología Quantum Dot.'),
('iphone-15-pro','Apple','iPhone 15 Pro 256 GB Titanio Natural','https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80&auto=format&fit=crop',5165180,6299000,4.9,1284,true,'celulares',false,true,true,6,'Diseño en titanio y chip A17 Pro.'),
('asus-vivobook-15','ASUS','Portátil Vivobook 15 Intel Core i7 16 GB 512 GB SSD','https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop',2807220,3599000,4.6,418,true,'computadores',false,true,true,7,'Intel Core i7 y 16 GB de RAM.'),
('macbook-air-m3','Apple','MacBook Air 13" Chip M3 8 GB 256 GB','https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&auto=format&fit=crop',5103120,5799000,4.9,655,true,'computadores',false,true,false,8,'Chip M3, hasta 18 horas de batería.');

create policy "img public read" on storage.objects for select using (bucket_id='images');
create policy "img admin write" on storage.objects for insert to authenticated with check (bucket_id='images' and public.has_role(auth.uid(),'admin'));
create policy "img admin update" on storage.objects for update to authenticated using (bucket_id='images' and public.has_role(auth.uid(),'admin'));
create policy "img admin delete" on storage.objects for delete to authenticated using (bucket_id='images' and public.has_role(auth.uid(),'admin'));