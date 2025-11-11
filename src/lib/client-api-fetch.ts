"use client";

import toast from "react-hot-toast";

let token: string | null = null;

export function setClientToken(clerk_token: string | null) {
  token = clerk_token;
}

export async function clientApiFetch(path: string, options: RequestInit = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL!;

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
    console.log(`Something went wrong: API ${res.status}: ${text || res.statusText}`);
    toast(`Something went wrong: API ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}
