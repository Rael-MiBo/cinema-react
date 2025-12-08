import { z } from "zod";

export const pedidoSchema = z.object({
  sessaoId: z.union([z.string(), z.number()]),
  qtInteira: z.number().min(0),
  qtMeia: z.number().min(0),
  lanches: z.array(z.object({
    lancheId: z.union([z.string(), z.number()]),
    quantidade: z.number().min(1),
    valorPago: z.number(),
  })).optional(),
  valorTotal: z.number(),
  dataPedido: z.string(),
}).refine((data) => data.qtInteira + data.qtMeia > 0, {
  message: "Você precisa selecionar pelo menos um ingresso (Inteira ou Meia).",
  path: ["qtInteira"],
});