
export interface apiData {
  url: string;
  method?: "GET" | "POST" | "OPTIONS" | "PUT" | "DELETE";
  body?: any;
  headers?: object;
}

export const baseUrl = "https://localhost:8283";

export async function ApiRequest({
  url,
  method = "GET",
  body = null,
  headers = {},
}: apiData) {
  if (!url) {
    throw new Error("Requires a url");
  }

  const isFormData = body instanceof FormData;

  const options: RequestInit = {
    method,
    headers: isFormData
      ? { ...headers } // let browser set Content-Type + boundary automatically
      : {
          "Content-Type": "application/json",
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
    throw new Error(result?.message || `Request failed with status `);
  }

  return result;
}
