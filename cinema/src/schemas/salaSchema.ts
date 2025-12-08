import { z } from "zod";

export const salaSchema = z.object({
  numero: z.number().min(1, "Número inválido"),
  capacidade: z.number().min(1, "Capacidade inválida"),
});