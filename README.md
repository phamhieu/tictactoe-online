# `WIP: TicTacToe Online`

## Todos

- [x] Implement Presence system
- [ ] Allow to invite other to a 1vs1
- [ ] Build game rules
  - [x] Classic tictactoe rule
  - [ ] Everyone has 10 seconds to think in a game. Player with idle time more than 10 seconds will lose the game.
  - [ ] Player with longer idle time will lose a draw game
- [ ] Game report
  - [ ] ...

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

-- Create a table for Presence. The client will ping every 10s to update updated_at
create table if not exists presence (
  id uuid references public.profiles not null,
  updated_at    timestamp with time zone default timezone('utc'::text, now()),

  primary key (id)
);

-- Create a table for Presence status. Trigger will check presence.updated_at and update the status
-- We can listen to status update from a realtime subscription client
create table if not exists presence_status (
  id uuid references public.profiles not null,
  status        bool default false not null,

  primary key (id)
);

-- clean up
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

-- inserts a row into public.presence, public.presence_status
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  insert into public.presence (id)
  values (new.id);
  insert into public.presence_status (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- trigger handle_new_user function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- clean up
drop trigger if exists on_presence_updated on public.presence;
drop function if exists public.verify_presence_status;

-- update presence status when updated_at greater than a duration
create function public.verify_presence_status()
returns trigger as $$
begin
  -- update presence_status to true for the updated id
  update public.presence_status
  set status = true
  where status = false and id = new.id;
  -- verify all other true status
  update public.presence_status
  set status = false
  from public.presence
  where public.presence.id = public.presence_status.id
        and status = true
        and now() - updated_at > interval '10 second';
  return null;
end;
$$ language plpgsql security definer;

-- trigger verify_presence_status function every time a presence is updated
-- pg_trigger_depth: https://stackoverflow.com/a/14262289
create trigger on_presence_updated
  after update on public.presence
  for each row when (pg_trigger_depth() = 0)
  execute procedure public.verify_presence_status();
```

## License

This repo is licenced under MIT.

## Credits

- https://github.com/khrj/tic-tac-toe: the game UI
