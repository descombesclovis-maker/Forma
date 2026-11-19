-- Apply as the database owner. Use a dedicated runtime role (grants in docs/CONTACT.md).
begin;
create schema forma_contact;
revoke all on schema forma_contact from public;
create table forma_contact.requests (
  reference uuid primary key default gen_random_uuid(),
  submission uuid not null unique,
  fingerprint text not null,
  source_hash text not null,
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contact','quote','quick')),
  name text not null, email text not null, subject text not null, message text not null
);
create index on forma_contact.requests (source_hash, created_at desc);
create index on forma_contact.requests (email, created_at desc);
create index on forma_contact.requests (fingerprint, created_at desc);
create index on forma_contact.requests (created_at desc, reference desc);
create table forma_contact.notifications (
  reference uuid not null references forma_contact.requests on delete cascade,
  channel text not null check (channel in ('email','telegram')),
  state text not null default 'pending' check (state in ('pending','sending','accepted','failed')),
  claimed_at timestamptz, claim uuid,
  primary key(reference,channel)
);
revoke all on all tables in schema forma_contact from public;
commit;
