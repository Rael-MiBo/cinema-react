import { z } from "zod";

export const ingressoSchema = z.object({
  sessaoId: z.number(),
  tipo: z.enum(["inteira", "meia"]),
  valor: z.number().positive("Valor inválido"),
});
