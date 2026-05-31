create extension if not exists pgcrypto;

create type public.account_role as enum ('customer','staff','admin');
create type public.order_status as enum ('Poruceno','U obradi','Na putu','Dostavljeno','Ceka uplatu');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null, role public.account_role not null default 'customer',
  label text not null, email text not null, phone text default '', credit numeric(12,2) not null default 0,
  active boolean not null default true, force_password_change boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.staff_permissions (
  user_id uuid references public.profiles(id) on delete cascade,
  permission text not null check(permission in ('manage_products','manage_orders','manage_customers','manage_prices','manage_invoices','manage_support','manage_special_requests')),
  primary key(user_id,permission)
);
create table public.products (
  id uuid primary key default gen_random_uuid(), name text not null, category text not null,
  description text default '', manufacturer text default '', color_name text default '',
  package_size text default '', base text default '', purpose text default '',
  retail_price numeric(12,2) not null check(retail_price>=0), image_url text, in_stock boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.customer_discounts (
  customer_id uuid references public.profiles(id) on delete cascade, category text not null default '*',
  discount_percent numeric(5,2) not null check(discount_percent between 0 and 100),
  primary key(customer_id,category)
);
create table public.customer_special_prices (
  customer_id uuid references public.profiles(id) on delete cascade, product_id uuid references public.products(id) on delete cascade,
  price numeric(12,2) not null check(price>=0), primary key(customer_id,product_id)
);
create table public.orders (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.profiles(id),
  customer_email text not null, status public.order_status not null default 'Poruceno',
  created_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), quantity integer not null check(quantity>0), unit_price numeric(12,2) not null
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id), name text not null, amount numeric(12,2) not null,
  status public.order_status not null default 'Poruceno', is_paid boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.product_views (
  id bigint generated always as identity primary key, customer_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade, viewed_at timestamptz not null default now()
);
create table public.special_requests (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.profiles(id) on delete cascade,
  message text not null, status text not null default 'Novo', created_at timestamptz not null default now()
);
create table public.support_threads (
  id uuid primary key default gen_random_uuid(), customer_id uuid references public.profiles(id),
  guest_email text, access_token_hash text, assigned_to uuid references public.profiles(id),
  status text not null default 'Novo', created_at timestamptz not null default now()
);
create table public.support_messages (
  id uuid primary key default gen_random_uuid(), thread_id uuid references public.support_threads(id) on delete cascade,
  sender_id uuid references public.profiles(id), guest_sender boolean not null default false,
  body text not null, created_at timestamptz not null default now()
);
create table public.password_reset_audit (
  id bigint generated always as identity primary key, actor_id uuid references public.profiles(id),
  target_email text not null, action text not null check(action in ('reset_email','temporary_password')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin' and active);
$$;
create or replace function public.has_permission(p text) returns boolean language sql stable security definer set search_path=public as $$
  select public.is_admin() or exists(select 1 from public.staff_permissions where user_id=auth.uid() and permission=p);
$$;

alter table public.profiles enable row level security;
alter table public.staff_permissions enable row level security;
alter table public.products enable row level security;
alter table public.customer_discounts enable row level security;
alter table public.customer_special_prices enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.invoices enable row level security;
alter table public.product_views enable row level security;
alter table public.special_requests enable row level security;
alter table public.support_threads enable row level security;
alter table public.support_messages enable row level security;
alter table public.password_reset_audit enable row level security;

create policy "public product catalog" on public.products for select using(true);
create policy "staff manage products" on public.products for all using(public.has_permission('manage_products')) with check(public.has_permission('manage_products'));
create policy "read own profile" on public.profiles for select using(id=auth.uid() or public.has_permission('manage_customers'));
create policy "update own profile" on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy "read own discounts" on public.customer_discounts for select using(customer_id=auth.uid() or public.has_permission('manage_prices'));
create policy "read own prices" on public.customer_special_prices for select using(customer_id=auth.uid() or public.has_permission('manage_prices'));
create policy "read own invoices" on public.invoices for select using(customer_id=auth.uid() or public.has_permission('manage_invoices'));
create policy "staff manage invoices" on public.invoices for all using(public.has_permission('manage_invoices')) with check(public.has_permission('manage_invoices'));
create policy "read own orders" on public.orders for select using(customer_id=auth.uid() or public.has_permission('manage_orders'));
create policy "create own orders" on public.orders for insert with check(customer_id=auth.uid());
create policy "staff manage orders" on public.orders for all using(public.has_permission('manage_orders')) with check(public.has_permission('manage_orders'));
create policy "read own requests" on public.special_requests for select using(customer_id=auth.uid() or public.has_permission('manage_special_requests'));
create policy "create own requests" on public.special_requests for insert with check(customer_id=auth.uid());
create policy "staff support threads" on public.support_threads for select using(public.has_permission('manage_support') or customer_id=auth.uid());
create policy "staff support messages" on public.support_messages for select using(public.has_permission('manage_support') or exists(select 1 from public.support_threads t where t.id=thread_id and t.customer_id=auth.uid()));
create policy "staff insert messages" on public.support_messages for insert with check(public.has_permission('manage_support') or exists(select 1 from public.support_threads t where t.id=thread_id and t.customer_id=auth.uid()));

insert into storage.buckets(id,name,public) values('product-images','product-images',true) on conflict(id) do nothing;
create policy "public product images" on storage.objects for select using(bucket_id='product-images');
create policy "staff upload product images" on storage.objects for insert with check(bucket_id='product-images' and public.has_permission('manage_products'));

alter publication supabase_realtime add table public.support_messages;
