-- products テーブル (in-memory を DB に移行する学習用)
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price integer not null,
  created_at timestamptz default now()
);

-- cart_items: セッション/ユーザー概念簡略化のため temp_user_id で紐づけ
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  temp_user_id text not null,
  product_id uuid references products(id) on delete cascade,
  qty integer not null default 1,
  created_at timestamptz default now(),
  unique (temp_user_id, product_id)
);

-- orders と order_items
create table orders (
  id uuid primary key default gen_random_uuid(),
  temp_user_id text not null,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  qty integer not null,
  price_at_order integer not null,
  created_at timestamptz default now()
);
