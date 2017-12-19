-- join tables are always table1_table2_join, with t1 and t2 in alpha order

drop schema if exists florence cascade;
create schema florence;

create table florence.users (
  id text not null primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table florence.profiles (
  id text not null primary key,
  name text not null,
  about jsonb not null default '{}'::jsonb,
  draft jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table florence.profiles_users_join (
  user_id text not null references florence.users(id),
  profile_id text not null references florence.profiles(id),
  created_at timestamptz not null default now()
);

create table florence.communities (
  id text not null primary key,
  name text not null,
  description jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table florence.communities_profiles_join (
  community_id text not null references florence.communities(id),
  profile_id text not null references florence.profiles(id),
  created_at timestamptz not null default now()
);

create table florence.posts (
  id text not null primary key,
  name text not null,
  body jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table florence.communities_posts_join (
  community_id text not null references florence.communities(id),
  post_id text not null references florence.posts(id),
  created_at timestamptz not null default now()
);

create table florence.posts_profiles_join (
  post_id text not null references florence.posts(id),
  profile_id text not null references florence.profiles(id),
  created_at timestamptz not null default now()
);
