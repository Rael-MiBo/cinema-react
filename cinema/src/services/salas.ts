import { APIService } from "./api";
import type { Sala, Sessao } from "../types";

const PATH = "salas";

export const salasService = {
  listar: () => APIService.get<Sala[]>(PATH),
  obter: (id: number | string) => APIService.get<Sala>(`${PATH}/${id}`),
  criar: (dados: Sala) => APIService.post<Sala>(PATH, dados),
  atualizar: (id: number | string, dados: Sala) => APIService.put<Sala>(PATH, id, dados),
  
  remover: async (id: number | string) => {

    const sessoes = await APIService.get<Sessao[]>("sessoes");
    const relacionadas = sessoes.filter((s) => String(s.salaId) === String(id));

    for (const s of relacionadas) {
      if (s.id) await APIService.delete("sessoes", s.id);
    }

    await APIService.delete(PATH, id);
  }
};