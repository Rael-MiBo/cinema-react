import { z } from "zod";

export const filmeSchema = z.object({
  titulo: z.string().nonempty("Título é obrigatório"),
  sinopse: z.string().nonempty("Sinopse é obrigatória"),
  classificacao: z.string().nonempty("Classificação é obrigatória"),
  duracao: z.number().min(1, "Duração deve ser maior que 0"),
  genero: z.string().nonempty("Gênero é obrigatório"),
  elenco: z.string().optional(),
  dataInicialExibicao: z.string().nonempty("Data inicial obrigatória"),
  dataFinalExibicao: z.string().nonempty("Data final obrigatória"),
});