// 🎬 Filme
export interface Filme {
  id?: number;
  titulo: string;
  sinopse: string;
  classificacao: string;
  duracao: number; // minutos
  genero: string;
  elenco: string;
  dataInicialExibicao: string; // YYYY-MM-DD
  dataFinalExibicao: string;   // YYYY-MM-DD
}

// 🏟 Sala
export interface Sala {
  id?: number;
  numero: number;
  capacidade: number;
}

// 🎞 Sessão
export interface Sessao {
  id?: number;
  filmeId: number;   // FK → Filme
  salaId: number;    // FK → Sala
  horarioExibicao: string; // format YYYY-MM-DDTHH:mm
}

// 🎟 Ingresso
export interface Ingresso {
  id?: number;
  sessaoId: number; 
  tipo: "inteira" | "meia";
  valor: number;
}
