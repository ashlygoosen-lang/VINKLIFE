export const schemaSql = /* sql */ `
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  organisation text not null default '',
  type text not null,
  contact_preference text not null,
  company text not null,
  message text not null,
  details jsonb not null default '{}'::jsonb,
  consent_at timestamptz not null,
  status text not null default 'new' check (status in ('new','in_progress','resolved','spam')),
  notes text not null default '',
  ip_hash text
);
create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx on enquiries (status);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'website',
  unsubscribe_token text not null unique,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);
create unique index if not exists subscribers_email_idx on subscribers (lower(email));

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  department text not null,
  location text not null,
  employment_type text not null default 'Full-time',
  summary text not null default '',
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references jobs(id) on delete set null,
  job_title text not null,
  name text not null,
  email text not null,
  phone text not null,
  linkedin_url text not null default '',
  cv_url text not null default '',
  cover_note text not null,
  consent_at timestamptz not null,
  status text not null default 'new' check (status in ('new','reviewing','shortlisted','rejected','hired')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  ip_hash text
);
create index if not exists applications_created_idx on applications (created_at desc);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null check (category in ('Group news','Impact','Perspective')),
  excerpt text not null default '',
  body text not null default '',
  image_url text not null default '',
  status text not null default 'draft' check (status in ('draft','published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_pub_idx on articles (status, published_at desc);
`;
