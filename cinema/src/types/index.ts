export type Filme = {
  id?: number;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number;
  genero: string;
  dataInicialExibicao?: string;
  dataFinalExibicao?: string;
};

export type Sala = {
  id?: number;
  numero: number;
  capacidade: number;
};

export type Sessao = {
  id?: number;
  filmeId: number;
  salaId: number;
  horarioExibicao: string; // ISO string
};

export type Ingresso = {
  id?: number;
  sessaoId: number;
  tipo: "inteira" | "meia";
  valor: number;
};
