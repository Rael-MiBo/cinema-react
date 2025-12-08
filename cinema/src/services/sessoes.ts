import { APIService } from "./api";
import type { Sessao } from "../types";

const PATH = "sessoes";

export const sessoesService = {
  listar: () => APIService.get<Sessao[]>(PATH),
  obter: (id: number | string) => APIService.get<Sessao>(`${PATH}/${id}`),
  criar: (dados: Sessao) => APIService.post<Sessao>(PATH, dados),
  atualizar: (id: number | string, dados: Sessao) => APIService.put<Sessao>(PATH, id, dados),
  remover: (id: number | string) => APIService.delete(PATH, id),
  
  // Função extra para compatibilidade
  buscar: (id: number | string) => APIService.get<Sessao>(`${PATH}/${id}`), 
};