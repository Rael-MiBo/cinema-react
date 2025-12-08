import { get, post, put, remove } from "./api";
import type { Sala } from "../types/index";
import type { Sessao } from "../types/index";

const PATH = "salas";

export async function listar(): Promise<Sala[]> {
  return await get(PATH);
}

export async function obter(id: number): Promise<Sala> {
  return await get(`${PATH}/${id}`);
}

export async function criar(body: Sala): Promise<Sala> {
  return await post(PATH, body);
}

export async function atualizar(id: number, body: Sala): Promise<Sala> {
  return await put(`${PATH}/${id}`, body);
}

export async function removerSala(id: number): Promise<void> {
  await remove(`${PATH}/${id}`);

  // Remover sessões que usam essa sala
  const sessoes: Sessao[] = await get("sessoes");
  const relacionadas = sessoes.filter((s) => s.salaId === id);

  for (const s of relacionadas) {
    await remove(`sessoes/${s.id}`);
  }
}
