import * as api from "./api";
import { Ingresso } from "../types";

const PATH = "ingressos";

export async function listar(): Promise<Ingresso[]> {
  return api.get(PATH);
}

export async function buscar(id: number): Promise<Ingresso> {
  return api.get(`${PATH}/${id}`);
}

export async function criar(data: Ingresso): Promise<Ingresso> {
  return api.post(PATH, data);
}

export async function atualizar(id: number, data: Ingresso): Promise<Ingresso> {
  return api.put(`${PATH}/${id}`, data);
}

export async function remover(id: number): Promise<void> {
  return api.remove(`${PATH}/${id}`);
}
