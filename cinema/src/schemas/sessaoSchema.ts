import { z } from "zod";

export const sessaoSchema = z.object({
  
  filmeId: z.union([z.string(), z.number()]),
  salaId: z.union([z.string(), z.number()]),
  horarioExibicao: z.string().nonempty("Horário é obrigatório"),
    valorIngresso: z.number().min(1, "O valor do ingresso deve ser maior que R$ 1,00"),
});