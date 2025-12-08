// import { get, post, put, remove } from "./api";
// import type { Ingresso } from "../types/index";

// const PATH = "ingressos";

// export async function listar(): Promise<Ingresso[]> {
//   return await get(PATH);
// }

// export async function obter(id: number | string): Promise<Ingresso> {
//   return await get(`${PATH}/${id}`);
// }

// export async function criar(body: Ingresso): Promise<Ingresso> {
//   body.valor = Number(body.valor);
//   return await post(PATH, body);
// }

// export async function atualizar(id: number, body: Ingresso): Promise<Ingresso> {
//   body.valor = Number(body.valor);
//   return await put(`${PATH}/${id}`, body);
// }

// export async function removerIngresso(id: number): Promise<void> {
//   await remove(`${PATH}/${id}`);
// }
