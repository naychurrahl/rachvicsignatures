
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
  headers = {
    //"Authorization": `Bearer ${localStorage.getItem("token")}`,
    //Authorization: `ZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKSVV6STFOaUo5LmV5SjFjMlZ5U1dRaU9pSTJPR0kyTlRoak0yUTJZakZsSWl3aWJtRnRaU0k2SW1OaGNIUnZjaUlzSW1WdFlXbHNJam9pYm1GNVkyaDFjbkpoYUd4QVoyMWhhV3d1WTI5dElpd2ljbTlzWlNJNkltRmtiV2x1SWl3aWFXRjBJam94TnpjNU5UVXpNRGc0ZlEuZkxhUk9kYVp1Rlp6M0I0Sl9LRGR4OXluMUlsOG1VNF9XZ3NocDh0SjRhYw==`,
  },
}: apiData) {
  if (!url) {
    throw new Error("Requires a url");
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  };

  if (body && method !== "GET") {
    options.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  //console.log({ options: options });
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
