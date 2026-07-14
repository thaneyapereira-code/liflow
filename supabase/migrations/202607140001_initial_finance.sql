-- LIFLOW MVP financeiro
-- Valores monetários são armazenados em unidades mínimas (centavos) para evitar
-- erros de ponto flutuante. A moeda original nunca é descartada.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  base_currency text not null default 'EUR' check (base_currency ~ '^[A-Z]{3}$'),
  locale text not null default 'pt-PT',
  timezone text not null default 'Europe/London',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.flows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  color text not null default '#2688FF' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  position smallint not null default 0,
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id)
);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flow_id uuid not null,
  name text not null check (char_length(name) between 1 and 80),
  type text not null check (type in ('checking', 'savings', 'cash', 'credit', 'investment')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  opening_balance_minor bigint not null default 0,
  institution_name text,
  color text not null default '#24C894' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_archived boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id),
  constraint accounts_flow_owner_fk foreign key (flow_id, user_id)
    references public.flows(id, user_id) on delete cascade
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  kind text not null check (kind in ('income', 'expense')),
  icon text not null default 'circle',
  color text not null default '#71809A' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_system boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id),
  unique (user_id, kind, name)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flow_id uuid not null,
  account_id uuid not null,
  category_id uuid,
  transfer_account_id uuid,
  type text not null check (type in ('income', 'expense', 'transfer')),
  status text not null default 'cleared' check (status in ('pending', 'cleared')), 
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  description text not null check (char_length(description) between 1 and 140),
  notes text check (notes is null or char_length(notes) <= 1000),
  occurred_on date not null default current_date,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint transactions_flow_owner_fk foreign key (flow_id, user_id)
    references public.flows(id, user_id) on delete cascade,
  constraint transactions_account_owner_fk foreign key (account_id, user_id)
    references public.accounts(id, user_id) on delete cascade,
  constraint transactions_category_owner_fk foreign key (category_id, user_id)
    references public.categories(id, user_id) on delete restrict,
  constraint transactions_transfer_account_owner_fk foreign key (transfer_account_id, user_id)
    references public.accounts(id, user_id) on delete restrict,
  constraint transactions_transfer_shape check (
    (type = 'transfer' and transfer_account_id is not null and category_id is null and transfer_account_id <> account_id)
    or (type <> 'transfer' and transfer_account_id is null)
  )
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid not null,
  month date not null check (month = date_trunc('month', month)::date),
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint budgets_category_owner_fk foreign key (category_id, user_id)
    references public.categories(id, user_id) on delete cascade,
  unique (user_id, category_id, month)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  target_minor bigint not null check (target_minor > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  target_date date,
  color text not null default '#24C894' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (id, user_id)
);

create table public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null,
  amount_minor bigint not null check (amount_minor <> 0),
  contributed_on date not null default current_date,
  note text check (note is null or char_length(note) <= 280),
  created_at timestamptz not null default timezone('utc', now()),
  constraint goal_contributions_goal_owner_fk foreign key (goal_id, user_id)
    references public.goals(id, user_id) on delete cascade
);

create index flows_user_id_idx on public.flows(user_id);
create index accounts_user_id_idx on public.accounts(user_id);
create index accounts_flow_id_idx on public.accounts(flow_id);
create index categories_user_id_idx on public.categories(user_id);
create index transactions_user_date_idx on public.transactions(user_id, occurred_on desc);
create index transactions_account_id_idx on public.transactions(account_id);
create index transactions_category_id_idx on public.transactions(category_id);
create index budgets_user_month_idx on public.budgets(user_id, month);
create index goals_user_id_idx on public.goals(user_id);
create index goal_contributions_goal_id_idx on public.goal_contributions(goal_id);

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger flows_set_updated_at before update on public.flows
for each row execute function public.set_updated_at();
create trigger accounts_set_updated_at before update on public.accounts
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger transactions_set_updated_at before update on public.transactions
for each row execute function public.set_updated_at();
create trigger budgets_set_updated_at before update on public.budgets
for each row execute function public.set_updated_at();
create trigger goals_set_updated_at before update on public.goals
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.categories (user_id, name, kind, icon, color, is_system)
  values
    (new.id, 'Salário', 'income', 'wallet', '#24C894', true),
    (new.id, 'Outras receitas', 'income', 'circle-plus', '#35B8BA', true),
    (new.id, 'Moradia', 'expense', 'house', '#327DD8', true),
    (new.id, 'Alimentação', 'expense', 'utensils', '#BEA75C', true),
    (new.id, 'Transporte', 'expense', 'car', '#71D6AF', true),
    (new.id, 'Saúde', 'expense', 'heart-pulse', '#FF6178', true),
    (new.id, 'Lazer', 'expense', 'sparkles', '#8B67EF', true),
    (new.id, 'Outros', 'expense', 'shapes', '#9AA6B8', true);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.flows enable row level security;
alter table public.accounts enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;
alter table public.goal_contributions enable row level security;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.flows to authenticated;
grant select, insert, update, delete on public.accounts to authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.budgets to authenticated;
grant select, insert, update, delete on public.goals to authenticated;
grant select, insert, update, delete on public.goal_contributions to authenticated;

create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "flows_all_own" on public.flows for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "accounts_all_own" on public.accounts for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "categories_all_own" on public.categories for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "transactions_all_own" on public.transactions for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "budgets_all_own" on public.budgets for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "goals_all_own" on public.goals for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "goal_contributions_all_own" on public.goal_contributions for all to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create view public.account_balances
with (security_invoker = true)
as
select
  a.id as account_id,
  a.user_id,
  a.currency,
  a.opening_balance_minor
    + coalesce(sum(
      case
        when t.type = 'income' and t.account_id = a.id then t.amount_minor
        when t.type = 'expense' and t.account_id = a.id then -t.amount_minor
        when t.type = 'transfer' and t.account_id = a.id then -t.amount_minor
        when t.type = 'transfer' and t.transfer_account_id = a.id then t.amount_minor
        else 0
      end
    ) filter (where t.status = 'cleared'), 0) as balance_minor
from public.accounts a
left join public.transactions t
  on t.user_id = a.user_id
  and (t.account_id = a.id or t.transfer_account_id = a.id)
group by a.id, a.user_id, a.currency, a.opening_balance_minor;

grant select on public.account_balances to authenticated;
