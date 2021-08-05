# `TicTacToe Online`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Schema

```sql
-- Create a table for Public Profiles
create table profiles (
  id uuid references auth.users not null,
  avatar_url text,
  username text unique,
  updated_at timestamp with time zone default timezone('utc'::text, now()),

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for Public Profiles
create table if not exists presence (
  id uuid references public.profiles not null,
  status        bool default false not null,
  updated_at    timestamp with time zone default timezone('utc'::text, now()),

  primary key (id)
);

alter table presence enable row level security;

create policy "Presence are viewable by everyone."
  on presence for select
  using ( true );

create policy "Users can insert their own presence."
  on presence for insert
  with check ( auth.uid() = id );

create policy "Users can update own presence."
  on presence for update
  using ( auth.uid() = id );

-- clean up
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

-- inserts a row into public.presence
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  insert into public.presence (id, status)
  values (new.id, true);
  return new;
end;
$$ language plpgsql security definer;

-- trigger handle_new_user function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- clean up
drop trigger if exists on_presence_updated on public.presence;
drop function if exists public.verify_presence;

-- update presence status when updated_at greater than a duration
create function public.verify_presence()
returns trigger as $$
begin
  update public.presence
  set status = false
  where now() - updated_at > interval '10 second';
  return null;
end;
$$ language plpgsql security definer;

-- trigger verify_presence function every time a presence is updated
-- pg_trigger_depth: https://stackoverflow.com/a/14262289
create trigger on_presence_updated
  after update on public.presence
  for each row when (pg_trigger_depth() = 0)
  execute procedure public.verify_presence();
```

## License

This repo is licenced under MIT.

## Credits

- https://github.com/khrj/tic-tac-toe: the game UI
