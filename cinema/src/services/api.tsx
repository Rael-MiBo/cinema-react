const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function handleResp(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function get(path: string) {
  const res = await fetch(`${BASE}/${path}`);
  return handleResp(res);
}

export async function post(path: string, body: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResp(res);
}

export async function put(path: string, body: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return handleResp(res);
}

export async function remove(path: string) {
  const res = await fetch(`${BASE}/${path}`, { method: "DELETE" });
  return handleResp(res);
}
