import { APIService } from "./api";
import type { Pedido } from "../types";

const PATH = "pedidos";

export const pedidosService = {
  listar: () => APIService.get<Pedido[]>(PATH),
  obter: (id: number | string) => APIService.get<Pedido>(`${PATH}/${id}`),
  criar: (dados: Pedido) => APIService.post<Pedido>(PATH, dados),
  remover: (id: number | string) => APIService.delete(PATH, id),
};