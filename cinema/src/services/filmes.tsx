import { get, post, put, remove } from "./api";
import type { Filme } from "../types/index";
import type { Sessao } from "../types/index";

const PATH = "filmes";

export async function listar(): Promise<Filme[]> {
  return await get(PATH);
}

export async function obter(id: number): Promise<Filme> {
  return await get(`${PATH}/${id}`);
}

export async function criar(body: Filme): Promise<Filme> {
  return await post(PATH, body);
}

export async function atualizar(id: number, body: Filme): Promise<Filme> {
  return await put(`${PATH}/${id}`, body);
}

export async function removerFilme(id: number): Promise<void> {
  await remove(`${PATH}/${id}`);

  const sessoes: Sessao[] = await get("sessoes");
  const relacionadas = sessoes.filter((s) => s.filmeId === id);

  for (const s of relacionadas) {
    await remove(`sessoes/${s.id}`);
  }
}
