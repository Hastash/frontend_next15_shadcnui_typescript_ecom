import { verifySession } from "./dal";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL; // ví dụ: https://cms.example.com

export async function strapiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const { isAuth, session } = await verifySession();

  if (!isAuth || !session?.jwt) {
    throw new Error("Unauthorized");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.jwt}`,
    ...options.headers,
  };

  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Strapi error: ${res.status} - ${error}`);
  }

  return res.json();
}
