// Base para IDs (resolve o problema de string vs number)
export type ID = string | number;

export interface Filme {
  id?: ID;
  titulo: string;
  sinopse: string;
  classificacao: string; // ex: "18", "L", "12"
  duracao: number;       // em minutos
  genero: string;
  elenco: string;
  dataInicialExibicao: string; // ISO Date
  dataFinalExibicao: string;   // ISO Date
}

export interface Sala {
  id?: ID;
  numero: number;
  capacidade: number;
  // poltronas: int[][] -> na UML tem matriz, mas por enquanto vamos simplificar
}
export interface Sessao {
  id?: string | number;
  filmeId: string | number;
  salaId: string | number;
  horarioExibicao: string;
  valorIngresso: number;
  lugaresOcupados?: string[];
}

export interface LancheCombo {
  id?: ID;
  nome: string;
  descricao: string;
  valorUnitario: number;
  qtUnidade: number; // Estoque ou quantidade no combo
}

// O Pedido junta tudo (Ingresso + Lanche)
export interface Pedido {
  id?: ID;
  sessaoId: ID;
  qtInteira: number;
  qtMeia: number;
  lanches: {
    lancheId: ID;
    quantidade: number;
    valorPago: number; // Histórico do preço no momento da compra
  }[];
  valorTotal: number;
  dataPedido: string;
}