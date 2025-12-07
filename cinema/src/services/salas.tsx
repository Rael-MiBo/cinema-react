import * as api from "./api";
import type { Sala } from "../types";

const PATH = "salas";

export async function listar(): Promise<Sala[]> {
  return api.get(PATH);
}

export async function buscar(id: number): Promise<Sala> {
  return api.get(`${PATH}/${id}`);
}

export async function criar(data: Sala): Promise<Sala> {
  return api.post(PATH, data);
}

export async function atualizar(id: number, data: Sala): Promise<Sala> {
  return api.put(`${PATH}/${id}`, data);
}

export async function remover(id: number): Promise<void> {
  return api.remove(`${PATH}/${id}`);
}
