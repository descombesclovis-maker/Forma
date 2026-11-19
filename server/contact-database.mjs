import { resolve } from "node:path";

// pg-connection-string derives TLS options from the URI, including the CA file.
export function contactDatabaseUrl(connectionString) {
  const url = new URL(connectionString);
  if (!url.hostname.endsWith(".pooler.supabase.com")) return connectionString;
  url.searchParams.set("sslmode", "verify-full");
  url.searchParams.set("sslrootcert", resolve("server/certs/prod-ca-2021.crt"));
  return url.href;
}
