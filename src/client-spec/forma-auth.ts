// Forma — données privées : accès via Supabase Auth + politiques RLS.
// Aucun compte client, secret de service ou donnée fictive n'est embarqué.
export type Session = { access_token: string; refresh_token: string; expires_at: number };
export type Client = { id: string; email?: string };
export type ClientProject = { id: string; title: string; status: string; site_url: string | null; created_at: string };
export type ClientOrder = { id: string; reference: string; status: string; amount_cents: number; currency: string; created_at: string };
export type ClientNotification = { id: string; title: string; body: string; created_at: string };
export type ClientActivity = { id: string; description: string; created_at: string };
const url = (import.meta.env.VITE_FORMA_SUPABASE_URL || "").replace(/\/$/, "");
const key = import.meta.env.VITE_FORMA_SUPABASE_ANON_KEY || "";
const storageKey = "forma-client-session-v1";
export const authConfigured = Boolean(key && /^https:\/\/[^/]+$/.test(url));

function headers(token?: string): HeadersInit {
  // Une clé sb_publishable_ n'est PAS un JWT. Ne jamais l'envoyer en Bearer.
  // Le header Authorization est réservé au jeton de la session du client.
  return { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), "Content-Type": "application/json" };
}
class AuthResponseError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}
const recoveryKey = storageKey + "-recovery";
export function recovering() {
  return sessionStorage.getItem(recoveryKey) === "1" ||
    new URLSearchParams(location.hash.slice(1)).get("type") === "recovery";
}
function forget() {
  sessionStorage.removeItem(storageKey);
  sessionStorage.removeItem(recoveryKey);
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  if (!authConfigured) throw new Error("L'accès privé n'est pas encore configuré.");
  const response = await fetch(`${url}${path}`, { ...options, headers: { ...headers(token), ...options.headers }, cache: "no-store" });
  if (!response.ok) {
    const data: { msg?: string; message?: string; error_description?: string } = await response.json().catch(() => ({}));
    throw new AuthResponseError(response.status, data.error_description || data.msg || data.message || "La requête sécurisée a échoué.");
  }
  const body = await response.text();
  return body ? JSON.parse(body) as T : null as T;
}
function remember(data: { access_token: string; refresh_token: string; expires_in?: number; expires_at?: number }): Session {
  const session = { access_token: data.access_token, refresh_token: data.refresh_token,
    expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600) };
  sessionStorage.setItem(storageKey, JSON.stringify(session));
  return session;
}
function stored(): Session | null {
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw) as Session;
    return data.access_token && data.refresh_token ? data : null;
  } catch { return null; }
}
export async function currentSession(): Promise<{ session: Session; client: Client } | null> {
  const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
  if (hash.has("error_description")) {
    history.replaceState(null, "", location.pathname);
    throw new Error(hash.get("error_description") || "Connexion externe refusée.");
  }
  let session = stored();
  if (hash.has("access_token") && hash.has("refresh_token")) {
    if (hash.get("type") === "recovery") sessionStorage.setItem(recoveryKey, "1");
    else sessionStorage.removeItem(recoveryKey);
    session = remember({ access_token: hash.get("access_token")!, refresh_token: hash.get("refresh_token")!,
      expires_in: Number(hash.get("expires_in") || 3600) });
    history.replaceState(null, "", location.pathname + location.search);
  }
  if (!session) return null;
  try {
    if (session.expires_at <= Math.floor(Date.now() / 1000) + 60) session = await refresh(session);
    const client = await request<Client>("/auth/v1/user", {}, session.access_token);
    if (!client.id) throw new Error("Session invalide.");
    return { session, client };
  } catch (error) {
    if (error instanceof AuthResponseError && [400,401,403].includes(error.status)) {
      if (stored()?.refresh_token === session.refresh_token) forget();
      return null;
    }
    throw error;
  }
}
let refreshing: { token: string; promise: Promise<Session> } | undefined;
function refresh(session: Session): Promise<Session> {
  if (refreshing?.token === session.refresh_token) return refreshing.promise;
  const promise = rotateSession(session).finally(() => {
    if (refreshing?.promise === promise) refreshing = undefined;
  });
  refreshing = { token: session.refresh_token, promise };
  return promise;
}
async function rotateSession(session: Session): Promise<Session> {
  const data = await request<{ access_token: string; refresh_token: string; expires_in: number }>(
    "/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }) });
  if (stored()?.refresh_token !== session.refresh_token) throw new Error("La session a changé.");
  return remember(data);
}
export async function register(email: string, password: string): Promise<boolean> {
  const redirect = encodeURIComponent(location.origin + "/espace-client");
  const result = await request<{ access_token?: string; refresh_token?: string; expires_in?: number }>(
    `/auth/v1/signup?redirect_to=${redirect}`, { method: "POST", body: JSON.stringify({ email, password }) });
  if (result.access_token && result.refresh_token) { remember({ access_token: result.access_token, refresh_token: result.refresh_token, expires_in: result.expires_in }); return true; }
  return false; // confirmation d'e-mail requise
}
export async function signIn(email: string, password: string): Promise<void> {
  const data = await request<{ access_token: string; refresh_token: string; expires_in: number }>(
    "/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password }) });
  sessionStorage.removeItem(recoveryKey);
  remember(data);
}
export async function requestLoginCode(email: string): Promise<void> {
  await request("/auth/v1/otp", { method: "POST", body: JSON.stringify({ email, create_user: false }) });
}

/** Vérifie le code e-mail émis par Supabase pour cette adresse. */
export async function verifyEmailCode(email: string, code: string): Promise<void> {
  if (!/^\d{6}$/.test(code)) throw new Error("Saisissez exactement six chiffres.");
  const data = await request<{ access_token?: string; refresh_token?: string; expires_in?: number }>(
    "/auth/v1/verify", {
      method: "POST",
      body: JSON.stringify({ type: "email", email, token: code }),
    }
  );
  if (!data.access_token || !data.refresh_token) {
    throw new Error("Confirmation reçue, mais la session n'a pas été ouverte. Essayez de vous connecter.");
  }
  remember({ access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in });
}

/** Nouveau code uniquement pour une inscription non confirmée (limité par GoTrue). */
export async function resendSignupCode(email: string): Promise<void> {
  await request("/auth/v1/resend", {
    method: "POST",
    body: JSON.stringify({ type: "signup", email }),
  });
}

export function socialLogin(provider: "google" | "github" | "x"): void {
  if (!authConfigured) return;
  // Seuls les prestataires activés dans Supabase peuvent aboutir.
  location.assign(`${url}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(location.origin + "/espace-client")}`);
}
export async function resetPassword(email: string): Promise<void> {
  const redirect = encodeURIComponent(location.origin + "/espace-client");
  await request(`/auth/v1/recover?redirect_to=${redirect}`, { method: "POST", body: JSON.stringify({ email }) });
}
export async function updatePassword(password: string, session: Session): Promise<void> {
  await request("/auth/v1/user", { method: "PUT", body: JSON.stringify({ password }) }, session.access_token);
}
export async function signOut(): Promise<void> {
  const session = stored();
  forget();
  if (session) await request("/auth/v1/logout?scope=local", { method: "POST" }, session.access_token);
}
async function selectRows<T>(table: string, columns: string, session: Session, clientId: string): Promise<T[]> {
  const rows = await request<T[]>(`/rest/v1/${table}?select=${encodeURIComponent(columns)}&client_id=eq.${encodeURIComponent(clientId)}&order=created_at.desc&limit=50`, {}, session.access_token);
  if (!Array.isArray(rows)) throw new Error("Réponse privée invalide.");
  return rows;
}
export async function loadDashboard(session: Session, clientId: string) {
  const [projects, orders, notifications, activity] = await Promise.all([
    selectRows<ClientProject>("forma_client_projects", "id,title,status,site_url,created_at", session, clientId),
    selectRows<ClientOrder>("forma_client_orders", "id,reference,status,amount_cents,currency,created_at", session, clientId),
    selectRows<ClientNotification>("forma_client_notifications", "id,title,body,created_at", session, clientId),
    selectRows<ClientActivity>("forma_client_activity", "id,description,created_at", session, clientId),
  ]);
  return { projects, orders, notifications, activity };
}
