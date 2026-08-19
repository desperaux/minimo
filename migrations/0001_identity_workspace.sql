CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  auth_provider_user_id text NOT NULL UNIQUE,
  email_normalized text NOT NULL,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  disabled_at timestamptz
);

CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY,
  name varchar(120) NOT NULL,
  slug varchar(64) NOT NULL UNIQUE,
  country_code char(2) NOT NULL DEFAULT 'US',
  currency_code char(3) NOT NULL DEFAULT 'USD',
  timezone varchar(64) NOT NULL,
  default_payment_terms_days integer NOT NULL CHECK (default_payment_terms_days IN (7, 14, 30)),
  invoice_prefix varchar(12),
  next_invoice_sequence integer NOT NULL DEFAULT 1 CHECK (next_invoice_sequence > 0),
  support_email varchar(320) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE TABLE IF NOT EXISTS workspace_members (
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role varchar(16) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS workspace_members_one_owner
  ON workspace_members (user_id) WHERE role = 'owner';

CREATE INDEX IF NOT EXISTS workspace_members_user_idx ON workspace_members (user_id);
