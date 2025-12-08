import { z } from "zod";

export const lancheSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  descricao: z.string().optional(),
  valorUnitario: z.number().min(0.01, "Valor deve ser positivo"),
  qtUnidade: z.number().int().min(0, "Estoque/Qtd deve ser positivo"),
});