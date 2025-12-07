import * as api from "./api";
import type { Sessao } from "../types";

const PATH = "sessoes";

export async function listar(): Promise<Sessao[]> {
  return api.get(PATH);
}

export async function buscar(id: number): Promise<Sessao> {
  return api.get(`${PATH}/${id}`);
}

export async function criar(data: Sessao): Promise<Sessao> {
  return api.post(PATH, data);
}

export async function atualizar(id: number, data: Sessao): Promise<Sessao> {
  return api.put(`${PATH}/${id}`, data);
}

export async function remover(id: number): Promise<void> {
  return api.remove(`${PATH}/${id}`);
}
