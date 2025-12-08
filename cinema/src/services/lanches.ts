import { APIService } from "./api";
import type { LancheCombo } from "../types";

const PATH = "lanches";

export const lanchesService = {
  listar: () => APIService.get<LancheCombo[]>(PATH),
  obter: (id: number | string) => APIService.get<LancheCombo>(`${PATH}/${id}`),
  criar: (dados: LancheCombo) => APIService.post<LancheCombo>(PATH, dados),
  atualizar: (id: number | string, dados: LancheCombo) => APIService.put<LancheCombo>(PATH, id, dados),
  remover: (id: number | string) => APIService.delete(PATH, id),
};