-- FORMA / Portail client — première tranche : lecture privée des dossiers.
-- Appliquer sur un NOUVEAU projet Supabase dédié à Forma (jamais sur QEH ou un autre projet).
-- Toutes les écritures de production sont réservées au backend de confiance (service role).
create table if not exists public.forma_client_projects (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references auth.users(id) on delete cascade,
 title text not null, status text not null default 'preparation',
 site_url text, created_at timestamptz not null default now()
);
create table if not exists public.forma_client_orders (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references auth.users(id) on delete cascade,
 project_id uuid references public.forma_client_projects(id) on delete set null,
 reference text not null unique, status text not null default 'en_attente',
 amount_cents integer not null check(amount_cents >= 0), currency text not null default 'EUR',
 created_at timestamptz not null default now()
);
create table if not exists public.forma_client_notifications (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references auth.users(id) on delete cascade,
 title text not null, body text not null, created_at timestamptz not null default now()
);
create table if not exists public.forma_client_activity (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references auth.users(id) on delete cascade,
 description text not null, created_at timestamptz not null default now()
);
alter table public.forma_client_projects enable row level security;
alter table public.forma_client_orders enable row level security;
alter table public.forma_client_notifications enable row level security;
alter table public.forma_client_activity enable row level security;
revoke all on public.forma_client_projects,public.forma_client_orders,public.forma_client_notifications,public.forma_client_activity from anon, authenticated;
grant select on public.forma_client_projects,public.forma_client_orders,public.forma_client_notifications,public.forma_client_activity to authenticated;
drop policy if exists forma_projects_owner_select on public.forma_client_projects;
drop policy if exists forma_orders_owner_select on public.forma_client_orders;
drop policy if exists forma_notifications_owner_select on public.forma_client_notifications;
drop policy if exists forma_activity_owner_select on public.forma_client_activity;
create policy forma_projects_owner_select on public.forma_client_projects for select to authenticated using(client_id = (select auth.uid()));
create policy forma_orders_owner_select on public.forma_client_orders for select to authenticated using(client_id = (select auth.uid()));
create policy forma_notifications_owner_select on public.forma_client_notifications for select to authenticated using(client_id = (select auth.uid()));
create policy forma_activity_owner_select on public.forma_client_activity for select to authenticated using(client_id = (select auth.uid()));
create index if not exists forma_client_projects_owner on public.forma_client_projects(client_id,created_at desc);
create index if not exists forma_client_orders_owner on public.forma_client_orders(client_id,created_at desc);
create index if not exists forma_client_notifications_owner on public.forma_client_notifications(client_id,created_at desc);
create index if not exists forma_client_activity_owner on public.forma_client_activity(client_id,created_at desc);
-- Pas de politiques INSERT/UPDATE/DELETE pour les clients : refus par défaut.
-- Vérifier les RLS avec deux vrais comptes avant tout dépôt de données personnelles.
