export type ID = string | number;

export interface Filme {
  id?: ID;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  elenco: string;
  dataInicialExibicao: string;
  dataFinalExibicao: string;
}

export interface Sala {
  id?: ID;
  numero: number;
  capacidade: number;
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
  qtUnidade: number;
}

export interface Pedido {
  id?: ID;
  sessaoId: ID;
  qtInteira: number;
  qtMeia: number;
  lanches: {
    lancheId: ID;
    quantidade: number;
    valorPago: number;
  }[];
  valorTotal: number;
  dataPedido: string;
}