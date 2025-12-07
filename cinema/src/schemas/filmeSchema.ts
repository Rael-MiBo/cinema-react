import { z } from "zod";

export const filmeSchema = z.object({
  titulo: z.string().min(2, "Título muito curto"),
  sinopse: z.string().min(10, "Sinopse muito curta"),
  classificacao: z.string().min(1, "Informe a classificação"),
  duracao: z.number().min(1, "Duração inválida"),
  genero: z.string().min(2, "Gênero muito curto"),
  dataInicialExibicao: z.string().optional(),
  dataFinalExibicao: z.string().optional(),
});
