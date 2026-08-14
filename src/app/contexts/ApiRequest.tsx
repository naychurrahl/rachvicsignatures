import { apiData } from "@/app/data/interFaces";

export const baseUrl = import.meta.env.VITE_API_URL || "https://rachvic.alwaysdata.net";

const TOKEN_KEY = "auth_token";

// Cookie is the primary auth transport (see backend Functions::verifyJWT) -- this
// bearer token is sent alongside it as a fallback for contexts where the cookie
// doesn't arrive (blocked third-party cookies, cross-domain deploys).
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function ApiRequest({
  url,
  method = "GET",
  body = null,
  headers = {},
}: apiData) {
  if (!url) {
    throw new Error("Requires a url");
  }

  const token = getAuthToken();
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const isFormData = body instanceof FormData;
  const needsOverride =
    isFormData && ["PUT", "PATCH", "DELETE"].includes(method);

  const options: RequestInit = {
    method: needsOverride ? "POST" : method,
    headers: isFormData
      ? {
          ...authHeaders,
          ...headers,
          ...(needsOverride && { "X-HTTP-Method-Override": method }),
        }
      : {
          "Content-Type": "application/json",
          ...authHeaders,
          ...headers,
        },
    credentials: "include",
  };

  if (body && method !== "GET") {
    options.body = isFormData
      ? body
      : typeof body === "string"
        ? body
        : JSON.stringify(body);
  }

  const response = await fetch(url, options);

  let result;
  const ContentType = response.headers.get("content-type");

  if (ContentType && ContentType?.includes("application/json")) {
    result = await response.json();
  } else {
    result = await response.text();
  }

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || `Request failed with status `,
    );
  }

  return result;
}
