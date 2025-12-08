import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

export async function get(path: string) {
  const { data } = await api.get(path);
  return data;
}

export async function post(path: string, body: any) {
  const { data } = await api.post(path, body);
  return data;
}

export async function put(path: string, body: any) {
  const { data } = await api.put(path, body);
  return data;
}

export async function remove(path: string) {
  await api.delete(path);
}

export default api;
