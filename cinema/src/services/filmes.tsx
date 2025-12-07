import * as api from "./api";
import { Filme } from "../types";

const PATH = "filmes";

export async function listar(): Promise<Filme[]> {
  return api.get(PATH);
}

export async function buscar(id: number): Promise<Filme> {
  return api.get(`${PATH}/${id}`);
}

export async function criar(data: Filme): Promise<Filme> {
  return api.post(PATH, data);
}

export async function atualizar(id: number, data: Filme): Promise<Filme> {
  return api.put(`${PATH}/${id}`, data);
}

export async function remover(id: number): Promise<void> {
  return api.remove(`${PATH}/${id}`);
}
