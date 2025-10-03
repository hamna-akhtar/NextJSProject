import { auth } from "@clerk/nextjs/server";

export async function serverApiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.INTERNAL_API_URL!;

  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,

    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.log(
      `Something went wrong: API ${res.status}: ${text || res.statusText}`,
    );
    return [];
  }
  if (res.status === 204) return null;
  return res.json();
}
