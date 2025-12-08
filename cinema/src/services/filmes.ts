import { APIService } from "./api";
import type { Filme, Sessao } from "../types";

const PATH = "filmes";

export const filmesService = {
  listar: () => APIService.get<Filme[]>(PATH),
  obter: (id: number | string) => APIService.get<Filme>(`${PATH}/${id}`),
  criar: (dados: Filme) => APIService.post<Filme>(PATH, dados),
  atualizar: (id: number | string, dados: Filme) => APIService.put<Filme>(PATH, id, dados),
  
  // Função especial de remover com cascata (apaga sessões junto)
  remover: async (id: number | string) => {
    // 1. Apagar sessões órfãs primeiro
    const sessoes = await APIService.get<Sessao[]>("sessoes");
    const relacionadas = sessoes.filter((s) => String(s.filmeId) === String(id));
    
    for (const s of relacionadas) {
      if (s.id) await APIService.delete("sessoes", s.id);
    }

    // 2. Apagar o filme
    await APIService.delete(PATH, id);
  }
};