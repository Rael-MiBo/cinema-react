import { get, post, put, remove } from "./api";
import type { Sessao } from "../types/index";

const PATH = "sessoes";

export async function listar(): Promise<Sessao[]> {
  return await get(PATH);
}

export async function obter(id: number): Promise<Sessao> {
  return await get(`${PATH}/${id}`);
}

export async function criar(body: Sessao): Promise<Sessao> {
  return await post(PATH, body);
}

export async function atualizar(id: number, body: Sessao): Promise<Sessao> {
  return await put(`${PATH}/${id}`, body);
}

export async function removerSessao(id: number): Promise<void> {
  await remove(`${PATH}/${id}`);
}
export function buscar(arg0: number) {
  throw new Error("Function not implemented.");
}

