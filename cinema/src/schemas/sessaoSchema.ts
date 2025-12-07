import { z } from "zod";

export const sessaoSchema = z.object({
  filmeId: z.number(),
  salaId: z.number(),
  horarioExibicao: z.string().min(5, "Horário inválido"),
});
